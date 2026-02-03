import React from "react"
import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css' 

// TỐI ƯU HÓA FONT:
// 1. Giảm weights: Chỉ giữ lại 400 (thường), 600 (semi-bold), 700 (bold)
// 2. Thêm display: 'swap' để text hiện ra ngay lập tức
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"], 
  variable: '--font-montserrat',
  display: 'swap', //
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap', //
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
  ),
  title: {
    default: 'ZINITEK - Kỹ Thuật Cơ Khí Chính Xác & Tự Động Hóa',
    template: '%s | ZINITEK'
  },
  description: 'ZINITEK chuyên gia công CNC chính xác, thiết kế khuôn mẫu và giải pháp tự động hóa công nghiệp. Cam kết chất lượng cao, nâng tầm sản xuất.',
  generator: 'ByPhanTan',
  applicationName: 'ZINITEK',
  referrer: 'origin-when-cross-origin',
  keywords: ['gia công CNC', 'cơ khí chính xác', 'thiết kế khuôn mẫu', 'tự động hóa', 'Zinitek', 'Bình Dương'],
  authors: [{ name: 'ZINITEK Team' }],
  creator: 'ZINITEK',
  publisher: 'ZINITEK',
  openGraph: {
    title: 'ZINITEK - Kỹ Thuật Cơ Khí Chính Xác',
    description: 'Giải pháp kỹ thuật chính xác cho sự xuất sắc trong công nghiệp.',
    url: 'https://zinitek.com',
    siteName: 'ZINITEK',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ZINITEK Precision Engineering',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZINITEK - Kỹ Thuật Cơ Khí Chính Xác',
    description: 'Giải pháp kỹ thuật chính xác cho sự xuất sắc trong công nghiệp.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/icon-light.svg?v=2', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg?v=2', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: '/icon-light.svg',
    apple: '/icon-light.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon-light.svg',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }, { lang: 'jp' }, { lang: 'kr' }, { lang: 'cn' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-light.svg?v=1" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-light.svg" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}