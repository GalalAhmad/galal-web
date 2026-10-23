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
    const { identifier, newPassword } = body;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني المسجل' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور الجديدة يجب أن لا تقل عن 6 خانات أو أحرف' },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim();
    const cleanPhone = normalizePhone(cleanInput);
    const cleanEmail = cleanInput.toLowerCase();

    const profiles = await readProfiles();

    const userIndex = profiles.findIndex((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && p.phone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'لم يتم العثور على حساب مسجل برقم الهاتف أو البريد المدخل' },
        { status: 404 }
      );
    }

    // Update password
    profiles[userIndex].passwordHash = hashPassword(newPassword);
    await writeProfiles(profiles);

    return NextResponse.json({
      success: true,
      message: 'تم تعيين كلمة المرور الجديدة بنجاح. يمكنك الآن تسجيل الدخول بها.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إعادة تعيين كلمة المرور' },
      { status: 500 }
    );
  }
}
