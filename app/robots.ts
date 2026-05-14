// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Nhất quán với metadataBase và sitemap.ts
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zinitek.vn'

  return {
    rules: [
      {
        // Cho phép Googlebot crawl toàn bộ nội dung công khai
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/studio/'],
      },
      {
        // Cho phép các bot lành tính khác (Bing, Yahoo...)
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/studio/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}