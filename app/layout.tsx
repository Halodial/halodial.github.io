import type { Metadata, Viewport } from 'next';
import { Onest, Unbounded } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const display = Unbounded({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-display' });
const body = Onest({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });

const description = 'A dial that opens under your pointer. Drag a file, hold ⌘, and convert, edit, share or file it without opening another app. For macOS.';

export const metadata: Metadata = {
  metadataBase: new URL('https://halodial.github.io'),
  title: 'Halodial',
  description,
  icons: { icon: '/assets/favicon.svg', apple: '/assets/icon-256.png' },
  openGraph: {
    title: 'Halodial',
    description: 'Everything you do with a file, one flick away. A dial for your Mac that opens under your pointer.',
    images: '/assets/og.png',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#050608', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
