import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      phone, 
      email, 
      password, 
      gender, 
      ageGroup, 
      maritalStatus, 
      country, 
      city 
    } = body;

    // 1. Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'يرجى كتابة الاسم الكريم (حرفين على الأقل)' },
        { status: 400 }
      );
    }

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن لا تقل عن 6 خانات أو أحرف' },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhone(phone);
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const pwdHash = hashPassword(password);

    // 2. Check for duplicate account in Supabase
    if (isSupabaseConfigured) {
      let query = supabaseAdmin.from('profiles').select('id, phone, email');
      if (cleanPhone && cleanEmail) {
        query = query.or(`phone.eq.${cleanPhone},email.eq.${cleanEmail}`);
      } else if (cleanPhone) {
        query = query.eq('phone', cleanPhone);
      } else {
        query = query.eq('email', cleanEmail);
      }

      const { data: existingUsers } = await query;
      if (existingUsers && existingUsers.length > 0) {
        return NextResponse.json(
          {
            error:
              'يوجد حساب مسجل بالفعل برقم الهاتف أو البريد الإلكتروني المدخل. يرجى تسجيل الدخول مباشرة.',
          },
          { status: 409 }
        );
      }

      // Insert into Supabase
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from('profiles')
        .insert({
          name: name.trim(),
          phone: cleanPhone || null,
          email: cleanEmail || null,
          password_hash: pwdHash,
          role: 'client',
          gender: gender || null,
          age_group: ageGroup || null,
          marital_status: maritalStatus || null,
          country: country || null,
          city: city || null,
        })
        .select()
        .single();

      if (!insErr && inserted) {
        return NextResponse.json({
          success: true,
          user: {
            id: inserted.id,
            name: inserted.name,
            phone: inserted.phone || '',
            email: inserted.email || '',
            gender: inserted.gender || '',
            ageGroup: inserted.age_group || '',
            maritalStatus: inserted.marital_status || '',
            country: inserted.country || '',
            city: inserted.city || '',
            role: inserted.role || 'client',
            createdAt: inserted.created_at,
          },
        });
      }
    }

    // Local Fallback
    let profiles: any[] = [];
    try {
      profiles = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    } catch (e) {
      profiles = [];
    }

    const existing = profiles.find((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && p.phone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            'يوجد حساب مسجل بالفعل برقم الهاتف أو البريد الإلكتروني المدخل. يرجى تسجيل الدخول مباشرة.',
        },
        { status: 409 }
      );
    }

    const newProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone || '',
      email: cleanEmail || '',
      passwordHash: pwdHash,
      provider: 'credentials',
      gender: gender || '',
      ageGroup: ageGroup || '',
      maritalStatus: maritalStatus || '',
      country: country || '',
      city: city || '',
      role: 'client',
      clinicalNotes: '',
      homework: [],
      testResults: [],
      createdAt: new Date().toISOString(),
    };

    profiles.unshift(newProfile);
    try {
      await fs.writeFile(filePath, JSON.stringify(profiles, null, 2), 'utf-8');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      user: {
        id: newProfile.id,
        name: newProfile.name,
        phone: newProfile.phone,
        email: newProfile.email,
        gender: newProfile.gender,
        ageGroup: newProfile.ageGroup,
        maritalStatus: newProfile.maritalStatus,
        country: newProfile.country,
        city: newProfile.city,
        role: 'client',
        createdAt: newProfile.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إنشاء الحساب، يرجى المحاولة لاحقاً.' },
      { status: 500 }
    );
  }
}
