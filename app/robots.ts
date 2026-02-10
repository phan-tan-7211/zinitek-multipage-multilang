// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Lấy URL từ biến môi trường hoặc dùng mặc định
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zinitek.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}