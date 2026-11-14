-- ==============================================================================
-- Migration: Distributed Rate Limiting Table & Atomic Procedure
-- Purpose: Protect sensitive endpoints across multi-instance serverless deployments
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.rate_limits (
    key TEXT PRIMARY KEY,
    count INT DEFAULT 1,
    reset_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for background cleanup of expired windows
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at 
ON public.rate_limits (reset_at);

-- Atomic sliding-window rate limit checker
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_key TEXT,
    p_max_attempts INT,
    p_window_seconds INT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_now TIMESTAMPTZ := clock_timestamp();
    v_window_interval INTERVAL := (p_window_seconds || ' seconds')::INTERVAL;
    v_record RECORD;
    v_allowed BOOLEAN;
    v_remaining INT;
    v_reset_in INT;
BEGIN
    INSERT INTO public.rate_limits (key, count, reset_at)
    VALUES (p_key, 1, v_now + v_window_interval)
    ON CONFLICT (key) DO UPDATE
    SET count = CASE
            WHEN rate_limits.reset_at < v_now THEN 1
            ELSE rate_limits.count + 1
        END,
        reset_at = CASE
            WHEN rate_limits.reset_at < v_now THEN v_now + v_window_interval
            ELSE rate_limits.reset_at
        END
    RETURNING count, reset_at INTO v_record;

    IF v_record.count > p_max_attempts THEN
        v_allowed := FALSE;
        v_remaining := 0;
    ELSE
        v_allowed := TRUE;
        v_remaining := p_max_attempts - v_record.count;
    END IF;

    v_reset_in := GREATEST(1, EXTRACT(EPOCH FROM (v_record.reset_at - v_now))::INT);

    RETURN jsonb_build_object(
        'allowed', v_allowed,
        'remaining', v_remaining,
        'resetInSeconds', v_reset_in
    );
END;
$$;

-- Security: Least privilege access control
REVOKE ALL ON TABLE public.rate_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.rate_limits FROM anon;
REVOKE ALL ON TABLE public.rate_limits FROM authenticated;
GRANT ALL ON TABLE public.rate_limits TO service_role;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM anon;
REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO service_role;

COMMIT;
