-- ==============================================================================
-- Migration: Force Password Reset Mechanism Schema
-- Prepared for client credential invalidation & security hardening
-- NOTE: Prepared only — DO NOT run the mass-update query without explicit approval.
-- ==============================================================================

BEGIN;

-- 1. Add force_password_reset flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS force_password_reset BOOLEAN DEFAULT FALSE;

-- 2. Add index for quick query filtering
CREATE INDEX IF NOT EXISTS idx_profiles_force_reset 
ON public.profiles (force_password_reset) 
WHERE force_password_reset = TRUE;

-- 3. Standby Mass Invalidation Command:
-- (Uncomment and execute ONLY after explicit authorization by Dr. Galal)
-- UPDATE public.profiles 
-- SET force_password_reset = TRUE, 
--     updated_at = NOW() 
-- WHERE role = 'client';

COMMIT;
