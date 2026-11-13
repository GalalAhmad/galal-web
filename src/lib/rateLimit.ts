/**
 * In-memory sliding-window rate limiter for sensitive endpoints.
 * Thread-safe for Node.js event-loop concurrency.
 *
 * NOTE ON DISTRIBUTED PRODUCTION:
 * This in-memory store tracks limits per Node.js server instance. In a horizontally
 * scaled multi-container or serverless edge deployment across multiple regions,
 * an external distributed key-value store (e.g. Upstash Redis / Redis Cluster)
 * should be connected via standard sliding window scripts.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent memory leaks
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

export function checkRateLimit(
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

  // Keep only timestamps within the current window
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
