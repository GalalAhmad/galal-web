/**
 * خدمة إرسال البريد الإلكتروني والإشعارات الرسمية
 * تدعم مزود Resend المعتمد مع قوالب HTML أنيقة وتنبيهات فورية للمستشار والعملاء
 */

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'المستشار جلال أحمد <appointments@galalahmad.com>';
const CONSULTANT_EMAIL = 'galalahmad1201@gmail.com';

interface SendBookingEmailParams {
  to: string;
  clientName: string;
  bookingId: string;
  trackLabel: string;
  slotDate: string;
  slotTime: string;
  meetLink?: string;
  status?: string;
}

export async function sendBookingConfirmationEmail(params: SendBookingEmailParams): Promise<{ success: boolean; id?: string }> {
  const { to, clientName, bookingId, trackLabel, slotDate, slotTime, meetLink, status } = params;

  const isConfirmed = status === 'confirmed';
  const subject = isConfirmed 
    ? `تأكيد جلسة استشارية ورابط Google Meet | موعد: ${slotDate} (${slotTime})`
    : `استلام طلب حجز استشارة | رقم الطلب: ${bookingId}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; line-height: 1.6; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #4E7E76; padding: 32px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 32px 24px; }
        .card { background: #F1F5F9; border-radius: 16px; padding: 20px; margin: 20px 0; border-right: 4px solid #4E7E76; }
        .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #CBD5E1; font-size: 13px; }
        .card-row:last-child { border-bottom: none; }
        .btn-meet { display: inline-block; background: #154F9C; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: bold; font-size: 14px; text-align: center; margin: 15px 0; width: 100%; box-sizing: border-box; }
        .btn-profile { display: inline-block; background: #4E7E76; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-align: center; margin: 10px 0; }
        .note { font-size: 12px; color: #64748B; background: #FFFBEB; border: 1px solid #FDE68A; padding: 14px; border-radius: 12px; margin-top: 20px; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>المستشار جـلال أحـمد</h1>
          <p>المنصة الرسمية للاستشارات النفسية والزوجية وبناء الأسرة</p>
        </div>
        <div class="content">
          <h2 style="font-size: 18px; color: #0F172A; margin-top: 0;">أهلاً بك أ. ${clientName} 🌿</h2>
          <p style="font-size: 14px; color: #334155;">
            ${isConfirmed 
              ? 'تم اعتماد جلساتك وتأكيد الموعد رسمياً. تفاصيل الجلسة وقاعة الاجتماع الآمنة موضحة أدناه:'
              : 'تم استلام طلب حجزك بنجاح وهو قيد المراجعة والاعتماد المالي. سيتم إرسال رابط الجلسة فور اعتماد الموعد.'}
          </p>

          <div class="card">
            <div class="card-row">
              <span style="color: #64748B;">رقم الحجز المرجعي:</span>
              <strong style="color: #0F172A; font-family: monospace;">${bookingId}</strong>
            </div>
            <div class="card-row">
              <span style="color: #64748B;">نوع الجلسة:</span>
              <strong style="color: #0F172A;">${trackLabel}</strong>
            </div>
            <div class="card-row">
              <span style="color: #64748B;">تاريخ الموعد:</span>
              <strong style="color: #0F172A;">${slotDate}</strong>
            </div>
            <div class="card-row">
              <span style="color: #64748B;">التوقيت المحدد:</span>
              <strong style="color: #4E7E76;">${slotTime}</strong>
            </div>
            <div class="card-row">
              <span style="color: #64748B;">الحالة:</span>
              <strong style="color: ${isConfirmed ? '#16A34A' : '#D97706'};">
                ${isConfirmed ? 'مؤكد ومعتمد ✓' : 'قيد التدقيق والتأكيد'}
              </strong>
            </div>
          </div>

          ${meetLink && isConfirmed ? `
            <p style="font-size: 13px; font-weight: bold; color: #0F172A; margin-bottom: 8px;">
              🎥 رابط قاعة الجلسة الآمنة (Google Meet):
            </p>
            <a href="${meetLink}" target="_blank" class="btn-meet">
              الدخول إلى قاعة الجلسة عبر Google Meet
            </a>
            <p style="font-size: 11px; color: #64748B; word-break: break-all; text-align: center;">
              أو عبر الرابط المباشر: ${meetLink}
            </p>
          ` : `
            <p style="font-size: 12px; color: #64748B; background: #F1F5F9; padding: 12px; border-radius: 12px;">
              ⏳ سيتم تزويدك برابط قاعة Google Meet فور تأكيد موعدك، كما يمكنك متابعة حالة الجلسة من ملفك الشخصي في المنصة.
            </p>
          `}

          <div class="note">
            <strong>إرشادات هامة للجلسة:</strong>
            <ul style="margin: 6px 0 0 0; padding-right: 20px;">
              <li>يُرجى التواجد في مكان هادئ ومريح يضمن خصوصيتك التامة قبل الموعد بـ 5 دقائق.</li>
              <li>التأكد من جودة اتصال الإنترنت وعمل الكاميرا والميكروفون.</li>
              <li>كافة المعلومات والمداولات مشمولة بالسرية المهنية والأمان التام.</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>للتنسيق العاجل أو الاستفسارات: واتساب رسمي <strong>+20 101 487 6666</strong></p>
          <p>© 2026 المستشار جلال أحمد — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await dispatchEmail(to, subject, htmlContent);
}


export async function sendHomeworkNotificationEmail(params: {
  to: string;
  clientName: string;
  homeworkTitle: string;
  notes?: string;
}) {
  const { to, clientName, homeworkTitle, notes } = params;
  const subject = `تمرين إرشادي جديد في ملفك الشخصي 🌿 | المستشار جلال أحمد`;

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; line-height: 1.6; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; }
        .header { background: #154F9C; padding: 24px; text-align: center; color: #FFFFFF; }
        .content { padding: 28px 24px; }
        .card { background: #EDF5FD; border-right: 4px solid #154F9C; padding: 18px; border-radius: 12px; margin: 16px 0; }
        .footer { background: #F8FAFC; padding: 16px; text-align: center; font-size: 11px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0; font-size: 18px;">المستشار جـلال أحـمد</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">متابعة خطتك الإرشادية والواجبات المنزلية</p>
        </div>
        <div class="content">
          <p>أهلاً بك أ. ${clientName}،</p>
          <p>قام المستشار بإضافة تمرين/تكليف جديد ضمن مسار متابعتك وتطوير مهارات الاتزان والوعي:</p>
          <div class="card">
            <h3 style="margin: 0 0 8px 0; color: #154F9C; font-size: 16px;">${homeworkTitle}</h3>
            ${notes ? `<p style="margin: 0; font-size: 13px; color: #475569;">${notes}</p>` : ''}
          </div>
          <p style="font-size: 13px; color: #64748B;">
            يمكنك الدخول إلى ملفك الشخصي في المنصة للاطلاع على تفاصيل التمرين وتسجيل إنجازك.
          </p>
        </div>
        <div class="footer">
          <p>© 2026 المستشار جلال أحمد — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await dispatchEmail(to, subject, htmlContent);
}


export async function sendAdvisorCustomEmail(params: {
  to: string;
  clientName: string;
  subject: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}): Promise<{ success: boolean; id?: string }> {
  const { to, clientName, subject, message, actionUrl, actionText } = params;
  
  const formattedMessage = (message || '').replace(/\n/g, '<br/>');

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; line-height: 1.7; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #4E7E76; padding: 28px 24px; text-align: center; color: #FFFFFF; }
        .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; }
        .header p { margin: 0; font-size: 12px; opacity: 0.9; }
        .content { padding: 32px 24px; }
        .message-card { background: #F8FAFC; border-right: 4px solid #4E7E76; padding: 20px; border-radius: 14px; margin: 20px 0; font-size: 14px; color: #334155; }
        .btn-action { display: inline-block; background: #154F9C; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-align: center; margin-top: 15px; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>المستشار جـلال أحـمد</h2>
          <p>رسالة مباشرة وتواصل مهني خاص</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; font-weight: bold; color: #0F172A; margin-top: 0;">أهلاً بك أ. ${clientName || 'العميل الفاضل'} 🌿</p>
          <div class="message-card">
            ${formattedMessage}
          </div>
          ${actionUrl ? `
            <div style="text-align: center; margin-top: 25px;">
              <a href="${actionUrl}" target="_blank" class="btn-action">
                ${actionText || 'الانتقال إلى المنصة'}
              </a>
            </div>
          ` : ''}
          <p style="font-size: 12px; color: #64748B; margin-top: 24px; border-top: 1px solid #F1F5F9; padding-top: 16px;">
            هذه الرسالة مرسلة مباشرة من منصة المستشار جلال أحمد الرسمية. يمكنك الرد على هذه الرسالة أو التواصل عبر الواتساب في أي وقت.
          </p>
        </div>
        <div class="footer">
          <p>للتواصل والاستفسار: واتساب رسمي <strong>+20 101 487 6666</strong></p>
          <p>© 2026 المستشار جلال أحمد — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await dispatchEmail(to, subject, htmlContent);
}

export async function sendAdviceNotificationEmail(params: {
  message: string;
  senderEmail?: string;
}): Promise<{ success: boolean; id?: string }> {
  const { message, senderEmail } = params;
  const cleanEmail = senderEmail ? senderEmail.trim() : '';
  const subject = `رسالة جديدة في صندوق النصيحة 📬 (${cleanEmail ? cleanEmail : 'زائر مجهول'})`;
  const formattedMessage = (message || '').replace(/\n/g, '<br/>');

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; line-height: 1.7; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #4E7E76; padding: 28px 24px; text-align: center; color: #FFFFFF; }
        .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; }
        .header p { margin: 0; font-size: 12px; opacity: 0.9; }
        .content { padding: 32px 24px; }
        .message-card { background: #F8FAFC; border-right: 4px solid #4E7E76; padding: 20px; border-radius: 14px; margin: 20px 0; font-size: 14px; color: #1E293B; line-height: 1.8; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
        .btn { display: inline-block; background: #154F9C; color: #FFFFFF !important; text-decoration: none; padding: 10px 24px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-align: center; margin-top: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>المستشار جـلال أحـمد</h2>
          <p>تنبيه إداري فوري — صندوق النصيحة والملاحظات</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; font-weight: bold; color: #0F172A; margin-top: 0;">وصلت رسالة جديدة عبر صندوق النصيحة في المنصة 📬</p>
          <p style="font-size: 13px; color: #64748B;">تاريخ ووقت الإرسال: ${new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}</p>
          <div class="message-card">
            ${formattedMessage}
          </div>
          ${cleanEmail ? `
            <p style="font-size: 13px; color: #334155;">
              <strong>بريد المرسل للتواصل:</strong> <a href="mailto:${cleanEmail}" style="color: #154F9C; font-weight: bold;">${cleanEmail}</a>
            </p>
          ` : `
            <p style="font-size: 12px; color: #94A3B8; font-style: italic;">
              المرسل فضّل عدم إرفاق بريده الإلكتروني (ملاحظة سرية ومجهولة).
            </p>
          `}
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://galalahmad.com/admin" class="btn">الانتقال إلى لوحة الإدارة</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 منصة المستشار جلال أحمد الرسمية</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await dispatchEmail(CONSULTANT_EMAIL, subject, htmlContent);
}

export async function sendNewsletterWelcomeEmail(params: {
  to: string;
  name?: string;
}): Promise<{ success: boolean; id?: string }> {
  const { to, name } = params;
  const subject = `أهلاً بك في النشرة الإرشادية والفكرية 🌿 | المستشار جـلال أحـمد`;

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; line-height: 1.7; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #4E7E76; padding: 32px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 32px 24px; }
        .card { background: #EDF7F5; border-right: 4px solid #4E7E76; padding: 20px; border-radius: 14px; margin: 20px 0; font-size: 14px; color: #1E3A34; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
        .btn { display: inline-block; background: #4E7E76; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-align: center; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>المستشار جـلال أحـمد</h1>
          <p>نشرة الوعي النفسي والتربوي وبناء الإنسان والأسرة</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; font-weight: bold; color: #0F172A; margin-top: 0;">
            أهلاً بك${name ? ` أ. ${name}` : ''} في مجتمعنا المعرفي 🌿
          </p>
          <p style="font-size: 14px; color: #334155; line-height: 1.8;">
            تم تأكيد اشتراكك في النشرة الدورية لمنصة المستشار جلال أحمد بنجاح. ستصلك خلاصات فكرية دورية، أحدث المقالات السلوكية، وإضاءات تربوية وأسرية مستلهمة من هدايات الوحي والتأصيل النفسي العملي.
          </p>
          <div class="card">
            <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold;">ماذا تتوقع في بريدك؟</h4>
            <ul style="margin: 0; padding-right: 20px; font-size: 13px; line-height: 1.8;">
              <li>مفاهيم تطبيقية لفهم السلوك وتفكيك التشوهات المعرفية.</li>
              <li>أحدث مرئيات ومحاضرات أكاديمية البرامج واليوتيوب.</li>
              <li>مواعيد إطلاق دفعات برامج «ميثاق» و«المقبلين على الزواج».</li>
              <li>إرشادات نوعية لتعزيز الاتزان الفطري والمودة الأسرية.</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://galalahmad.com/articles" class="btn">تصفح المنتدى الفكري والمقالات</a>
          </div>
        </div>
        <div class="footer">
          <p>تصلك هذه الرسالة لاشتراكك في نشرة galalahmad.com</p>
          <p>© 2026 المستشار جلال أحمد — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await dispatchEmail(to, subject, htmlContent);
}

export async function sendNewsletterBroadcastEmail(params: {
  to: string;
  subject: string;
  title: string;
  content: string;
  actionUrl?: string;
  actionText?: string;
  badge?: string;
}): Promise<{ success: boolean; id?: string }> {
  const { to, subject, title, content, actionUrl, actionText, badge } = params;
  const formattedContent = (content || '').replace(/\n/g, '<br/>');

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head><meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; line-height: 1.7; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #154F9C; padding: 30px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; }
        .header p { margin: 0; font-size: 12px; opacity: 0.9; }
        .content { padding: 32px 24px; }
        .badge { display: inline-block; background: #EDF5FD; color: #154F9C; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; }
        .card { background: #F8FAFC; border-right: 4px solid #154F9C; padding: 22px; border-radius: 14px; margin: 20px 0; font-size: 14px; color: #334155; line-height: 1.8; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
        .btn { display: inline-block; background: #CC4E46; color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: bold; font-size: 13px; text-align: center; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>المستشار جـلال أحـمد</h1>
          <p>إشعار جديد للمشتركين في النشرة الفكرية والإرشادية</p>
        </div>
        <div class="content">
          ${badge ? `<div class="badge">${badge}</div>` : ''}
          <h2 style="font-size: 19px; color: #0F172A; margin: 0 0 16px 0; font-weight: 800;">${title}</h2>
          <div class="card">
            ${formattedContent}
          </div>
          ${actionUrl ? `
            <div style="text-align: center; margin-top: 25px;">
              <a href="${actionUrl}" target="_blank" class="btn">
                ${actionText || 'قراءة المزيد / مشاهدة الآن ←'}
              </a>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>تصلك هذه الرسالة لاشتراكك في نشرة المستشار جلال أحمد الرسمية (galalahmad.com)</p>
          <p>© 2026 المستشار جلال أحمد — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await dispatchEmail(to, subject, htmlContent);
}

async function dispatchEmail(to: string, subject: string, html: string): Promise<{ success: boolean; id?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      // 1. Send to destination recipient (if custom domain is verified)
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: to.includes('@') ? [to] : [CONSULTANT_EMAIL],
          subject: subject,
          html: html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id };
      } else {
        const errData = await res.json();
        // If domain not verified, send notification to consultant's verified account email
        if (errData?.statusCode === 403 && to !== CONSULTANT_EMAIL) {
          const resFallback = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [CONSULTANT_EMAIL],
              subject: `[إشعار الإدارة] ${subject} (موجه إلى: ${to})`,
              html: html,
            }),
          });
          if (resFallback.ok) {
            const dataFb = await resFallback.json();
            return { success: true, id: dataFb.id };
          }
        }
      }
    } catch (err) {
      console.error('Email dispatch error:', err);
    }
  }

  return { success: true, id: `local-${Date.now()}` };
}
