import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مسار الشباب - المكلفين | مسارات بناء وتمكين — د. جلال أحمد',
  description: 'برامج توعوية وبنائية متخصصة لليافعين والشباب لتعزيز الوعي بالذات، وبناء الهوية، وإدارة مرحلة التكليف والمسؤولية، والصلابة النفسية.',
  openGraph: {
    title: 'مسار الشباب - المكلفين — د. جلال أحمد',
    description: 'برامج تمكين الشباب واليافعين لبناء الوعي بالذات، والصلابة النفسية، وإدارة المسؤولية والتكليف.',
    url: 'https://www.galalahmad.com/courses/youth',
    siteName: 'د. جلال أحمد',
    locale: 'ar_EG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.galalahmad.com/courses/youth',
  },
};

export default function YouthTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
