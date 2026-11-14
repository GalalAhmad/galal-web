import crypto from 'crypto';

const LEGACY_SALT = 'galal_auth_salt_2026';
// Upgraded to OWASP-recommended 210,000 iterations for PBKDF2-HMAC-SHA512
const PBKDF2_ITERATIONS = 210000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Hash password using OWASP-recommended PBKDF2-HMAC-SHA512
 * with 210,000 iterations and a cryptographically secure random 16-byte salt.
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

/**
 * Checks if a stored hash needs progressive upgrading upon successful login
 * (e.g. legacy SHA-256, or PBKDF2 with fewer than 210,000 iterations).
 */
export function needsRehash(storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== 'string') return true;
  if (isLegacyHash(storedHash)) return true;
  if (storedHash.startsWith('$pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length === 6) {
      const iterations = parseInt(parts[3], 10) || 0;
      return iterations < PBKDF2_ITERATIONS;
    }
  }
  return true;
}

// ==============================================================================
// TOTP (Time-based One-Time Password - RFC 6238 / RFC 4226) for Staff 2FA
// ==============================================================================

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Decode(base32: string): Buffer {
  let bits = '';
  const clean = (base32 || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) throw new Error(`Invalid Base32 character: ${clean[i]}`);
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function base32Encode(buffer: Buffer): string {
  let bits = '';
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, '0');
  }
  let output = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0');
    output += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return output;
}

/**
 * Generates a cryptographically random 160-bit Base32 secret for TOTP.
 */
export function generateTotpSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Computes the 6-digit TOTP token for a given timestamp (default: now, 30s step).
 */
export function generateTotpToken(secret: string, timestampSeconds = Math.floor(Date.now() / 1000), step = 30, digits = 6): string {
  const key = base32Decode(secret);
  const counter = Math.floor(timestampSeconds / step);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % Math.pow(10, digits)).toString().padStart(digits, '0');
}

/**
 * Verifies a 6-digit TOTP token against a secret with ±window steps tolerance (default window = 1 -> ±30s).
 * Constant-time comparison prevents timing attacks.
 */
export function verifyTotpToken(token: string, secret: string, window = 1): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim();
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  for (let offset = -window; offset <= window; offset++) {
    try {
      const expectedToken = generateTotpToken(secret, nowSeconds + offset * 30);
      if (
        cleanToken.length === expectedToken.length &&
        crypto.timingSafeEqual(Buffer.from(cleanToken, 'utf-8'), Buffer.from(expectedToken, 'utf-8'))
      ) {
        return true;
      }
    } catch {
      // Continue to next window
    }
  }
  return false;
}

/**
 * Generates the standardized otpauth:// URI for QR code generation.
 */
export function generateTotpUri(label: string, issuer: string, secret: string): string {
  const encodedLabel = encodeURIComponent(label);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
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
