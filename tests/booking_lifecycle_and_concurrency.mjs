/**
 * Booking Lifecycle, Concurrency & State Machine Integration Tests
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

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 بدء اختبارات دورة حياة الحجز والتزامن والأمان (Stage 2 & 5)');
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

  const testSlotDate = `2029-01-${Math.floor(10 + Math.random() * 18)}`;
  const testSlotTime = '07:30 PM';
  let createdBookingId = null;
  const createdTestBookingIds = [];

  try {
    // 1. Zod Server Validation: Missing required fields (Non-mutating rejection)
    await test('رفض حجز بدون رقم هاتف ورقم هاتف غير صالح عبر Zod (400)', async () => {
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { clientName: 'تجربة', clientPhone: '12', slotDate: testSlotDate, slotTime: testSlotTime }
      );
      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error);
    }, false);

    // 2. Zod Server Validation: Invalid date format (Non-mutating rejection)
    await test('رفض حجز بتنسيق تاريخ غير متوافق مع معيار YYYY-MM-DD (400)', async () => {
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        { clientName: 'تجربة حجز', clientPhone: '01019998877', slotDate: '15/01/2029', slotTime: testSlotTime }
      );
      assert.strictEqual(res.status, 400);
    }, false);

    // 2b. Price Tampering Validation (Non-mutating rejection)
    await test('رفض محاولة التلاعب بالرسوم وتخفيض السعر من العميل (400 Bad Request)', async () => {
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        {
          clientName: 'مخترق أسعار',
          clientPhone: '01019998877',
          slotDate: testSlotDate,
          slotTime: testSlotTime,
          track: 'psychological',
          fee: '10 ر.س', // Attempted tampering from 250 to 10
        }
      );
      assert.strictEqual(res.status, 400, `Expected 400 for tampered fee, got ${res.status}`);
      assert.ok(res.body.error.includes('غير مطابقة للتسعيرة الرسمية'));
    }, false);

    // 2c. Invalid Track Whitelist Validation (Non-mutating rejection)
    await test('رفض اختيار مسار استشاري غير معتمد في القائمة البيضاء (400 Bad Request)', async () => {
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        {
          clientName: 'مسار عشوائي',
          clientPhone: '01019998877',
          slotDate: testSlotDate,
          slotTime: testSlotTime,
          track: 'unauthorized_hacked_track',
        }
      );
      assert.strictEqual(res.status, 400, `Expected 400 for invalid track, got ${res.status}`);
      assert.ok(res.body.error.includes('غير معتمد في المنصة'));
    }, false);

    // 3. Successful Booking creation with receipt storage (Mutating write)
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
      createdTestBookingIds.push(createdBookingId);
    }, true);

    // 4. Concurrency / Anti-double-booking (Mutating write)
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
      assert.ok(res.body.error.includes('تم حجزه للتو') || res.body.error.includes('يتعارض'));
    }, true);

    // 4b. Overlapping slot with DIFFERENT time format (07:30 PM vs 19:45) (Mutating write)
    await test('منع تداخل المواعيد بصيغ مختلفة (07:30 PM مقابل 19:45) بنظام 409 Conflict', async () => {
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        {
          clientName: 'مستفيد بتوقيت متداخل',
          clientPhone: '01199887766',
          clientEmail: 'overlap@example.com',
          slotDate: testSlotDate,
          slotTime: '19:45', // 24-hour format overlapping with 07:30 PM (19:30 to 20:20)
          track: 'psychological',
          paymentMethod: 'instapay',
        }
      );

      if (res.status === 200 && res.body?.booking?.id) {
        createdTestBookingIds.push(res.body.booking.id);
      }

      assert.strictEqual(res.status, 409, `Expected 409 Conflict for overlapping slot, got ${res.status}`);
      assert.ok(res.body.error.includes('يتعارض') || res.body.error.includes('تم حجزه'));
    }, true);

    // 5. Secure Receipt Vault endpoint: unauthenticated access rejected (Non-mutating)
    await test('منع الوصول غير المصادق لملفات الإيصالات البنكية عبر /api/bookings/receipt (401)', async () => {
      const targetId = createdBookingId || 'BK-10001';
      const res = await makeRequest(`${BASE_URL}/api/bookings/receipt?id=${targetId}`);
      assert.strictEqual(res.status, 401);
    }, false);

    // 6. Secure Receipt Vault endpoint: unauthorized third-party client rejected (Non-mutating)
    await test('منع وصول مستفيد غريب لإيصال سداد مستفيد آخر (403 Forbidden)', async () => {
      const strangerCookie = createSessionCookie({
        id: 'stranger-999',
        name: 'مستفيد غريب',
        phone: '01055554433',
        role: 'client',
      });

      const targetId = createdBookingId || 'BK-10001';
      const res = await makeRequest(`${BASE_URL}/api/bookings/receipt?id=${targetId}`, {
        headers: { Cookie: strangerCookie },
      });
      assert.strictEqual(res.status, 403);
    }, false);

    // 7. State Machine: Client cannot confirm their own booking (Mutating state check)
    await test('منع المستفيد من ترقية حالة حجزه بنفسه إلى مؤكد (403 Forbidden)', async () => {
      if (!createdBookingId) return;
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: clientCookie } },
        { id: createdBookingId, status: 'confirmed' }
      );
      assert.strictEqual(res.status, 403);
      assert.ok(res.body.error.includes('المعالج'));
    }, true);

    // 8. State Machine: Counselor approves booking and sets meeting room (Mutating write)
    await test('سماح المعالج باعتماد وتأكيد الحجز وتعيين رابط قاعة اللقاء (200)', async () => {
      if (!createdBookingId) return;
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
    }, true);

    // 9. State Machine: Counselor completes session (Mutating write)
    await test('ترقية الحجز المؤكد إلى مكتمل بعد انعقاد الجلسة السريرية (200)', async () => {
      if (!createdBookingId) return;
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
        { id: createdBookingId, status: 'completed' }
      );
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.booking.status, 'completed');
    }, true);

    // 10. State Machine: Terminal State enforcement on completed session (Mutating state check)
    await test('منع التراجع أو العبث بجلسة مكتملة وموثقة سريرياً (400 Terminal State)', async () => {
      if (!createdBookingId) return;
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
        { id: createdBookingId, status: 'pending_verification' }
      );
      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error.includes('لا يمكن تعديل حالة جلسة مكتملة'));
    }, true);

    // 11. Profile Hijacking Guard: Unauthenticated booking cannot overwrite existing profile name (Mutating write)
    await test('منع الحجز المجهول من تغيير اسم أو ملف مستخدم مسجل مسبقاً (Profile Hijacking Prevention)', async () => {
      const existingTargetPhone = '01000000000';
      const hijackSlotDate = `2029-02-${Math.floor(10 + Math.random() * 15)}`;
      const res = await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        {
          clientName: 'مخترق مزيف للاسم',
          clientPhone: existingTargetPhone,
          clientEmail: 'hacker@example.com',
          slotDate: hijackSlotDate,
          slotTime: '06:00 PM',
          track: 'psychological',
          paymentMethod: 'instapay',
        }
      );

      if (res.status === 200 && res.body?.booking?.id) {
        createdTestBookingIds.push(res.body.booking.id);
      }

      // Verify existing profile in local store was not mutated
      const profiles = JSON.parse(fs.readFileSync('src/data/userProfiles.json', 'utf-8'));
      const targetUser = profiles.find((p) => p.phone === existingTargetPhone);
      assert.ok(targetUser, 'Existing user must exist in profile store');
      assert.strictEqual(
        targetUser.name,
        'عميل تجريبي',
        'Profile name was improperly overwritten by unauthenticated booking!'
      );
    }, true);

    // 12. Cleanup test booking
    await test('حذف الحجز التجريبي بعد انتهاء دورة الفحص بواسطة المعالج (200)', async () => {
      if (createdBookingId) {
        const res = await makeRequest(
          `${BASE_URL}/api/bookings`,
          { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
          { id: createdBookingId, action: 'delete' }
        );
        assert.strictEqual(res.status, 200);
        createdBookingId = null;
      }
    }, true);
  } finally {
    // =========================================================================
    // STAGE 5 GUARANTEED CLEANUP: Restore state for all bookings, profiles, receipts
    // =========================================================================
    for (const id of createdTestBookingIds) {
      await makeRequest(
        `${BASE_URL}/api/bookings`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: counselorCookie } },
        { id, action: 'delete' }
      ).catch(() => {});
    }

    // Ensure local JSON files have no test artifacts
    try {
      const bFile = path.join(process.cwd(), 'src', 'data', 'bookings.json');
      if (fs.existsSync(bFile)) {
        const list = JSON.parse(fs.readFileSync(bFile, 'utf-8'));
        const filtered = list.filter((b) => !createdTestBookingIds.includes(b.id));
        if (filtered.length !== list.length) {
          fs.writeFileSync(bFile, JSON.stringify(filtered, null, 2) + '\n');
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
