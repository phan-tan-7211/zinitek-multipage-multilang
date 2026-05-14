import { MetadataRoute } from 'next'
import { createClient } from "next-sanity"
import { i18n } from '@/lib/i18n-config'

const sanityClient = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Dùng nhất quán với metadataBase trong layout.tsx
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zinitek.vn'
// Đồng bộ với i18n-config.ts — đủ 5 ngôn ngữ
const locales = i18n.locales // ['vi', 'en', 'jp', 'kr', 'cn']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- 1. ĐỊNH TUYẾN TĨNH (STATIC ROUTES) ---
  // Thêm /policy vào danh sách trang tĩnh
  const staticRoutes = ['', '/about', '/services', '/products', '/portfolio', '/blog', '/contact']
  const policyRoutes = ['/policy/privacy', '/policy/terms', '/policy/cookies']

  // Helper function để tạo hreflang alternates cho trang tĩnh
  const getAlternates = (route: string) => ({
    languages: {
      'vi-VN': `${baseUrl}/vi${route}`,
      'en-US': `${baseUrl}/en${route}`,
      'ja-JP': `${baseUrl}/jp${route}`,
      'ko-KR': `${baseUrl}/kr${route}`,
      'zh-CN': `${baseUrl}/cn${route}`,
    }
  })

  // Priority hierarchy: Trang chủ > Category > Sub-pages
  const staticPaths = [
    // Trang chủ mỗi ngôn ngữ — priority cao nhất
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
      alternates: getAlternates(''),
    })),
    // Trang category — priority cao
    ...staticRoutes.slice(1).flatMap((route) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: getAlternates(route),
      }))
    ),
    // Trang chính sách pháp lý — priority thấp hơn
    ...policyRoutes.flatMap((route) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
        alternates: getAlternates(route),
      }))
    ),
  ]

  // --- 2. ĐỊNH TUYẾN ĐỘNG (DYNAMIC ROUTES TỪ SANITY) ---
  
  try {
    // 2.1 Lấy toàn bộ Dịch vụ
    const services = await sanityClient.fetch(`*[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const servicePaths = services.map((service: any) => ({
      url: `${baseUrl}/${service.language || 'vi'}/services/${service.slug}`,
      lastModified: new Date(service._updatedAt),
      changeFrequency: 'monthly' as any,
      priority: 0.7,
    }))

    // 2.2 Lấy toàn bộ Sản phẩm
    const products = await sanityClient.fetch(`*[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const productPaths = products.map((product: any) => ({
      url: `${baseUrl}/${product.language || 'vi'}/products/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: 'monthly' as any,
      priority: 0.7,
    }))

    // 2.3 Lấy toàn bộ Dự án (Portfolio)
    const portfolios = await sanityClient.fetch(`*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const portfolioPaths = portfolios.map((portfolio: any) => ({
      url: `${baseUrl}/${portfolio.language || 'vi'}/portfolio/${portfolio.slug}`,
      lastModified: new Date(portfolio._updatedAt),
      changeFrequency: 'monthly' as any,
      priority: 0.7,
    }))

    // 2.4 Lấy toàn bộ Bài viết Blog
    const blogPosts = await sanityClient.fetch(`*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const blogPaths = blogPosts.map((post: any) => ({
      url: `${baseUrl}/${post.language || 'vi'}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as any,
      priority: 0.6,
    }))

    // Gộp tất cả lại thành 1 mảng Sitemap duy nhất
    return [...staticPaths, ...servicePaths, ...productPaths, ...portfolioPaths, ...blogPaths]
  } catch (error) {
    console.error("Lỗi khi tạo Sitemap từ Sanity:", error)
    // Nếu Sanity sập, vẫn trả về các trang tĩnh cơ bản
    return staticPaths
  }
}
