import { NextResponse } from 'next/server';
import { clearSessionCookie, parseCookie, revokeSessionToken, SESSION_COOKIE_NAME } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const token = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (token) {
    revokeSessionToken(token);
  }

  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });

  response.headers.set('Set-Cookie', clearSessionCookie());
  return response;
}
