import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });

  response.headers.set('Set-Cookie', clearSessionCookie());
  return response;
}
