-- ==========================================================
-- سكريبت التحديث والترقية v2 (Supabase Migration Script v2)
-- المنصة الرسمية للمستشار جـلال أحـمد (Galal Web)
-- معالجة الأمان، التكليفات الإرشادية، صندوق النصيحة، ومنع التسريبات
-- ==========================================================

-- 1. جدول صندوق النصيحة والملاحظات السرية (Advice Box)
CREATE TABLE IF NOT EXISTS public.advice (
    id TEXT PRIMARY KEY DEFAULT ('adv-' || extract(epoch from now())::bigint),
    sender_name TEXT NOT NULL,
    email_or_phone TEXT,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'unread', -- 'unread' | 'read' | 'replied' | 'archived'
    reply TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ترقية جدول الملفات الشخصية لدعم التكليفات والخطط القرائية والكورسات بشكل صريح
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS homework JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS courses JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reading_plan JSONB DEFAULT '[]'::jsonb;

-- 3. تصحيح القيمة الافتراضية لرابط الاجتماع في الحجوزات (عدم وضع رابط افتراضي غير حقيقي)
ALTER TABLE public.bookings 
ALTER COLUMN meet_link DROP DEFAULT;

ALTER TABLE public.bookings 
ALTER COLUMN meet_link SET DEFAULT '';

-- 4. التأكد من وجود فهرس منع التعارض في الحجوزات النشطة
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking_slot
ON public.bookings (slot_date, slot_time)
WHERE status NOT IN ('cancelled', 'rejected');

-- 5. تفعيل أمان مستوى الصفوف للجداول المضافة
ALTER TABLE public.advice ENABLE ROW LEVEL SECURITY;

-- سياسة السماح للزوار بتقديم نصيحة جديدة فقط بدون قراءة نصائح الآخرين
DROP POLICY IF EXISTS "Allow public insert advice" ON public.advice;
CREATE POLICY "Allow public insert advice" ON public.advice FOR INSERT WITH CHECK (true);

-- تأكيد سياسة الحجز
DROP POLICY IF EXISTS "Allow public insert bookings" ON public.bookings;
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
