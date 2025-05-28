import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

// Font optimizasyonu
const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Coffy Coin | Blockchain Bazlı Kahve Ekosistemi',
  description: 'Coffy Coin, kripto para dünyasını kahve endüstrisiyle birleştiren yenilikçi bir blockchain projesidir. Stake yapın, kazanın ve kahve ekosistemini destekleyin.',
  keywords: 'coffy coin, kripto para, blockchain, kahve, staking, defi, token',
  openGraph: {
    title: 'Coffy Coin | Blockchain Bazlı Kahve Ekosistemi',
    description: 'Coffy Coin, kripto para dünyasını kahve endüstrisiyle birleştiren yenilikçi bir blockchain projesidir.',
    url: 'https://coffycoin.com',
    siteName: 'Coffy Coin',
    images: [
      {
        url: '/images/coffy-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Coffy Coin Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffy Coin | Blockchain Bazlı Kahve Ekosistemi',
    description: 'Coffy Coin, kripto para dünyasını kahve endüstrisiyle birleştiren yenilikçi bir blockchain projesidir.',
    images: ['/images/coffy-twitter-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#D4A017',
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Mobil cihazlar için ekran iyileştirmesi */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:top-0 focus:left-0 focus:z-50 focus:bg-[#D4A017] focus:text-white">
          İçeriğe geç
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
