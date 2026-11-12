import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
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

    let filterPhone = phone;
    let filterEmail = email;

    if (!isManagement) {
      filterPhone = sessionUser.phone || null;
      filterEmail = sessionUser.email || null;
    }

    if (!filterPhone && !filterEmail) {
      return NextResponse.json({ success: true, logs: [], today: null });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, logs: [], today: null });
    }

    let query = supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('test_id', 'daily_wellbeing')
      .order('created_at', { ascending: false });

    if (filterPhone && filterEmail) {
      query = query.or(`client_phone.eq.${filterPhone},client_email.eq.${filterEmail}`);
    } else if (filterPhone) {
      query = query.eq('client_phone', filterPhone);
    } else if (filterEmail) {
      query = query.eq('client_email', filterEmail);
    }

    const { data, error } = await query.limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const logs = (data || []).map((row) => {
      let parsedHabits = [];
      try {
        parsedHabits = JSON.parse(row.recommendation || '[]');
      } catch {
        parsedHabits = [];
      }

      return {
        id: row.id,
        date: row.created_at.split('T')[0],
        createdAt: row.created_at,
        moodId: row.test_title,
        moodLabel: row.level,
        moodScore: row.score,
        note: row.description || '',
        habits: parsedHabits,
      };
    });

    const todayIso = new Date().toISOString().split('T')[0];
    const todayLog = logs.find((l) => l.date === todayIso) || null;

    return NextResponse.json({ success: true, logs, today: todayLog });
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
    const { moodId, moodLabel, moodScore, note, habits } = body;

    const phone = sessionUser.phone || '';
    const email = sessionUser.email || '';
    const name = sessionUser.name || 'مستفيد';

    if (!phone && !email) {
      return NextResponse.json({ error: 'بيانات الحساب (الهاتف أو البريد) غير مكتملة' }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, message: 'حفظ محلي' });
    }

    const todayIso = new Date().toISOString().split('T')[0];
    const habitsJson = JSON.stringify(habits || []);

    // Check if entry already exists for today
    let query = supabaseAdmin
      .from('test_results')
      .select('id, created_at')
      .eq('test_id', 'daily_wellbeing');

    if (phone) query = query.eq('client_phone', phone);
    else if (email) query = query.eq('client_email', email);

    const { data: existingList } = await query;
    const existingToday = (existingList || []).find((r: any) => r.created_at?.startsWith(todayIso));

    if (existingToday) {
      // Update today's record
      const { data, error } = await supabaseAdmin
        .from('test_results')
        .update({
          test_title: moodId,
          level: moodLabel,
          score: moodScore || 3,
          description: note || '',
          recommendation: habitsJson,
          client_name: name,
        })
        .eq('id', existingToday.id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, updated: true, entry: data });
    } else {
      // Insert new record for today
      const newId = `wellbeing-${todayIso}-${Date.now().toString().slice(-4)}`;
      const { data, error } = await supabaseAdmin
        .from('test_results')
        .insert({
          id: newId,
          client_name: name,
          client_phone: phone,
          client_email: email,
          test_id: 'daily_wellbeing',
          test_title: moodId,
          level: moodLabel,
          score: moodScore || 3,
          score_percent: (moodScore || 3) * 20,
          description: note || '',
          recommendation: habitsJson,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, created: true, entry: data });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
