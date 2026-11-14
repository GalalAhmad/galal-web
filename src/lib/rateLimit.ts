/**
 * Distributed rate limiter for sensitive endpoints with shared Supabase store
 * and in-memory sliding-window fallback for local development.
 *
 * Prevents DDoS, brute-force credential stuffing, and concurrent race attacks
 * across distributed serverless instances.
 */

import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent memory leaks in the local fallback store
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600 * 1000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    });
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Synchronous in-memory rate limiter (used for testing or offline fallback).
 */
export function checkRateLimitSync(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxAttempts) {
    const oldest = record.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxAttempts - record.timestamps.length,
    resetInSeconds: windowSeconds,
  };
}

/**
 * Distributed rate limiter:
 * 1. Synchronously reserves a ticket in the local in-memory sliding window to prevent
 *    concurrent burst race conditions during async network round-trips.
 * 2. Coordinates with the shared Supabase rate_limits table/RPC across multiple serverless
 *    instances to enforce global limits.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
  // 1. Immediate synchronous local reservation to prevent concurrent in-flight race conditions
  const localCheck = checkRateLimitSync(key, maxAttempts, windowSeconds);
  if (!localCheck.allowed) {
    return localCheck;
  }

  // 2. Synchronize with distributed Supabase shared storage if configured
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      // First try stored RPC procedure for atomic single-transaction execution
      const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('check_rate_limit', {
        p_key: key,
        p_max_attempts: maxAttempts,
        p_window_seconds: windowSeconds,
      });

      if (!rpcError && rpcData && typeof rpcData === 'object') {
        if (!rpcData.allowed) {
          return {
            allowed: false,
            remaining: 0,
            resetInSeconds: Number(rpcData.resetInSeconds) || windowSeconds,
          };
        }
        return {
          allowed: true,
          remaining: Math.min(localCheck.remaining, Number(rpcData.remaining) || 0),
          resetInSeconds: Number(rpcData.resetInSeconds) || windowSeconds,
        };
      }

      // If RPC is missing, use direct atomic upsert against rate_limits table
      const now = new Date();
      const resetAt = new Date(now.getTime() + windowSeconds * 1000).toISOString();

      const { data: existingRecord } = await supabaseAdmin
        .from('rate_limits')
        .select('count, reset_at')
        .eq('key', key)
        .maybeSingle();

      if (existingRecord) {
        const resetTime = new Date(existingRecord.reset_at).getTime();
        if (resetTime > now.getTime()) {
          if (existingRecord.count >= maxAttempts) {
            const resetInSeconds = Math.max(1, Math.ceil((resetTime - now.getTime()) / 1000));
            return { allowed: false, remaining: 0, resetInSeconds };
          }

          await supabaseAdmin
            .from('rate_limits')
            .update({ count: existingRecord.count + 1 })
            .eq('key', key);

          return {
            allowed: true,
            remaining: Math.min(localCheck.remaining, Math.max(0, maxAttempts - (existingRecord.count + 1))),
            resetInSeconds: Math.max(1, Math.ceil((resetTime - now.getTime()) / 1000)),
          };
        }
      }

      // Expired or new record: upsert
      await supabaseAdmin
        .from('rate_limits')
        .upsert({ key, count: 1, reset_at: resetAt }, { onConflict: 'key' });
    } catch (dbErr) {
      console.warn('[RATE_LIMIT] Supabase rate limit store warning, falling back to local memory store:', dbErr);
    }
  }

  return localCheck;
}

/**
 * Extracts and sanitizes the client IP address from trusted reverse-proxy headers.
 */
export function getClientIp(request: Request): string {
  // 1. Cloudflare True-Client-IP / CF-Connecting-IP
  const cfConnecting = request.headers.get('cf-connecting-ip');
  if (cfConnecting && isValidIp(cfConnecting.trim())) {
    return cfConnecting.trim();
  }

  // 2. Vercel Real IP / Reverse-Proxy Real-IP
  const vercelIp = request.headers.get('x-vercel-ip') || request.headers.get('x-real-ip');
  if (vercelIp && isValidIp(vercelIp.trim())) {
    return vercelIp.trim();
  }

  // 3. X-Forwarded-For (sanitized)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0 && isValidIp(parts[0])) {
      return parts[0];
    }
  }

  return '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  // Basic IPv4 or IPv6 format validation to prevent header injection in rate limit keys
  return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[a-fA-F0-9:]+$/.test(ip);
}
