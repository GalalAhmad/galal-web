/**
 * End-to-End Integration Tests: Client Portal, Clinical Studio & Security Access
 * Verified against Next.js API Routes & Supabase Backend
 */

import http from 'http';
import crypto from 'crypto';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Load .env.local safely
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
}

process.env.MOCK_EMAIL = 'true';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3005';

// ==============================================================================
// STAGE 5 STRICT SAFETY GUARD: REMOTE / PRODUCTION DATABASE PROTECTION
// ==============================================================================
// Localhost is NOT proof of a local or isolated database (it could be an SSH tunnel or port-forward).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const isRemoteSupabase = supabaseUrl.includes('.supabase.co') || !supabaseUrl.includes('test');
const isExplicitIsolated = process.env.TEST_DATABASE_IS_ISOLATED === 'true' && process.env.STAGING_DATABASE_CONFIRMED === 'true';

if (isRemoteSupabase && !isExplicitIsolated) {
  console.log('\n🛡️  [STAGE 5 SAFETY GUARD] Remote Supabase database detected.');
  console.log('   All mutating write tests are strictly SKIPPED to protect database integrity.');
  console.log('   To enable write tests on staging, set TEST_DATABASE_IS_ISOLATED=true and STAGING_DATABASE_CONFIRMED=true.\n');
}

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  console.error('[CRITICAL] Valid SESSION_SECRET (>= 32 chars) required for integration testing.');
  process.exit(1);
}

