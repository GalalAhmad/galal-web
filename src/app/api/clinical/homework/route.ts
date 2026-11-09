import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { parseClinicalDossier } from '@/lib/clinical/dossierParser';
import { CLINICAL_EXERCISES_LIBRARY } from '@/lib/clinical/exercisesLibrary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const profilesFilePath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

async function readProfilesLocal() {
  try {
    const data = await fs.readFile(profilesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeProfilesLocal(data: any[]) {
  try {
    await fs.writeFile(profilesFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing userProfiles.json in homework API:', err);
  }
}

// GET: Retrieve homework tasks for a given client (by phone or email or id)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || '';
    const email = searchParams.get('email') || '';
    const clientId = searchParams.get('clientId') || '';

    const cleanPhone = phone.replace(/[^\d]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      let query = supabaseAdmin.from('profiles').select('*');
      if (clientId) query = query.eq('id', clientId);
      else if (cleanPhone) query = query.eq('phone', cleanPhone);
      else if (cleanEmail) query = query.eq('email', cleanEmail);

      const { data: profile } = await query.maybeSingle();
      if (profile) {
        const dossier = parseClinicalDossier(profile.clinical_notes);
        return NextResponse.json({ success: true, homework: dossier.homework || [] });
      }
    }

    // Local JSON fallback
    const profiles = await readProfilesLocal();
    const found = profiles.find((p: any) => {
      if (clientId && p.id === clientId) return true;
      const pPhone = (p.phone || '').replace(/[^\d]/g, '');
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && pPhone && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone))) return true;
      if (cleanEmail && pEmail && pEmail === cleanEmail) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      homework: found && Array.isArray(found.homework) ? found.homework : [],
    });
  } catch (error) {
    console.error('Error in GET /api/clinical/homework:', error);
    return NextResponse.json({ error: 'Failed to fetch homework' }, { status: 500 });
  }
}

