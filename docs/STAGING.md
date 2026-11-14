# دليل إعداد وتشغيل بيئة الفحص المتقدمة (Staging Environment Setup Guide)
**تاريخ الوثيقة:** 14 نوفمبر 2026  
**المشروع:** منصة د. جلال أحمد للاستشارات (`galal-web`)  
**المسار:** `docs/STAGING.md`  
**الحالة:** معتمد للتنفيذ (Operational Guide)  

---

## 1. لماذا نحتاج بيئة Staging حقيقية منفصلة؟

الهدف الأساسي من بيئة **Staging** هو اختبار كافة التغييرات الحساسة (الترحيلات البرمجية، سياسات الأمان RLS، وظائف الحجز التزامنية، ومحاكاة الدفع والبريد) على قاعدة بيانات سحابية متطابقة مع الإنتاج، ولكن:
1. **بدون أي مساس ببيانات العملاء الحقيقيين.**
2. **بدون إجراء اختبارات كتابة أو حذف على قاعدة الإنتاج.**
3. **مع عزل أمني تام للمفاتيح والأسرار الرقمية.**

---

## 2. خطوات إنشاء مشروع Supabase منفصل لبيئة Staging

1. ادخل إلى لوحة تحكم [Supabase Dashboard](https://supabase.com/dashboard).
2. انقر على **New project** (مشروع جديد).
3. اضبط إعدادات المشروع كالتالي:
   - **Name:** `galal-web-staging`
   - **Database Password:** قم بتوليد كلمة مرور قوية جدًا واحفظها في مدير كلمات المرور الخاص بك.
   - **Region:** اختر المنطقة الأقرب للجمهور المستهدف (مثل: `Frankfurt (eu-central-1)` أو `London (eu-west-2)`).
   - **Pricing Plan:** Free Tier (تكفي تماماً لاختبارات الـ Staging).
4. بعد إنشاء المشروع (يستغرق حوالي دقيقة إلى دقيقتين)، انتقل إلى:
   - **Project Settings ➔ API**: وانسخ الآتي:
     - `Project URL`
     - `anon public key`
     - `service_role secret key` (يُحفظ بحذر شديد ولا يُكشف في المتصفح).
   - **Project Settings ➔ Database**: وانسخ `Connection string (URI)` في حال رغبت بتشغيل الترحيلات عبر السكربت الآلي.

---

## 3. جدول متغيرات البيئة لكل بيئة (Environment Variables Matrix)

> [!CAUTION]
> **ممنوع قطعيًا إعادة استخدام نفس الأسرار أو المفاتيح بين بيئة Staging وبيئة الإنتاج (Production)!**

| متغير البيئة (`Variable`) | بيئة التطوير المحلي (`Local Dev`) | بيئة الفحص (`Staging`) | بيئة الإنتاج الفعلي (`Production`) | نوع وقيمة المتغير المقترحة |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` | `production` (أو `staging`) | `production` | يفرض إغلاق المسارات التجريبية والمحاكاة |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://staging.galalahmad.com` | `https://galalahmad.com` | رابط الأصل الرسمي للـ CORS والـ Auth |
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع محلي أو staging | `https://[staging-ref].supabase.co` | `https://[prod-ref].supabase.co` | مسار Supabase السحابي |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح anon محلي | مفتاح anon الخاص بـ staging | مفتاح anon الخاص بـ production | عام مع تقييد RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح محلي | مفتاح service_role الخاص بـ staging | مفتاح service_role الخاص بـ production | خادمي فقط (Backend Secret) |
| `SESSION_SECRET` | `dev-insecure-secret-32-chars-long!` | سر عشوائي 64 بايت لـ staging | سر عشوائي 64 بايت مستقل لـ prod | توليد عبر `openssl rand -hex 32` |
| `TOTP_ENCRYPTION_KEY` | `dev-totp-key-32-bytes-long-string` | مفتاح تشفير 32 بايت لـ staging | مفتاح تشفير 32 بايت مستقل لـ prod | لتشفير أسرار الـ 2FA في قاعدة البيانات |
| `COUNSELOR_PASSWORD_HASH` | تجزئة كلمة سر وهمية للاختبار | تجزئة كلمة سر خاصة بـ staging | تجزئة كلمة سر الدكتور جلال الحقيقية | PBKDF2-SHA512 بـ 210,000 دورة |
| `ADMIN_PASSWORD_HASH` | تجزئة كلمة سر وهمية للاختبار | تجزئة كلمة سر خاصة بـ staging | تجزئة كلمة سر الإدارة الحقيقية | PBKDF2-SHA512 بـ 210,000 دورة |
| `ENABLE_DEV_SESSION` | `true` (اختياري للفحص السريع) | `false` (أو غير معرف) | `false` (محظور قطعيًا) | حماية إضافية لمسار الجلسات |
| `MOCK_EMAIL` | `true` | `true` (أو بريد تجريبي) | `false` | منع خروج إيميلات حقيقية من Staging |
| `RESEND_API_KEY` | غير مطلوب | مفتاح Resend تجريبي أو Brevo Sandbox | مفتاح Resend الإنتاجي المعتمد | إرسال البريد الإلكتروني |

---

## 4. تطبيق الترحيلات على قاعدة Staging (Migration Execution)

لتطبيق كافة جداول وسياسات الأمان والـ RPCs على مشروع Staging الجديد:

### الخطوة أ: تطبيق المخطط الأساسي وسياسات الأمان
من لوحة تحكم Supabase Staging، توجه إلى **SQL Editor** ونفذ الملفات الأساسية التالية بالترتيب:
1. `supabase/schema.sql` (المخطط الأولي للجداول الأساسية).
2. `supabase/clinical_schema.sql` (جداول العيادة والملاحظات السريرية).
3. `supabase/secure_rls_v4.sql` (تفعيل RLS وسحب الصلاحيات من anon).
4. `supabase/atomic_booking_rpc.sql` (دالة الحجز الذري الآمنة `create_booking_atomic`).

### الخطوة ب: تطبيق ترحيلات التحصين التدريجية (Migrations)
نفذ السكربت المخصص للترحيلات:
```bash
# وضع المحاكاة والفحص
node scripts/run_migrations.mjs --dry-run

# التطبيق الفعلي على قاعدة Staging (باستخدام رابط الاتصال)
$env:DATABASE_URL="postgres://postgres:[PASSWORD]@db.[STAGING_REF].supabase.co:5432/postgres"
node scripts/run_migrations.mjs --up
```

---

## 5. مصفوفة التراجع عن الترحيلات (Rollback Matrix)

في حال حدوث أي خطأ، يوفر السكربت والجدول التالي خطة التراجع العكسية المباشرة (Down Migration):

| الملف المطبق (`Up`) | أمر التراجع (`Down / Rollback Plan`) |
| :--- | :--- |
| `20261114_force_password_reset_schema.sql` | `ALTER TABLE public.profiles DROP COLUMN IF EXISTS must_reset_password, DROP COLUMN IF EXISTS password_algo, DROP COLUMN IF EXISTS password_updated_at;` |
| `20261114_append_only_audit_log.sql` | `DROP TRIGGER IF EXISTS trg_prevent_audit_log_tamper ON public.clinical_audit_logs; DROP FUNCTION IF EXISTS public.prevent_audit_log_tampering();` |
| `20261114_distributed_rate_limiting.sql` | `DROP FUNCTION IF EXISTS public.check_rate_limit; DROP TABLE IF EXISTS public.rate_limits CASCADE;` |
| `20261114_institutional_inquiries_and_feedback.sql` | `DROP TABLE IF EXISTS public.inquiries CASCADE; DROP TABLE IF EXISTS public.feedback_submissions CASCADE;` |
| `20261114_reschedule_booking_atomic_rpc.sql` | `DROP FUNCTION IF EXISTS public.reschedule_booking_atomic;` |
| `20261114_backfill_booking_slot_minutes.sql` | `ALTER TABLE public.bookings DROP COLUMN IF EXISTS slot_start_minutes, DROP COLUMN IF EXISTS duration_minutes;` |
| `20261114_create_auth_otps_table.sql` | `DROP TABLE IF EXISTS public.auth_otps CASCADE;` |

---

## 6. حزمة الاختبارات الشاملة بعد تجهيز Staging

فور جاهزية Staging، يتم تشغيل حزمة الاختبارات بالترتيب التالي:
1. **اختبارات الأمان وحماية الـ IDOR والتوكنات:**
   ```bash
   node tests/security_tests.mjs
   ```
2. **اختبار التزامن ومحرك الحجز الذري وقفل قاعدة البيانات:**
   ```bash
   node tests/booking_lifecycle_and_concurrency.mjs
   ```
3. **اختبار الـ Rate Limiter الموزع المتوازي:**
   ```bash
   node scripts/test_parallel_rate_limit.mjs
   ```
4. **اختبار رحلات العميل والمعالج والـ SOAP Notes:**
   ```bash
   node tests/e2e_portal_and_clinical_tests.mjs
   ```
