import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * SECURITY GATEWAY: Direct client OAuth route has been securely disabled.
 *
 * Vulnerability Addressed:
 * Previously, this endpoint accepted unverified `provider`, `email`, `name`, and `phone`
 * directly from the client without cryptographic proof from an identity provider (Google/Apple).
 * Accepting client-asserted identity without OpenID Connect (OIDC) token verification allows
 * trivial account takeover (IDOR/spoofing) and provider mutation on existing accounts.
 *
 * Secure Policy:
 * 1. Social login via unverified body payloads is completely blocked.
 * 2. Real OAuth must implement strict state/nonce verification, cryptographic ID token
 *    signature checking (Google/Apple JWKS), audience/issuer validation, and verified email proof.
 * 3. Users must authenticate through the official password-verified portal (/login).
 */

export async function POST() {
  return NextResponse.json(
    {
      error: 'تسجيل الدخول الاجتماعي عبر هذا المسار غير متاح حالياً. يرجى استخدام بوابة تسجيل الدخول الرسمية برقم الهاتف أو البريد وكلمة المرور.',
      code: 'OAUTH_DISABLED',
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'تسجيل الدخول الاجتماعي عبر هذا المسار غير متاح حالياً.',
      code: 'OAUTH_DISABLED',
    },
    { status: 501 }
  );
}
