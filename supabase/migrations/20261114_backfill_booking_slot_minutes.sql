-- ==============================================================================
-- Migration: Backfill slot_start_minutes and duration_minutes for Active Bookings
-- Safely normalizes 12-hour (AM/PM / ص/م) and 24-hour time strings into minutes from midnight
-- ==============================================================================

BEGIN;

-- 1. Ensure interval columns exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS slot_start_minutes INT,
ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 50,
ADD COLUMN IF NOT EXISTS slot_end_minutes INT;

-- 2. Backfill helper function (temporary, dropped after execution)
CREATE OR REPLACE FUNCTION pg_temp.parse_slot_time_to_minutes(p_time TEXT)
RETURNS INT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_clean TEXT;
    v_is_pm BOOLEAN := false;
    v_parts TEXT[];
    v_hours INT;
    v_mins INT;
BEGIN
    IF p_time IS NULL OR length(trim(p_time)) < 2 THEN
        RETURN NULL;
    END IF;

    v_clean := lower(trim(p_time));

    -- Detect PM indicators (English or Arabic)
    IF v_clean ~* '(pm|م|مساء|مساءً)' THEN
        v_is_pm := true;
    END IF;

    -- Extract numeric digits for HH:MM
    v_parts := regexp_matches(v_clean, '(\d{1,2})[:.](\d{2})');
    IF v_parts IS NULL OR array_length(v_parts, 1) < 2 THEN
        -- Fallback single hour match
        v_parts := regexp_matches(v_clean, '(\d{1,2})');
        IF v_parts IS NULL THEN
            RETURN NULL;
        END IF;
        v_hours := v_parts[1]::INT;
        v_mins := 0;
    ELSE
        v_hours := v_parts[1]::INT;
        v_mins := v_parts[2]::INT;
    END IF;

    -- Adjust 12-hour format
    IF v_is_pm THEN
        IF v_hours < 12 THEN
            v_hours := v_hours + 12;
        END IF;
    ELSE
        -- AM adjustment
        IF v_clean ~* '(am|ص|صباح|صباحاً)' AND v_hours = 12 THEN
            v_hours := 0;
        END IF;
    END IF;

    -- Bound to standard 24h day
    IF v_hours >= 0 AND v_hours < 24 AND v_mins >= 0 AND v_mins < 60 THEN
        RETURN (v_hours * 60) + v_mins;
    END IF;

    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$;

-- 3. Update existing active bookings with normalized interval metrics
UPDATE public.bookings
SET 
    duration_minutes = CASE 
        WHEN track = 'marital' THEN 75 
        ELSE 50 
    END,
    slot_start_minutes = COALESCE(slot_start_minutes, pg_temp.parse_slot_time_to_minutes(slot_time)),
    slot_end_minutes = COALESCE(
        slot_end_minutes, 
        COALESCE(slot_start_minutes, pg_temp.parse_slot_time_to_minutes(slot_time)) + CASE WHEN track = 'marital' THEN 75 ELSE 50 END
    )
WHERE status NOT IN ('cancelled', 'rejected')
  AND (slot_start_minutes IS NULL OR duration_minutes IS NULL);

-- 4. Create an index for accelerated date-scoped interval queries
CREATE INDEX IF NOT EXISTS idx_bookings_date_interval
ON public.bookings (slot_date, slot_start_minutes, slot_end_minutes)
WHERE status NOT IN ('cancelled', 'rejected');

COMMIT;

-- ==============================================================================
-- Verification Query (Run in Staging):
-- SELECT id, slot_date, slot_time, track, slot_start_minutes, duration_minutes, slot_end_minutes, status 
-- FROM public.bookings 
-- WHERE status NOT IN ('cancelled', 'rejected')
-- ORDER BY slot_date, slot_start_minutes;
-- ==============================================================================
