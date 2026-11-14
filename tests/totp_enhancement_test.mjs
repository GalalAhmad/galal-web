/**
 * TOTP Replay Prevention & Single-Use Recovery Codes Verification Test
 */

import {
  generateTotpSecret,
  generateTotpToken,
  verifyTotpToken,
  generateRecoveryCodes,
  verifyAndConsumeRecoveryCode
} from '../src/lib/auth.ts';

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
  console.log(`🔐 2FA Enhancements: Replay Protection & Recovery Codes`);
  console.log(`======================================================\n`);

  // 1. Replay Protection Test
  const secret = generateTotpSecret();
  const token = generateTotpToken(secret);
  const identifier = 'user-test-counselor-01';

  // First use should succeed
  const firstUse = verifyTotpToken(token, secret, identifier);
  assert(firstUse === true, 'First use of valid TOTP token succeeds');

  // Immediate replay with same token should fail
  const replayUse = verifyTotpToken(token, secret, identifier);
  assert(replayUse === false, 'Replaying the same TOTP token within validity window is REJECTED');

  // Different user identifier with same token should not conflict if secrets were identical (isolation check)
  const otherUserIdentifier = 'user-test-counselor-02';
  const otherUserFirstUse = verifyTotpToken(token, secret, otherUserIdentifier);
  assert(otherUserFirstUse === true, 'Different user identifier is evaluated independently');

  // 2. Single-Use Recovery Codes Test
  const { plainCodes, hashedCodes } = generateRecoveryCodes(5);
  assert(plainCodes.length === 5, 'Generates requested count of plain recovery codes (5)');
  assert(hashedCodes.length === 5, 'Generates matching count of hashed recovery codes (5)');
  assert(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(plainCodes[0]), 'Recovery code format matches XXXX-XXXX pattern');

  // Test consuming code 1
  const codeToUse = plainCodes[0];
  const { valid: consumeValid1, remainingHashedCodes: remaining1 } = verifyAndConsumeRecoveryCode(codeToUse, hashedCodes);
  assert(consumeValid1 === true, 'Valid plain recovery code verifies successfully');
  assert(remaining1.length === 4, 'Consumed recovery code is removed from remaining array (count drops from 5 to 4)');

  // Try using code 1 again (replay)
  const { valid: consumeReplay, remainingHashedCodes: remainingAfterReplay } = verifyAndConsumeRecoveryCode(codeToUse, remaining1);
  assert(consumeReplay === false, 'Re-using already consumed recovery code FAILS');
  assert(remainingAfterReplay.length === 4, 'Remaining count does not change on failed attempt');

  // Invalid code test
  const { valid: consumeInvalid } = verifyAndConsumeRecoveryCode('INVALID-CODE', remaining1);
  assert(consumeInvalid === false, 'Invalid format or non-existent recovery code FAILS');

  console.log(`\n======================================================`);
  console.log(`Result: ${passCount} passed, ${failCount} failed`);
  console.log(`======================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
