import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'برامج تأهيل زواجي وتربية واعية ودعم نفسي | جلال أحمد',
  description: 'برامج تدريبية وورش عمل متخصصة في الإعداد الزواجي الشامل، الممارسات الوالدية الفعالة، والصلابة النفسية مع المستشار جلال أحمد. سجل اهتمامك وانضم الآن.',
  keywords: [
    'برنامج ميثاق',
    'رحلة رفق',
    'برنامج مساحة',
    'تأهيل المقبلين على الزواج',
    'تربية واعية',
    'ورش عمل نفسية',
    'كورسات أسرية أونلاين',
    'جلال أحمد'
  ],
  openGraph: {
    title: 'برامج تأهيل زواجي وتربية واعية ودعم نفسي | جلال أحمد',
    description: 'كتالوج البرامج التدريبية المعتمدة للمستشار جلال أحمد: رحلة رفق، برنامج ميثاق، وبرنامج مساحة للدعم النفسي.',
    url: 'https://www.galalahmad.com/courses',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/illustrations/course-mithaq.svg',
        width: 1200,
        height: 630,
        alt: 'الكورسات والبرامج التدريبية — جلال أحمد',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'برامج تأهيل زواجي وتربية واعية ودعم نفسي | جلال أحمد',
    description: 'برامج تدريبية وتطبيقية مركزة في التربية والزواج وبناء الاتزان الذاتي.',
    images: ['/assets/illustrations/course-mithaq.svg'],
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
