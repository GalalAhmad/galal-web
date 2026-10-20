import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'استشارات نفسية فردية وزوجية وتربوية أونلاين | جلال أحمد',
  description: 'استكشف خدمات الاستشارات النفسية الفردية، والعلاقات الزوجية، والإرشاد الوالدي والتربوي، والحجز الطارئ خلال 24 ساعة مع المستشار جلال أحمد عبر لقاءات فيديو مشفرة.',
  openGraph: {
    title: 'استشارات نفسية فردية وزوجية وتربوية أونلاين | جلال أحمد',
    description: 'جلسات استشارية متخصصة في مساحات استماع آمنة ومحكمة السرية عبر Google Meet لجميع دول العالم.',
    url: 'https://www.galalahmad.com/services',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/arabtherapy/couple-animation.svg',
        width: 1200,
        height: 630,
        alt: 'خدمات الاستشارات النفسية والتربوية — جلال أحمد',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'استشارات نفسية فردية وزوجية وتربوية أونلاين | جلال أحمد',
    description: 'استكشف مسارات الاستشارات النفسية الفردية والزوجية والتربوية والحجز الطارئ عبر لقاءات أونلاين مشفرة.',
    images: ['/assets/arabtherapy/couple-animation.svg'],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
