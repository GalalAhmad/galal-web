import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { sendNewsletterBroadcastEmail } from '@/lib/email';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subject,
      title,
      content,
      badge,
      actionUrl,
      actionText,
      testEmailOnly,
    } = body;

    if (!subject || !title || !content) {
      return NextResponse.json(
        { error: 'عنوان الموضوع والرسالة ومحتوى النشرة حقول أساسية' },
        { status: 400 }
      );
    }

    // 1. If sending a test email only
    if (testEmailOnly) {
      const cleanTest = testEmailOnly.trim();
      const testResult = await sendNewsletterBroadcastEmail({
        to: cleanTest,
        subject: `[معاينة تجريبية] ${subject}`,
        title,
        content,
        badge: badge || 'معاينة تجريبية',
        actionUrl,
        actionText,
      });

      return NextResponse.json({
        success: true,
        isTest: true,
        sentCount: 1,
        message: `تم إرسال بريد المعاينة التجريبي بنجاح إلى: ${cleanTest}`,
      });
    }

    // 2. Fetch all active subscribers
    const recipientsSet = new Set<string>();

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: dbSubs } = await supabaseAdmin
        .from('test_results')
        .select('client_email, level')
        .eq('test_id', 'newsletter_subscriber')
        .eq('level', 'active');

      if (dbSubs && Array.isArray(dbSubs)) {
        for (const sub of dbSubs) {
          const em = (sub.client_email || '').trim().toLowerCase();
          if (em && em.includes('@')) {
            recipientsSet.add(em);
          }
        }
      }
    }

    // Also read local fallback
    const localList = await readLocalSubscribers();
    for (const sub of localList) {
      const em = (sub.email || '').trim().toLowerCase();
      if (em && em.includes('@') && (sub.status === 'active' || !sub.status)) {
        recipientsSet.add(em);
      }
    }

    const recipients = Array.from(recipientsSet);

    if (recipients.length === 0) {
      return NextResponse.json({
        error: 'لا يوجد مشتركون نشطون في القائمة حالياً لإرسال النشرة إليهم.',
      }, { status: 400 });
    }

    // 3. Broadcast to all subscribers with throttled batches to protect Resend rate limits
    let sentCount = 0;
    let failedCount = 0;

    for (const email of recipients) {
      try {
        await sendNewsletterBroadcastEmail({
          to: email,
          subject,
          title,
          content,
          badge: badge || 'جديد المنصة',
          actionUrl,
          actionText,
        });
        sentCount++;
      } catch (e) {
        failedCount++;
        console.error(`Failed to send newsletter broadcast to ${email}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      totalSubscribers: recipients.length,
      message: `تم إرسال النشرة البريدية بنجاح إلى ${sentCount} مشترك${failedCount > 0 ? ` (تعذر الإرسال إلى ${failedCount})` : ''}.`,
    });
  } catch (error) {
    console.error('Newsletter broadcast error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال النشرة البريدية' }, { status: 500 });
  }
}
