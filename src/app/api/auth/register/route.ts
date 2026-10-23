import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readProfiles() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeProfiles(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing userProfiles.json:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password } = body;

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

    const profiles = await readProfiles();

    // 2. Check for duplicate account
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

    // 3. Create real user profile
    const newProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone || '',
      email: cleanEmail || '',
      passwordHash: hashPassword(password),
      provider: 'credentials',
      clinicalNotes: '',
      homework: [],
      testResults: [],
      createdAt: new Date().toISOString(),
    };

    profiles.unshift(newProfile);
    await writeProfiles(profiles);

    // Return safe user object (omit passwordHash)
    return NextResponse.json({
      success: true,
      user: {
        id: newProfile.id,
        name: newProfile.name,
        phone: newProfile.phone,
        email: newProfile.email,
        provider: newProfile.provider,
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
