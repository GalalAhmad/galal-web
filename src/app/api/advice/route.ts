import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { sendAdviceNotificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src', 'data', 'advice.json');

async function readLocalAdvice() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeLocalAdvice(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Vercel serverless functions have a read-only filesystem; Supabase is the primary cloud store
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    // Privacy Guard: Only admin can view submitted confidential advice messages
    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالوصول لصندوق الاستشارات' }, { status: 403 });
    }

    const itemsMap = new Map<string, any>();

    // 1. Fetch from Supabase cloud database
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: dbAdvice } = await supabaseAdmin
        .from('test_results')
        .select('*')
        .eq('test_id', 'advice_message')
        .order('created_at', { ascending: false });

      if (dbAdvice) {
        for (const row of dbAdvice) {
          itemsMap.set(row.id, {
            id: row.id,
            message: row.description,
            email: row.client_email || '',
            status: row.level || 'new',
            created_at: row.created_at,
          });
        }
      }
    }

    // 2. Fetch from local file if available
    const localData = await readLocalAdvice();
    for (const item of localData) {
      if (!itemsMap.has(item.id)) {
        itemsMap.set(item.id, item);
      }
    }

    const advice = Array.from(itemsMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, advice });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read advice messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, email } = body;

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'يرجى كتابة رسالة واضحة لا تقل عن 5 أحرف' },
        { status: 400 }
      );
    }

    const id = `adv-${Date.now()}`;
    const cleanMessage = message.trim();
    const cleanEmail = email ? email.trim() : '';
    const nowIso = new Date().toISOString();

    const newItem = {
      id,
      message: cleanMessage,
      email: cleanEmail,
      status: 'new',
      created_at: nowIso,
    };

    let savedCloud = false;

    // 1. Primary Cloud Persistence: Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('test_results').insert({
        id,
        client_name: 'مشارك في صندوق النصيحة',
        client_phone: '',
        client_email: cleanEmail,
        test_id: 'advice_message',
        test_title: 'ملاحظة سرية عبر صندوق النصيحة',
        score: 0,
        score_percent: 0,
        level: 'new',
        description: cleanMessage,
        recommendation: '',
        created_at: nowIso,
      }).select();

      if (!error && data) {
        savedCloud = true;
      }
    }

    // 2. Local fallback storage
    const currentList = await readLocalAdvice();
    currentList.unshift(newItem);
    await writeLocalAdvice(currentList);

    // 3. Instant Email Notification to the Consultant via Resend
    try {
      await sendAdviceNotificationEmail({
        message: cleanMessage,
        senderEmail: cleanEmail,
      });
    } catch (e) {
      console.error('Advice email dispatch error:', e);
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Advice submit storage error');
    return NextResponse.json(
      { error: 'تعذر حفظ الرسالة حالياً، يرجى المحاولة بعد قليل أو التواصل عبر الواتساب.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالحذف' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'معرّف الرسالة مطلوب' }, { status: 400 });
    }

    // Delete from Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin.from('test_results').delete().eq('id', id);
    }

    // Delete from local
    const currentList = await readLocalAdvice();
    const filtered = currentList.filter((item: any) => item.id !== id);
    await writeLocalAdvice(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete advice item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بتعديل الحالة' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // Update in Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      await supabaseAdmin
        .from('test_results')
        .update({ level: status })
        .eq('id', id);
    }

    // Update in local
    const currentList = await readLocalAdvice();
    const idx = currentList.findIndex((item: any) => item.id === id);
    if (idx !== -1) {
      currentList[idx].status = status;
      await writeLocalAdvice(currentList);
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update advice status' }, { status: 500 });
  }
}
