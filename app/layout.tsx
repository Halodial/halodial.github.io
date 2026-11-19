import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SiteDial from '@/components/SiteDial';
import Search from '@/components/Search';
import PageTransition, { ARRIVE_SCRIPT } from '@/components/PageTransition';
import './globals.css';

// One family: Manrope ExtraBold for headings, Regular to Semibold for everything else.
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope' });

const description = 'A dial that opens under your pointer. Drag a file, hold ⌘, and convert, edit, share or file it without opening another app. For macOS.';

export const metadata: Metadata = {
  metadataBase: new URL('https://halodial.github.io'),
  title: { default: 'Halodial', template: '%s · Halodial' },
  description,
  icons: { icon: '/assets/favicon.svg', apple: '/assets/icon-256.png' },
  openGraph: {
    title: { default: 'Halodial', template: '%s · Halodial' },
    description: 'Everything you do with a file, one flick away. A dial for your Mac that opens under your pointer.',
    images: '/assets/og.png',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#111111', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: ARRIVE_SCRIPT }} /></head>
      <body>
        <SmoothScroll />
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
        <SiteDial />
        <Search />
        <PageTransition />
      </body>
    </html>
  );
}
