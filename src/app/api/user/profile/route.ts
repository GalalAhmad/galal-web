import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { hashPassword, phonesMatch, normalizePhone } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { parseClinicalDossier } from '@/lib/clinical/dossierParser';
import { getServerUserSession, requireAuth, requireOwnershipOrRole } from '@/lib/serverAuth';

const filePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readProfilesLocal() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
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

export async function GET(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    let id = searchParams.get('id');

    let cleanPhone = phone ? normalizePhone(phone) : '';
    let cleanEmail = email ? email.trim().toLowerCase() : '';

    // If an authenticated client queries their own profile without parameters, resolve to session user
    if (!id && !cleanPhone && !cleanEmail && sessionUser.role === 'client') {
      id = sessionUser.id;
      cleanPhone = sessionUser.phone ? normalizePhone(sessionUser.phone) : '';
      cleanEmail = sessionUser.email ? sessionUser.email.trim().toLowerCase() : '';
    }

    // 1. Fetching all profiles — RESTRICTED TO COUNSELOR OR ADMIN
    if (!id && !cleanPhone && !cleanEmail) {
      if (sessionUser.role !== 'counselor' && sessionUser.role !== 'admin') {
        return NextResponse.json(
          { error: 'ممنوع: ليس لديك الصلاحية لاستعراض قائمة ملفات العملاء', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
      const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
      const search = (searchParams.get('search') || '').trim();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      if (isSupabaseConfigured && supabaseAdmin) {
        let profileQuery = supabaseAdmin
          .from('profiles')
          .select('id, name, phone, email, role, gender, age_group, marital_status, country, city, clinical_notes, created_at', { count: 'exact' })
          .order('created_at', { ascending: false });

        if (search) {
          profileQuery = profileQuery.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data: dbProfiles, count } = await profileQuery.range(from, to);

        if (dbProfiles) {
          return NextResponse.json({
            success: true,
            pagination: {
              page,
              limit,
              total: count ?? dbProfiles.length,
              totalPages: Math.ceil((count ?? dbProfiles.length) / limit),
            },
            profiles: dbProfiles.map((p: any) => {
              const dossier = parseClinicalDossier(p.clinical_notes);
              return {
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
                clinicalNotes: sessionUser.role === 'counselor' ? dossier.notes : '',
                homework: dossier.homework,
                courses: dossier.courses,
                readingPlan: dossier.readingPlan,
                testResults: [], // Detailed assessments loaded on-demand when client profile is opened
                createdAt: p.created_at,
              };
            }),
          });
        }
      }

      // Local fallback for counselor/admin with pagination
      const allProfiles = await readProfilesLocal();
      const filtered = search
        ? allProfiles.filter((p: any) =>
            (p.name || '').includes(search) || (p.phone || '').includes(search) || (p.email || '').includes(search)
          )
        : allProfiles;
      const paginated = filtered.slice(from, from + limit);

      return NextResponse.json({
        success: true,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
        profiles: paginated.map(({ passwordHash, clinicalNotes, ...rest }: any) => ({
          ...rest,
          clinicalNotes: sessionUser.role === 'counselor' ? clinicalNotes : '',
        })),
      });
    }

    // 2. Fetching single specific profile — ENFORCE OWNERSHIP OR COUNSELOR/ADMIN ROLE
    const ownership = requireOwnershipOrRole(
      request,
      { id: id || undefined, phone: cleanPhone || undefined, email: cleanEmail || undefined },
      ['counselor', 'admin']
    );
    if (!ownership.user) {
      return ownership.response;
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('profiles').select('*');
      if (id) query = query.eq('id', id);
      else if (cleanPhone) query = query.eq('phone', cleanPhone);
      else if (cleanEmail) query = query.eq('email', cleanEmail);

      const { data: dbProfile, error: dbErr } = await query.maybeSingle();

      if (!dbErr && dbProfile) {
        const dossier = parseClinicalDossier(dbProfile.clinical_notes);

        let testQuery = supabaseAdmin
          .from('test_results')
          .select('*')
          .neq('test_id', 'user_notification')
          .neq('test_id', 'daily_wellbeing')
          .neq('test_id', 'client_journal')
          .order('created_at', { ascending: false });

        if (cleanPhone && cleanEmail) {
          testQuery = testQuery.or(`client_phone.eq.${cleanPhone},client_email.eq.${cleanEmail}`);
        } else if (cleanPhone) {
          testQuery = testQuery.eq('client_phone', cleanPhone);
        } else if (cleanEmail) {
          testQuery = testQuery.eq('client_email', cleanEmail);
        }

        const { data: tests } = await testQuery;

        const formattedProfile = {
          id: dbProfile.id,
          name: dbProfile.name,
          phone: dbProfile.phone || '',
          email: dbProfile.email || '',
          role: dbProfile.role || 'client',
          gender: dbProfile.gender || '',
          ageGroup: dbProfile.age_group || '',
          maritalStatus: dbProfile.marital_status || '',
          country: dbProfile.country || '',
          city: dbProfile.city || '',
          clinicalNotes: sessionUser.role === 'counselor' ? dossier.notes : '',
          homework: dossier.homework,
          courses: dossier.courses,
          readingPlan: dossier.readingPlan,
          testResults: (tests || []).map((t: any) => ({
            id: t.id,
            testId: t.test_id,
            testTitle: t.test_title,
            score: t.score,
            scorePercent: t.score_percent,
            level: t.level,
            description: t.description,
            recommendation: t.recommendation,
            date: new Date(t.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
            timestamp: t.created_at,
          })),
          createdAt: dbProfile.created_at,
        };

        return NextResponse.json(
          { success: true, profile: formattedProfile },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        );
      }
    }

    // Local Fallback for single profile
    const profiles = await readProfilesLocal();
    const localProfile = profiles.find((p: any) => {
      if (id && p.id === id) return true;
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      return false;
    });

    const safeProfile = localProfile
      ? (({ passwordHash, clinicalNotes, ...rest }: any) => ({
          ...rest,
          clinicalNotes: sessionUser.role === 'counselor' ? clinicalNotes : '',
        }))(localProfile)
      : null;
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
    const sessionUser = getServerUserSession(request);
    const body = await request.json();
    const { phone, email, name, testResult, gender, ageGroup, maritalStatus, country, city } = body;

    const cleanPhone = phone ? normalizePhone(phone) : (sessionUser?.phone || '');
    const cleanEmail = email ? email.trim().toLowerCase() : (sessionUser?.email || '');
    const clientName = name || sessionUser?.name || 'مستفيد';

    if (!cleanPhone && !cleanEmail && !clientName) {
      return NextResponse.json({ error: 'الاسم ورقم الهاتف أو البريد ضروري' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        if (testResult) {
          await supabaseAdmin.from('test_results').insert({
            client_name: clientName,
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
        if (sessionUser?.id) query = query.eq('id', sessionUser.id);
        else if (cleanPhone) query = query.eq('phone', cleanPhone);
        else if (cleanEmail) query = query.eq('email', cleanEmail);
        else query = query.eq('name', clientName);

        const { data: existing } = await query.maybeSingle();

        const updateData: any = { updated_at: new Date().toISOString() };
        if (clientName) updateData.name = clientName;
        if (cleanPhone) updateData.phone = cleanPhone;
        if (cleanEmail) updateData.email = cleanEmail;
        if (gender) updateData.gender = gender;
        if (ageGroup) updateData.age_group = ageGroup;
        if (maritalStatus) updateData.marital_status = maritalStatus;
        if (country) updateData.country = country;
        if (city) updateData.city = city;

        if (existing) {
          await supabaseAdmin.from('profiles').update(updateData).eq('id', existing.id);
        }
      } catch (sbErr) {
        console.error('Supabase test result save error:', sbErr);
      }
    }

    return NextResponse.json({ success: true, message: 'تم حفظ النتيجة بنجاح' });
  } catch (error) {
    console.error('Error saving user profile test:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;

    const body = await request.json();
    const {
      id,
      phone,
      email,
      notes,
      name,
      newPassword,
      gender,
      city,
      maritalStatus,
      ageGroup,
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

    // Enforce ownership: Client can ONLY mutate their own profile
    if (sessionUser.role === 'client') {
      const isTargetingSelf =
        (id && sessionUser.id === id) ||
        (cleanPhone && sessionUser.phone && phonesMatch(sessionUser.phone, cleanPhone)) ||
        (cleanEmail && sessionUser.email && sessionUser.email.toLowerCase() === cleanEmail) ||
        (!id && !cleanPhone && !cleanEmail);

      if (!isTargetingSelf) {
        return NextResponse.json(
          { error: 'ممنوع: لا تملك الصلاحية لتعديل بيانات مستفيد آخر', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }
    }

    const isCounselorOrAdmin = sessionUser.role === 'counselor' || sessionUser.role === 'admin';

    if (isSupabaseConfigured && supabaseAdmin) {
      const targetId = id || (sessionUser.role === 'client' ? sessionUser.id : undefined);

      let fetchQuery = supabaseAdmin.from('profiles').select('*');
      if (targetId) fetchQuery = fetchQuery.eq('id', targetId);
      else if (cleanPhone) fetchQuery = fetchQuery.eq('phone', cleanPhone);
      else if (cleanEmail) fetchQuery = fetchQuery.eq('email', cleanEmail);

      const { data: existing } = await fetchQuery.maybeSingle();

      const dossier = parseClinicalDossier(existing?.clinical_notes || null);
      let updatedNotes = isCounselorOrAdmin && notes !== undefined ? notes : dossier.notes;
      let updatedHomework = isCounselorOrAdmin && Array.isArray(homework) ? [...homework] : [...dossier.homework];
      let updatedCourses = isCounselorOrAdmin && Array.isArray(courses) ? [...courses] : [...dossier.courses];
      let updatedReadingPlan = isCounselorOrAdmin && Array.isArray(readingPlan) ? [...readingPlan] : [...dossier.readingPlan];

      // Counselor assigning new homework
      if (isCounselorOrAdmin) {
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
        if (removeHomeworkId) {
          updatedHomework = updatedHomework.filter((h: any) => h.id !== removeHomeworkId);
        }
      }

      // Client or Counselor toggling/updating homework status
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

      if (toggleReadingPlanId && isCounselorOrAdmin) {
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
      if (newPassword && (sessionUser.role === 'client' || sessionUser.id === existing?.id)) {
        updateData.password_hash = hashPassword(newPassword);
      }
      if (gender) updateData.gender = gender;
      if (city) updateData.city = city;
      if (maritalStatus) updateData.marital_status = maritalStatus;
      if (ageGroup) updateData.age_group = ageGroup;

      let updateQuery = supabaseAdmin.from('profiles').update(updateData);
      if (targetId) updateQuery = updateQuery.eq('id', targetId);
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
            clinicalNotes: isCounselorOrAdmin ? updatedNotes : '',
            homework: updatedHomework,
            courses: updatedCourses,
            readingPlan: updatedReadingPlan,
            role: data.role,
          },
        });
      }
    }

    // Local Fallback
    const profiles = await readProfilesLocal();
    const targetId = id || (sessionUser.role === 'client' ? sessionUser.id : undefined);

    const idx = profiles.findIndex((p: any) => {
      if (targetId && p.id === targetId) return true;
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
    if (isCounselorOrAdmin && notes !== undefined) profile.clinicalNotes = notes;
    if (newPassword && (sessionUser.role === 'client' || sessionUser.id === profile.id)) {
      profile.passwordHash = hashPassword(newPassword);
    }
    if (gender) profile.gender = gender;
    if (city) profile.city = city;
    if (maritalStatus) profile.maritalStatus = maritalStatus;
    if (ageGroup) profile.ageGroup = ageGroup;

    if (!Array.isArray(profile.homework)) profile.homework = [];
    if (isCounselorOrAdmin) {
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
      if (removeHomeworkId) {
        profile.homework = profile.homework.filter((h: any) => h.id !== removeHomeworkId);
      }
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

    profiles[idx] = profile;
    await writeProfilesLocal(profiles);

    const { passwordHash, ...safe } = profile;
    return NextResponse.json({ success: true, profile: safe });
  } catch (error) {
    console.error('Error in PUT profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
