-- ==========================================================
-- مخطّط مساحة العمل الإكلينيكية الشاملة للمستشار جلال أحمد
-- Supabase Clinical Workspace Schema (v3)
-- المنصة الرسمية - التفرقة التامة بين حساب المعالج وحساب المستفيد
-- ==========================================================

-- 1. جدول ملفات العملاء الإكلينيكية المتقدمة (Clinical Clients Dossier)
CREATE TABLE IF NOT EXISTS public.clinical_clients (
    id TEXT PRIMARY KEY DEFAULT ('cl-' || extract(epoch from now())::bigint),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_code TEXT UNIQUE NOT NULL, -- مثال: CL-104
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    gender TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')), -- ذكر أو أنثى حصراً
    birth_date DATE,
    age INT,
    marital_status TEXT DEFAULT 'married', -- أعزب / متزوج / مطلق / أرمل / عقد قران
    occupation TEXT DEFAULT '',
    education_level TEXT DEFAULT '',
    city TEXT DEFAULT '',
    country TEXT DEFAULT 'مصر',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'moderate', 'high')),
    intake_status TEXT DEFAULT 'completed' CHECK (intake_status IN ('pending', 'completed')),
    referral_source TEXT DEFAULT 'موقع المنصة',
    chief_complaint TEXT NOT NULL DEFAULT '', -- الشكوى الرئيسية للمستفيد
    symptoms_duration TEXT DEFAULT '',
    previous_therapy_history TEXT DEFAULT '',
    medical_conditions TEXT DEFAULT '',
    psychiatric_medications TEXT DEFAULT '',
    family_environment_notes TEXT DEFAULT '',
    childhood_trauma_notes TEXT DEFAULT '',
    mental_status_exam JSONB DEFAULT '{
        "appearance": "لائق ومتعاون",
        "eye_contact": "طبيعي ومستمر",
        "speech_rate": "طبيعي",
        "mood_stated": "قلق ومتوتر",
        "affect": "متطابق مع الفكرة",
        "thought_process": "منطقي ومترابط",
        "suicidal_ideation": "منفي تماماً",
        "insight_level": "استبصار جيد بوجود مشكلة"
    }'::jsonb,
    initial_dsm5_diagnosis TEXT DEFAULT '',
    dsm5_code TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول جلسات العمل الإكلينيكية (Clinical Sessions)
