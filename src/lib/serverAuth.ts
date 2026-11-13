import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { normalizePhone, phonesMatch } from '@/lib/auth';

export type UserRole = 'client' | 'counselor' | 'admin';

export interface ServerSessionUser {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
}

interface TokenPayload extends ServerSessionUser {
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = 'galal_session';
export const CURRENT_TOKEN_VERSION = 1;
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days max lifetime
const ALLOWED_ROLES: ReadonlyArray<UserRole> = ['client', 'counselor', 'admin'];

// In-memory token revocation list (e.g., on explicit logout or password reset)
const revokedTokenSignatures = new Set<string>();

export function revokeSessionToken(token: string): void {
  if (!token || typeof token !== 'string') return;
  const parts = token.split('.');
  if (parts.length === 2) {
    revokedTokenSignatures.add(parts[1]);
  }
}

// In-memory ephemeral secret for development/testing if SESSION_SECRET is not explicitly set
let devEphemeralSecret: string | null = null;

/**
 * Derives the HMAC signing secret from the environment.
 * Strict Security Rules:
 * 1. Requires SESSION_SECRET environment variable (min 32 characters).
 * 2. Never uses SUPABASE_SERVICE_ROLE_KEY to sign application session tokens.
 * 3. Never uses a hardcoded static fallback string.
 * 4. Fails closed in production if SESSION_SECRET is missing or insecure.
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (secret && secret.trim().length >= 32) {
    return secret.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[CRITICAL_SECURITY] SESSION_SECRET environment variable is missing or too short (< 32 chars) in production. Application refusing to start with insecure credentials.'
    );
  }

  // Safe ephemeral fallback for development / testing environments only
  if (!devEphemeralSecret) {
    devEphemeralSecret = crypto.randomBytes(32).toString('hex');
    console.warn(
      '[SECURITY WARNING] SESSION_SECRET is missing or < 32 chars. An ephemeral in-memory secret has been generated for this local process.'
    );
  }
  return devEphemeralSecret;
}

interface TokenPayload {
  v: number;
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  iat: number;
  exp: number;
}

/**
 * Sign payload into a tamper-evident compact token: base64url(payload).base64url(hmac)
 */
export function signSessionToken(user: ServerSessionUser): string {
  if (!ALLOWED_ROLES.includes(user.role)) {
    throw new Error(`[SECURITY] Cannot issue session token for invalid role: ${user.role}`);
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    v: CURRENT_TOKEN_VERSION,
    id: String(user.id).trim(),
    name: String(user.name).trim(),
    role: user.role,
    phone: user.phone ? String(user.phone).trim() : undefined,
    email: user.email ? String(user.email).trim().toLowerCase() : undefined,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode session token.
 * Performs cryptographic signature verification, claim bounds validation,
 * role allowlisting, and revocation checks.
 */
export function verifySessionToken(token: string): ServerSessionUser | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

  // Check revocation set
  if (revokedTokenSignatures.has(signature)) {
    return null;
  }

  try {
    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(payloadB64)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const rawJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: TokenPayload = JSON.parse(rawJson);

    // 1. Structure and Version checks
    if (!payload || typeof payload !== 'object') return null;
    if (payload.v !== CURRENT_TOKEN_VERSION) return null;

    // 2. ID and Name checks
    if (!payload.id || typeof payload.id !== 'string' || payload.id.length > 128) return null;
    if (!payload.name || typeof payload.name !== 'string' || payload.name.length > 200) return null;

    // 3. Strict Role Allowlist
    if (!ALLOWED_ROLES.includes(payload.role)) {
      return null;
    }

    // 4. Timestamp validity checks (with 60-second clock skew tolerance)
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.iat !== 'number' || payload.iat > now + 60 || payload.iat < now - 365 * 24 * 3600) {
      return null;
    }
    if (typeof payload.exp !== 'number' || payload.exp <= now - 60) {
      return null; // Expired
    }
    if (payload.exp - payload.iat > SESSION_TTL_SECONDS + 120) {
      return null; // Excessively long TTL rejected
    }

    return {
      id: payload.id,
      name: payload.name,
      role: payload.role,
      phone: payload.phone,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

/**
 * Parses cookie header from Request or Headers.
 */
export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Retrieves and cryptographically validates the user session from the Request.
 */
export function getServerUserSession(request: Request): ServerSessionUser | null {
  // 1. Try Cookie header
  const cookieHeader = request.headers.get('cookie');
  const tokenFromCookie = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (tokenFromCookie) {
    const user = verifySessionToken(tokenFromCookie);
    if (user) return user;
  }

  // 2. Try Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    const user = verifySessionToken(bearerToken);
    if (user) return user;
  }

  return null;
}

/**
 * Require valid authenticated session. Returns 401 if unauthenticated.
 */
export function requireAuth(request: Request): { user: ServerSessionUser; response?: never } | { user: null; response: NextResponse } {
  const user = getServerUserSession(request);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'غير مصرّح: يرجى تسجيل الدخول أولاً للوصول إلى هذه البيانات', code: 'UNAUTHORIZED' },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Require specific role (e.g. 'admin' or 'counselor'). Returns 401 if unauthenticated, 403 if forbidden.
 */
export function requireRole(
  request: Request,
  allowedRoles: UserRole[]
): { user: ServerSessionUser; response?: never } | { user: null; response: NextResponse } {
  const authCheck = requireAuth(request);
  if (!authCheck.user) {
    return authCheck;
  }

  const { user } = authCheck;
  if (!allowedRoles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'ممنوع: ليس لديك الصلاحية المطلوبة للقيام بهذا الإجراء', code: 'FORBIDDEN' },
        { status: 403 }
      ),
    };
  }

  return { user };
}

/**
 * Checks if authenticated user owns the resource or has an authorized management role (counselor or admin).
 */
export function requireOwnershipOrRole(
  request: Request,
  resourceOwner: { id?: string; phone?: string; email?: string },
  managementRoles: UserRole[] = ['counselor', 'admin']
): { user: ServerSessionUser; response?: never } | { user: null; response: NextResponse } {
  const authCheck = requireAuth(request);
  if (!authCheck.user) {
    return authCheck;
  }

  const { user } = authCheck;

  // Management roles have access
  if (managementRoles.includes(user.role)) {
    return { user };
  }

  // Check ownership by ID
  if (resourceOwner.id && user.id === resourceOwner.id) {
    return { user };
  }

  // Check ownership by Phone
  if (resourceOwner.phone && user.phone && phonesMatch(user.phone, resourceOwner.phone)) {
    return { user };
  }

  // Check ownership by Email
  if (
    resourceOwner.email &&
    user.email &&
    user.email.trim().toLowerCase() === resourceOwner.email.trim().toLowerCase()
  ) {
    return { user };
  }

  return {
    user: null,
    response: NextResponse.json(
      { error: 'ممنوع: لا تملك الصلاحية للوصول إلى بيانات مستفيد آخر', code: 'FORBIDDEN' },
      { status: 403 }
    ),
  };
}

/**
 * Creates Set-Cookie header value for the session.
 */
export function createSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  const flags = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
    'SameSite=Lax',
    'HttpOnly',
  ];
  if (isProd) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

/**
 * Creates Set-Cookie header to clear the session cookie.
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`;
}
