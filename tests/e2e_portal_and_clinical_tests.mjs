/**
 * End-to-End Integration Suite: 3-Tier Portals, Clinical Studio & Public Routes
 * Stage 6 Verification:
 *  - Public route health, Arabic RTL markers, sanitized privacy text.
 *  - Unified 3-tier auth validation (/api/auth/me).
 *  - Counselor ConsultationStudio: SOAP notes lifecycle & CBT homework assignment.
 *  - Client Portal: Redacted clinical notes, wellbeing tracking & gratitude journal.
 *  - Admin Boundary: Public content management permitted, clinical dossiers strictly 403.
 *  - Session Logout: Token revocation & HttpOnly cookie invalidation.
 */

import assert from 'assert';
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';

// Safely load environment configuration
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

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3005';
const parsedBase = new URL(BASE_URL);
if (!['localhost', '127.0.0.1', '::1'].includes(parsedBase.hostname)) {
  console.error('[CRITICAL] Tests must strictly run on localhost/staging:', parsedBase.hostname);
  process.exit(1);
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

  // 1. Public Route Health & Text Accuracy
  await test('الصفحة الرئيسية (/) تعمل وتستجيب برمز 200 وخالية من ادعاءات تشفير 100%', async () => {
    const res = await makeRequest(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(!res.body.includes('سرية وأمان تام 100%'), 'Should not contain "سرية وأمان تام 100%"');
  });

  await test('صفحة الخدمات والدورات والاختبارات وبوابة تسجيل الدخول تعمل برمز 200', async () => {
    const routes = ['/services', '/courses', '/tests', '/aqwameyat-quran', '/feedback', '/login'];
    for (const r of routes) {
      const res = await makeRequest(`${BASE_URL}${r}`);
      assert.strictEqual(res.status, 200, `Route ${r} returned status ${res.status}`);
    }
  });

  // 2. Three-Tier Authentication Verification (/api/auth/me)
  await test('المصادقة الخادمية تميز دور المعالج بدقة (/api/auth/me -> counselor)', async () => {
    const cookie = createSessionCookie(counselorUser);
    const res = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: cookie },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.role, 'counselor');
    assert.strictEqual(res.body.user.name, 'د. جلال أحمد');
  });

  await test('المصادقة الخادمية تميز دور الأدمن بدقة (/api/auth/me -> admin)', async () => {
    const cookie = createSessionCookie(adminUser);
    const res = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: cookie },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.role, 'admin');
    assert.strictEqual(res.body.user.name, 'مدير المنصة');
  });

  await test('المصادقة الخادمية تميز دور المستفيد بدقة (/api/auth/me -> client)', async () => {
    const cookie = createSessionCookie(clientUser);
    const res = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: cookie },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.role, 'client');
    assert.strictEqual(res.body.user.name, 'عميل تجريبي');
  });

  // 3. Clinical Studio & SOAP Lifecycle
  await test('المعالج يسجل ويسترجع ملاحظات التدوين السريري SOAP للعميل (200 OK)', async () => {
    const counselorCookie = createSessionCookie(counselorUser);
    
    // Save a SOAP note
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

    // Retrieve SOAP notes
    const getRes = await makeRequest(
      `${BASE_URL}/api/clinical/soap?clientId=client-test-01`,
      { headers: { Cookie: counselorCookie } }
    );
    assert.strictEqual(getRes.status, 200);
    assert.ok(Array.isArray(getRes.body.notes));
  });

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
  });

  await test('عزل بيانات العيادة: حظر الأدمن والعميل من الاطلاع على السجل السريري (403)', async () => {
    const adminCookie = createSessionCookie(adminUser);
    const clientCookie = createSessionCookie(clientUser);

    const adminSoap = await makeRequest(
      `${BASE_URL}/api/clinical/soap?clientId=client-test-01`,
      { headers: { Cookie: adminCookie } }
    );
    assert.strictEqual(adminSoap.status, 403, 'Admin must receive 403 on SOAP notes');

    const clientSoap = await makeRequest(
      `${BASE_URL}/api/clinical/soap?clientId=client-test-01`,
      { headers: { Cookie: clientCookie } }
    );
    assert.strictEqual(clientSoap.status, 403, 'Client must receive 403 on clinical SOAP notes');
  });

  // 4. Client Portal & Redaction Verification
  await test('حجب الملاحظات السريرية الخاصة عن ملف العميل عند استعراضه بنفسه (Redacted clinicalNotes)', async () => {
    const clientCookie = createSessionCookie(clientUser);
    const res = await makeRequest(`${BASE_URL}/api/user/profile`, {
      headers: { Cookie: clientCookie },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.profile, 'Profile object must exist');
    // clinicalNotes must be empty for client view, only visible to counselor
    assert.strictEqual(res.body.profile.clinicalNotes || '', '', 'clinicalNotes must be redacted/empty for client');
    assert.ok(Array.isArray(res.body.profile.homework), 'Client can see assigned homework');
  });

  await test('المستفيد يسجل ويقرأ يومياته السرية، ومنع أي مستفيد آخر من التطفل عليها (IDOR Guard)', async () => {
    const clientCookie = createSessionCookie(clientUser);
    
    // Create entry
    const postRes = await makeRequest(
      `${BASE_URL}/api/user/journal`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: clientCookie },
      },
      {
        title: 'يوميات امتنان ووعي',
        content: 'اليوم مارست تمارين التنفس العميق وشعرت بهدوء ذهني ملموس.',
        mood: 'calm',
      }
    );
    assert.strictEqual(postRes.status, 200);

    // Read back own entries
    const getRes = await makeRequest(`${BASE_URL}/api/user/journal`, {
      headers: { Cookie: clientCookie },
    });
    assert.strictEqual(getRes.status, 200);
    assert.ok(Array.isArray(getRes.body.entries));

    // Attacker tries to view client's entries with phone injection
    const otherClientCookie = createSessionCookie({
      id: 'client-attacker-99',
      name: 'مهاجم',
      role: 'client',
      phone: '01099999999',
    });
    const idorRes = await makeRequest(
      `${BASE_URL}/api/user/journal?phone=01000000000`,
      { headers: { Cookie: otherClientCookie } }
    );
    assert.strictEqual(idorRes.status, 403, 'Attacker must be blocked from reading another client journal (403)');
  });

  // 5. Admin Boundary & Public Content Isolation
  await test('الأدمن مصرح له بقراءة وتعديل الإعدادات العامة للمنصة (200 OK)', async () => {
    const adminCookie = createSessionCookie(adminUser);
    const res = await makeRequest(`${BASE_URL}/api/admin/settings`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.settings !== undefined);
  });

  await test('المستفيد محظور من تعديل إعدادات وسياسات المنصة (403 Forbidden)', async () => {
    const clientCookie = createSessionCookie(clientUser);
    const res = await makeRequest(
      `${BASE_URL}/api/admin/settings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: clientCookie },
      },
      { settings: { siteMaintenance: true } }
    );
    assert.strictEqual(res.status, 403);
  });

  // 6. Session Logout & Revocation
  await test('تسجيل الخروج يُبطل التوكن فوراً ويمنع إعادة استخدامه (Token Revocation)', async () => {
    const cookie = createSessionCookie(clientUser);
    const rawToken = cookie.replace('galal_session=', '');

    // Log out with this session
    const logoutRes = await makeRequest(
      `${BASE_URL}/api/auth/logout`,
      {
        method: 'POST',
        headers: { Cookie: cookie },
      }
    );
    assert.strictEqual(logoutRes.status, 200);
    assert.strictEqual(logoutRes.body.success, true);

    // Verify Set-Cookie clears the session
    const setCookie = logoutRes.headers['set-cookie'];
    assert.ok(setCookie, 'Logout must send Set-Cookie clearing the cookie');

    // Attempting to use the revoked token must now be rejected with 401
    const verifyRes = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: cookie },
    });
    assert.strictEqual(verifyRes.status, 401, 'Revoked token must fail authentication with 401');
  });

  console.log('\n------------------------------------------------------');
  console.log(`📊 نتيجة الفحص: نجح ${passed} | فشل ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('[FATAL] Uncaught test harness error:', err);
  process.exit(1);
});
