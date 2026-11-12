import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyPassword, hashPassword, isLegacyHash, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { signSessionToken, createSessionCookie, ServerSessionUser } from '@/lib/serverAuth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني المسجل' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال كلمة المرور' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim();
    const cleanPhone = normalizePhone(cleanInput);
    const cleanEmail = cleanInput.toLowerCase();

    // 1. Rate limiting: 10 attempts per 15 minutes per IP+Identifier
    const rateLimitKey = `login:${ip}:${cleanPhone || cleanEmail}`;
    const rateCheck = checkRateLimit(rateLimitKey, 10, 15 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `تم تجاوز الحد المسموح لمحاولات تسجيل الدخول. يرجى الانتظار لمدة ${Math.ceil(
            rateCheck.resetInSeconds / 60
          )} دقيقة قبل المحاولة مجدداً.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    let authenticatedUser: ServerSessionUser | null = null;
    let fullUserProfile: any = null;

    // 2. Query Supabase profiles table
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        let query = supabaseAdmin.from('profiles').select('*');
        if (cleanPhone && cleanEmail) {
          query = query.or(`phone.eq.${cleanPhone},email.eq.${cleanEmail}`);
        } else if (cleanPhone) {
          query = query.eq('phone', cleanPhone);
        } else {
          query = query.eq('email', cleanEmail);
        }

        const { data: users, error: dbErr } = await query;
        if (!dbErr && users && users.length > 0) {
          const user = users[0];
          if (user.password_hash && verifyPassword(password, user.password_hash)) {
            // Automatically upgrade legacy hash to PBKDF2 upon successful verification
            if (isLegacyHash(user.password_hash)) {
              const upgradedHash = hashPassword(password);
              await supabaseAdmin
                .from('profiles')
                .update({ password_hash: upgradedHash, updated_at: new Date().toISOString() })
                .eq('id', user.id);
            }

            authenticatedUser = {
              id: user.id,
              name: user.name,
              role: (user.role as any) || 'client',
              phone: user.phone || undefined,
              email: user.email || undefined,
            };
            fullUserProfile = user;
          }
        }
      } catch (sbErr) {
        console.error('Supabase login check error:', sbErr);
      }
    }

    // 3. Fallback to local user store if not resolved in Supabase
    if (!authenticatedUser) {
      try {
        const raw = await fs.readFile(filePath, 'utf-8');
        const profiles: any[] = JSON.parse(raw);

        const foundIndex = profiles.findIndex((p: any) => {
          const pEmail = (p.email || '').trim().toLowerCase();
          if (cleanPhone && p.phone && phonesMatch(p.phone, cleanPhone)) return true;
          if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
          return false;
        });

        if (foundIndex !== -1) {
          const localUser = profiles[foundIndex];
          if (localUser.passwordHash && verifyPassword(password, localUser.passwordHash)) {
            // Upgrade legacy hash in local store
            if (isLegacyHash(localUser.passwordHash)) {
              localUser.passwordHash = hashPassword(password);
              profiles[foundIndex] = localUser;
              await fs.writeFile(filePath, JSON.stringify(profiles, null, 2), 'utf-8').catch(() => {});
            }

            authenticatedUser = {
              id: localUser.id,
              name: localUser.name,
              role: localUser.role || 'client',
              phone: localUser.phone || undefined,
              email: localUser.email || undefined,
            };
            fullUserProfile = localUser;
          }
        }
      } catch {
        // Local store read error
      }
    }

    // 4. Verification failed or user not found
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من رقم الهاتف أو البريد وكلمة المرور.' },
        { status: 401 }
      );
    }

    // 5. Issue cryptographically signed session token and HttpOnly cookie
    const token = signSessionToken(authenticatedUser);
    const cookieHeader = createSessionCookie(token);

    const safeUser = {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
      phone: authenticatedUser.phone || '',
      email: authenticatedUser.email || '',
      gender: fullUserProfile?.gender || '',
      ageGroup: fullUserProfile?.age_group || fullUserProfile?.ageGroup || '',
      maritalStatus: fullUserProfile?.marital_status || fullUserProfile?.maritalStatus || '',
      country: fullUserProfile?.country || '',
      city: fullUserProfile?.city || '',
      createdAt: fullUserProfile?.created_at || fullUserProfile?.createdAt || new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء معالجة الطلب، يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
