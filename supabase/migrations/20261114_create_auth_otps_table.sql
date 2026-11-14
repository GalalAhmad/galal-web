-- ==============================================================================
-- Migration: Create auth_otps Table for Distributed Password Reset
-- Prevents race conditions and enables cross-instance OTP verification
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.auth_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    attempts INT DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast identifier lookup of active nonces
CREATE INDEX IF NOT EXISTS idx_auth_otps_lookup 
ON public.auth_otps (identifier, expires_at) 
WHERE used_at IS NULL;

-- Security: Revoke all from public/anon/authenticated; allow service_role only
REVOKE ALL ON TABLE public.auth_otps FROM PUBLIC;
REVOKE ALL ON TABLE public.auth_otps FROM anon;
REVOKE ALL ON TABLE public.auth_otps FROM authenticated;
GRANT ALL ON TABLE public.auth_otps TO service_role;

COMMIT;
