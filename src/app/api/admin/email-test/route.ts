import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { to, subject, message } = body;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح RESEND_API_KEY غير مهيأ في الخادم' }, { status: 400 });
    }

    const targetEmail = to ? to.trim() : 'galalahmad1201@gmail.com';
    const emailSubject = subject || 'رسالة تجريبية من لوحة إدارة د. جلال أحمد';
    const fromAddress = process.env.RESEND_FROM_EMAIL || ' أحمد <onboarding@resend.dev>';

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
            <h2 style="margin: 0; font-size: 20px;"> أحـمد</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">اختبار نظام البريد الإلكتروني والإشعارات الرسمية</p>
          </div>
          <div class="content">
            <h3 style="color: #0F172A; margin-top: 0;">تهانينا، الاتصال البريدي يعمل بكفاءة كاملة! 🌿</h3>
            <p style="font-size: 14px; color: #334155;">
              هذه رسالة اختبارية تم إرسالها من لوحة الإدارة للتأكد من ربط مفتاح Resend الخاص بك بنجاح.
            </p>
            <div class="card">
              <strong style="color: #4E7E76; font-size: 13px;">نص الرسالة:</strong>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #1E293B; line-height: 1.7;">
                ${message || 'خدمة الإرسال اللحظي جاهزة لإرسال تأكيدات الحجوزات وروابط قاعات Google Meet وتكليفات المستفيدين.'}
              </p>
            </div>
            <p style="font-size: 12px; color: #64748B;">
              تاريخ الإرسال: ${new Date().toLocaleString('ar-EG')}
            </p>
          </div>
          <div class="footer">
            <p>© 2026 د. جلال أحمد — جميع الحقوق محفوظة</p>
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
      return NextResponse.json({
        error: data.message || 'فشل إرسال البريد',
        details: data,
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      to: targetEmail,
      message: 'تم إرسال الرسالة بنجاح عبر Resend',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
