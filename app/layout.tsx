import React from "react"
import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import TrackingProvider from "@/components/analytics"
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { getSiteSettings, resolveSiteName } from "@/lib/site-settings"
import { getPublicSiteUrl } from "@/lib/runtime-config"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = resolveSiteName(settings)
  const faviconUrl = `/api/favicon?v=${encodeURIComponent(settings._updatedAt || "default")}`

  return {
    metadataBase: new URL(getPublicSiteUrl()),
    title: {
      default: `${siteName} - Website`,
      template: `%s | ${siteName}`,
    },
    description: `${siteName} - website chính thức.`,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      type: 'website',
      siteName,
    },
    icons: {
      icon: [{ url: faviconUrl, type: 'image/svg+xml' }],
      shortcut: [{ url: faviconUrl, type: 'image/svg+xml' }],
    },
  }
}

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var dark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (dark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.backgroundColor = '#020617';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.backgroundColor = '#fafafa';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <Analytics />
          <TrackingProvider />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
