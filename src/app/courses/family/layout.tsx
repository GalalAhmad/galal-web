import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مسار الأسرة | مسارات بناء وتمكين — جلال أحمد',
  description: 'برامج مسار الأسرة المتخصصة في الإعداد الزواجي والشراكة الأسرية المستقرة؛ رحلة رفق للمقبلين على الزواج ورحلة رفق ميثاق للمتزوجين.',
  openGraph: {
    title: 'مسار الأسرة | مسارات بناء وتمكين — جلال أحمد',
    description: 'برامج عملية متخصصة لبناء بيوت تقوم على السكن والمودة والرحمة والشراكة الواعية.',
    url: 'https://www.galalahmad.com/courses/family',
    siteName: 'جلال أحمد',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.galalahmad.com/courses/family',
  },
};

export default function FamilyTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
