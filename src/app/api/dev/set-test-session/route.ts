import { NextResponse } from 'next/server';
import { createSessionCookie, signSessionToken, ServerSessionUser } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

const TEST_USERS: Record<string, ServerSessionUser> = {
  counselor: {
    id: 'counselor-galal',
    name: 'د. جلال أحمد',
    role: 'counselor',
    email: 'counselor@galalahmad.com',
  },
  admin: {
    id: 'admin-platform',
    name: 'مدير المنصة',
    role: 'admin',
    email: 'admin@galalahmad.com',
  },
  clientA: {
    id: 'client-test-01',
    name: 'المستفيد أ',
    role: 'client',
    phone: '01000000001',
    email: 'client-a@test.local',
  },
  clientB: {
    id: 'client-test-02',
    name: 'المستفيد ب',
    role: 'client',
    phone: '01000000002',
    email: 'client-b@test.local',
  },
};

export async function GET(request: Request) {
  // Strictly disabled in production AND requires explicit opt-in flag ENABLE_DEV_SESSION=true
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DEV_SESSION !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'clientA';
  const redirectUrl = searchParams.get('redirect') || '/profile';

  const user = TEST_USERS[role];
  if (!user) {
    return NextResponse.json({ error: `Invalid test role: ${role}` }, { status: 400 });
  }

  const token = signSessionToken(user);
  const cookieHeader = createSessionCookie(token);

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.headers.set('Set-Cookie', cookieHeader);
  return response;
}
