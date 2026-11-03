import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    const isAdmin = searchParams.get('admin') === 'true';

    if (!phone && !email && !isAdmin) {
      return NextResponse.json({ success: true, entries: [] });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, entries: [] });
    }

    let query = supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('test_id', 'client_journal')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      if (phone && email) {
        query = query.or(`client_phone.eq.${phone},client_email.eq.${email}`);
      } else if (phone) {
        query = query.eq('client_phone', phone);
      } else if (email) {
        query = query.eq('client_email', email);
      }
    } else {
      // If admin, only show shared entries
      query = query.eq('level', 'shared');
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
    const body = await req.json();
    const { phone, email, name, title, content, sharedWithAdvisor, moodTag } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'نص الخاطرة أو الرسالة مطلوب' }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, message: 'حفظ محلي مؤقت' });
    }

    const entryId = `journal-${Date.now()}`;
    const isShared = sharedWithAdvisor !== false; // default to shared with advisor

    const { data, error } = await supabaseAdmin.from('test_results').insert({
      id: entryId,
      client_name: name || 'مستفيد',
      client_phone: phone || '',
      client_email: email || '',
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

    // If shared with advisor, create an admin alert notification
    if (isShared) {
      try {
        await supabaseAdmin.from('test_results').insert({
          id: `notif-admin-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          client_name: 'إشعار الإدارة',
          client_phone: 'admin',
          client_email: 'galalahmad1201@gmail.com',
          test_id: 'user_notification',
          test_title: `رسالة / خاطرة جديدة من الحالة: ${name || 'مستفيد'} 📝`,
          score: 0,
          score_percent: 0,
          level: 'unread',
          description: `أضافت الحالة تدوينة جديدة في ملفها الإكلينيكي: "${content.slice(0, 60)}..."`,
          recommendation: '/admin',
          created_at: new Date().toISOString(),
        });
      } catch (notifErr) {
        console.error('Journal admin notification error:', notifErr);
      }
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
