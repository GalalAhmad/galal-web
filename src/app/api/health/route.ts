import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SERVER_START_TIME = Date.now();

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - SERVER_START_TIME) / 1000);
  const memoryUsage = process.memoryUsage();

  let dbStatus: 'connected' | 'degraded' | 'not_configured' = 'not_configured';
  let dbLatencyMs: number | null = null;
  let errorDetails: string | null = null;

  if (isSupabaseConfigured && supabaseAdmin) {
    const start = performance.now();
    try {
      // Lightweight read-only head check on profiles table
      const { error } = await supabaseAdmin.from('profiles').select('id', { head: true, count: 'exact' }).limit(1);
      dbLatencyMs = Math.round(performance.now() - start);

      if (error && error.code !== 'PGRST116') {
        dbStatus = 'degraded';
        errorDetails = error.message;
      } else {
        dbStatus = 'connected';
      }
    } catch (err: any) {
      dbStatus = 'degraded';
      errorDetails = err?.message || 'Database ping connection failed';
    }
  }

  const isHealthy = dbStatus !== 'degraded';
  const responsePayload = {
    status: isHealthy ? 'healthy' : 'degraded',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    checks: {
      server: 'ok',
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        ...(errorDetails ? { error: errorDetails } : {}),
      },
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
    },
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
