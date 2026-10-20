import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مسار المؤسسات التعليمية والتربوية | مسارات بناء وتمكين — جلال أحمد',
  description: 'برامج وحقائب تدريبية متخصصة لتطوير الكوادر التعليمية والإدارية وبناء البيئات المدرسية والتربوية الآمنة والملهمة.',
  openGraph: {
    title: 'مسار المؤسسات التعليمية والتربوية — جلال أحمد',
    description: 'استشارات وتدريب للمدارس والمؤسسات التربوية لتأهيل المعلمين والمشرفين وبناء البيئة التربوية المتكاملة.',
    url: 'https://www.galalahmad.com/courses/institutions',
    siteName: 'جلال أحمد',
    locale: 'ar_EG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.galalahmad.com/courses/institutions',
  },
};

export default function InstitutionsTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
