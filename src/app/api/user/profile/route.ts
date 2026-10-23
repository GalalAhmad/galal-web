import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

function phonesMatch(phone1?: string, phone2?: string): boolean {
  if (!phone1 || !phone2) return false;
  const digits1 = phone1.replace(/[^\d]/g, '');
  const digits2 = phone2.replace(/[^\d]/g, '');
  if (!digits1 || !digits2) return false;
  if (digits1 === digits2) return true;
  if (digits1.length >= 8 && digits2.length >= 8) {
    return digits1.slice(-8) === digits2.slice(-8);
  }
  return false;
}

// GET user profile by phone or email or return all for admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    const profiles = await readProfiles();

    if (id) {
      const profile = profiles.find((p: any) => p.id === id);
      if (profile) {
        const { passwordHash, ...safeProfile } = profile;
        return NextResponse.json({ success: true, profile: safeProfile });
      }
      return NextResponse.json({ success: true, profile: null });
    }

    if (!phone && !email) {
      const safeProfiles = profiles.map((p: any) => {
        const { passwordHash, ...safe } = p;
        return safe;
      });
      return NextResponse.json({ success: true, profiles: safeProfiles });
    }

    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const profile = profiles.find((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    const safeProfile = profile ? (({ passwordHash, ...rest }) => rest)(profile) : null;

    return NextResponse.json(
      { success: true, profile: safeProfile },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read user profile' }, { status: 500 });
  }
}

// POST: Save test result or create/update client profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, email, name, provider, testResult, notes, homework } = body;

    if (!phone && !email && !name) {
      return NextResponse.json({ error: 'الاسم ورقم الهاتف أو البريد ضروري' }, { status: 400 });
    }

    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const profiles = await readProfiles();

    let existingIdx = profiles.findIndex((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      if (name && p.name && p.name.trim().toLowerCase() === name.trim().toLowerCase()) return true;
      return false;
    });

    if (existingIdx >= 0) {
      // Update existing profile
      const profile = profiles[existingIdx];
      if (name) profile.name = name;
      if (cleanPhone && !profile.phone) profile.phone = cleanPhone;
      if (cleanEmail && !profile.email) profile.email = cleanEmail;
      if (provider) profile.provider = provider;
      if (notes !== undefined) profile.clinicalNotes = notes;

      if (homework) {
        if (!Array.isArray(profile.homework)) profile.homework = [];
        profile.homework.push(homework);
      }

      if (testResult) {
        if (!Array.isArray(profile.testResults)) {
          profile.testResults = [];
        }
        profile.testResults.unshift({
          ...testResult,
          id: `tr-${Date.now()}`,
          date: new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          timestamp: new Date().toISOString(),
        });
      }

      profiles[existingIdx] = profile;
      await writeProfiles(profiles);
      return NextResponse.json({ success: true, profile });
    } else {
      // Create new client profile
      const newProfile: any = {
        id: `user-${Date.now()}`,
        name: name || 'مستفيد جديد',
        phone: cleanPhone || '',
        email: cleanEmail || '',
        provider: provider || 'guest',
        clinicalNotes: notes || '',
        homework: homework ? [homework] : [],
        testResults: testResult
          ? [
              {
                ...testResult,
                id: `tr-${Date.now()}`,
                date: new Date().toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                timestamp: new Date().toISOString(),
              },
            ]
          : [],
        createdAt: new Date().toISOString(),
      };

      profiles.unshift(newProfile);
      await writeProfiles(profiles);
      return NextResponse.json({ success: true, profile: newProfile });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

// PUT: Admin updates client notes, homework, or info
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, phone, email, notes, homework, toggleHomeworkId, removeHomeworkId, name } = body;

    const profiles = await readProfiles();
    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const idx = profiles.findIndex((p: any) => {
      if (id && p.id === id) return true;
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    if (idx === -1) {
      return NextResponse.json({ error: 'الملف غير موجود' }, { status: 404 });
    }

    const profile = profiles[idx];

    if (name) profile.name = name;
    if (notes !== undefined) profile.clinicalNotes = notes;

    if (!Array.isArray(profile.homework)) {
      profile.homework = [];
    }

    if (homework) {
      profile.homework.push({
        id: `hw-${Date.now()}`,
        title: homework.title,
        link: homework.link || '',
        completed: false,
        assignedAt: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    }

    if (toggleHomeworkId) {
      const hw = profile.homework.find((h: any) => h.id === toggleHomeworkId);
      if (hw) {
        hw.completed = !hw.completed;
      }
    }

    if (removeHomeworkId) {
      profile.homework = profile.homework.filter((h: any) => h.id !== removeHomeworkId);
    }

    if (body.toggleReadingPlanId) {
      if (!Array.isArray(profile.readingPlan)) profile.readingPlan = [];
      const rp = profile.readingPlan.find((r: any) => r.id === body.toggleReadingPlanId);
      if (rp) {
        rp.completed = !rp.completed;
      }
    }

    if (body.enrollCourse) {
      if (!Array.isArray(profile.courses)) profile.courses = [];
      const exists = profile.courses.some((c: any) => c.id === body.enrollCourse.id);
      if (!exists) {
        profile.courses.push(body.enrollCourse);
      }
    }

    profiles[idx] = profile;
    await writeProfiles(profiles);

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error in PUT profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
