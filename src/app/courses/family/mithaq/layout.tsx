import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رحلة رِفق | ميثاق — للمتزوجين | د. جلال أحمد',
  description: 'برنامج تدريبي وتوعوي للمتزوجين لبناء شراكة زوجية أكثر وعيًا واستقرارًا وتجديد المودة وإدارة الخلافات بحكمة ورحمة.',
  openGraph: {
    title: 'رحلة رِفق | ميثاق — للمتزوجين | د. جلال أحمد',
    description: 'برنامج عملي من 8 محطات للمتزوجين؛ البيوت لا تُبنى بحفلات الزفاف وحدها، بل بالوعي والمهارات والرفق.',
    url: 'https://www.galalahmad.com/courses/family/mithaq',
    siteName: 'د. جلال أحمد',
    locale: 'ar_EG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.galalahmad.com/courses/family/mithaq',
  },
};

export default function RifqMithaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
