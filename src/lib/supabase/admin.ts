import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * ARCHITECTURAL NOTICE — SERVER-SIDE AUTHORIZATION GATEWAY:
 *
 * 1. `supabaseAdmin` connects using the privileged `SUPABASE_SERVICE_ROLE_KEY`.
 * 2. In Supabase Postgres, `service_role` explicitly bypasses Row Level Security (RLS).
 * 3. Therefore, this client MUST NEVER be exposed to the browser or invoked without
 *    prior server-side authentication (`requireAuth`) and authorization (`requireRole` /
 *    resource ownership checks) in the Next.js API route layer.
 * 4. All API routes function as the Trusted Security Boundary ensuring clients can only
 *    access their own records, and that clinical SOAP notes are strictly restricted to
 *    authorized counselors.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  !supabaseUrl.includes('your-project')
);

export const supabaseAdmin: SupabaseClient = (isSupabaseConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null) as unknown as SupabaseClient;
