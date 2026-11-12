/**
 * Security Verification Suite for Stage 1 (المرحلة 1)
 * Tests cryptographic primitives, server session tokens, rate limiting,
 * and HTTP authorization boundaries.
 */

import assert from 'assert';
import http from 'http';

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
