-- ==========================================================
-- مخطّط قاعدة بيانات سوبا بيز (Supabase Schema) — د. جلال أحمد
-- ==========================================================

-- 1. جدول طلبات الاستشارات والتنسيق المبدئي (Intake Requests)
CREATE TABLE IF NOT EXISTS public.intake_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    track TEXT NOT NULL, -- 'individual' | 'marital' | 'premarital' | 'teen' | 'corporate'
    delivery_mode TEXT DEFAULT 'online', -- 'online' | 'in_person'
    preferred_time TEXT DEFAULT 'any', -- 'morning' | 'evening' | 'any'
    notes TEXT,
    status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'confirmed' | 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول مقالات المكتبة المعرفية (Articles / Knowledge Hub)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'quranic' | 'marital' | 'parenting' | 'educational'
    excerpt TEXT,
    content TEXT,
    reading_time_minutes INT DEFAULT 5,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
ALTER TABLE public.intake_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- سياسات جدول الطلبات:
-- السماح للزوار بتقديم طلب جديد
CREATE POLICY "Allow public insert on intake_requests" 
ON public.intake_requests 
FOR INSERT 
WITH CHECK (true);

-- السماح للمشرفين المسجلين فقط بالقراءة والتعديل
CREATE POLICY "Allow authenticated read on intake_requests" 
ON public.intake_requests 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update on intake_requests" 
ON public.intake_requests 
FOR UPDATE 
TO authenticated 
USING (true);

-- سياسات جدول المقالات:
-- السماح للعامة بقراءة المقالات المنشورة
CREATE POLICY "Allow public read published articles" 
ON public.articles 
FOR SELECT 
USING (is_published = true);

-- السماح للمشرف بكافة الصلاحيات
CREATE POLICY "Allow authenticated manage articles" 
ON public.articles 
FOR ALL 
TO authenticated 
USING (true);

-- بيانات أولية تجريبية للمقالات (Seed Data)
INSERT INTO public.articles (title, slug, category, excerpt, content, reading_time_minutes)
VALUES 
(
  'السلوك رسالة قبل أن يكون مشكلة: مدخل لفهم أفعال الأبناء',
  'behavior-is-a-message',
  'parenting',
  'كيف ننتقل من محاولة إيقاف السلوك الظاهر فوراً إلى فهم الدافع الكامن وراءه، وبناء العلاقة أولاً قبل طلب التغيير.',
  'التربية بناء وليست معركة.. حينما يبدأ المربي بفهم بواعث السلوك، تنفتح أمامه أبواب التأثير الحقيقي دون حاجة إلى الصدام المستمر.',
  4
),
(
  'أقومية القرآن في فقه العلاقات الزوجية',
  'quranic-marital-harmony',
  'marital',
  'تأملات في الفطرة والوحي لإعادة ترميم المودة وتجاوز صراعات التوقعات غير الواقعية في البيت المسلم.',
  'الزواج ميثاق غليظ وسكن ومودة.. كيف نستعيد هذه المعاني القرآنية بعيداً عن التشوهات الفكرية المعاصرة.',
  6
),
(
  'من ردود الفعل إلى الوعي: ثلاثية الاتزان النفسي',
  'from-reactions-to-awareness',
  'quranic',
  'خطوات عملية في إدارة الانفعالات وتجاوز دوائر التوتر عبر الفهم وبناء المسؤولية الذاتية.',
  'الإنسان لا يتغير بالضغط فقط بل بالفهم أيضاً.. قواعد عملية للانتقال من التلقائية إلى الحكمة والاتزان.',
  5
)
ON CONFLICT (slug) DO NOTHING;
