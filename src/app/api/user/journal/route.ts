import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { sendClientJournalNotificationEmail } from '@/lib/email';
import { getServerUserSession, requireAuth } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const authCheck = requireAuth(req);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;
    const isManagement = sessionUser.role === 'counselor' || sessionUser.role === 'admin';

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, entries: [] });
    }

    let query = supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('test_id', 'client_journal')
      .order('created_at', { ascending: false });

    if (!isManagement) {
      // Client can ONLY view their own entries
      const uPhone = sessionUser.phone || '';
      const uEmail = sessionUser.email || '';
      if (uPhone && uEmail) {
        query = query.or(`client_phone.eq.${uPhone},client_email.eq.${uEmail}`);
      } else if (uPhone) {
        query = query.eq('client_phone', uPhone);
      } else if (uEmail) {
        query = query.eq('client_email', uEmail);
      } else {
        return NextResponse.json({ success: true, entries: [] });
      }
    } else {
      // Counselor/admin: viewing shared entries, or filtered by specific client
      if (phone && email) {
        query = query.or(`client_phone.eq.${phone},client_email.eq.${email}`);
      } else if (phone) {
        query = query.eq('client_phone', phone);
      } else if (email) {
        query = query.eq('client_email', email);
      } else {
        query = query.eq('level', 'shared');
      }
    }

    const { data, error } = await query.limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const entries = (data || []).map((row) => ({
      id: row.id,
      title: row.test_title || 'خاطرة إرشادية',
      content: row.description || '',
      sharedWithAdvisor: row.level === 'shared',
      moodTag: row.recommendation || '',
      createdAt: row.created_at,
      clientName: row.client_name,
      clientPhone: row.client_phone,
      clientEmail: row.client_email,
    }));

    return NextResponse.json({ success: true, entries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authCheck = requireAuth(req);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;

    const body = await req.json();
    const { title, content, sharedWithAdvisor, moodTag } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'نص الخاطرة أو الرسالة مطلوب' }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, message: 'حفظ محلي مؤقت' });
    }

    const entryId = `journal-${Date.now()}`;
    const isShared = sharedWithAdvisor !== false;

    const clientName = sessionUser.name || 'مستفيد';
    const clientPhone = sessionUser.phone || '';
    const clientEmail = sessionUser.email || '';

    const { data, error } = await supabaseAdmin.from('test_results').insert({
      id: entryId,
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      test_id: 'client_journal',
      test_title: title || 'تدوينة وتواصل إرشادي',
      description: content.trim(),
      level: isShared ? 'shared' : 'private',
      recommendation: moodTag || 'عادي',
      score: 1,
      score_percent: 100,
      created_at: new Date().toISOString(),
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If shared with advisor, notify counselor
    if (isShared) {
      try {
        await supabaseAdmin.from('test_results').insert({
          id: `notif-counselor-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          client_name: 'إشعار المعالج',
          client_phone: 'counselor',
          client_email: 'counselor@galalahmad.com',
          test_id: 'user_notification',
          test_title: `خاطرة جديدة تمت مشاركتها: ${clientName} 📝`,
          score: 0,
          score_percent: 0,
          level: 'unread',
          description: `شارك العميل خاطرة جديدة: "${content.trim().slice(0, 60)}..."`,
          recommendation: '/counselor',
          created_at: new Date().toISOString(),
        });

        // Instant email alert to consultant
        sendClientJournalNotificationEmail({
          clientName: clientName,
          clientPhone: clientPhone,
          clientEmail: clientEmail,
          title: title || 'تدوينة وتواصل إرشادي',
          content: content.trim(),
          moodTag: moodTag || 'ملاحظة ومصارحة',
        }).catch((e) => console.error('Journal email dispatch error:', e));
      } catch (notifErr) {
        console.error('Journal notification error:', notifErr);
      }
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
