import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وشروط الحجز والإلغاء | جلال أحمد',
  description: 'سياسة الخصوصية وسرية الجلسات وشروط الاستخدام وسياسة الإلغاء وإعادة الجدولة المجانية حتى 24 ساعة للمستشار جلال أحمد، مع تنبيه إرشادات الطوارئ.',
  openGraph: {
    title: 'سياسة الخصوصية وشروط الحجز والإلغاء | جلال أحمد',
    description: 'معايير السرية والأمان المهني، وسياسة الإلغاء المجاني وإعادة الجدولة المرنة حتى 24 ساعة.',
    url: 'https://www.galalahmad.com/policies',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-speaking.jpg',
        width: 1200,
        height: 630,
        alt: 'سياسات وشروط الموقع — جلال أحمد',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سياسة الخصوصية وشروط الحجز والإلغاء | جلال أحمد',
    description: 'شروط استخدام الموقع وسياسات الخصوصية وإعادة الجدولة المرنة للجلسات الاستشارية.',
    images: ['/assets/dr-galal-speaking.jpg'],
  },
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
