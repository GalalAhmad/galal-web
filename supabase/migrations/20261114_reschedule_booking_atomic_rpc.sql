-- Migration: Add Atomic Reschedule RPC with pg_advisory_xact_lock
-- File: 20261114_reschedule_booking_atomic_rpc.sql

BEGIN;

CREATE OR REPLACE FUNCTION public.reschedule_booking_atomic(
    p_id TEXT,
    p_slot_date DATE,
    p_slot_time TEXT,
    p_slot_start_minutes INT,
    p_duration_minutes INT DEFAULT 50,
    p_status TEXT DEFAULT NULL,
    p_meet_link TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_has_conflict BOOLEAN := false;
    v_new_end_minutes INT;
    v_existing RECORD;
BEGIN
    IF p_id IS NULL OR length(trim(p_id)) < 3 THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_INPUT', 'error', 'معرّف الحجز غير صالح');
    END IF;

    IF p_slot_date IS NULL THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_INPUT', 'error', 'تاريخ الموعد غير محدد');
    END IF;

    IF p_slot_start_minutes IS NULL OR p_slot_start_minutes < 0 OR p_slot_start_minutes > 1439 THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_INPUT', 'error', 'وقت الموعد غير صالح');
    END IF;

    IF p_duration_minutes IS NULL OR p_duration_minutes < 15 OR p_duration_minutes > 240 THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_INPUT', 'error', 'مدة الجلسة غير صالحة');
    END IF;

    v_new_end_minutes := p_slot_start_minutes + p_duration_minutes;

    PERFORM pg_advisory_xact_lock(hashtext('booking_date_' || p_slot_date::text));

    SELECT * INTO v_existing
    FROM public.bookings
    WHERE id = p_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'code', 'NOT_FOUND', 'error', 'الحجز غير موجود');
    END IF;

    IF v_existing.status = 'completed' THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_STATE', 'error', 'لا يمكن إعادة جدولة جلسة مكتملة وموثقة سريرياً مسبقاً');
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM public.bookings
        WHERE slot_date = p_slot_date
          AND id <> p_id
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

    IF v_has_conflict THEN
        RETURN jsonb_build_object('success', false, 'code', 'CONFLICT', 'error', 'عذراً، هذا الموعد البديل محجوز بالفعل لحجز آخر. يرجى اختيار موعد شاغر.');
    END IF;

    UPDATE public.bookings
    SET slot_date = p_slot_date,
        slot_time = trim(p_slot_time),
        slot_start_minutes = p_slot_start_minutes,
        duration_minutes = p_duration_minutes,
        slot_end_minutes = v_new_end_minutes,
        status = COALESCE(p_status, 'rescheduled'),
        meet_link = COALESCE(p_meet_link, v_existing.meet_link),
        notes = COALESCE(p_notes, v_existing.notes),
        updated_at = NOW()
    WHERE id = p_id;

    RETURN jsonb_build_object(
        'success', true,
        'id', p_id,
        'slot_date', p_slot_date,
        'slot_time', trim(p_slot_time),
        'duration_minutes', p_duration_minutes,
        'status', COALESCE(p_status, 'rescheduled')
    );
END;
$$;

ALTER FUNCTION public.reschedule_booking_atomic(
    TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.reschedule_booking_atomic(
    TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT
) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.reschedule_booking_atomic(
    TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT
) FROM anon;

REVOKE EXECUTE ON FUNCTION public.reschedule_booking_atomic(
    TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.reschedule_booking_atomic(
    TEXT, DATE, TEXT, INT, INT, TEXT, TEXT, TEXT
) TO service_role;

COMMIT;
