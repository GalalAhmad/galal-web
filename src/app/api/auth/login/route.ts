import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyPassword, hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';

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

    const profiles = await readProfiles();

    // Find user by phone or email
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

    // Check password
    if (user.passwordHash) {
      const isMatch = verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: 'كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.' },
          { status: 401 }
        );
      }
    } else {
      // Legacy user without passwordHash: initialize password on first real login
      user.passwordHash = hashPassword(password);
      profiles[userIndex] = user;
      await writeProfiles(profiles);
    }

    // Return safe user object
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        provider: user.provider || 'credentials',
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
