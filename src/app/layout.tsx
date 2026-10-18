import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://galalahmad.com'),
  title: 'د. جلال أحمد | استشارات نفسية وتربوية وإرشاد أسري',
  description: 'الموقع الرسمي لد. جلال أحمد — استشاري الصحة النفسية والتربوية، ومؤسس مركز إنسان. استشارات فردية وزوجية، إرشاد المراهقين، وبرامج رحلة رِفق وميثاق للأسرة.',
  keywords: [
    'دكتور جلال أحمد',
    'استشارات نفسية',
    'إرشاد أسري وزواجي',
    'تأهيل المقبلين على الزواج',
    'رحلة رفق',
    'برنامج ميثاق',
    'تربية المراهقين',
    'مركز إنسان للتدريب والاستشارات',
    'أقومية القرآن'
  ],
  authors: [{ name: 'د. جلال أحمد', url: 'https://galalahmad.com' }],
  openGraph: {
    title: 'د. جلال أحمد | استشارات نفسية وتربوية',
    description: 'السلوك رسالة قبل أن يكون مشكلة.. والوعي بداية التغيير. استشارات وجلسات مهنية للأفراد والأسر والمدارس.',
    url: 'https://galalahmad.com',
    siteName: 'د. جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-speaking.jpg',
        width: 1200,
        height: 630,
        alt: 'د. جلال أحمد',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'د. جلال أحمد | استشارات نفسية وتربوية',
    description: 'السلوك رسالة قبل أن يكون مشكلة.. والوعي بداية التغيير.',
    images: ['/assets/dr-galal-speaking.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/assets/logo.png" />
      </head>
      <body className="antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
