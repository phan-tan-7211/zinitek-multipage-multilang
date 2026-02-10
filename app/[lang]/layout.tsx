// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
import React from "react"
import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css' 
import TrackingProvider from "@/components/analytics";
import { SmartSwipeWrapper } from "@/components/smart-swipe-wrapper"

// IMPORT CÁC COMPONENT ĐIỀU HƯỚNG VÀ CHỈ BÁO
import { Navigation } from "@/components/navigation"
import { MobileWidgetIndicator } from "@/components/mobile-widget-indicator"
import { getDictionary } from "@/lib/get-dictionary"

// TỐI ƯU HÓA FONT:
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"], 
  variable: '--font-montserrat',
  display: 'swap', 
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap', 
});

// --- TỐI ƯU SEO QUỐC TẾ (DYNAMIC METADATA) ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> // Sửa: params là Promise
}): Promise<Metadata> {
  // BẮT BUỘC: Phải await params trước khi dùng
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  const dict = await getDictionary(lang);

  // Xử lý loại bỏ thẻ HTML <span> khỏi description để SEO đẹp hơn
  const cleanDescription = dict.hero.description.replace(/<[^>]*>?/gm, '');
  const siteTitle = `ZINITEK - ${dict.hero.title_line1} ${dict.hero.title_highlight}`;

  return {
    metadataBase: new URL(
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    ),
    title: {
      default: siteTitle,
      template: `%s | ZINITEK`
    },
    description: cleanDescription,
    keywords: ['CNC Machining', 'Precision Engineering', 'Mold Design', 'Automation', 'Zinitek', 'Bình Dương', 'Vietnam Factory'],
    authors: [{ name: 'ZINITEK Team' }],
    
    // Thẻ Hreflang giúp Google nhận diện các bản dịch khác nhau
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'vi-VN': '/vi',
        'en-US': '/en',
        'ja-JP': '/jp',
        'ko-KR': '/kr',
        'zh-CN': '/cn',
      },
    },

    openGraph: {
      title: siteTitle,
      description: cleanDescription,
      url: `/${lang}`,
      siteName: 'ZINITEK',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
      locale: lang,
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: cleanDescription,
      images: ['/og-image.jpg'],
    },

    icons: {
      icon: [
        { url: '/icon-light.svg?v=2', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark.svg?v=2', media: '(prefers-color-scheme: dark)' },
      ],
      shortcut: '/icon-light.svg',
      apple: '/icon-light.svg',
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
}

export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }, { lang: 'jp' }, { lang: 'kr' }, { lang: 'cn' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }> // Sửa: params là Promise
}) {
  // BẮT BUỘC: Phải await params trước khi dùng
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  // FETCH DỮ LIỆU NGÔN NGỮ
  const dict = await getDictionary(lang)

  return (
    <html lang={lang} className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Hreflang x-default cho các ngôn ngữ không xác định sẽ về tiếng Anh */}
        <link rel="alternate" href="/en" hrefLang="x-default" />
        <link rel="icon" href="/icon-light.svg?v=1" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-light.svg" />
      </head>
      
      <body className="font-sans antialiased bg-[#020617] text-white">
        {/* 1. NAVIGATION CỐ ĐỊNH Ở TRÊN */}
        <Navigation lang={lang} dict={dict} />

        {/* 2. WRAPPER QUẢN LÝ VUỐT CHUYỂN TRANG (MOBILE OPTIMIZED) */}
        <SmartSwipeWrapper lang={lang}>
          <main className="min-h-screen">
            {children}
          </main>
        </SmartSwipeWrapper>

        {/* 3. CHỈ BÁO WIDGET MOBILE CỐ ĐỊNH Ở DƯỚI */}
        <MobileWidgetIndicator lang={lang} dict={dict} />

        {/* CÁC CÔNG CỤ THEO DÕI & PHÂN TÍCH */}
        <Analytics />
        <TrackingProvider />
      </body>
    </html>
  )
}