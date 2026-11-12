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
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Derive HMAC secret from environment or fallback secure static seed
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'galal_secure_session_hmac_secret_2026';
  return secret;
}

/**
 * Sign payload into a tamper-evident compact token: base64(payload).base64(hmac)
 */
export function signSessionToken(user: ServerSessionUser): string {
  const payload: TokenPayload = {
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode session token. Returns null if invalid, expired, or tampered.
 */
export function verifySessionToken(token: string): ServerSessionUser | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

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

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
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
