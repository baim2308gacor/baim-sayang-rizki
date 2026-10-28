import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rizky Pratama — Personal Space',
  description: 'Ruang kecil untuk mengenal M. Rizky Pratama, hobinya, perjalanan sekolah, dan cita-citanya.',
  metadataBase: new URL('https://example.com'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
