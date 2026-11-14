import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  verifyPassword,
  hashPassword,
  isLegacyHash,
  needsRehash,
  verifyTotpToken,
  phonesMatch,
  normalizePhone,
} from '@/lib/auth';
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
    const { identifier, password, totpCode } = body;

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
    const rateCheck = await checkRateLimit(rateLimitKey, 10, 15 * 60);
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

    // 2. Production Fail-Closed Safety Guard
    if (process.env.NODE_ENV === 'production' && (!isSupabaseConfigured || !supabaseAdmin)) {
      return NextResponse.json(
        { error: 'خدمة تسجيل الدخول غير متاحة حالياً بسبب نقص إعدادات الخادم (Supabase unconfigured).' },
        { status: 503 }
      );
    }

    // Check environment-driven Admin credentials (strictly hashed verification, no plaintext defaults)
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@galalahmad.com').trim().toLowerCase();
    const envAdminPhone = normalizePhone(process.env.ADMIN_PHONE || '');
    const envAdminHash = process.env.ADMIN_PASSWORD_HASH;

    if (envAdminHash && (cleanEmail === envAdminEmail || (cleanPhone && cleanPhone === envAdminPhone))) {
      if (verifyPassword(password, envAdminHash)) {
        authenticatedUser = {
          id: 'admin-env',
          name: 'مدير المنصة',
          role: 'admin',
          phone: envAdminPhone || undefined,
          email: envAdminEmail,
        };
        fullUserProfile = {
          id: 'admin-env',
          name: 'مدير المنصة',
          role: 'admin',
          phone: envAdminPhone,
          email: envAdminEmail,
        };
      }
    }

    // Check environment-driven Counselor credentials (strictly hashed verification, no plaintext defaults)
    const envCounselorEmail = (process.env.COUNSELOR_EMAIL || 'counselor@galalahmad.com').trim().toLowerCase();
    const envCounselorPhone = normalizePhone(process.env.COUNSELOR_PHONE || '');
    const envCounselorHash = process.env.COUNSELOR_PASSWORD_HASH;

    if (!authenticatedUser && envCounselorHash && (cleanEmail === envCounselorEmail || (cleanPhone && cleanPhone === envCounselorPhone))) {
      if (verifyPassword(password, envCounselorHash)) {
        authenticatedUser = {
          id: 'counselor-env',
          name: 'د. جلال أحمد',
          role: 'counselor',
          phone: envCounselorPhone || undefined,
          email: envCounselorEmail,
        };
        fullUserProfile = {
          id: 'counselor-env',
          name: 'د. جلال أحمد',
          role: 'counselor',
          phone: envCounselorPhone,
          email: envCounselorEmail,
        };
      }
    }

    // 3. Query Supabase profiles table
    if (!authenticatedUser && isSupabaseConfigured && supabaseAdmin) {
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
            // Automatically upgrade legacy or lower-iteration hash to PBKDF2 210,000 iterations upon successful verification
            if (needsRehash(user.password_hash)) {
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

    // 4. Fallback to local user store ONLY in non-production environments
    if (!authenticatedUser && process.env.NODE_ENV !== 'production') {
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
            // Progressive hash upgrade in local store
            if (needsRehash(localUser.passwordHash)) {
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

    // 5. TOTP 2FA Enforcement for Counselor and Admin
    if (authenticatedUser.role === 'admin' || authenticatedUser.role === 'counselor') {
      const configuredTotpSecret =
        authenticatedUser.role === 'admin'
          ? (process.env.ADMIN_TOTP_SECRET || fullUserProfile?.totp_secret)
          : (process.env.COUNSELOR_TOTP_SECRET || fullUserProfile?.totp_secret);

      if (configuredTotpSecret) {
        if (!totpCode || typeof totpCode !== 'string' || !totpCode.trim()) {
          return NextResponse.json(
            {
              requires2FA: true,
              role: authenticatedUser.role,
              message: 'يرجى إدخال رمز التحقق بخطوتين (TOTP 2FA) المكون من 6 أرقام من تطبيق المصادقة.',
            },
            { status: 200 }
          );
        }

        const is2FAValid = verifyTotpToken(totpCode.trim(), configuredTotpSecret);
        if (!is2FAValid) {
          return NextResponse.json(
            {
              error: 'رمز التحقق بخطوتين (TOTP) غير صحيح أو انتهت صلاحيته، يرجى إدخال الرمز الحالي من التطبيق.',
              code: 'INVALID_2FA_TOKEN',
            },
            { status: 401 }
          );
        }
      }
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
      requiresPasswordReset: Boolean(fullUserProfile?.force_password_reset),
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
