import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { sendNewsletterWelcomeEmail } from '@/lib/email';
import { requireRole } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src', 'data', 'subscribers.json');

async function readLocalSubscribers(): Promise<any[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeLocalSubscribers(data: any[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing subscribers.json:', err);
  }
}

export async function GET(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const itemsMap = new Map<string, any>();

    // 1. Fetch from Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: dbSubs, error } = await supabaseAdmin
        .from('test_results')
        .select('*')
        .eq('test_id', 'newsletter_subscriber')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(dbSubs)) {
        for (const row of dbSubs) {
          const email = (row.client_email || '').trim().toLowerCase();
          if (email) {
            itemsMap.set(email, {
              id: row.id,
              name: row.client_name || 'مشترك في النشرة',
              email: email,
              status: row.level || 'active',
              source: row.recommendation || 'website',
              created_at: row.created_at,
            });
          }
        }
      }
    }

    // 2. Merge with local
    const localData = await readLocalSubscribers();
    for (const item of localData) {
      const email = (item.email || '').trim().toLowerCase();
      if (email && !itemsMap.has(email)) {
        itemsMap.set(email, item);
      }
    }

    const subscribers = Array.from(itemsMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error('GET newsletter error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, source } = body;

    if (!email || !email.includes('@') || email.trim().length < 5) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان بريد إلكتروني صحيح' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || '').trim();
    const subSource = (source || 'footer_widget').trim();
    const nowIso = new Date().toISOString();
    const subId = `sub-${Date.now()}`;

    // 1. Check duplicate in Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from('test_results')
        .select('id, level')
        .eq('test_id', 'newsletter_subscriber')
        .eq('client_email', cleanEmail)
        .maybeSingle();

      if (existing) {
        if (existing.level !== 'active') {
          // Re-activate
          await supabaseAdmin
            .from('test_results')
            .update({ level: 'active', updated_at: nowIso })
            .eq('id', existing.id);
        }
        return NextResponse.json({
          success: true,
          message: 'أنت مسجل بالفعل في النشرة البريدية وسنكون على تواصل دائم معك 🌿',
        });
      }

      // Insert new subscriber
      await supabaseAdmin.from('test_results').insert({
        id: subId,
        client_name: cleanName || 'مشترك في النشرة',
        client_phone: '',
        client_email: cleanEmail,
        test_id: 'newsletter_subscriber',
        test_title: 'مشترك في النشرة الفكرية والإرشادية',
        score: 0,
        score_percent: 0,
        level: 'active',
        description: `انضمام عبر: ${subSource}`,
        recommendation: subSource,
        created_at: nowIso,
      });
    }

    // 2. Mirror to local subscribers
    const localList = await readLocalSubscribers();
    const existsLocally = localList.some((s) => (s.email || '').toLowerCase() === cleanEmail);
    if (!existsLocally) {
      localList.unshift({
        id: subId,
        name: cleanName || 'مشترك في النشرة',
        email: cleanEmail,
        status: 'active',
        source: subSource,
        created_at: nowIso,
      });
      await writeLocalSubscribers(localList);
    }

    // 3. Dispatch welcome email via Resend
    try {
      await sendNewsletterWelcomeEmail({
        to: cleanEmail,
        name: cleanName,
      });
    } catch (emailErr) {
      console.error('Welcome email dispatch error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تأكيد اشتراكك في النشرة البريدية بنجاح! تفقد بريدك الإلكتروني لرسالة الترحيب 🌿',
    });
  } catch (error) {
    console.error('POST newsletter error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الاشتراك' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (isSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('test_results').delete().eq('test_id', 'newsletter_subscriber');
      if (id) query = query.eq('id', id);
      else if (cleanEmail) query = query.eq('client_email', cleanEmail);
      await query;
    }

    const localList = await readLocalSubscribers();
    const filtered = localList.filter((s) => {
      if (id && s.id === id) return false;
      if (cleanEmail && (s.email || '').toLowerCase() === cleanEmail) return false;
      return true;
    });
    await writeLocalSubscribers(filtered);

    return NextResponse.json({ success: true, message: 'تم إلغاء الاشتراك بنجاح' });
  } catch (error) {
    console.error('DELETE newsletter error:', error);
    return NextResponse.json({ error: 'فشل في إلغاء الاشتراك' }, { status: 500 });
  }
}
