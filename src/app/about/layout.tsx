import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من أنا | جلال أحمد',
  description: 'تعرف على جلال أحمد: باحث ومستشار نفسي وتربوي مصنف من الهيئة السعودية للتخصصات الصحية (2025)، مؤسس منصات رفق ووصلة ومراكز مفهوم وإنسان بخبرة +18 عاماً.',
  keywords: [
    'من هو جلال أحمد',
    'جلال أحمد مستشار نفسي',
    'تصنيف الهيئة السعودية للتخصصات الصحية',
    'منصة رفق',
    'منصة وصلة',
    'مركز مفهوم',
    'مركز إنسان',
    'ماجستير علم النفس'
  ],
  openGraph: {
    title: 'من هو جلال أحمد؟ المؤهلات والمسيرة المهنية',
    description: 'المسيرة المهنية والاعتمادات الرسمية للالمستشار جلال أحمد: تصنيف الهيئة السعودية للتخصصات الصحية 2025، وتأسيس 4 منصات ومراكز استشارية.',
    url: 'https://www.galalahmad.com/about',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-portrait.webp',
        width: 700,
        height: 1000,
        alt: 'جلال أحمد — مستشار الصحة النفسية والتربوية',
      },
    ],
    locale: 'ar_EG',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'من هو جلال أحمد؟ المؤهلات والمسيرة المهنية',
    description: 'باحث ومستشار في الصحة النفسية والإرشاد الأسري والتربوي، ومطور برامج بناء الإنسان وتأهيل القيادات التعليمية.',
    images: ['/assets/dr-galal-portrait.webp'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
