import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مقالات في الصحة النفسية وبناء الأسرة | جلال أحمد',
  description: 'مقالات وتأصيلات فكرية ونفسية للمستشار جلال أحمد في بناء الأسرة، سواء الفطرة، مشروع أقومية القرآن، وفك شفرات السلوك الإنساني لتحقيق الاتزان النفسي.',
  keywords: [
    'مقالات نفسية',
    'مشروع أقومية القرآن',
    'السلوك رسالة',
    'العلاقات الزوجية',
    'التربية بالرفق',
    'الصحة النفسية',
    'جلال أحمد'
  ],
  openGraph: {
    title: 'مقالات في الصحة النفسية وبناء الأسرة | جلال أحمد',
    description: 'مقالات ودراسات فكرية ونفسية تستلهم هدايات الوحي في بناء السواء النفسي والاستقرار الأسري.',
    url: 'https://www.galalahmad.com/articles',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-speaking.jpg',
        width: 1200,
        height: 630,
        alt: 'مقالات وبحوث جلال أحمد',
      },
    ],
    locale: 'ar_EG',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مقالات في الصحة النفسية وبناء الأسرة | جلال أحمد',
    description: 'تأصيلات فكرية ونفسية في هدايات الوحي وبناء الفطرة السوية واستقرار الأسرة.',
    images: ['/assets/dr-galal-speaking.jpg'],
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
