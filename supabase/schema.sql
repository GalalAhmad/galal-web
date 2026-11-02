-- ==========================================================
-- مخطّط قاعدة بيانات سوبا بيز الشامل (Supabase Comprehensive Schema)
-- المنصة الرسمية للمستشار جـلال أحـمد (Galal Web)
-- ==========================================================

-- تفعيل امتدادات UUID والتشفير
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. جدول ملفات المستفيدين والمستخدمين (Profiles & Client Dossiers)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT ('user-' || extract(epoch from now())::bigint),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    password_hash TEXT,
    gender TEXT DEFAULT 'unspecified', -- 'male' | 'female' | 'unspecified'
    age_group TEXT DEFAULT '26-35',     -- '18-25' | '26-35' | '36-45' | '46-55' | '55+'
    marital_status TEXT DEFAULT 'single', -- 'single' | 'engaged' | 'married' | 'divorced' | 'other'
    country TEXT DEFAULT 'مصر',
    city TEXT DEFAULT '',
    role TEXT DEFAULT 'client',         -- 'client' | 'admin'
    provider TEXT DEFAULT 'credentials',
    clinical_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول المواعيد والحجوزات الرسمية (Bookings & Sessions)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('BK-' || floor(random() * 90000 + 10000)::text),
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    track TEXT NOT NULL DEFAULT 'psychological', -- 'psychological' | 'marital' | 'premarital' | 'parenting' | 'emergency'
    track_label TEXT NOT NULL DEFAULT 'استشارة نفسية فردية',
    age TEXT,
    marital_status TEXT,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    meet_link TEXT NOT NULL DEFAULT 'https://meet.google.com',
    status TEXT NOT NULL DEFAULT 'pending_verification', -- 'pending_verification' | 'confirmed' | 'completed' | 'cancelled'
    payment_method TEXT DEFAULT 'instapay',
    fee TEXT DEFAULT '250 ر.س',
    receipt_note TEXT,
    receipt_image TEXT,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهرس منع الحجز المزدوج (Anti-Double-Booking Unique Partial Index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking_slot
ON public.bookings (slot_date, slot_time)
WHERE status NOT IN ('cancelled', 'rejected');

-- 3. جدول نتائج المقاييس والاختبارات النفسية (Assessments & Test Results)
CREATE TABLE IF NOT EXISTS public.test_results (
    id TEXT PRIMARY KEY DEFAULT ('tr-' || extract(epoch from now())::bigint),
    client_name TEXT NOT NULL,
    client_phone TEXT,
    client_email TEXT,
    test_id TEXT NOT NULL,
    test_title TEXT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    score_percent INT NOT NULL DEFAULT 0,
    level TEXT NOT NULL,
    description TEXT,
    recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول التكليفات والواجبات الإرشادية (Homework & Clinical Tasks)
CREATE TABLE IF NOT EXISTS public.homework (
    id TEXT PRIMARY KEY DEFAULT ('hw-' || extract(epoch from now())::bigint),
    client_phone TEXT,
    client_email TEXT,
    title TEXT NOT NULL,
    link TEXT,
    completed BOOLEAN DEFAULT FALSE,
    assigned_at TEXT DEFAULT to_char(NOW(), 'YYYY-MM-DD'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول إدارة المواعيد وجدول العمل (Availability & Calendly Settings)
CREATE TABLE IF NOT EXISTS public.availability (
    id INT PRIMARY KEY DEFAULT 1,
    working_days INT[] DEFAULT ARRAY[0, 1, 2, 3, 4, 6], -- الأحد إلى الجمعة (السبت=6، الأحد=0)
    time_slots JSONB DEFAULT '[
        {"id": "16:00", "label": "04:00 مساءً", "enabled": true},
        {"id": "17:30", "label": "05:30 مساءً", "enabled": true},
        {"id": "19:00", "label": "07:00 مساءً", "enabled": true},
        {"id": "20:30", "label": "08:30 مساءً", "enabled": true},
        {"id": "22:00", "label": "10:00 مساءً", "enabled": true}
    ]'::jsonb,
    blocked_dates TEXT[] DEFAULT ARRAY[]::TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. جدول مقالات المكتبة الفكرية (Articles & Insights)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    reading_time_minutes INT DEFAULT 5,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول (RLS Policies)
-- السماح بالتسجيل والقراءة الآمنة
CREATE POLICY "Allow public select articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read availability" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert test_results" ON public.test_results FOR INSERT WITH CHECK (true);

-- إدخال إعدادات التوفر الأولية
INSERT INTO public.availability (id, working_days, time_slots, blocked_dates)
VALUES (
    1,
    ARRAY[0, 1, 2, 3, 4, 6],
    '[
        {"id": "16:00", "label": "04:00 مساءً", "enabled": true},
        {"id": "17:30", "label": "05:30 مساءً", "enabled": true},
        {"id": "19:00", "label": "07:00 مساءً", "enabled": true},
        {"id": "20:30", "label": "08:30 مساءً", "enabled": true},
        {"id": "22:00", "label": "10:00 مساءً", "enabled": true}
    ]'::jsonb,
    ARRAY[]::TEXT[]
) ON CONFLICT (id) DO NOTHING;