// POST: Handles assignment, submission, and review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, email, clientId, exerciseSlug, homeworkId, clientAnswers, counselorFeedback } = body;

    const cleanPhone = (phone || '').replace(/[^\d]/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();

    // ----------------------------------------------------
    // ACTION 1: ASSIGN EXERCISE FROM LIBRARY TO CLIENT
    // ----------------------------------------------------
    if (action === 'assign') {
      const template = CLINICAL_EXERCISES_LIBRARY.find((ex) => ex.slug === exerciseSlug);
      if (!template) {
        return NextResponse.json({ error: 'التمرين المطلوب غير موجود في المكتبة' }, { status: 404 });
      }

      const newHomeworkItem = {
        id: `hw-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        exerciseSlug: template.slug,
        title: template.titleAr,
        category: template.category,
        categoryLabel: template.categoryLabelAr,
        description: template.descriptionAr,
        estimatedMinutes: template.estimatedMinutes,
        icon: template.icon,
        instructions: template.instructions,
        fields: template.defaultFields,
        status: 'assigned', // 'assigned' | 'in_progress' | 'submitted' | 'reviewed'
        completed: false,
        assignedAt: new Date().toISOString(),
        submittedAt: null,
        clientAnswers: {},
        counselorFeedback: '',
        counselorReviewedAt: null,
      };

      if (isSupabaseConfigured) {
        let query = supabaseAdmin.from('profiles').select('*');
        if (clientId) query = query.eq('id', clientId);
        else if (cleanPhone) query = query.eq('phone', cleanPhone);
        else if (cleanEmail) query = query.eq('email', cleanEmail);

        const { data: profile } = await query.maybeSingle();
        if (profile) {
          const dossier = parseClinicalDossier(profile.clinical_notes);
          const updatedHw = [newHomeworkItem, ...(dossier.homework || [])];
          await supabaseAdmin
            .from('profiles')
            .update({
              clinical_notes: JSON.stringify({ ...dossier, homework: updatedHw }),
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
        }
      }

      // Local fallback
      const profiles = await readProfilesLocal();
      const idx = profiles.findIndex((p: any) => {
        if (clientId && p.id === clientId) return true;
        const pPhone = (p.phone || '').replace(/[^\d]/g, '');
        const pEmail = (p.email || '').trim().toLowerCase();
        if (cleanPhone && pPhone && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone))) return true;
        if (cleanEmail && pEmail && pEmail === cleanEmail) return true;
        return false;
      });

      if (idx !== -1) {
        if (!Array.isArray(profiles[idx].homework)) profiles[idx].homework = [];
        profiles[idx].homework.unshift(newHomeworkItem);
        await writeProfilesLocal(profiles);
      }

      return NextResponse.json({
        success: true,
        message: 'تم إسناد التمرين للعميل بنجاح',
        item: newHomeworkItem,
      });
    }

    // ----------------------------------------------------
    // ACTION 2: CLIENT SUBMITS EXERCISE ANSWERS
    // ----------------------------------------------------
    if (action === 'submit') {
      if (!homeworkId) {
        return NextResponse.json({ error: 'معرّف الواجب مطلوب للتسليم' }, { status: 400 });
      }

      const submittedAt = new Date().toISOString();

      if (isSupabaseConfigured) {
        let query = supabaseAdmin.from('profiles').select('*');
        if (clientId) query = query.eq('id', clientId);
        else if (cleanPhone) query = query.eq('phone', cleanPhone);
        else if (cleanEmail) query = query.eq('email', cleanEmail);

        const { data: profile } = await query.maybeSingle();
        if (profile) {
          const dossier = parseClinicalDossier(profile.clinical_notes);
          const updatedHw = (dossier.homework || []).map((h: any) => {
            if (h.id === homeworkId) {
              return {
                ...h,
                status: 'submitted',
                completed: true,
                clientAnswers: clientAnswers || {},
                submittedAt,
                updatedAt: submittedAt,
              };
            }
            return h;
          });

          await supabaseAdmin
            .from('profiles')
            .update({
              clinical_notes: JSON.stringify({ ...dossier, homework: updatedHw }),
              updated_at: submittedAt,
            })
            .eq('id', profile.id);
        }
      }

      // Local fallback
      const profiles = await readProfilesLocal();
      const idx = profiles.findIndex((p: any) => {
        if (clientId && p.id === clientId) return true;
        const pPhone = (p.phone || '').replace(/[^\d]/g, '');
        const pEmail = (p.email || '').trim().toLowerCase();
        if (cleanPhone && pPhone && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone))) return true;
        if (cleanEmail && pEmail && pEmail === cleanEmail) return true;
        return false;
      });

      if (idx !== -1 && Array.isArray(profiles[idx].homework)) {
        profiles[idx].homework = profiles[idx].homework.map((h: any) => {
          if (h.id === homeworkId) {
            return {
              ...h,
              status: 'submitted',
              completed: true,
              clientAnswers: clientAnswers || {},
              submittedAt,
              updatedAt: submittedAt,
            };
          }
          return h;
        });
        await writeProfilesLocal(profiles);
      }

      return NextResponse.json({
        success: true,
        message: 'تم تسليم إجابات الواجب الإرشادي للمعالج بنجاح',
      });
    }

    // ----------------------------------------------------
    // ACTION 3: COUNSELOR REVIEWS AND GIVES FEEDBACK
    // ----------------------------------------------------
    if (action === 'review') {
      if (!homeworkId) {
        return NextResponse.json({ error: 'معرّف الواجب مطلوب للمراجعة' }, { status: 400 });
      }

      const counselorReviewedAt = new Date().toISOString();

      if (isSupabaseConfigured) {
        let query = supabaseAdmin.from('profiles').select('*');
        if (clientId) query = query.eq('id', clientId);
        else if (cleanPhone) query = query.eq('phone', cleanPhone);
        else if (cleanEmail) query = query.eq('email', cleanEmail);

        const { data: profile } = await query.maybeSingle();
        if (profile) {
          const dossier = parseClinicalDossier(profile.clinical_notes);
          const updatedHw = (dossier.homework || []).map((h: any) => {
            if (h.id === homeworkId) {
              return {
                ...h,
                status: 'reviewed',
                counselorFeedback: counselorFeedback || '',
                counselorReviewedAt,
                updatedAt: counselorReviewedAt,
              };
            }
            return h;
          });

          await supabaseAdmin
            .from('profiles')
            .update({
              clinical_notes: JSON.stringify({ ...dossier, homework: updatedHw }),
              updated_at: counselorReviewedAt,
            })
            .eq('id', profile.id);
        }
      }

      // Local fallback
      const profiles = await readProfilesLocal();
      const idx = profiles.findIndex((p: any) => {
        if (clientId && p.id === clientId) return true;
        const pPhone = (p.phone || '').replace(/[^\d]/g, '');
        const pEmail = (p.email || '').trim().toLowerCase();
        if (cleanPhone && pPhone && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone))) return true;
        if (cleanEmail && pEmail && pEmail === cleanEmail) return true;
        return false;
      });

      if (idx !== -1 && Array.isArray(profiles[idx].homework)) {
        profiles[idx].homework = profiles[idx].homework.map((h: any) => {
          if (h.id === homeworkId) {
            return {
              ...h,
              status: 'reviewed',
              counselorFeedback: counselorFeedback || '',
              counselorReviewedAt,
              updatedAt: counselorReviewedAt,
            };
          }
          return h;
        });
        await writeProfilesLocal(profiles);
      }

      return NextResponse.json({
        success: true,
        message: 'تم اعتماد التمرين وحفظ التغذية الراجعة للعميل بنجاح',
      });
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/clinical/homework:', error);
    return NextResponse.json({ error: 'Failed to process homework request' }, { status: 500 });
  }
}
