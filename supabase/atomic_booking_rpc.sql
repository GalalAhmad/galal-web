-- ==============================================================================
-- Atomic Booking RPC with Interval Overlap Prevention & Advisory Locking
-- Hardened for Enterprise Production / Staging Deployment
-- ==============================================================================

BEGIN;

-- 1. Ensure required schema columns exist on public.bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS slot_start_minutes INT,
ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 50,
ADD COLUMN IF NOT EXISTS slot_end_minutes INT;

-- 2. Create the Atomic Booking Stored Procedure with Strict Security Hardening
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
    p_id TEXT,
    p_client_name TEXT,
    p_client_phone TEXT,
    p_client_email TEXT,
    p_track TEXT,
    p_track_label TEXT,
    p_age TEXT,
    p_marital_status TEXT,
    p_slot_date DATE,
    p_slot_time TEXT,
    p_slot_start_minutes INT,
    p_duration_minutes INT DEFAULT 50,
    p_fee TEXT DEFAULT '250 ر.س',
    p_payment_method TEXT DEFAULT 'instapay',
    p_receipt_note TEXT DEFAULT '',
    p_receipt_image TEXT DEFAULT '',
    p_answers JSONB DEFAULT '{}'::jsonb,
    p_meet_link TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_has_conflict BOOLEAN := false;
    v_new_end_minutes INT;
    v_clean_phone TEXT;
BEGIN
    -- Strict Input Validations
    IF p_id IS NULL OR length(trim(p_id)) < 3 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_INPUT',
            'error', 'معرّف الحجز غير صالح'
        );
    END IF;

    IF p_client_name IS NULL OR length(trim(p_client_name)) < 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_INPUT',
            'error', 'اسم العميل يجب أن يحتوي على حرفين على الأقل'
        );
    END IF;

    v_clean_phone := regexp_replace(COALESCE(p_client_phone, ''), '[^\d]', '', 'g');
    IF length(v_clean_phone) < 8 OR length(v_clean_phone) > 16 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_INPUT',
            'error', 'رقم الهاتف غير صالح، يجب أن يحتوي على 8 إلى 16 رقماً'
        );
    END IF;

    IF p_slot_date IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_INPUT',
            'error', 'تاريخ الموعد غير محدد'
        );
    END IF;

    IF p_slot_start_minutes IS NULL OR p_slot_start_minutes < 0 OR p_slot_start_minutes > 1439 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_INPUT',
            'error', 'وقت بداية الموعد غير صالح (بالدقائق من منتصف الليل)'
        );
    END IF;

    IF p_duration_minutes IS NULL OR p_duration_minutes < 15 OR p_duration_minutes > 240 THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_INPUT',
            'error', 'مدة الجلسة غير صالحة'
        );
    END IF;

    -- Calculate session end in minutes
    v_new_end_minutes := p_slot_start_minutes + p_duration_minutes;

    -- Acquire an exclusive advisory transaction-level lock scoped to the specific booking date
    -- This serializes concurrent booking requests targeting the exact same date across all server instances
    PERFORM pg_advisory_xact_lock(hashtext('booking_date_' || p_slot_date::text));

    -- Check for overlapping active bookings on the same date
    -- Mathematical interval overlap: (startA < endB AND startB < endA)
    -- Excludes cancelled and rejected bookings
    SELECT EXISTS (
        SELECT 1
        FROM public.bookings
        WHERE slot_date = p_slot_date
          AND status NOT IN ('cancelled', 'rejected')
          AND (
              (slot_start_minutes IS NOT NULL AND 
               slot_start_minutes < v_new_end_minutes AND 
               p_slot_start_minutes < (slot_start_minutes + COALESCE(duration_minutes, 50))
              )
              OR
              (slot_start_minutes IS NULL AND TRIM(slot_time) = TRIM(p_slot_time))
          )
    ) INTO v_has_conflict;

    -- If a conflict exists, return generic error with ZERO leakage of existing booking data or IDs
    IF v_has_conflict THEN
        RETURN jsonb_build_object(
            'success', false,
            'code', 'CONFLICT',
            'error', 'عذراً، هذا الموعد يتعارض مع موعد محجوز مسبقاً. يرجى اختيار موعد آخر متاح.'
        );
    END IF;

    -- Insert new booking atomically within the serialized transaction
    INSERT INTO public.bookings (
        id,
        client_name,
        client_phone,
        client_email,
        track,
        track_label,
        age,
        marital_status,
        slot_date,
        slot_time,
        slot_start_minutes,
        duration_minutes,
        slot_end_minutes,
        status,
        payment_method,
        fee,
        receipt_note,
        receipt_image,
        answers,
        meet_link,
        created_at,
        updated_at
    ) VALUES (
        p_id,
        trim(p_client_name),
        trim(p_client_phone),
        nullif(trim(p_client_email), ''),
        COALESCE(p_track, 'psychological'),
        COALESCE(p_track_label, 'استشارة نفسية فردية'),
        p_age,
        COALESCE(p_marital_status, 'غير محدد'),
        p_slot_date,
        trim(p_slot_time),
        p_slot_start_minutes,
        p_duration_minutes,
        v_new_end_minutes,
        'pending_verification',
        COALESCE(p_payment_method, 'instapay'),
        COALESCE(p_fee, '250 ر.س'),
        COALESCE(p_receipt_note, ''),
        COALESCE(p_receipt_image, ''),
        COALESCE(p_answers, '{}'::jsonb),
        COALESCE(p_meet_link, ''),
        NOW(),
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'id', p_id
    );
END;
$$;

-- 3. Ownership and Privileges Hardening (Single Transaction)
-- Set owner to postgres (or the cloud database owner)
ALTER FUNCTION public.create_booking_atomic(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT
) OWNER TO postgres;

-- Explicitly revoke execution from public, anon, and authenticated
REVOKE ALL ON FUNCTION public.create_booking_atomic(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT
) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.create_booking_atomic(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT
) FROM anon;

REVOKE EXECUTE ON FUNCTION public.create_booking_atomic(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT
) FROM authenticated;

-- Grant execution ONLY to service_role (the authoritative backend server key)
GRANT EXECUTE ON FUNCTION public.create_booking_atomic(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT
) TO service_role;

COMMIT;

-- ==============================================================================
-- Verification Query (Run as read-only inspection in Staging):
-- SELECT routine_name, grantee, privilege_type 
-- FROM information_schema.routine_privileges 
-- WHERE routine_name = 'create_booking_atomic';
-- Expected: Only 'service_role' (and postgres/superuser) has 'EXECUTE'.
-- ==============================================================================
