import React from "react"
import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css' // ĐÃ SỬA: Lùi 1 cấp vì file này đã vào trong thư mục [lang]

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: '--font-montserrat', // Tạo biến CSS cho font
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', // Tạo biến CSS cho font
});

export const metadata: Metadata = {
  title: 'ZINITEK - Kỹ Thuật Cơ Khí Chính Xác',
  description: 'Giải pháp kỹ thuật chính xác cho sự xuất sắc trong công nghiệp. Gia công CNC, thiết kế khuôn mẫu, lập trình PLC và tự động hóa.',
  generator: 'v0.app',
  keywords: ['CNC', 'gia công chính xác', 'khuôn mẫu', 'PLC', 'tự động hóa', 'Zinitek', 'Bình Dương'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

// Danh sách các ngôn ngữ được hỗ trợ
export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }, { lang: 'jp' }, { lang: 'kr' }, { lang: 'cn' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }> // Next.js 15+ yêu cầu params là Promise
}) {
  const { lang } = await params;

  return (
    // ĐÃ SỬA: html lang sẽ thay đổi động theo URL
    <html lang={lang} className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}