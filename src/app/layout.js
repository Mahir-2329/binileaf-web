import { fontVariables } from './fonts';
import './globals.css';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileActionBar from '@/components/layout/MobileActionBar';
import JsonLd from '@/components/seo/JsonLd';

import { site } from '@/data/site';
import { cafeSchema, websiteSchema } from '@/lib/seo';
import { mediaSrc } from '@/lib/media';

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'Binileaf',
    'Binileaf Cafe',
    'cafe in Ahmedabad',
    'University Area cafe',
    'coffee shop Ahmedabad',
    'masala chai Ahmedabad',
    'matcha Ahmedabad',
    'cafe franchise India',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'food',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport = {
  themeColor: '#152B4F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Media URLs are opaque tokens minted on the server, which the client
 * components that draw the brand cannot compute for themselves. The two marks
 * used as CSS masks are handed down as custom properties — one place to set
 * them, reachable from any stylesheet or inline style, server or client — and
 * the header takes the same files as a prop for the `<Image>` it renders.
 */
const brand = {
  wordmark: mediaSrc('/media/brand/wordmark-text.png'),
  mark: mediaSrc('/media/brand/mark.png'),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={fontVariables}
      style={{
        '--mask-wordmark': `url(${brand.wordmark})`,
        '--mask-mark': `url(${brand.mark})`,
      }}
    >
      <body className="grain">
        <JsonLd id="ld-cafe" data={cafeSchema()} />
        <JsonLd id="ld-website" data={websiteSchema()} />

        <Header brand={brand} />

        <main id="main">{children}</main>

        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
