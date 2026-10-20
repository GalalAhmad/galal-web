import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.galalahmad.com'),
  title: 'جلال أحمد | استشارات نفسية وزوجية وتربوية أونلاين',
  description: 'احجز جلستك الاستشارية أونلاين مع جلال أحمد. استشارات نفسية فردية، إرشاد أسري وزواجي، وتربية بالرفق في بيئة آمنة وسرية تامة عبر Google Meet لجميع دول العالم.',
  keywords: [
    'جلال أحمد',
    'Galal Ahmad',
    'استشارات نفسية أونلاين',
    'استشارات زوجية',
    'إرشاد أسري',
    'تربية واعية',
    'رحلة رفق',
    'برنامج ميثاق',
    'أخصائي مساعد علم نفس',
    'الهيئة السعودية للتخصصات الصحية',
    'مركز إنسان',
    'منصة وصلة',
    'مركز مفهوم',
    'مشروع أقومية القرآن'
  ],
  authors: [{ name: 'جلال أحمد', url: 'https://www.galalahmad.com' }],
  openGraph: {
    title: 'جلال أحمد | استشارات نفسية وزوجية وتربوية أونلاين',
    description: 'احجز جلستك الاستشارية أونلاين مع جلال أحمد. استشارات نفسية فردية، إرشاد أسري وزواجي، وتربية بالرفق في بيئة آمنة وسرية تامة عبر Google Meet.',
    url: 'https://www.galalahmad.com',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-speaking.jpg',
        width: 1200,
        height: 630,
        alt: 'جلال أحمد — استشارات وبناء الإنسان والأسرة',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جلال أحمد | استشارات نفسية وزوجية وتربوية أونلاين',
    description: 'استشارات نفسية وزوجية وتربوية أونلاين في بيئة آمنة وسرية تامة مع المستشار جلال أحمد.',
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
    'https://linkedin.com/in/galal3hmad/',
    'https://www.google.com/search?kgmid=/g/11p_0131cq'
  ]
};

import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4E7E76" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="جلال أحمد" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('galal_theme') || 'light';
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
          <FloatingWhatsApp />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
