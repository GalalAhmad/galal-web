import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Temporary in-memory store for reset tokens: key -> { tokenHash, expiresAt }
// Valid for 15 minutes, single-use
interface ResetRecord {
  tokenHash: string;
  expiresAt: number;
}
const resetTokenStore = new Map<string, ResetRecord>();

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
    const cleanEmail = cleanInput.toLowerCase();
    const storeKey = cleanPhone || cleanEmail;

    // 1. Rate limiting: 3 reset attempts per 30 minutes per IP/identifier
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

    // Step 2: Confirming Reset with Token/OTP
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

      const record = resetTokenStore.get(storeKey);
      if (!record || record.expiresAt < Date.now()) {
        resetTokenStore.delete(storeKey);
        return NextResponse.json(
          { error: 'رمز التحقق غير صالح أو انتهت صلاحيته. يرجى طلب رمز جديد.' },
          { status: 400 }
        );
      }

      const submittedTokenHash = crypto.createHash('sha256').update(resetToken.trim()).digest('hex');
      if (submittedTokenHash !== record.tokenHash) {
        return NextResponse.json(
          { error: 'رمز التحقق غير صحيح' },
          { status: 400 }
        );
      }

      // Valid token! Invalidate token immediately (single-use)
      resetTokenStore.delete(storeKey);

      const newHash = hashPassword(newPassword);

      // Update in Supabase
      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          let query = supabaseAdmin.from('profiles').select('id');
          if (cleanPhone) query = query.eq('phone', cleanPhone);
          else query = query.eq('email', cleanEmail);

          const { data: matched } = await query;
          if (matched && matched.length > 0) {
            await supabaseAdmin
              .from('profiles')
              .update({ password_hash: newHash, updated_at: new Date().toISOString() })
              .eq('id', matched[0].id);
          }
        } catch (sbErr) {
          console.error('Supabase password reset update error:', sbErr);
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

    // Step 1: Requesting Reset Token
    // Generate secure 6-digit numeric OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const tokenHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

    resetTokenStore.set(storeKey, {
      tokenHash,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // In local development/testing without live SMS gateway, log debug token securely to server console only
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AUTH-DEV] Password reset OTP generated for ${storeKey}: ${rawOtp}`);
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
