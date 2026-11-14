/**
 * Parallel Concurrency Verification Script for Distributed Rate Limiting
 * Sends parallel concurrent requests to demonstrate thread-safety and threshold enforcement.
 */

import http from 'http';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const ENDPOINT = `${BASE_URL}/api/auth/login`;

const RUN_ID = Date.now();

function sendRequest(i) {
  return new Promise((resolve) => {
    const parsed = new URL(ENDPOINT);
    const body = JSON.stringify({
      identifier: `parallel_user_${RUN_ID}@example.com`,
      password: 'WrongPassword@123',
    });

    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 80,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'X-Forwarded-For': `198.51.100.${RUN_ID % 200}`,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {}
          resolve({ index: i, status: res.statusCode, data: json });
        });
      }
    );

    req.on('error', (err) => resolve({ index: i, status: 0, error: err.message }));
    req.write(body);
    req.end();
  });
}

async function runParallelTest() {
  console.log('======================================================');
  console.log('⚡ اختبار إرسال 15 طلباً متوازياً لفحص محدد المعدل المشترك');
  console.log('======================================================\n');

  const promises = [];
  for (let i = 1; i <= 15; i++) {
    promises.push(sendRequest(i));
  }

  const results = await Promise.all(promises);

  let allowedCount = 0;
  let rateLimitedCount = 0;

  results.forEach((r) => {
    if (r.status === 401 || r.status === 200 || r.status === 400) {
      allowedCount++;
      console.log(`  [طلب #${r.index}] استجابة مقبولة (رمز ${r.status}) - المحاولة ضمن الحصة`);
    } else if (r.status === 429) {
      rateLimitedCount++;
      console.log(`  [طلب #${r.index}] 🛑 محظور برمز 429 Rate Limited: ${r.data?.error || ''}`);
    } else {
      console.log(`  [طلب #${r.index}] رمز استجابة: ${r.status}`);
    }
  });

  console.log('\n------------------------------------------------------');
  console.log(`📊 النتيجة الإجمالية: تم قبول ${allowedCount} طلبات | تم حظر ${rateLimitedCount} طلبات برمز 429`);
  console.log('------------------------------------------------------\n');

  if (rateLimitedCount > 0 && allowedCount <= 10) {
    console.log('✅ نجح إثبات عمل Rate Limiting المشترك تحت ضغط الطلبات المتوازية!');
    process.exit(0);
  } else {
    console.error('❌ فشل الاختبار: لم يتم حظر الطلبات المتجاوزة بالقدر المتوقع.');
    process.exit(1);
  }
}

runParallelTest().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
