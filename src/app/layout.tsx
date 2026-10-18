import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://galalahmad.com'),
  title: 'جلال أحمد | استشارات نفسية وتربوية وبناء الإنسان',
  description: 'الموقع الرسمي لـ جلال أحمد — استشاري الصحة النفسية والتربوية، ومؤسس مركز إنسان ومنصتي رفق ووصلة ومركز مفهوم. «ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ».',
  keywords: [
    'جلال أحمد',
    'استشارات نفسية',
    'إرشاد أسري وزواجي',
    'تأهيل المقبلين على الزواج',
    'رحلة رفق',
    'برنامج ميثاق',
    'تربية المراهقين',
    'مركز إنسان للتدريب والاستشارات',
    'منصة وصلة',
    'مركز مفهوم',
    'أقومية القرآن'
  ],
  authors: [{ name: 'جلال أحمد', url: 'https://galalahmad.com' }],
  openGraph: {
    title: 'جلال أحمد | استشارات وبناء الإنسان والأسرة',
    description: '«ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — السلوك رسالة قبل أن يكون مشكلة.. والوعي بداية التغيير.',
    url: 'https://galalahmad.com',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-speaking.jpg',
        width: 1200,
        height: 630,
        alt: 'جلال أحمد',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جلال أحمد | استشارات وبناء الإنسان والأسرة',
    description: '«ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — السلوك رسالة قبل أن يكون مشكلة.',
    images: ['/assets/dr-galal-speaking.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('galal_theme') || 'dark';
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-accent-500 selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
