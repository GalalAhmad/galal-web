import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://galalahmad.com'),
  title: 'جلال أحمد | استشارات نفسية وتربوية وبناء الإنسان والأسرة',
  description: 'الموقع الرسمي لـ جلال أحمد — استشاري الصحة النفسية والتربوية، ومؤسس مركز إنسان ومنصتي رفق ووصلة ومركز مفهوم. «ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ».',
  keywords: [
    'جلال أحمد',
    'Galal Ahmad',
    'استشارات نفسية',
    'إرشاد أسري وزواجي',
    'تأهيل المقبلين على الزواج',
    'رحلة رفق',
    'برنامج ميثاق',
    'تربية المراهقين',
    'مركز إنسان للتدريب والاستشارات',
    'منصة وصلة',
    'مركز مفهوم',
    'أقومية القرآن',
    'ذات وموضوع',
    'كتاب ظلي'
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'جلال أحمد | Galal Ahmad',
  url: 'https://galalahmad.com',
  logo: 'https://galalahmad.com/assets/logo.png',
  image: 'https://galalahmad.com/assets/dr-galal-speaking.jpg',
  description: 'استشارات نفسية وتربوية، إرشاد زواجي، تأهيل المقبلين على الزواج، وتطوير المدارس والمؤسسات التعليمية.',
  telephone: '+201014876666',
  email: 'info@galalahmad.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'القاهرة',
    addressCountry: 'EG'
  },
  sameAs: [
    'https://share.google/mcjTrK9P6DPRb07Z0',
    'https://linkedin.com/in/galal3hmad/',
    'https://www.google.com/search?kgmid=/g/11p_0131cq'
  ]
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
