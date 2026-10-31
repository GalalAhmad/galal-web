import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    // إرسال تنبيه تجريبي إلى سنتري للتأكد من وصول البيانات
    const eventId = Sentry.captureMessage('تجربة اتصال ناجحة مع مشروع جلال أحمد (galal-web)');
    
    return NextResponse.json({
      success: true,
      message: 'تم إرسال إشارة الفحص بنجاح إلى Sentry!',
      eventId,
      dsnConfigured: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    });
  } catch (error: any) {
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
