import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الاختبارات والمقاييس النفسية المجانية | جلال أحمد',
  description: 'استكشف اختبارات نفسية موثوقة ومجانية تمنحك فهماً أعمق لمشاعرك وصحتك النفسية، العلاقات، والنمط الشخصي، بإشراف المستشار جلال أحمد.',
  openGraph: {
    title: 'الاختبارات والمقاييس النفسية المجانية | جلال أحمد',
    description: 'أدوات تقييم وفحص ذاتي موثوقة ومجانية في الصحة النفسية، الشخصية، والعلاقات الأسرية.',
    url: 'https://www.galalahmad.com/tests',
    siteName: 'جلال أحمد',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.galalahmad.com/tests',
  },
};

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
