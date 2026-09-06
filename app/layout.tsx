import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import {SITE_URL, HOME_TITLE, HOME_DESCRIPTION, SOCIAL_IMAGE} from '@/lib/seo';

const vietnam = Be_Vietnam_Pro({ variable: '--font-vietnam', weight: ['400', '500', '600', '700'], subsets: ['latin', 'vietnamese'], display: 'swap' });

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {canonical: '/'},
  robots: {index: true, follow: true},
  openGraph: {type: 'profile', locale: 'vi_VN', siteName: 'Hà Long Giang', title: HOME_TITLE, description: HOME_DESCRIPTION, url: '/', images: [{url: SOCIAL_IMAGE, width: 1419, height: 1109, alt: 'Minh họa Hà Long Giang, Founder BISC và 9Learning'}]},
  twitter: {card: 'summary_large_image', title: HOME_TITLE, description: HOME_DESCRIPTION, images: [SOCIAL_IMAGE]},
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className="dark"><body className={vietnam.variable}>{children}</body></html>;
}
