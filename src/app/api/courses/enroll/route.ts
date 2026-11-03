import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { parseClinicalDossier } from '@/app/api/user/profile/route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, courseTitle, name, phone, email, notes, batchDate } = body;

    if (!courseId || !courseTitle) {
      return NextResponse.json({ error: 'معرّف واسم البرنامج مطلوبان' }, { status: 400 });
    }

    const cleanPhone = (phone || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanPhone && !cleanEmail && !name) {
      return NextResponse.json({ error: 'بيانات التسجيل (الاسم أو الهاتف أو البريد) مطلوبة' }, { status: 400 });
    }

    const newCourseItem = {
      id: courseId,
      title: courseTitle,
      batchDate: batchDate || 'الدفعة القادمة',
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'active',
      progress: 0,
      notes: notes || '',
    };

    if (isSupabaseConfigured && supabaseAdmin) {
      // 1. Find user profile in Supabase
      let query = supabaseAdmin.from('profiles').select('*');
      if (cleanPhone && cleanEmail) {
        query = query.or(`phone.eq.${cleanPhone},email.eq.${cleanEmail}`);
      } else if (cleanPhone) {
        query = query.eq('phone', cleanPhone);
      } else if (cleanEmail) {
        query = query.eq('email', cleanEmail);
      } else if (name) {
        query = query.eq('name', name);
      }

      const { data: existingRows } = await query;
      let targetUser = existingRows && existingRows.length > 0 ? existingRows[0] : null;

      if (!targetUser) {
        // Create client profile if new visitor
        const { data: created } = await supabaseAdmin.from('profiles').insert({
          name: name || 'مستفيد جديد',
          phone: cleanPhone || '',
          email: cleanEmail || '',
          role: 'client',
        }).select().maybeSingle();
        targetUser = created;
      }

      if (targetUser) {
        const dossier = parseClinicalDossier(targetUser.clinical_notes);
        // Avoid duplicate enrollment
        const existingCourses = Array.isArray(dossier.courses) ? dossier.courses : [];
        const isAlreadyEnrolled = existingCourses.some((c: any) => c.id === courseId);

        let updatedCourses = existingCourses;
        if (!isAlreadyEnrolled) {
          updatedCourses = [newCourseItem, ...existingCourses];
        }

        const serialized = JSON.stringify({
          ...dossier,
          courses: updatedCourses,
        });

        await supabaseAdmin
          .from('profiles')
          .update({
            clinical_notes: serialized,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUser.id);

        // 2. Add in-app notification
        try {
          await supabaseAdmin.from('test_results').insert({
            id: `notif-${Date.now()}`,
            client_name: targetUser.name,
            client_phone: targetUser.phone || '',
            client_email: targetUser.email || '',
            test_id: 'user_notification',
            test_title: `تم انضمامك لبرنامج: ${courseTitle} 🌿`,
            score: 0,
            score_percent: 0,
            level: 'unread',
            description: `تهانينا! تم تسجيلك بنجاح في ${courseTitle}. يمكنك متابعة مواعيد المحطات واللقاءات والمواد الإرشادية من صفحة ملفك الشخصي.`,
            recommendation: '/profile',
            created_at: new Date().toISOString(),
          });
        } catch (notifErr) {
          // non-blocking
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم التسجيل في البرنامج بنجاح وإضافته إلى ملفك الشخصي',
      course: newCourseItem,
    });
  } catch (err: any) {
    console.error('Course enrollment error:', err);
    return NextResponse.json({ error: 'تعذر إتمام التسجيل حالياً' }, { status: 500 });
  }
}
