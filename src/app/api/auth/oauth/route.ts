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
    const { provider, email, name, phone } = body;

    if (!provider || !['google', 'apple'].includes(provider)) {
      return NextResponse.json({ error: 'مزود تسجيل الدخول غير صالح' }, { status: 400 });
    }

    if (!email && !phone && !name) {
      return NextResponse.json({ error: 'بيانات الحساب غير مكتملة' }, { status: 400 });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPhone = normalizePhone(phone);
    const cleanName = (name || (provider === 'google' ? 'مستخدم Google' : 'مستخدم Apple')).trim();

    const profiles = await readProfiles();

    // Check if user already exists
    let userIndex = profiles.findIndex((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      if (cleanPhone && p.phone && phonesMatch(p.phone, cleanPhone)) return true;
      return false;
    });

    let user: any;

    if (userIndex >= 0) {
      // Existing user: log in and update provider if not set
      user = profiles[userIndex];
      if (!user.provider || user.provider === 'credentials') {
        user.provider = provider;
      }
      profiles[userIndex] = user;
      await writeProfiles(profiles);
    } else {
      // New user via Google or Apple: create unified real account
      user = {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail || `${cleanName.replace(/\s+/g, '').toLowerCase()}@${provider}.com`,
        phone: cleanPhone || '',
        passwordHash: hashPassword(`oauth_${Date.now()}_${Math.random()}`),
        provider,
        clinicalNotes: '',
        homework: [
          {
            id: `hw-${Date.now()}`,
            title: 'قراءة ميثاق السرية والتعريف بمسار الاستشارات النفسية والتربوية',
            link: '/policies',
            completed: false,
            assignedAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
          },
        ],
        testResults: [],
        courses: [],
        readingPlan: [
          {
            id: `rp-${Date.now()}`,
            title: 'أقومية القرآن في بناء الإنسان والأسرة',
            category: 'منهج البصيرة',
            readTime: '8 دقائق',
            completed: false,
            link: '/aqwameyat-quran',
          },
        ],
        createdAt: new Date().toISOString(),
      };

      profiles.unshift(user);
      await writeProfiles(profiles);
    }

    // Return safe user object
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('OAuth sign-in error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تسجيل الدخول السريع' },
      { status: 500 }
    );
  }
}
