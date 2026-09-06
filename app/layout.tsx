import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const vietnam = Be_Vietnam_Pro({ variable: '--font-vietnam', weight: ['400', '500', '600', '700'], subsets: ['latin', 'vietnamese'], display: 'swap' });

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: 'Hà Long Giang | Quản trị, tài chính & phát triển bền vững',
  description: 'Khám phá chuyên môn và hành trình của thầy Hà Long Giang trong quản trị doanh nghiệp, kiểm soát nội bộ, quản lý rủi ro, tài chính, M&A và ESG.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className="dark"><body className={vietnam.variable}>{children}</body></html>;
}
