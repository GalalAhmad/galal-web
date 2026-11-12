import crypto from 'crypto';

const LEGACY_SALT = 'galal_auth_salt_2026';
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Hash password using OWASP-recommended PBKDF2-HMAC-SHA512
 * with a cryptographically secure random 16-byte salt.
 */
export function hashPassword(password: string): string {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `$pbkdf2$v=1$${PBKDF2_ITERATIONS}$${salt}$${derivedKey}`;
}

/**
 * Verifies a password against either modern PBKDF2 hashes or legacy SHA-256 hashes.
 * Constant-time comparison prevents timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  try {
    if (storedHash.startsWith('$pbkdf2$')) {
      const parts = storedHash.split('$');
      // Format: ["", "pbkdf2", "v=1", iterations, salt, key]
      if (parts.length !== 6) return false;
      const iterations = parseInt(parts[3], 10) || PBKDF2_ITERATIONS;
      const salt = parts[4];
      const expectedKey = parts[5];
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(derivedKey, 'hex'), Buffer.from(expectedKey, 'hex'));
    }

    // Legacy SHA-256 fallback with static salt
    const legacyHash = crypto.createHash('sha256').update(password + LEGACY_SALT).digest('hex');
    if (storedHash.length === legacyHash.length) {
      return crypto.timingSafeEqual(Buffer.from(legacyHash, 'utf-8'), Buffer.from(storedHash, 'utf-8'));
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Checks if a stored password hash is using the legacy SHA-256 format
 * and should be upgraded to PBKDF2 upon successful authentication.
 */
export function isLegacyHash(storedHash: string): boolean {
  return typeof storedHash === 'string' && !storedHash.startsWith('$pbkdf2$');
}

export function normalizePhone(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

export function phonesMatch(phone1?: string, phone2?: string): boolean {
  if (!phone1 || !phone2) return false;
  const digits1 = normalizePhone(phone1);
  const digits2 = normalizePhone(phone2);
  if (!digits1 || !digits2) return false;
  if (digits1 === digits2) return true;
  if (digits1.length >= 8 && digits2.length >= 8) {
    return digits1.slice(-8) === digits2.slice(-8);
  }
  return false;
}
