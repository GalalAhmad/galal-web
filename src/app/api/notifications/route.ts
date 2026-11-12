import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { requireAuth } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;
    const isManagement = sessionUser.role === 'counselor' || sessionUser.role === 'admin';

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    let query = supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('test_id', 'user_notification')
      .order('created_at', { ascending: false });

    if (!isManagement) {
      const uPhone = sessionUser.phone || '';
      const uEmail = sessionUser.email || '';
      if (uPhone && uEmail) {
        query = query.or(`client_email.eq.${uEmail},client_phone.eq.${uPhone}`);
      } else if (uEmail) {
        query = query.eq('client_email', uEmail);
      } else if (uPhone) {
        query = query.eq('client_phone', uPhone);
      } else {
        return NextResponse.json({ success: true, notifications: [] });
      }
    } else {
      // Management receives management/admin notifications
      const { searchParams } = new URL(request.url);
      const roleFilter = searchParams.get('role') || sessionUser.role;
      query = query.or(`client_phone.eq.${roleFilter},client_phone.eq.admin,client_phone.eq.counselor`);
    }

    const { data, error } = await query.limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const notifications = (data || []).map((row) => ({
      id: row.id,
      title: row.test_title,
      message: row.description,
      link: row.recommendation || '/profile',
      isRead: row.level === 'read',
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const { phone, email, title, message, link } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'العنوان والرسالة مطلوبان' }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true });
    }

    const notifId = `notif-${Date.now()}`;
    const { data, error } = await supabaseAdmin.from('test_results').insert({
      id: notifId,
      client_name: 'مستفيد المنصة',
      client_phone: phone || '',
      client_email: email || '',
      test_id: 'user_notification',
      test_title: title,
      score: 0,
      score_percent: 0,
      level: 'unread',
      description: message,
      recommendation: link || '/profile',
      created_at: new Date().toISOString(),
    }).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification: data?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;

    const body = await request.json();
    const { id, markAll } = body;

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true });
    }

    if (markAll) {
      let query = supabaseAdmin
        .from('test_results')
        .update({ level: 'read' })
        .eq('test_id', 'user_notification');

      if (sessionUser.role === 'client') {
        const uPhone = sessionUser.phone || '';
        const uEmail = sessionUser.email || '';
        if (uEmail && uPhone) {
          query = query.or(`client_email.eq.${uEmail},client_phone.eq.${uPhone}`);
        } else if (uEmail) {
          query = query.eq('client_email', uEmail);
        } else if (uPhone) {
          query = query.eq('client_phone', uPhone);
        }
      } else {
        query = query.or(`client_phone.eq.${sessionUser.role},client_phone.eq.admin,client_phone.eq.counselor`);
      }

      await query;
      return NextResponse.json({ success: true });
    }

    if (id) {
      await supabaseAdmin
        .from('test_results')
        .update({ level: 'read' })
        .eq('id', id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing id or criteria' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
