// layout.tsx - Bản đầy đủ không mất tính năng
import React from "react";
import { Montserrat, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import TrackingProvider from "@/components/analytics";
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";

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
        <script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var dark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
          if (dark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#020617'; // Màu xanh đen của bạn
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = '#ffffff'; // ÉP TRẮNG TUYỆT ĐỐI NGAY LẬP TỨC
          }
        } catch (e) {}
      })();
    `,
  }}
/>
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {children}

          <Analytics />
          <TrackingProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}