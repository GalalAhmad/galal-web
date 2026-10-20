import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مشروع أقومية القرآن في التربية | جـلال أحـمد',
  description: 'الوثيقة الشاملة لمشروع أقومية القرآن في التربية: من السلوك الظاهر إلى فهم الجذور وبناء الإنسان.',
  alternates: {
    canonical: 'https://www.galalahmad.com/aqwameyat-quran',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'مشروع أقومية القرآن في التربية | جـلال أحـمد',
    description: 'الوثيقة المنهجية الكاملة لمشروع أقومية القرآن.',
    url: 'https://www.galalahmad.com/aqwameyat-quran',
  },
};

export default function AqwamiyyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
