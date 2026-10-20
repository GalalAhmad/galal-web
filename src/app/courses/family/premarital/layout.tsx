import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رحلة رِفق | للمقبلين على الزواج — إعداد زواجي واعي | جلال أحمد',
  description: 'برنامج إعداد للمقبلين على الزواج، يساعدك على فهم الذات، وحسن اختيار شريك الحياة، وتطوير مهارات التواصل والاستعداد لبناء حياة زوجية مستقرة.',
  openGraph: {
    title: 'رحلة رِفق | للمقبلين على الزواج — جلال أحمد',
    description: 'برنامج عملي متدرج في 8 محطات للإعداد الواعي للزواج وبناء شراكة قائمة على المودة والرحمة.',
    url: 'https://www.galalahmad.com/courses/family/premarital',
    siteName: 'جلال أحمد',
    locale: 'ar_EG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.galalahmad.com/courses/family/premarital',
  },
};

export default function RifqPremaritalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
