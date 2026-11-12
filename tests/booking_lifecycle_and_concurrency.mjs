/**
 * End-to-End Integration Suite for Stage 3 & 4:
 * Booking Lifecycle, Concurrency / Double-Booking Prevention,
 * Role Separation, and Receipt Vault.
 */

import assert from 'assert';
import http from 'http';
import crypto from 'crypto';

import fs from 'fs';

// Load .env.local without logging or printing any secrets
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
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'galal_secure_session_hmac_secret_2026';

function createSessionCookie(user) {
  const payload = {
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

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 بدء اختبارات دورة حياة الحجز والتزامن والأمان (Stage 3 & 4)');
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

  const clientUser = {
    id: 'test-client-123',
    name: 'عميل تجريبي',
    phone: '01019998877',
    email: 'client_test@galalahmad.com',
    role: 'client',
  };

  const clientCookie = createSessionCookie(clientUser);

  const counselorUser = {
    id: 'test-counselor-1',
    name: 'د. جلال أحمد',
    phone: '01003207974',
    email: 'counselor@galalahmad.com',
    role: 'counselor',
  };

  const counselorCookie = createSessionCookie(counselorUser);

  // Unique slot for testing to prevent collision with actual data
  const testSlotDate = `2029-01-${Math.floor(10 + Math.random() * 18)}`;
  const testSlotTime = '07:30 PM';
  let createdBookingId = null;

  // 1. Zod Server Validation: Missing required fields
  await test('رفض حجز بدون رقم هاتف ورقم هاتف غير صالح عبر Zod (400)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { clientName: 'تجربة', clientPhone: '12', slotDate: testSlotDate, slotTime: testSlotTime }
    );
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  // 2. Zod Server Validation: Invalid date format
  await test('رفض حجز بتنسيق تاريخ غير متوافق مع معيار YYYY-MM-DD (400)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { clientName: 'تجربة حجز', clientPhone: '01019998877', slotDate: '15/01/2029', slotTime: testSlotTime }
    );
    assert.strictEqual(res.status, 400);
  });

  // 3. Successful Booking creation with receipt storage
  await test('إنشاء حجز مستوفٍ للشروط واعتماد إيصال السداد المشفر (200)', async () => {
    const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const receiptBase64 = `data:image/jpeg;base64,${validJpeg.toString('base64')}`;

    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        clientName: 'عميل تجريبي معتمد',
        clientPhone: clientUser.phone,
        clientEmail: clientUser.email,
        slotDate: testSlotDate,
        slotTime: testSlotTime,
        track: 'psychological',
        trackLabel: 'استشارة نفسية فردية',
        paymentMethod: 'instapay',
        receiptNote: 'إيصال تحويل تجريبي للتأكد من السلامة',
        receiptImage: receiptBase64,
      }
    );

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.booking && res.body.booking.id);
    createdBookingId = res.body.booking.id;
  });

  // 4. Concurrency / Anti-double-booking: Second client attempts booking the exact same slot
  await test('منع الحجز المزدوج لنفس الموعد بالتزامن (409 Conflict)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        clientName: 'مستفيد منافس آخر',
        clientPhone: '01122334455',
        clientEmail: 'other@example.com',
        slotDate: testSlotDate,
        slotTime: testSlotTime,
        track: 'marriage',
        paymentMethod: 'instapay',
      }
    );

    assert.strictEqual(res.status, 409, `Expected 409 Conflict for double booking, got ${res.status}`);
    assert.ok(res.body.error.includes('تم حجزه للتو'));
  });

  // 5. Secure Receipt Vault endpoint: unauthenticated access rejected
  await test('منع الوصول غير المصادق لملفات الإيصالات البنكية عبر /api/bookings/receipt (401)', async () => {
    const res = await makeRequest(`${BASE_URL}/api/bookings/receipt?id=${createdBookingId}`);
    assert.strictEqual(res.status, 401);
  });

  // 6. Secure Receipt Vault endpoint: unauthorized third-party client rejected
  await test('منع وصول مستفيد غريب لإيصال سداد مستفيد آخر (403 Forbidden)', async () => {
    const strangerCookie = createSessionCookie({
      id: 'stranger-999',
      name: 'مستفيد غريب',
      phone: '01055554433',
      role: 'client',
    });

    const res = await makeRequest(`${BASE_URL}/api/bookings/receipt?id=${createdBookingId}`, {
      headers: { Cookie: strangerCookie },
    });
    assert.strictEqual(res.status, 403);
  });

  // 7. State Machine: Client cannot confirm their own booking
  await test('منع المستفيد من ترقية حالة حجزه بنفسه إلى مؤكد (403 Forbidden)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: clientCookie } },
      { id: createdBookingId, status: 'confirmed' }
    );
    assert.strictEqual(res.status, 403);
    assert.ok(res.body.error.includes('المعالج'));
  });

  // 8. State Machine: Counselor approves booking and sets meeting room
  await test('سماح المعالج باعتماد وتأكيد الحجز وتعيين رابط قاعة اللقاء (200)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
      {
        id: createdBookingId,
        status: 'confirmed',
        meetLink: 'https://meet.google.com/galal-clinic-room',
      }
    );
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.strictEqual(res.body.booking.status, 'confirmed');
    assert.strictEqual(res.body.booking.meetLink, 'https://meet.google.com/galal-clinic-room');
  });

  // 9. State Machine: Counselor completes session
  await test('ترقية الحجز المؤكد إلى مكتمل بعد انعقاد الجلسة السريرية (200)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
      { id: createdBookingId, status: 'completed' }
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.booking.status, 'completed');
  });

  // 10. State Machine: Terminal State enforcement on completed session
  await test('منع التراجع أو العبث بجلسة مكتملة وموثقة سريرياً (400 Terminal State)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
      { id: createdBookingId, status: 'pending_verification' }
    );
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error.includes('لا يمكن تعديل حالة جلسة مكتملة'));
  });

  // 11. Cleanup test booking
  await test('حذف الحجز التجريبي بعد انتهاء دورة الفحص بواسطة المعالج (200)', async () => {
    const res = await makeRequest(
      `${BASE_URL}/api/bookings`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
      { id: createdBookingId, action: 'delete' }
    );
    assert.strictEqual(res.status, 200);
  });

  console.log('\n------------------------------------------------------');
  console.log(`📊 نتيجة الفحص: نجح ${passed} | فشل ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
