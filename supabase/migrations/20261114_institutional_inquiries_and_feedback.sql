-- ==============================================================================
-- Migration: Create institutional_inquiries, client_feedback, newsletter_subscribers,
-- and clinical_audit_logs tables
-- Security: Strict RLS and least-privilege role boundaries
-- ==============================================================================

BEGIN;

-- 1. Institutional Inquiries (B2B School & Corporate Requests)
CREATE TABLE IF NOT EXISTS public.institutional_inquiries (
    id TEXT PRIMARY KEY,
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.institutional_inquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.institutional_inquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.institutional_inquiries FROM anon;
REVOKE ALL ON TABLE public.institutional_inquiries FROM authenticated;
GRANT ALL ON TABLE public.institutional_inquiries TO service_role;

-- 2. Client Testimonials & Feedback
CREATE TABLE IF NOT EXISTS public.client_feedback (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    session_type TEXT,
    service_category TEXT,
    feedback TEXT NOT NULL,
    location TEXT DEFAULT 'أونلاين',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.client_feedback FROM PUBLIC;
GRANT ALL ON TABLE public.client_feedback TO service_role;

-- Public can only view published testimonials
CREATE POLICY "Public can view published testimonials"
ON public.client_feedback
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- 3. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.newsletter_subscribers FROM PUBLIC;
REVOKE ALL ON TABLE public.newsletter_subscribers FROM anon;
REVOKE ALL ON TABLE public.newsletter_subscribers FROM authenticated;
GRANT ALL ON TABLE public.newsletter_subscribers TO service_role;

-- 4. Clinical Audit Logs (HIPAA / Clinical Confidentiality Compliance)
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

ALTER TABLE public.clinical_audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.clinical_audit_logs FROM PUBLIC;
REVOKE ALL ON TABLE public.clinical_audit_logs FROM anon;
REVOKE ALL ON TABLE public.clinical_audit_logs FROM authenticated;
GRANT ALL ON TABLE public.clinical_audit_logs TO service_role;

-- Index for clinical audit queries
CREATE INDEX IF NOT EXISTS idx_clinical_audit_logs_actor
ON public.clinical_audit_logs (actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clinical_audit_logs_target
ON public.clinical_audit_logs (target_client_id, created_at DESC);

COMMIT;
