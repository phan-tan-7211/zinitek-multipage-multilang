// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
import React from "react";
import { Montserrat, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import TrackingProvider from "@/components/analytics";
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-light.svg?v=1" type="image/svg+xml" />
      </head>
      {/* SỬA LỖI: Thêm suppressHydrationWarning vào body để chặn lỗi do Extension trình duyệt */}
      <body 
        className="font-sans antialiased bg-[#020617] text-white"
        suppressHydrationWarning={true}
      >
        {children}
        
        <Analytics />
        <TrackingProvider />
      </body>
    </html>
  );
}