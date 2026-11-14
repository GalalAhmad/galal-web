-- ==============================================================================
-- Migration: Make clinical_audit_logs Strictly Append-Only & Immutable
-- Compliance: Medical Confidentiality, HIPAA Audit Trail, ISO 27001
-- ==============================================================================

BEGIN;

-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.clinical_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_client_id TEXT,
    target_session_id TEXT,
    client_ip TEXT,
    status TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clinical_audit_logs ENABLE ROW LEVEL SECURITY;

-- Revoke all mutations from public, anon, and authenticated
REVOKE ALL ON TABLE public.clinical_audit_logs FROM PUBLIC;
REVOKE ALL ON TABLE public.clinical_audit_logs FROM anon;
REVOKE ALL ON TABLE public.clinical_audit_logs FROM authenticated;

-- Service role is granted INSERT and SELECT only (NEVER UPDATE or DELETE)
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.clinical_audit_logs FROM service_role;
GRANT INSERT, SELECT ON TABLE public.clinical_audit_logs TO service_role;

-- Enforce append-only integrity via PostgreSQL trigger
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'clinical_audit_logs is an immutable append-only audit trail. UPDATE and DELETE operations are strictly forbidden.';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_modification ON public.clinical_audit_logs;
CREATE TRIGGER trg_prevent_audit_log_modification
BEFORE UPDATE OR DELETE ON public.clinical_audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.prevent_audit_log_modification();

COMMIT;
