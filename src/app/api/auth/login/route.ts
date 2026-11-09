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

    // ==========================================================
    // 1. حساب المعالج الخاص (د. جلال أحمد) — مساحة العمل الإكلينيكية
    // ==========================================================
    const isCounselorIdentifier = 
      cleanInput === '01014876666' || 
      cleanPhone === '01014876666' || 
      cleanEmail === 'counselor@galalahmad.com' || 
      cleanInput.toLowerCase() === 'galal';

    const validCounselorPasswords = ['Galal@2026', 'galalahmad2026', 'galal2026'];

    if (isCounselorIdentifier && validCounselorPasswords.includes(password.trim())) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'counselor-galal-ahmad',
          name: 'د. جلال أحمد',
          phone: '01014876666',
          email: 'counselor@galalahmad.com',
          gender: 'male',
          ageGroup: '36-45',
          maritalStatus: 'متزوج',
          country: 'مصر',
          city: 'القاهرة',
          role: 'counselor', // دور المعالج المعتمد — يوجهه مباشرة إلى /counselor
          createdAt: new Date().toISOString(),
        },
      });
    }

    // ==========================================================
    // 2. حساب إدارة الموقع (الأدمن) — لوحة تحكم محتويات المنصة
    // ==========================================================
    const isAdminIdentifier = 
      cleanInput.toLowerCase() === 'admin' || 
      cleanEmail === 'admin@galalahmad.com' || 
      cleanPhone === '01000000099';

    const validAdminPasswords = ['Admin@2026', 'GalalAdmin@2026', 'admin2026', 'Galal@2026'];

    if (isAdminIdentifier && validAdminPasswords.includes(password.trim())) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin-site-manager',
          name: 'مدير المنصة',
          phone: '01000000099',
          email: 'admin@galalahmad.com',
          gender: 'male',
          ageGroup: '36-45',
          maritalStatus: 'متزوج',
          country: 'مصر',
          city: 'القاهرة',
          role: 'admin', // دور الأدمن — يوجهه مباشرة إلى /admin
          createdAt: new Date().toISOString(),
        },
      });
    }

    // ==========================================================
    // 3. الحساب التجريبي المعتمد للعميل (لتجربة رحلة العميل)
    // ==========================================================
    const isTestClientIdentifier =
      cleanInput === '01000000000' ||
      cleanPhone === '01000000000' ||
      cleanEmail === 'client@test.com' ||
      cleanInput.toLowerCase() === 'client';

    const validTestClientPasswords = ['Client@2026', 'client2026', '123456'];

    if (isTestClientIdentifier && validTestClientPasswords.includes(password.trim())) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'client-test-01',
          name: 'عميل تجريبي',
          phone: '01000000000',
          email: 'client@test.com',
          gender: 'male',
          ageGroup: '26-35',
          maritalStatus: 'متزوج',
          country: 'مصر',
          city: 'القاهرة',
          role: 'client', // دور العميل — يوجهه مباشرة إلى /profile
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
