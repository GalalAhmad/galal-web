import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendPasswordResetEmail } from '@/lib/email';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Shared memory fallback for dev/offline environments
interface ResetRecord {
  tokenHash: string;
  expiresAt: number;
  attempts: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __galalResetTokenStore: Map<string, ResetRecord> | undefined;
}

if (!globalThis.__galalResetTokenStore) {
  globalThis.__galalResetTokenStore = new Map<string, ResetRecord>();
}
const resetTokenStore = globalThis.__galalResetTokenStore;

/**
 * Helper to find an existing user matching the identifier in Supabase or local fallback
 */
async function findExistingUser(identifier: string) {
  const cleanInput = identifier.trim();
  const cleanPhone = normalizePhone(cleanInput);
  const cleanEmail = cleanInput.includes('@') ? cleanInput.toLowerCase() : '';

  // 1. Check Supabase
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      let query = supabaseAdmin.from('profiles').select('id, name, email, phone');
      if (cleanPhone) {
        query = query.eq('phone', cleanPhone);
      } else if (cleanEmail) {
        query = query.eq('email', cleanEmail);
      }
      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name || '',
          email: data.email ? data.email.trim().toLowerCase() : '',
          phone: data.phone || '',
          source: 'supabase',
        };
      }
    } catch (e) {
      console.warn('[AUTH] Supabase user lookup fallback triggered:', e);
    }
  }

  // 2. Local JSON fallback
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const profiles: any[] = JSON.parse(raw);
    const p = profiles.find((x: any) => {
      if (cleanPhone && x.phone && phonesMatch(x.phone, cleanPhone)) return true;
      if (cleanEmail && x.email && x.email.trim().toLowerCase() === cleanEmail) return true;
      return false;
    });
    if (p) {
      return {
        id: p.id,
        name: p.name || '',
        email: p.email ? p.email.trim().toLowerCase() : '',
        phone: p.phone || '',
        source: 'local',
      };
    }
  } catch {}

  return null;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { identifier, resetToken, newPassword } = body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim();
    const cleanPhone = normalizePhone(cleanInput);
    const cleanEmail = cleanInput.includes('@') ? cleanInput.toLowerCase() : '';
    const storeKey = cleanPhone || cleanEmail;

    // 1. Rate limiting: 5 requests per 30 minutes per IP/identifier
    const rateCheck = checkRateLimit(`forgot:${ip}:${storeKey}`, 5, 30 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `تم تجاوز الحد المسموح لطلبات الاستعادة. يرجى الانتظار لمدة ${Math.ceil(
            rateCheck.resetInSeconds / 60
          )} دقيقة.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    // =========================================================================
    // STEP 2: Confirming Reset with Token/OTP and Updating Password
    // =========================================================================
    if (newPassword) {
      if (!resetToken || typeof resetToken !== 'string') {
        return NextResponse.json(
          { error: 'رمز التحقق المؤقت مطلوب لإتمام تغيير كلمة المرور' },
          { status: 400 }
        );
      }

      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'كلمة المرور الجديدة يجب أن لا تقل عن 6 خانات أو أحرف' },
          { status: 400 }
        );
      }

      const submittedTokenHash = crypto.createHash('sha256').update(resetToken.trim()).digest('hex');
      let tokenVerified = false;
      let tokenErrorMsg = 'رمز التحقق غير صالح أو انتهت صلاحيته. يرجى طلب رمز جديد.';

      // A. Try distributed Supabase auth_otps table
      let dbChecked = false;
      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          const { data: record, error: findErr } = await supabaseAdmin
            .from('auth_otps')
            .select('id, token_hash, attempts, expires_at')
            .eq('identifier', storeKey)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!findErr && record) {
            dbChecked = true;
            if ((record.attempts || 0) >= 3) {
              await supabaseAdmin
                .from('auth_otps')
                .update({ used_at: new Date().toISOString() })
                .eq('id', record.id);
              tokenErrorMsg = 'تم تجاوز الحد الأقصى للمحاولات الخاطئة لهذا الرمز. يرجى طلب رمز جديد.';
            } else if (record.token_hash !== submittedTokenHash) {
              await supabaseAdmin
                .from('auth_otps')
                .update({ attempts: (record.attempts || 0) + 1 })
                .eq('id', record.id);
              tokenErrorMsg = 'رمز التحقق غير صحيح';
            } else {
              // Valid! Atomic consumption (single-use)
              await supabaseAdmin
                .from('auth_otps')
                .update({ used_at: new Date().toISOString() })
                .eq('id', record.id);
              tokenVerified = true;
            }
          } else if (findErr) {
            console.warn('[AUTH] Error querying auth_otps in database:', findErr);
          }
        } catch (dbErr) {
          console.warn('[AUTH] Exception querying auth_otps:', dbErr);
        }
      }

      const isDevOrTest = process.env.NODE_ENV !== 'production' || process.env.MOCK_EMAIL === 'true';

      // B. Fallback to memory store ONLY in local development / test environments
      if (!tokenVerified && isDevOrTest && tokenErrorMsg === 'رمز التحقق غير صالح أو انتهت صلاحيته. يرجى طلب رمز جديد.') {
        const memRecord = resetTokenStore.get(storeKey);
        if (memRecord) {
          if (memRecord.expiresAt < Date.now()) {
            resetTokenStore.delete(storeKey);
          } else if (memRecord.attempts >= 3) {
            resetTokenStore.delete(storeKey);
            tokenErrorMsg = 'تم تجاوز الحد الأقصى للمحاولات الخاطئة لهذا الرمز. يرجى طلب رمز جديد.';
          } else if (memRecord.tokenHash !== submittedTokenHash) {
            memRecord.attempts += 1;
            tokenErrorMsg = 'رمز التحقق غير صحيح';
          } else {
            // Valid token! Invalidate immediately (single-use)
            resetTokenStore.delete(storeKey);
            tokenVerified = true;
          }
        }
      }

      if (!tokenVerified) {
        return NextResponse.json({ error: tokenErrorMsg }, { status: 400 });
      }

      // Token verified successfully! Proceed to update password
      const newHash = hashPassword(newPassword);

      // Verify the user actually exists before updating
      const existingUser = await findExistingUser(storeKey);
      if (!existingUser) {
        return NextResponse.json(
          { error: 'الحساب المراد استعادته غير موجود في النظام' },
          { status: 404 }
        );
      }

      // Update in Supabase with explicit error check (FAIL-CLOSED)
      if (isSupabaseConfigured && supabaseAdmin && existingUser.source === 'supabase') {
        const { error: sbUpdateErr } = await supabaseAdmin
          .from('profiles')
          .update({ password_hash: newHash, updated_at: new Date().toISOString() })
          .eq('id', existingUser.id);

        if (sbUpdateErr) {
          console.error('[CRITICAL] Supabase password reset update failed:', sbUpdateErr);
          return NextResponse.json(
            { error: 'تعذر تحديث كلمة المرور في قاعدة البيانات السحابية. يرجى المحاولة لاحقاً.' },
            { status: 500 }
          );
        }
      }

      // Update in local JSON fallback
      try {
        const raw = await fs.readFile(filePath, 'utf-8');
        const profiles: any[] = JSON.parse(raw);
        const idx = profiles.findIndex((p: any) => {
          if (cleanPhone && p.phone && phonesMatch(p.phone, cleanPhone)) return true;
          if (cleanEmail && p.email && p.email.toLowerCase() === cleanEmail) return true;
          return false;
        });
        if (idx !== -1) {
          profiles[idx].passwordHash = newHash;
          await fs.writeFile(filePath, JSON.stringify(profiles, null, 2), 'utf-8');
        }
      } catch {}

      return NextResponse.json({
        success: true,
        message: 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
      });
    }

    // =========================================================================
    // STEP 1: Requesting Reset Token
    // =========================================================================
    const hasEmailProvider = Boolean(process.env.RESEND_API_KEY);
    const isDevOrTest = process.env.NODE_ENV !== 'production' || process.env.MOCK_EMAIL === 'true';

    // In production without an active email provider or SMS gateway, never falsely claim success
    if (!hasEmailProvider && !isDevOrTest) {
      return NextResponse.json(
        {
          error: 'خدمة استعادة كلمة المرور الآلية غير متصلة بمزود إرسال حالياً. يرجى التواصل مع إدارة المنصة للمساعدة.',
          code: 'PROVIDER_UNAVAILABLE',
        },
        { status: 503 }
      );
    }

    // Security Guard: Check if account actually exists in our verified records
    // NEVER send OTP to an unverified email passed by the requester
    const existingUser = await findExistingUser(storeKey);

    // Only if the account actually exists do we generate and dispatch OTP
    if (existingUser) {
      const rawOtp = crypto.randomInt(100000, 999999).toString();
      const tokenHash = crypto.createHash('sha256').update(rawOtp).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // A. Store in Supabase auth_otps if available
      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          // Invalidate previous active OTPs for this identifier
          await supabaseAdmin
            .from('auth_otps')
            .update({ used_at: new Date().toISOString() })
            .eq('identifier', storeKey)
            .is('used_at', null);

          const { error: insErr } = await supabaseAdmin.from('auth_otps').insert({
            identifier: storeKey,
            token_hash: tokenHash,
            attempts: 0,
            expires_at: expiresAt.toISOString(),
          });

          if (insErr && !isDevOrTest) {
            console.error('[AUTH] Failed to save OTP in auth_otps in production:', insErr);
            return NextResponse.json(
              { error: 'تعذر حفظ رمز التحقق في قاعدة البيانات، يرجى المحاولة لاحقاً', code: 'STORAGE_UNAVAILABLE' },
              { status: 503 }
            );
          }
        } catch (err) {
          if (!isDevOrTest) {
            return NextResponse.json(
              { error: 'تعذر حفظ رمز التحقق في قاعدة البيانات، يرجى المحاولة لاحقاً', code: 'STORAGE_UNAVAILABLE' },
              { status: 503 }
            );
          }
        }
      } else if (!isDevOrTest) {
        return NextResponse.json(
          { error: 'قاعدة بيانات رموز التحقق غير مهيأة في بيئة الإنتاج', code: 'STORAGE_UNAVAILABLE' },
          { status: 503 }
        );
      }

      // B. Also cache in memory store
      resetTokenStore.set(storeKey, {
        tokenHash,
        expiresAt: expiresAt.getTime(),
        attempts: 0,
      });

      // Dispatch OTP ONLY to the verified, stored email of the matching account
      if (existingUser.email) {
        await sendPasswordResetEmail({
          to: existingUser.email,
          clientName: existingUser.name,
          resetToken: rawOtp,
        }).catch((err) => console.error('Failed to dispatch reset email:', err));
      }

      if (isDevOrTest) {
        console.log(`[AUTH-DEV] Password reset OTP generated for ${storeKey}: ${rawOtp}`);
      }
    } else {
      // If no account exists, do NOT generate or send any email!
      // Silently proceed to generic response below to prevent account enumeration
    }

    // Generic response preventing account enumeration (always 200, never reveals if account exists)
    return NextResponse.json({
      success: true,
      message: 'إذا كان الحساب مسجلاً لدينا، فقد تم إرسال رمز التحقق الخاص باستعادة كلمة المرور.',
      requiresToken: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء معالجة الطلب، يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
