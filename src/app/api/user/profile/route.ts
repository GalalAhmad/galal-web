import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readProfilesLocal() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeProfilesLocal(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing userProfiles.json:', err);
  }
}

export function parseClinicalDossier(rawNotes: string | null) {
  let notes = rawNotes || '';
  let homework: any[] = [];
  let courses: any[] = [];
  let readingPlan: any[] = [];

  if (rawNotes && typeof rawNotes === 'string' && rawNotes.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawNotes);
      notes = parsed.notes !== undefined ? parsed.notes : '';
      homework = Array.isArray(parsed.homework) ? parsed.homework : [];
      courses = Array.isArray(parsed.courses) ? parsed.courses : [];
      readingPlan = Array.isArray(parsed.readingPlan) ? parsed.readingPlan : [];
    } catch (e) {
      notes = rawNotes;
    }
  }
  return { notes, homework, courses, readingPlan };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    const cleanPhone = phone ? normalizePhone(phone) : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (isSupabaseConfigured) {
      // 1. If fetching all profiles (for admin)
      if (!id && !cleanPhone && !cleanEmail) {
        const { data: dbProfiles } = await supabaseAdmin
          .from('profiles')
          .select('id, name, phone, email, role, gender, age_group, marital_status, country, city, clinical_notes, created_at')
          .order('created_at', { ascending: false });

        if (dbProfiles) {
          return NextResponse.json({
            success: true,
            profiles: dbProfiles.map((p: any) => ({
              id: p.id,
              name: p.name,
              phone: p.phone || '',
              email: p.email || '',
              role: p.role || 'client',
              gender: p.gender || '',
              ageGroup: p.age_group || '',
              maritalStatus: p.marital_status || '',
              country: p.country || '',
              city: p.city || '',
              clinicalNotes: p.clinical_notes || '',
              createdAt: p.created_at,
            })),
          });
        }
      }

      // 2. If fetching specific profile
      let query = supabaseAdmin.from('profiles').select('*');
      if (id) {
        query = query.eq('id', id);
      } else if (cleanPhone && cleanEmail) {
        query = query.or(`phone.eq.${cleanPhone},email.eq.${cleanEmail}`);
      } else if (cleanPhone) {
        query = query.eq('phone', cleanPhone);
      } else if (cleanEmail) {
        query = query.eq('email', cleanEmail);
      }

      const { data: userRows } = await query;
      if (userRows && userRows.length > 0) {
        const p = userRows[0];

        // Fetch user's test results
        let testQuery = supabaseAdmin.from('test_results').select('*').order('created_at', { ascending: false });
        if (p.phone && p.email) {
          testQuery = testQuery.or(`client_phone.eq.${p.phone},client_email.eq.${p.email}`);
        } else if (p.phone) {
          testQuery = testQuery.eq('client_phone', p.phone);
        } else if (p.email) {
          testQuery = testQuery.eq('client_email', p.email);
        } else {
          testQuery = testQuery.eq('client_name', p.name);
        }

        const { data: userTests } = await testQuery;
        const dossier = parseClinicalDossier(p.clinical_notes);

        const formattedProfile = {
          id: p.id,
          name: p.name,
          phone: p.phone || '',
          email: p.email || '',
          gender: p.gender || '',
          ageGroup: p.age_group || '',
          maritalStatus: p.marital_status || '',
          country: p.country || '',
          city: p.city || '',
          role: p.role || 'client',
          clinicalNotes: dossier.notes,
          homework: dossier.homework,
          courses: dossier.courses,
          readingPlan: dossier.readingPlan,
          testResults: (userTests || []).map((t: any) => ({
            id: t.id,
            testId: t.test_id,
            testTitle: t.test_title,
            title: t.test_title,
            score: t.score,
            scorePercent: t.score_percent,
            level: t.level,
            description: t.description,
            recommendation: t.recommendation,
            date: new Date(t.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
            timestamp: t.created_at,
          })),
          createdAt: p.created_at,
        };

        return NextResponse.json(
          { success: true, profile: formattedProfile },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        );
      }
    }

    // Local Fallback
    const profiles = await readProfilesLocal();
    if (!cleanPhone && !cleanEmail && !id) {
      return NextResponse.json({
        success: true,
        profiles: profiles.map(({ passwordHash, ...rest }: any) => rest),
      });
    }

    const localProfile = profiles.find((p: any) => {
      if (id && p.id === id) return true;
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    const safeProfile = localProfile ? (({ passwordHash, ...rest }: any) => rest)(localProfile) : null;
    return NextResponse.json(
      { success: true, profile: safeProfile },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to read user profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, email, name, provider, testResult, notes, homework, gender, ageGroup, maritalStatus, country, city } = body;

    if (!phone && !email && !name) {
      return NextResponse.json({ error: 'الاسم ورقم الهاتف أو البريد ضروري' }, { status: 400 });
    }

    const cleanPhone = phone ? normalizePhone(phone) : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // 1. Supabase save test result & update profile
    if (isSupabaseConfigured) {
      try {
        if (testResult) {
          await supabaseAdmin.from('test_results').insert({
            client_name: name || 'مستفيد',
            client_phone: cleanPhone || null,
            client_email: cleanEmail || null,
            test_id: testResult.testId || testResult.id || 'general',
            test_title: testResult.testTitle || testResult.title || 'مقياس نفسي',
            score: testResult.score || 0,
            score_percent: testResult.scorePercent || 0,
            level: testResult.level || 'متوسط',
            description: testResult.description || '',
            recommendation: testResult.recommendation || '',
          });
        }

        // Upsert profile in Supabase
        let query = supabaseAdmin.from('profiles').select('id');
        if (cleanPhone) query = query.eq('phone', cleanPhone);
        else if (cleanEmail) query = query.eq('email', cleanEmail);
        else query = query.eq('name', name);

        const { data: existing } = await query.maybeSingle();

        const updateData: any = { updated_at: new Date().toISOString() };
        if (name) updateData.name = name;
        if (cleanPhone) updateData.phone = cleanPhone;
        if (cleanEmail) updateData.email = cleanEmail;
        if (gender) updateData.gender = gender;
        if (ageGroup) updateData.age_group = ageGroup;
        if (maritalStatus) updateData.marital_status = maritalStatus;
        if (country) updateData.country = country;
        if (city) updateData.city = city;
        if (notes !== undefined) updateData.clinical_notes = notes;

        if (existing) {
          await supabaseAdmin.from('profiles').update(updateData).eq('id', existing.id);
        } else {
          await supabaseAdmin.from('profiles').insert({
            ...updateData,
            role: 'client',
          });
        }
      } catch (dbErr) {
        console.error('Supabase profile POST error:', dbErr);
      }
    }

    // 2. Mirror local
    const profiles = await readProfilesLocal();
    let existingIdx = profiles.findIndex((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      if (name && p.name && p.name.trim().toLowerCase() === name.trim().toLowerCase()) return true;
      return false;
    });

    let currentProfile: any;
    if (existingIdx >= 0) {
      currentProfile = profiles[existingIdx];
      if (name) currentProfile.name = name;
      if (cleanPhone && !currentProfile.phone) currentProfile.phone = cleanPhone;
      if (cleanEmail && !currentProfile.email) currentProfile.email = cleanEmail;
      if (gender) currentProfile.gender = gender;
      if (ageGroup) currentProfile.ageGroup = ageGroup;
      if (maritalStatus) currentProfile.maritalStatus = maritalStatus;
      if (country) currentProfile.country = country;
      if (city) currentProfile.city = city;
      if (notes !== undefined) currentProfile.clinicalNotes = notes;
      if (testResult) {
        if (!Array.isArray(currentProfile.testResults)) currentProfile.testResults = [];
        currentProfile.testResults.unshift({
          ...testResult,
          id: `tr-${Date.now()}`,
          date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
          timestamp: new Date().toISOString(),
        });
      }
      profiles[existingIdx] = currentProfile;
    } else {
      currentProfile = {
        id: `user-${Date.now()}`,
        name: name || 'مستفيد جديد',
        phone: cleanPhone || '',
        email: cleanEmail || '',
        gender: gender || '',
        ageGroup: ageGroup || '',
        maritalStatus: maritalStatus || '',
        country: country || '',
        city: city || '',
        role: 'client',
        clinicalNotes: notes || '',
        homework: [],
        testResults: testResult ? [{
          ...testResult,
          id: `tr-${Date.now()}`,
          date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
          timestamp: new Date().toISOString(),
        }] : [],
        createdAt: new Date().toISOString(),
      };
      profiles.unshift(currentProfile);
    }

    await writeProfilesLocal(profiles);
    const { passwordHash, ...safe } = currentProfile;
    return NextResponse.json({ success: true, profile: safe });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      phone,
      email,
      notes,
      name,
      newPassword,
      homework,
      newHomework,
      removeHomeworkId,
      toggleHomeworkId,
      toggleReadingPlanId,
      courses,
      readingPlan,
      updateHomeworkId,
      updateHomeworkStatus,
      clientNotes,
      notificationPreferences,
    } = body;

    const cleanPhone = phone ? normalizePhone(phone) : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (isSupabaseConfigured) {
      // 1. Fetch existing profile to merge and preserve dossier
      let fetchQuery = supabaseAdmin.from('profiles').select('*');
      if (id) fetchQuery = fetchQuery.eq('id', id);
      else if (cleanPhone) fetchQuery = fetchQuery.eq('phone', cleanPhone);
      else if (cleanEmail) fetchQuery = fetchQuery.eq('email', cleanEmail);

      const { data: existing } = await fetchQuery.maybeSingle();

      const dossier = parseClinicalDossier(existing?.clinical_notes || null);
      let updatedNotes = notes !== undefined ? notes : dossier.notes;
      let updatedHomework = Array.isArray(homework) ? [...homework] : [...dossier.homework];
      let updatedCourses = Array.isArray(courses) ? [...courses] : [...dossier.courses];
      let updatedReadingPlan = Array.isArray(readingPlan) ? [...readingPlan] : [...dossier.readingPlan];

      const incomingHw = newHomework || (!Array.isArray(homework) && homework && typeof homework === 'object' ? homework : null);
      if (incomingHw && incomingHw.title) {
        const hwItem = {
          id: `hw-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          title: incomingHw.title,
          link: incomingHw.link || '',
          completed: false,
          assignedAt: new Date().toISOString().split('T')[0],
        };
        updatedHomework.unshift(hwItem);
      }

      if (toggleHomeworkId) {
        updatedHomework = updatedHomework.map((h: any) =>
          h.id === toggleHomeworkId ? { ...h, completed: !h.completed, status: !h.completed ? 'completed' : 'assigned' } : h
        );
      }

      if (updateHomeworkId) {
        updatedHomework = updatedHomework.map((h: any) => {
          if (h.id === updateHomeworkId) {
            const nextStatus = updateHomeworkStatus || (h.completed ? 'assigned' : 'completed');
            return {
              ...h,
              status: nextStatus,
              completed: nextStatus === 'completed',
              clientNotes: clientNotes !== undefined ? clientNotes : h.clientNotes,
              updatedAt: new Date().toISOString(),
            };
          }
          return h;
        });
      }

      if (removeHomeworkId) {
        updatedHomework = updatedHomework.filter((h: any) => h.id !== removeHomeworkId);
      }

      if (toggleReadingPlanId) {
        updatedReadingPlan = updatedReadingPlan.map((rp: any) =>
          rp.id === toggleReadingPlanId ? { ...rp, completed: !rp.completed } : rp
        );
      }

      const serializedNotes = JSON.stringify({
        notes: updatedNotes,
        homework: updatedHomework,
        courses: updatedCourses,
        readingPlan: updatedReadingPlan,
      });

      const updateData: any = {
        updated_at: new Date().toISOString(),
        clinical_notes: serializedNotes,
      };
      if (name) updateData.name = name;
      if (newPassword) updateData.password_hash = hashPassword(newPassword);

      let updateQuery = supabaseAdmin.from('profiles').update(updateData);
      if (id) updateQuery = updateQuery.eq('id', id);
      else if (cleanPhone) updateQuery = updateQuery.eq('phone', cleanPhone);
      else if (cleanEmail) updateQuery = updateQuery.eq('email', cleanEmail);

      const { data, error } = await updateQuery.select().maybeSingle();
      if (!error && data) {
        return NextResponse.json({
          success: true,
          profile: {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            clinicalNotes: updatedNotes,
            homework: updatedHomework,
            courses: updatedCourses,
            readingPlan: updatedReadingPlan,
            role: data.role,
          },
        });
      } else if (error) {
        console.error('Supabase profile update error:', error);
      }
    }

    // Local Fallback
    const profiles = await readProfilesLocal();
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
    if (newPassword) profile.passwordHash = hashPassword(newPassword);

    if (!Array.isArray(profile.homework)) profile.homework = [];
    const localIncomingHw = newHomework || (!Array.isArray(homework) && homework && typeof homework === 'object' ? homework : null);
    if (localIncomingHw && localIncomingHw.title) {
      profile.homework.unshift({
        id: `hw-${Date.now()}`,
        title: localIncomingHw.title,
        link: localIncomingHw.link || '',
        completed: false,
        assignedAt: new Date().toISOString().split('T')[0],
      });
    }
    if (toggleHomeworkId) {
      profile.homework = profile.homework.map((h: any) =>
        h.id === toggleHomeworkId ? { ...h, completed: !h.completed, status: !h.completed ? 'completed' : 'assigned' } : h
      );
    }
    if (updateHomeworkId) {
      profile.homework = profile.homework.map((h: any) => {
        if (h.id === updateHomeworkId) {
          const nextStatus = updateHomeworkStatus || (h.completed ? 'assigned' : 'completed');
          return {
            ...h,
            status: nextStatus,
            completed: nextStatus === 'completed',
            clientNotes: clientNotes !== undefined ? clientNotes : h.clientNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return h;
      });
    }
    if (notificationPreferences) {
      profile.notificationPreferences = notificationPreferences;
    }
    if (removeHomeworkId) {
      profile.homework = profile.homework.filter((h: any) => h.id !== removeHomeworkId);
    }
    if (courses) profile.courses = courses;
    if (readingPlan) profile.readingPlan = readingPlan;

    profiles[idx] = profile;
    await writeProfilesLocal(profiles);

    const { passwordHash, ...safe } = profile;
    return NextResponse.json({ success: true, profile: safe });
  } catch (error) {
    console.error('Error in PUT profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
