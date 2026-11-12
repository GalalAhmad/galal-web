import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من أنا | د. جلال أحمد',
  description: 'تعرف على د. جلال أحمد: باحث وأخصائي نفسي وتربوي مصنف من الهيئة السعودية للتخصصات الصحية (2025)، مؤسس منصات رفق ووصلة ومراكز مفهوم وإنسان بخبرة +18 عاماً.',
  keywords: [
    'من هو جلال أحمد',
    'د. جلال أحمد أخصائي نفسي',
    'تصنيف الهيئة السعودية للتخصصات الصحية',
    'منصة رفق',
    'منصة وصلة',
    'مركز مفهوم',
    'مركز إنسان',
    'ماجستير علم النفس'
  ],
  openGraph: {
    title: 'من أنا | د. جلال أحمد — المؤهلات والمسيرة المهنية',
    description: 'المسيرة المهنية والاعتمادات الرسمية لد. جلال أحمد: تصنيف الهيئة السعودية للتخصصات الصحية 2025، وتأسيس 4 منصات ومراكز استشارية.',
    url: 'https://www.galalahmad.com/about',
    siteName: 'د. جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-portrait.webp',
        width: 700,
        height: 1000,
        alt: 'د. جلال أحمد — اختصاصي الصحة النفسية والتربوية',
      },
    ],
    locale: 'ar_EG',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'من هو د. جلال أحمد؟ المؤهلات والمسيرة المهنية',
    description: 'باحث وأخصائي في الصحة النفسية والإرشاد الأسري والتربوي، ومطور برامج بناء الإنسان وتأهيل القيادات التعليمية.',
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