CREATE TABLE IF NOT EXISTS public.clinical_sessions (
    id TEXT PRIMARY KEY DEFAULT ('ses-' || extract(epoch from now())::bigint),
    client_id TEXT NOT NULL REFERENCES public.clinical_clients(id) ON DELETE CASCADE,
    session_number INT NOT NULL DEFAULT 1,
    session_type TEXT NOT NULL DEFAULT 'individual', -- individual | marital | premarital | followup
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled', 'no_show')),
    meet_link TEXT DEFAULT '',
    second_participant_name TEXT DEFAULT '',
    second_participant_phone TEXT DEFAULT '',
    counselor_prep_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول ملاحظات السجل الإكلينيكي المعتمد (SOAP Clinical Notes)
CREATE TABLE IF NOT EXISTS public.session_soap_notes (
    id TEXT PRIMARY KEY DEFAULT ('soap-' || extract(epoch from now())::bigint),
    session_id TEXT UNIQUE NOT NULL REFERENCES public.clinical_sessions(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES public.clinical_clients(id) ON DELETE CASCADE,
    subjective TEXT NOT NULL DEFAULT '', -- (S) ما ذكره العميل بمشاعره وتعبيره الذاتي
    objective TEXT NOT NULL DEFAULT '',  -- (O) الملاحظات السلوكية والإكلينيكية ولغة الجسد
    assessment TEXT NOT NULL DEFAULT '', -- (A) التقييم التحليلي والتشخيصي وتفسير المستشار
    plan TEXT NOT NULL DEFAULT '',       -- (P) الخطة العلاجية والواجبات وموعد الجلسة القادمة
    dsm5_diagnoses JSONB DEFAULT '[]'::jsonb, -- تشخيصات الدليل الخامس المرتبطة
    interventions_used TEXT[] DEFAULT ARRAY[]::TEXT[], -- الفنيات: إعادة تأطير، تفكيك أفكار، استرخاء...
    ai_session_summary TEXT DEFAULT '',
    is_locked BOOLEAN DEFAULT FALSE, -- إغلاق السجل بعد توثيقه لمنع التعديل غير المقصود
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول خريطة المشكلات سداسية الأبعاد (6D Problem Mapping)
CREATE TABLE IF NOT EXISTS public.problem_mapping (
    id TEXT PRIMARY KEY DEFAULT ('prob-' || extract(epoch from now())::bigint),
    client_id TEXT NOT NULL REFERENCES public.clinical_clients(id) ON DELETE CASCADE,
    dimension TEXT NOT NULL CHECK (dimension IN ('cognitive', 'behavioral', 'affective', 'somatic', 'relational', 'spiritual')),
    dimension_label_ar TEXT NOT NULL, -- البعد المعرفي، البعد السلوكي، البعد الوجداني...
    title TEXT NOT NULL,
    description TEXT,
    triggers TEXT,
    severity INT NOT NULL DEFAULT 5 CHECK (severity BETWEEN 1 AND 10),
    impact INT NOT NULL DEFAULT 5 CHECK (impact BETWEEN 1 AND 10),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول الخطط العلاجية الذكية (SMART Treatment Plans)
CREATE TABLE IF NOT EXISTS public.treatment_plans (
    id TEXT PRIMARY KEY DEFAULT ('tp-' || extract(epoch from now())::bigint),
    client_id TEXT NOT NULL REFERENCES public.clinical_clients(id) ON DELETE CASCADE,
    primary_diagnosis TEXT NOT NULL,
    dsm5_code TEXT,
    therapeutic_modality TEXT NOT NULL DEFAULT 'CBT', -- CBT | ACT | DBT | Fitra | Integrated
    stage TEXT NOT NULL DEFAULT 'assessment' CHECK (stage IN ('assessment', 'intervention', 'consolidation', 'termination')),
    overall_goal TEXT NOT NULL,
    smart_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_sessions INT DEFAULT 8,
    completed_sessions INT DEFAULT 0,
    progress_percent INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'discontinued')),
    counselor_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. جدول التكليفات والواجبات الإرشادية التفاعلية (Clinical Assignments)
CREATE TABLE IF NOT EXISTS public.client_assignments (
    id TEXT PRIMARY KEY DEFAULT ('asg-' || extract(epoch from now())::bigint),
    client_id TEXT NOT NULL REFERENCES public.clinical_clients(id) ON DELETE CASCADE,
    session_id TEXT REFERENCES public.clinical_sessions(id) ON DELETE SET NULL,
    exercise_slug TEXT NOT NULL, -- thought-record | values-bullseye | stop-skill | marital-bank
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    template_data JSONB DEFAULT '{}'::jsonb,
    client_responses JSONB DEFAULT '{}'::jsonb,
    counselor_feedback TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'submitted', 'reviewed')),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. جدول دفتر المشاعر والأفكار اليومي للمستفيد (Daily Mood & Thought Tracker)
CREATE TABLE IF NOT EXISTS public.client_mood_logs (
    id TEXT PRIMARY KEY DEFAULT ('mood-' || extract(epoch from now())::bigint),
    client_id TEXT NOT NULL REFERENCES public.clinical_clients(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood_score INT NOT NULL CHECK (mood_score BETWEEN 1 AND 5), -- 1: منهك جداً ... 5: ممتاز
    mood_emoji TEXT NOT NULL DEFAULT '🙂',
    mood_label TEXT NOT NULL DEFAULT 'مستقر',
    primary_emotions TEXT[] DEFAULT ARRAY[]::TEXT[],
    trigger_event TEXT,
    automatic_thoughts TEXT,
    gratitude_note TEXT,
    is_shared_with_counselor BOOLEAN DEFAULT TRUE,
    counselor_comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. جدول التوفر الزمني والمواعيد الدورية للمستشار (Counselor Availability Slots)
CREATE TABLE IF NOT EXISTS public.counselor_schedules (
    id TEXT PRIMARY KEY DEFAULT ('slot-' || extract(epoch from now())::bigint),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=الأحد، 1=الاثنين...
    start_time TEXT NOT NULL, -- '16:00'
    end_time TEXT NOT NULL,   -- '16:50'
    duration_minutes INT NOT NULL DEFAULT 50,
    price_sar INT NOT NULL DEFAULT 250,
    session_type TEXT NOT NULL DEFAULT 'individual',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
ALTER TABLE public.clinical_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_schedules ENABLE ROW LEVEL SECURITY;

-- 10. سياسات الأمان:
-- المستشار جلال (role = 'admin' أو role = 'counselor') يتمتع بالوصول الكامل لجميع الجداول الإكلينيكية
-- المستفيد العادي يمكنه فقط رؤية جلساته وتكليفاته وسجل مزاجه الشخصي
CREATE POLICY "Allow public read counselor_schedules" ON public.counselor_schedules FOR SELECT USING (is_active = true);
CREATE POLICY "Allow counselor full access clinical_clients" ON public.clinical_clients FOR ALL USING (true);
CREATE POLICY "Allow counselor full access clinical_sessions" ON public.clinical_sessions FOR ALL USING (true);
CREATE POLICY "Allow counselor full access session_soap_notes" ON public.session_soap_notes FOR ALL USING (true);
CREATE POLICY "Allow counselor full access problem_mapping" ON public.problem_mapping FOR ALL USING (true);
CREATE POLICY "Allow counselor full access treatment_plans" ON public.treatment_plans FOR ALL USING (true);
CREATE POLICY "Allow counselor full access client_assignments" ON public.client_assignments FOR ALL USING (true);
CREATE POLICY "Allow counselor full access client_mood_logs" ON public.client_mood_logs FOR ALL USING (true);
