import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin', 'counselor']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const { to, subject, message } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح RESEND_API_KEY غير مهيأ في الخادم' }, { status: 400 });
    }

    const targetEmail = to ? to.trim() : 'galalahmad1201@gmail.com';
    const emailSubject = subject || 'رسالة تجريبية من لوحة إدارة د. جلال أحمد';
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'د. جلال أحمد <appointments@galalahmad.com>';

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head><meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #FAFCFA; color: #1E293B; margin: 0; padding: 24px; text-align: right; }
          .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
          .header { background: #4E7E76; padding: 28px 24px; text-align: center; color: #FFFFFF; }
          .content { padding: 32px 24px; }
          .card { background: #EDF7F5; border-right: 4px solid #4E7E76; padding: 18px; border-radius: 12px; margin: 20px 0; }
          .footer { background: #F8FAFC; padding: 16px; text-align: center; font-size: 11px; color: #94A3B8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; font-size: 20px;">د. جلال أحمد</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">اختبار نظام البريد الإلكتروني والإشعارات الرسمية</p>
          </div>
          <div class="content">
            <h3 style="color: #0F172A; margin-top: 0;">تهانينا، الاتصال البريدي يعمل بكفاءة كاملة! 🌿</h3>
            <p style="font-size: 14px; color: #334155;">
              هذه رسالة اختبارية تم إرسالها من لوحة الإدارة للتأكد من ربط مفتاح Resend الخاص بك بنجاح.
            </p>
            <div class="card">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #4E7E76;">تفاصيل البث التجريبي:</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>المرسل:</strong> ${fromAddress}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>المستلم:</strong> ${targetEmail}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>التوقيت:</strong> ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</p>
              ${message ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px dashed #CBD5E1; font-size: 13px;"><strong>رسالة مخصصة:</strong> ${message}</p>` : ''}
            </div>
          </div>
          <div class="footer">
            منظومة د. جلال أحمد للاستشارات النفسية وتطوير الأسرة &copy; ${new Date().getFullYear()}
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [targetEmail],
        subject: emailSubject,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend test API error:', data);
      return NextResponse.json({ error: data.message || 'فشل إرسال البريد عبر Resend' }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      messageId: data.id,
      info: `تم إرسال بريد الاختبار بنجاح إلى ${targetEmail}`,
    });
  } catch (error: any) {
    console.error('Email test route error:', error);
    return NextResponse.json({ error: error?.message || 'حدث خطأ أثناء إرسال بريد الاختبار' }, { status: 500 });
  }
}
