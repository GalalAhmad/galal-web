import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyPassword, hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني المسجل' },
        { status: 400 }
      );
    }

    if (!password || !password.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال كلمة المرور' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim();
    const cleanPhone = normalizePhone(cleanInput);
    const cleanEmail = cleanInput.toLowerCase();

    // 0. MASTER COUNSELOR ACCOUNT ( أحـمد شخصياً)
    // حساب المعالج المعتمد للدخول المباشر إلى مساحة العمل الإكلينيكية ولوحة الإدارة
    const isCounselorIdentifier = 
      cleanInput === '01014876666' || 
      cleanPhone === '01014876666' || 
      cleanEmail === 'counselor@galalahmad.com' || 
      cleanEmail === 'galal@admin.com' ||
      cleanInput.toLowerCase() === 'galal';

    const validCounselorPasswords = ['Galal@2026', 'galalahmad2026', 'galal2026', 'admin@galal', 'galal@admin2026'];

    if (isCounselorIdentifier && validCounselorPasswords.includes(password.trim())) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'counselor-galal-ahmad',
          name: ' أحـمد',
          phone: '01014876666',
          email: 'counselor@galalahmad.com',
          gender: 'male',
          ageGroup: '36-45',
          maritalStatus: 'متزوج',
          country: 'مصر',
          city: 'القاهرة',
          role: 'counselor', // دور المعالج المعتمد
          createdAt: new Date().toISOString(),
        },
      });
    }

    // 1. Check in Supabase if configured
    if (isSupabaseConfigured) {
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

        if (user.password_hash) {
          const isMatch = verifyPassword(password, user.password_hash);
          if (!isMatch) {
            return NextResponse.json(
              { error: 'كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.' },
              { status: 401 }
            );
          }
        } else {
          // If no password set yet, set it now
          await supabaseAdmin
            .from('profiles')
            .update({ password_hash: hashPassword(password), updated_at: new Date().toISOString() })
            .eq('id', user.id);
        }

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone || '',
            email: user.email || '',
            gender: user.gender || '',
            ageGroup: user.age_group || '',
            maritalStatus: user.marital_status || '',
            country: user.country || '',
            city: user.city || '',
            role: user.role || 'client',
            createdAt: user.created_at,
          },
        });
      }
    }

    // 2. Local Fallback
    let profiles: any[] = [];
    try {
      profiles = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    } catch (e) {
      profiles = [];
    }

    const userIndex = profiles.findIndex((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && p.phone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'لم نتمكن من العثور على حساب مطابق لرقم الهاتف أو البريد المدخل. يمكنك إنشاء حساب جديد.' },
        { status: 404 }
      );
    }

    const user = profiles[userIndex];

    if (user.passwordHash) {
      const isMatch = verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: 'كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.' },
          { status: 401 }
        );
      }
    } else {
      user.passwordHash = hashPassword(password);
      profiles[userIndex] = user;
      try {
        await fs.writeFile(filePath, JSON.stringify(profiles, null, 2), 'utf-8');
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone || '',
        email: user.email || '',
        gender: user.gender || '',
        ageGroup: user.ageGroup || '',
        maritalStatus: user.maritalStatus || '',
        country: user.country || '',
        city: user.city || '',
        role: user.role || 'client',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تسجيل الدخول، يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
