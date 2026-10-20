import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة إدارة الموقع | المستشار جلال أحمد',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
