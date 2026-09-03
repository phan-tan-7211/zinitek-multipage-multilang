import { MetadataRoute } from 'next'
import { createClient } from "next-sanity"
import { i18n } from '@/lib/i18n-config'
import { getPublicSiteUrl, runtimeConfig } from '@/lib/runtime-config'

const sanityClient = createClient({
  projectId: runtimeConfig.sanityProjectId,
  dataset: runtimeConfig.sanityDataset,
  apiVersion: runtimeConfig.sanityApiVersion,
  useCdn: false,
})

const baseUrl = getPublicSiteUrl()
const locales = i18n.locales

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/services', '/products', '/portfolio', '/blog', '/contact']
  const policyRoutes = ['/policy/privacy', '/policy/terms', '/policy/cookies']

  const getAlternates = (route: string) => ({
    languages: {
      'vi-VN': `${baseUrl}/vi${route}`,
      'en-US': `${baseUrl}/en${route}`,
      'ja-JP': `${baseUrl}/jp${route}`,
      'ko-KR': `${baseUrl}/kr${route}`,
      'zh-CN': `${baseUrl}/cn${route}`,
    }
  })

  const staticPaths = [
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
      alternates: getAlternates(''),
    })),
    ...staticRoutes.slice(1).flatMap((route) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: getAlternates(route),
      }))
    ),
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

  try {
    const services = await sanityClient.fetch(`*[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const servicePaths = services.map((service: any) => ({
      url: `${baseUrl}/${service.language || 'vi'}/services/${service.slug}`,
      lastModified: new Date(service._updatedAt),
      changeFrequency: 'monthly' as any,
      priority: 0.7,
    }))

    const products = await sanityClient.fetch(`*[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const productPaths = products.map((product: any) => ({
      url: `${baseUrl}/${product.language || 'vi'}/products/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: 'monthly' as any,
      priority: 0.7,
    }))

    const portfolios = await sanityClient.fetch(`*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const portfolioPaths = portfolios.map((portfolio: any) => ({
      url: `${baseUrl}/${portfolio.language || 'vi'}/portfolio/${portfolio.slug}`,
      lastModified: new Date(portfolio._updatedAt),
      changeFrequency: 'monthly' as any,
      priority: 0.7,
    }))

    const blogPosts = await sanityClient.fetch(`*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, language, _updatedAt }`)
    const blogPaths = blogPosts.map((post: any) => ({
      url: `${baseUrl}/${post.language || 'vi'}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as any,
      priority: 0.6,
    }))

    return [...staticPaths, ...servicePaths, ...productPaths, ...portfolioPaths, ...blogPaths]
  } catch (error) {
    console.error("Lỗi khi tạo Sitemap từ Sanity:", error)
    return staticPaths
  }
}
