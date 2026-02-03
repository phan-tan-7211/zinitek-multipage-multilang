import React from "react"
import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css' 

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: '--font-montserrat', 
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', 
});

export const metadata: Metadata = {
  // Thêm dòng này để cố định gốc tọa độ cho các file tĩnh
  metadataBase: new URL('http://localhost:3000'), 
  title: 'ZINITEK - Kỹ Thuật Cơ Khí Chính Xác',
  description: 'Giải pháp kỹ thuật chính xác cho sự xuất sắc trong công nghiệp...',
  generator: 'ByPhanTan',
  icons: {
    // Ép buộc trình duyệt tìm ở gốc / không phụ thuộc vào /[lang]
    icon: [
      { url: '/icon-light.svg?v=1', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg?v=1', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/icon-light.svg',
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
        {/* Dấu / ở đầu cực kỳ quan trọng để trình duyệt tìm ở gốc public */}
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