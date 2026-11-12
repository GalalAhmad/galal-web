import { NextRequest, NextResponse } from 'next/server';
import { sendAdvisorCustomEmail } from '@/lib/email';
import { requireRole } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const authCheck = requireRole(req, ['admin', 'counselor']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await req.json();
    const { to, clientName, subject, message, actionUrl, actionText } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة: البريد، الموضوع، ونص الرسالة حقول مطلوبة' },
        { status: 400 }
      );
    }

    const result = await sendAdvisorCustomEmail({
      to,
      clientName: clientName || 'العميل الفاضل',
      subject,
      message,
      actionUrl,
      actionText,
    });

    return NextResponse.json({
      success: result.success,
      messageId: result.id,
      info: 'تم إرسال الرسالة بنجاح عبر Resend المعتمد',
    });
  } catch (err: any) {
    console.error('Admin send-email error:', err);
    return NextResponse.json(
      { error: err?.message || 'فشل إرسال الرسالة البريدية' },
      { status: 500 }
    );
  }
}
