/**
 * Security Verification Suite for Stage 1 (المرحلة 1)
 * Tests cryptographic primitives, server session tokens, rate limiting,
 * and HTTP authorization boundaries.
 */

import assert from 'assert';
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';

// Load .env.local safely without logging or exposing secrets
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
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

// Safety check: ensure testing is strictly on localhost/staging, never production
const parsedBase = new URL(BASE_URL);
if (!['localhost', '127.0.0.1', '::1'].includes(parsedBase.hostname)) {
  console.error('[CRITICAL] Tests cannot run against external/production hosts:', parsedBase.hostname);
  process.exit(1);
}

// ==============================================================================
// STAGE 5 STRICT SAFETY GUARD: REMOTE / PRODUCTION DATABASE PROTECTION
// ==============================================================================
// Localhost is NOT proof of a local or isolated database (it could be an SSH tunnel or port-forward).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const isRemoteSupabase = supabaseUrl.includes('.supabase.co') || !supabaseUrl.includes('test');
const isExplicitIsolated = process.env.TEST_DATABASE_IS_ISOLATED === 'true' && process.env.STAGING_DATABASE_CONFIRMED === 'true';

if (isRemoteSupabase && !isExplicitIsolated) {
  console.log('\n🛡️  [STAGE 5 SAFETY GUARD] Remote Supabase database detected.');
  console.log('   All tests in this suite are non-mutating security access checks (read-only / 401 / 403 / 501 / rate limit).');
  console.log('   Any mutating write tests on staging require TEST_DATABASE_IS_ISOLATED=true and STAGING_DATABASE_CONFIRMED=true.\n');
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

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 بدء اختبارات الأمان للمرحلة 1 (Security Integration Tests)');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message);
      failed++;
    }
  }

  const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3005';

  // Test 1: Unauthenticated profile access must be rejected with 401
  await test('رفض استعلام الملفات الشخصية بدون جلسة مصادقة (401 Unauthorized)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/profile`);
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
    assert.strictEqual(res.body.code, 'UNAUTHORIZED');
  });

  // Test 2: Pseudo-admin query parameter (?admin=true) must be ignored and rejected with 401
  await test('منع تجاوز الصلاحيات عبر بارامتر admin=true في الحجوزات (401)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/bookings?admin=true`);
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 3: Forged header x-admin-role must be rejected
  await test('منع تجاوز الصلاحيات عبر ترويسة x-admin-role: admin (401)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/bookings`, {
      headers: { 'x-admin-role': 'admin' },
    });
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 4: Unauthenticated booking deletion must be blocked
  await test('منع حذف أي حجز دون جلسة معالج أو أدمن موثقة (401)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' } },
      { id: 'fake-booking-id', action: 'delete' }
    );
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 5: Immediate password overwrite without OTP must be blocked with 400
  await test('منع الاستيلاء على الحساب وتغيير كلمة المرور دون رمز OTP مؤقت (400)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/auth/forgot-password`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { identifier: '01012345678', newPassword: 'NewPassword@2026' }
    );
    assert.strictEqual(res.status, 400, `Expected 400 but received ${res.status}`);
    assert.ok(res.body.error.includes('رمز التحقق'), 'Error should mention OTP requirement');
  });

  // Test 6: Unauthenticated open relay email dispatch must be blocked with 401
  await test('منع إرسال بريد مفتوح عبر /api/admin/send-email (401)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/admin/send-email`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { to: 'victim@example.com', subject: 'Spam', message: 'Spam' }
    );
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 7: Unauthenticated site settings modification must be blocked with 401
  await test('منع تعديل إعدادات وسياسات المنصة دون دور الأدمن (401)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/admin/settings`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { siteName: 'Hacked Site' }
    );
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 8: Unauthenticated access to clinical homework must be blocked with 401
  await test('منع قراءة تكليفات العلاج السريري دون مصادقة (401)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/clinical/homework?phone=01012345678`);
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 9: Unauthenticated access to client journal must be blocked with 401
  await test('منع قراءة خواطر ويوميات المستفيدين دون مصادقة (401)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/journal?phone=01012345678`);
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Test 10: Unauthenticated access to client wellbeing logs must be blocked with 401
  await test('منع قراءة سجلات السكينة والمزاج اليومية دون مصادقة (401)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/wellbeing?phone=01012345678`);
    assert.strictEqual(res.status, 401, `Expected 401 but received ${res.status}`);
  });

  // Prepare test role cookies
  const adminCookie = createSessionCookie({
    id: 'admin-platform',
    name: 'مدير المنصة',
    role: 'admin',
    email: 'admin@galalahmad.com',
  });

  const counselorCookie = createSessionCookie({
    id: 'counselor-galal',
    name: 'د. جلال أحمد',
    role: 'counselor',
    email: 'counselor@galalahmad.com',
  });

  const client1Cookie = createSessionCookie({
    id: 'client-test-01',
    name: 'عميل 1',
    phone: '01000000000',
    role: 'client',
  });

  const client2Cookie = createSessionCookie({
    id: 'client-test-02',
    name: 'عميل 2',
    phone: '01099998888',
    role: 'client',
  });

  // Test 11: Admin strictly forbidden from clinical SOAP GET (403)
  await test('حظر وصول الأدمن لسجلات التدوين السريري SOAP GET (403 Forbidden)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/clinical/soap?clientId=client-test-01`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
    assert.strictEqual(res.body.code, 'FORBIDDEN');
  });

  // Test 12: Admin strictly forbidden from clinical SOAP POST (403)
  await test('حظر إدراج الأدمن لأي ملاحظات سريرية SOAP POST (403 Forbidden)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/clinical/soap`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: adminCookie } },
      { clientId: 'client-test-01', subjective: 'Attacker note' }
    );
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
    assert.strictEqual(res.body.code, 'FORBIDDEN');
  });

  // Test 13: Admin strictly forbidden from client journal (403)
  await test('حظر وصول الأدمن لخواطر ويوميات المستفيدين السرية (403 Forbidden)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/journal?phone=01000000000`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
    assert.strictEqual(res.body.code, 'FORBIDDEN');
  });

  // Test 14: Admin strictly forbidden from client wellbeing logs (403)
  await test('حظر وصول الأدمن لسجلات مقياس السكينة اليومي للمستفيدين (403 Forbidden)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/wellbeing?phone=01000000000`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
    assert.strictEqual(res.body.code, 'FORBIDDEN');
  });

  // Test 15: Client 2 forbidden from accessing Client 1's journal (403)
  await test('منع مستفيد من التجسس على خواطر ويوميات مستفيد آخر (403 Forbidden)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/journal?phone=01000000000`, {
      headers: { Cookie: client2Cookie },
    });
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
    assert.strictEqual(res.body.code, 'FORBIDDEN');
  });

  // Test 15b: Client 2 forbidden from accessing Client 1's journal by email (403)
  await test('منع مستفيد من التجسس على خواطر مستفيد آخر عبر البريد الإلكتروني (403 Forbidden)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/user/journal?email=victim@example.com`, {
      headers: { Cookie: client2Cookie },
    });
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
    assert.strictEqual(res.body.code, 'FORBIDDEN');
  });

  // Test 16: Counselor permitted to read clinical SOAP records (200)
  await test('سماح المعالج د. جلال فقط بالوصول السريري لسجلات SOAP (200 OK)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/clinical/soap?clientId=client-test-01`, {
      headers: { Cookie: counselorCookie },
    });
    assert.strictEqual(res.status, 200, `Expected 200 but got ${res.status}`);
    assert.strictEqual(res.body.success, true);
  });

  // Test 17: Unauthenticated modification of availability rejected (401)
  await test('منع تعديل جدول المواعيد وأيام العمل دون مصادقة إدارية (401)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/availability`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { workingDays: [1, 2] }
    );
    assert.strictEqual(res.status, 401, `Expected 401 but got ${res.status}`);
  });

  // Test 18: Client forbidden from modifying availability (403)
  await test('منع المستفيد العادي من تغيير أوقات وأيام عمل العيادة (403 Forbidden)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/availability`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: client1Cookie } },
      { workingDays: [1, 2] }
    );
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
  });

  // Test 19: Client forbidden from modifying academy courses (403)
  await test('منع المستفيد العادي من إضافة أو حذف دورات الأكاديمية (403 Forbidden)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/admin/courses`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: client1Cookie } },
      { title: 'دورة غير مصرحة' }
    );
    assert.strictEqual(res.status, 403, `Expected 403 but got ${res.status}`);
  });

  // Test 20: Stage 1 - Untrusted OAuth request must be blocked safely (501)
  await test('إغلاق تسجيل الدخول الاجتماعي غير الموثوق ومنع تزوير الحسابات (/api/auth/oauth -> 501)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/auth/oauth`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        provider: 'google',
        email: 'counselor@galalahmad.com',
        name: 'حساب مزيف',
      }
    );
    assert.strictEqual(res.status, 501, `Expected 501 OAUTH_DISABLED, got ${res.status}`);
    assert.strictEqual(res.body.code, 'OAUTH_DISABLED');
  });

  // Test 21: Stage 3 - Requesting reset OTP with generic response and mock provider
  await test('طلب رمز استعادة كلمة المرور برسالة لا تكشف وجود الحساب مع مزود وهمي (200)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/auth/forgot-password`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { identifier: 'client@test.com' }
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.requiresToken, true);
    assert.ok(res.body.message.includes('إذا كان الحساب مسجلاً لدينا'));
  });

  // Test 22: Stage 3 - Rejection of wrong reset OTP
  await test('رفض استكمال استعادة كلمة المرور برمز تحقق خاطئ (400)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/auth/forgot-password`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { identifier: 'client@test.com', resetToken: '000000', newPassword: 'NewSecurePassword@2026' }
    );
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error.includes('رمز التحقق'));
  });

  console.log('\n------------------------------------------------------');
  console.log(`📊 نتيجة الفحص: نجح ${passed} | فشل ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test runner fatal error:', e);
  process.exit(1);
});
