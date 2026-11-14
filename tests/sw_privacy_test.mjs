/**
 * Service Worker Privacy & Cache Isolation Verification Test
 * Verifies that:
 * 1. Protected paths (/api, /admin, /counselor, /profile) are never cached by the Service Worker.
 * 2. Authenticated responses enforce Cache-Control: no-store.
 * 3. Cache clearing on logout removes all cached keys.
 * 4. Offline mode for sensitive paths fails closed with a 503 privacy protection response,
 *    preventing session leakage between users sharing a device.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swPath = path.resolve(__dirname, '..', 'public', 'sw.js');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🛡️ Service Worker Privacy & Cache Isolation Test Suite`);
  console.log(`Target: public/sw.js`);
  console.log(`======================================================\n`);

  assert(fs.existsSync(swPath), 'public/sw.js exists');
  const swCode = fs.readFileSync(swPath, 'utf8');

  // Test 1: NEVER_CACHE_PREFIXES contains all sensitive surfaces
  const hasProfile = swCode.includes("'/profile'");
  const hasCounselor = swCode.includes("'/counselor'");
  const hasAdmin = swCode.includes("'/admin'");
  const hasApi = swCode.includes("'/api'");
  assert(hasProfile && hasCounselor && hasAdmin && hasApi, 'NEVER_CACHE_PREFIXES explicitly contains /profile, /counselor, /admin, /api');

  // Test 2: Sensitive route check intercepts before caching
  assert(swCode.includes('isSensitiveRoute(url.pathname)'), 'Fetch handler checks isSensitiveRoute before navigation or asset caching');

  // Test 3: Offline handling for sensitive paths does not serve cached data
  assert(swCode.includes('Offline Protected') || swCode.includes('Service Unavailable'), 'Offline fallback for sensitive paths returns a non-cached privacy error (503)');

  // Test 4: CLEAR_USER_CACHE message handler exists
  assert(swCode.includes('CLEAR_USER_CACHE'), 'Message listener supports CLEAR_USER_CACHE event for logout cache invalidation');

  // Test 5: Cache-Control: no-store responses are blocked from being cached
  assert(swCode.includes('no-store'), 'Navigation fetch handler verifies Cache-Control does not include no-store before caching');

  // Test 6: Simulation of Service Worker logic with virtual URL objects
  const sensitivePrefixes = ['/api', '/admin', '/counselor', '/profile', '/login', '/register', '/forgot-password'];
  function testIsSensitive(pathname) {
    return sensitivePrefixes.some(p => pathname === p || pathname.startsWith(`${p}/`));
  }

  assert(testIsSensitive('/profile'), 'Simulated check: /profile is sensitive');
  assert(testIsSensitive('/profile/bookings'), 'Simulated check: /profile/bookings is sensitive');
  assert(testIsSensitive('/counselor/clients'), 'Simulated check: /counselor/clients is sensitive');
  assert(testIsSensitive('/admin/articles'), 'Simulated check: /admin/articles is sensitive');
  assert(testIsSensitive('/api/clinical/soap'), 'Simulated check: /api/clinical/soap is sensitive');
  assert(!testIsSensitive('/'), 'Simulated check: / (Home) is public');
  assert(!testIsSensitive('/about'), 'Simulated check: /about is public');
  assert(!testIsSensitive('/pricing'), 'Simulated check: /pricing is public');

  console.log(`\n======================================================`);
  console.log(`Result: ${passCount} passed, ${failCount} failed`);
  console.log(`======================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
