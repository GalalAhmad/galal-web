import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مشروع أقومية القرآن في التربية | جـلال أحـمد',
  description: 'مشروع معرفي وتطبيقي ينطلق من القرآن الكريم وصحيح السنة لتقديم فهم تربوي عميق للإنسان يبدأ من القيم والمعاني والدوافع، من السلوك الظاهر إلى فهم الجذور وبناء الإنسان.',
  openGraph: {
    title: 'مشروع أقومية القرآن في التربية | جـلال أحـمد',
    description: 'تأصيل منهجي يرى الإنسان في كليته ويجعل الوحي مرجعية أصيلة في فهم التربية وبناء السواء الإنساني.',
    url: 'https://galalahmad.com/aqwameyat-quran',
  },
};

export default function AqwameyatQuranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
