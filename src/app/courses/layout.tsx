import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مسارات بناء وتمكين | جلال أحمد',
  description: 'مسارات تدريبية وتطبيقية متقدمة في الأسرة وبناء الشراكة الزوجية، المؤسسات التعليمية، وتأهيل الشباب والمكلفين مع المستشار جلال أحمد.',
  keywords: [
    'مسارات بناء وتمكين',
    'مسار الأسرة',
    'رحلة رفق ميثاق',
    'رحلة رفق للمقبلين على الزواج',
    'مسار المؤسسات التعليمية',
    'مسار الشباب والمكلفين',
    'استشارات أسرية',
    'جلال أحمد'
  ],
  openGraph: {
    title: 'مسارات بناء وتمكين | جلال أحمد',
    description: 'مسارات تدريبية وتأهيلية معتمدة: مسار الأسرة والزواج، مسار المؤسسات التعليمية، ومسار الشباب والمكلفين.',
    url: 'https://www.galalahmad.com/courses',
    siteName: 'جلال أحمد',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مسارات بناء وتمكين | جلال أحمد',
    description: 'مسارات تدريبية وتطبيقية متكاملة في التربية والزواج وبناء الإنسان الأسري والمؤسسي.',
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