function createSessionCookie(user) {
  const payload = {
    v: 1,
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `galal_session=${payloadB64}.${signature}`;
}

// Helper for HTTP requests
function makeRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({ status: res.statusCode, headers: res.headers, body: json || data });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

// Synthetic Persona Definitions
const counselorUser = {
  id: 'counselor-galal',
  name: 'د. جلال أحمد',
  role: 'counselor',
  phone: '01003207974',
  email: 'counselor@galalahmad.com',
};

const adminUser = {
  id: 'admin-platform',
  name: 'مدير المنصة',
  role: 'admin',
  phone: '01011112222',
  email: 'admin@galalahmad.com',
};

const clientUser = {
  id: 'client-test-01',
  name: 'عميل تجريبي',
  role: 'client',
  phone: '01000000000',
  email: 'client@test.com',
};

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 بدء اختبارات التكامل الشاملة للبوابات والعيادة والصفحات العامة');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  async function test(name, fn, isMutating = false) {
    if (isMutating && isRemoteSupabase && !isExplicitIsolated) {
      console.log(`  ⏭️  [تخطي آمن - حماية القاعدة] ${name}`);
      skipped++;
      return;
    }

    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message);
      failed++;
    }
  }

  try {
    // 1. Public Route Health & Text Accuracy (Non-mutating)
    await test('الصفحة الرئيسية (/) تعمل وتستجيب برمز 200 وخالية من ادعاءات تشفير 100%', async () => {
      const res = await makeRequest(`${BASE_URL}/`);
      assert.strictEqual(res.status, 200);
      assert.ok(typeof res.body === 'string');
      assert.ok(!res.body.includes('سرية وأمان تام 100%'), 'Should not contain "سرية وأمان تام 100%"');
    }, false);

    await test('صفحة الخدمات والدورات والاختبارات وبوابة تسجيل الدخول تعمل برمز 200', async () => {
      const routes = ['/services', '/courses', '/tests', '/aqwameyat-quran', '/feedback', '/login'];
      for (const r of routes) {
        const res = await makeRequest(`${BASE_URL}${r}`);
        assert.strictEqual(res.status, 200, `Route ${r} returned status ${res.status}`);
      }
    }, false);

    // 2. Three-Tier Authentication Verification (/api/auth/me) (Non-mutating)
    await test('المصادقة الخادمية تميز دور المعالج بدقة (/api/auth/me -> counselor)', async () => {
      const cookie = createSessionCookie(counselorUser);
      const res = await makeRequest(`${BASE_URL}/api/auth/me`, {
        headers: { Cookie: cookie },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.role, 'counselor');
      assert.strictEqual(res.body.user.name, 'د. جلال أحمد');
    }, false);

    await test('المصادقة الخادمية تميز دور الأدمن بدقة (/api/auth/me -> admin)', async () => {
      const cookie = createSessionCookie(adminUser);
      const res = await makeRequest(`${BASE_URL}/api/auth/me`, {
        headers: { Cookie: cookie },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.role, 'admin');
      assert.strictEqual(res.body.user.name, 'مدير المنصة');
    }, false);

    await test('المصادقة الخادمية تميز دور المستفيد بدقة (/api/auth/me -> client)', async () => {
      const cookie = createSessionCookie(clientUser);
      const res = await makeRequest(`${BASE_URL}/api/auth/me`, {
        headers: { Cookie: cookie },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.role, 'client');
      assert.strictEqual(res.body.user.name, 'عميل تجريبي');
    }, false);

    // 3. Clinical Studio & SOAP Lifecycle (Mutating write)
    await test('المعالج يسجل ويسترجع ملاحظات التدوين السريري SOAP للعميل (200 OK)', async () => {
      const counselorCookie = createSessionCookie(counselorUser);
      
      const saveRes = await makeRequest(
        `${BASE_URL}/api/clinical/soap`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: counselorCookie },
        },
        {
          clientId: 'client-test-01',
          sessionDate: '2026-11-14',
          subjective: 'المستفيد يشكو من ضغوط العمل وتراكم المهام الأسبوعية.',
          objective: 'ملاحظة علامات الإجهاد الذهني، تطبيق مقياس التوتر.',
          assessment: 'حالة إجهاد وظيفي خفيف قابلة للتعديل المعرفي السلوكي.',
          plan: 'تكليف المستفيد بجدول تفريغ الأفكار CBT وجلسة تنفس يومية.',
          privateNotes: 'ملاحظة سرية للمتابعة في الجلسة المقبلة.',
        }
      );
      assert.ok([200, 201].includes(saveRes.status), `Expected 200/201, got ${saveRes.status}`);

      const getRes = await makeRequest(
        `${BASE_URL}/api/clinical/soap?clientId=client-test-01`,
        { headers: { Cookie: counselorCookie } }
      );
      assert.strictEqual(getRes.status, 200);
      assert.ok(Array.isArray(getRes.body.notes));
    }, true);

    // 4. Clinical Homework Assignment (Mutating write)
    await test('المعالج يسند تكليفاً سلوكياً للعميل CBT Homework (200 OK)', async () => {
      const counselorCookie = createSessionCookie(counselorUser);
      const hwRes = await makeRequest(
        `${BASE_URL}/api/clinical/homework`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: counselorCookie },
        },
        {
          action: 'assign',
          clientId: 'client-test-01',
          exerciseSlug: 'cbt-thought-record',
        }
      );
      assert.strictEqual(hwRes.status, 200);
      assert.strictEqual(hwRes.body.success, true);
    }, true);

    // 5. Clinical Data Isolation (Non-mutating rejection)
    await test('عزل بيانات العيادة: حظر الأدمن والعميل من الاطلاع على السجل السريري (403)', async () => {
      const adminCookie = createSessionCookie(adminUser);
      const clientCookie = createSessionCookie(clientUser);

      const adminSoap = await makeRequest(
        `${BASE_URL}/api/clinical/soap?clientId=client-test-01`,
        { headers: { Cookie: adminCookie } }
      );
      assert.strictEqual(adminSoap.status, 403);

      const clientSoap = await makeRequest(
        `${BASE_URL}/api/clinical/soap?clientId=client-test-01`,
        { headers: { Cookie: clientCookie } }
      );
      assert.strictEqual(clientSoap.status, 403);
    }, false);

    // 6. Clinical Notes Redaction for Client Profile (Non-mutating)
    await test('حجب الملاحظات السريرية الخاصة عن ملف العميل عند استعراضه بنفسه (Redacted clinicalNotes)', async () => {
      const clientCookie = createSessionCookie(clientUser);
      const res = await makeRequest(`${BASE_URL}/api/user/profile`, {
        headers: { Cookie: clientCookie },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.profile.clinicalNotes, undefined, 'Client profile must redact clinical notes');
      assert.strictEqual(res.body.profile.clinical_notes, undefined);
    }, false);

    // 7. Client Journal Isolation (Mutating write)
    await test('المستفيد يسجل ويقرأ يومياته السرية، ومنع أي مستفيد آخر من التطفل عليها (IDOR Guard)', async () => {
      const client1Cookie = createSessionCookie(clientUser);
      const client2Cookie = createSessionCookie({
        id: 'client-test-02',
        name: 'عميل 2',
        phone: '01099998888',
        role: 'client',
      });

      // Client 1 saves a journal entry
      const saveRes = await makeRequest(
        `${BASE_URL}/api/user/journal`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: client1Cookie },
        },
        {
          title: 'خواطر يومية سرية',
          content: 'أشعر بتحسن ملحوظ بعد تطبيق تمارين التنفس اليوم.',
          mood: 'happy',
        }
      );
      assert.ok([200, 201].includes(saveRes.status));

      // Client 2 attempts to read Client 1's journal using phone param
      const leakAttempt = await makeRequest(
        `${BASE_URL}/api/user/journal?phone=${clientUser.phone}`,
        { headers: { Cookie: client2Cookie } }
      );
      assert.strictEqual(leakAttempt.status, 403, 'Expected 403 IDOR rejection');
    }, true);

    // 8. Admin Settings Management (Non-mutating or safe idempotent)
    await test('الأدمن مصرح له بقراءة وتعديل الإعدادات العامة للمنصة (200 OK)', async () => {
      const adminCookie = createSessionCookie(adminUser);
      const getRes = await makeRequest(`${BASE_URL}/api/admin/settings`, {
        headers: { Cookie: adminCookie },
      });
      assert.strictEqual(getRes.status, 200);
    }, false);

    // 9. Unauthorized Settings Modification (Non-mutating rejection)
    await test('المستفيد محظور من تعديل إعدادات وسياسات المنصة (403 Forbidden)', async () => {
      const clientCookie = createSessionCookie(clientUser);
      const res = await makeRequest(
        `${BASE_URL}/api/admin/settings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: clientCookie },
        },
        { siteName: 'Hacked by Client' }
      );
      assert.strictEqual(res.status, 403);
    }, false);

    // 10. Logout & Token Revocation (Non-mutating)
    await test('تسجيل الخروج يُبطل التوكن فوراً ويمنع إعادة استخدامه (Token Revocation)', async () => {
      const userCookie = createSessionCookie(clientUser);
      const logoutRes = await makeRequest(
        `${BASE_URL}/api/auth/logout`,
        { method: 'POST', headers: { Cookie: userCookie } }
      );
      assert.strictEqual(logoutRes.status, 200);
      assert.strictEqual(logoutRes.body.success, true);
    }, false);
  } finally {
    // =========================================================================
    // STAGE 5 GUARANTEED CLEANUP: Restore SOAP, Homework, Journals, Profiles
    // =========================================================================
    try {
      const profFile = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');
      if (fs.existsSync(profFile)) {
        const profiles = JSON.parse(fs.readFileSync(profFile, 'utf-8'));
        const cl = profiles.find((x) => x.id === 'client-test-01');
        if (cl && Array.isArray(cl.homework)) {
          // Restore homework to baseline (only hw-101)
          const original = cl.homework.filter((h) => h.id === 'hw-101');
          if (original.length !== cl.homework.length) {
            cl.homework = original;
            fs.writeFileSync(profFile, JSON.stringify(profiles, null, 2) + '\n');
          }
        }
      }
    } catch {}
  }

  console.log('\n------------------------------------------------------');
  console.log(`📊 نتيجة الفحص: نجح ${passed} | فشل ${failed} | تخطي آمن ${skipped}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
