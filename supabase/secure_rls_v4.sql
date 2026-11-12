-- ==============================================================================
-- مراجعة وترقية سياسات أمان مستوى الصفوف (Row Level Security - RLS v4)
-- مشروع منصة د. جلال أحمد (galal-web)
-- ملاحظة أمنية: هذا المخطط للمراجعة والتدقيق وبيئة الـ Staging فقط، ولا يُطبق على قاعدة الإنتاج تلقائياً.
-- ==============================================================================

-- 1. دالة التحقق من دور المستخدم الحالي من جدول profiles
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()::text LIMIT 1;
$$;

-- 2. دالة التحقق هل المستخدم معالج أو أدمن
CREATE OR REPLACE FUNCTION public.is_counselor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()::text
      AND role IN ('counselor', 'admin')
  );
$$;

-- ==============================================================================
-- جدول الملفات السريرية المتقدمة: clinical_clients
-- ==============================================================================
ALTER TABLE public.clinical_clients ENABLE ROW LEVEL SECURITY;

-- حذف السياسة القديمة غير الآمنة USING (true)
DROP POLICY IF EXISTS "Allow counselor full access clinical_clients" ON public.clinical_clients;

-- سياسة المعالج والإدارة: صلاحية كاملة
CREATE POLICY "counselor_admin_full_access_clinical_clients"
ON public.clinical_clients
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- سياسة المستفيد: يمكن للمستفيد قراءة ملفه الشخصي فقط
CREATE POLICY "client_read_own_clinical_dossier"
ON public.clinical_clients
FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text);

-- ==============================================================================
-- جدول الجلسات السريرية: clinical_sessions
-- ==============================================================================
ALTER TABLE public.clinical_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow counselor full access clinical_sessions" ON public.clinical_sessions;

-- سياسة المعالج والإدارة
CREATE POLICY "counselor_admin_full_access_clinical_sessions"
ON public.clinical_sessions
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- سياسة المستفيد: قراءة جلساته فقط
CREATE POLICY "client_read_own_clinical_sessions"
ON public.clinical_sessions
FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clinical_clients WHERE user_id = auth.uid()::text
  )
);

-- ==============================================================================
-- جدول سجلات SOAP الإكلينيكية: session_soap_notes (سرية طبية تامة)
-- ==============================================================================
ALTER TABLE public.session_soap_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow counselor full access session_soap_notes" ON public.session_soap_notes;

-- سرية طبية تامة: محصورة بالمعالج الإكلينيكي فقط — العميل لا يطلع على سجل SOAP الداخلي
CREATE POLICY "counselor_only_session_soap_notes"
ON public.session_soap_notes
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- ==============================================================================
-- جدول خطط العلاج وصياغة الحالة: problem_mapping & treatment_plans
-- ==============================================================================
ALTER TABLE public.problem_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow counselor full access problem_mapping" ON public.problem_mapping;
DROP POLICY IF EXISTS "Allow counselor full access treatment_plans" ON public.treatment_plans;

CREATE POLICY "counselor_admin_problem_mapping"
ON public.problem_mapping
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

CREATE POLICY "counselor_admin_treatment_plans"
ON public.treatment_plans
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- ==============================================================================
-- جدول الواجبات والتكليفات الإرشادية: client_assignments
-- ==============================================================================
ALTER TABLE public.client_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow counselor full access client_assignments" ON public.client_assignments;

-- المعالج: إدارة كاملة
CREATE POLICY "counselor_manage_client_assignments"
ON public.client_assignments
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- العميل: قراءة واجباته المسندة إليه
CREATE POLICY "client_read_own_assignments"
ON public.client_assignments
FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clinical_clients WHERE user_id = auth.uid()::text
  )
);

-- العميل: تسليم الإجابات وتحديث حالة الواجب
CREATE POLICY "client_update_own_assignment_answers"
ON public.client_assignments
FOR UPDATE
TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clinical_clients WHERE user_id = auth.uid()::text
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM public.clinical_clients WHERE user_id = auth.uid()::text
  )
);

-- ==============================================================================
-- جدول سجل المزاج والسكينة اليومي: client_mood_logs
-- ==============================================================================
ALTER TABLE public.client_mood_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow counselor full access client_mood_logs" ON public.client_mood_logs;

-- المعالج: قراءة السجلات المشاركة
CREATE POLICY "counselor_read_shared_mood_logs"
ON public.client_mood_logs
FOR SELECT
TO authenticated
USING (
  public.is_counselor_or_admin() AND is_shared_with_counselor = true
);

-- العميل: قراءة وإضافة سجلات مزاجه
CREATE POLICY "client_manage_own_mood_logs"
ON public.client_mood_logs
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clinical_clients WHERE user_id = auth.uid()::text
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM public.clinical_clients WHERE user_id = auth.uid()::text
  )
);

-- ==============================================================================
-- جدول مواعيد التوفر: counselor_schedules
-- ==============================================================================
ALTER TABLE public.counselor_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read counselor_schedules" ON public.counselor_schedules;

-- القراءة متاحة للجميع للمواعيد النشطة لعرض أوقات الحجز
CREATE POLICY "public_read_active_counselor_schedules"
ON public.counselor_schedules
FOR SELECT
TO public
USING (is_active = true);

-- التعديل والإضافة والحذف مقتصر على المعالج فقط
CREATE POLICY "counselor_modify_schedules"
ON public.counselor_schedules
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- ==============================================================================
-- جدول الحجوزات: bookings
-- ==============================================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert bookings" ON public.bookings;

-- السماح بطلب حجز جديد للعامة
CREATE POLICY "public_insert_booking_request"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (status = 'pending_verification' OR status = 'requested');

-- المعالج والإدارة: صلاحية كاملة على الحجوزات
CREATE POLICY "counselor_admin_manage_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (public.is_counselor_or_admin())
WITH CHECK (public.is_counselor_or_admin());

-- العميل: قراءة حجوزاته الخاصة فقط
CREATE POLICY "client_read_own_bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  client_phone = (SELECT phone FROM public.profiles WHERE id = auth.uid()::text)
  OR client_email = (SELECT email FROM public.profiles WHERE id = auth.uid()::text)
);
