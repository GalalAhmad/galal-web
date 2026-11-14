import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حجز جلسة استشارية أونلاين | د. جلال أحمد',
  description: 'احجز موعد جلستك الاستشارية النفسية أو الزوجية أو الأسرية أونلاين عبر خطوات آمنة وسرية تامة من أي مكان في العالم عبر Google Meet.',
  alternates: {
    canonical: 'https://www.galalahmad.com/booking',
  },
  openGraph: {
    title: 'حجز جلسة استشارية أونلاين | د. جلال أحمد',
    description: 'احجز موعد جلستك الاستشارية النفسية أو الزوجية أو الأسرية أونلاين عبر خطوات آمنة وسرية تامة من أي مكان في العالم عبر Google Meet.',
    url: 'https://www.galalahmad.com/booking',
    siteName: 'د. جلال أحمد للاستشارات',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
