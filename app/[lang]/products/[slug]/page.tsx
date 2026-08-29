import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { cache } from "react"
import { getDictionary } from "@/lib/get-dictionary"
import { ProductDetailPageContent } from "@/components/product-detail-page-content"
import { DetailRelatedSection } from "@/components/detail-related-section"
import { Footer } from "@/components/footer"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { getSiteName, withSiteName } from "@/lib/site-settings"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

const getProduct = cache(async (slug: string, lang: string) => {
  const query = `
    {
      "metadata": *[
        _type == "translation.metadata" &&
        "product" in schemaTypes &&
        count(translations[value->slug.current == $slug]) > 0
      ][0] {
        _id,
        "product": coalesce(
          translations[_key == $lang][0].value->,
          translations[_key == "en"][0].value->,
          translations[_key == "vi"][0].value->
        ) {
          _id,
          _translationKey,
          "_metadataGroupId": *[_type == "translation.metadata" && "product" in schemaTypes && references(^._id)][0]._id,
          title,
          modelCode,
          description,
          "slug": slug.current,
          language,
          "image": image.asset->{ _id, url },
          "gallery": coalesce(gallery[].asset->{ _id, url }, []),
          "attachments": coalesce(attachments[].asset->{ _id, url, originalFilename }, []),
          "features": coalesce(features, []),
          "specifications": coalesce(specifications, []),
          "categoryIdentifier": coalesce(serviceCategory->_translationKey, serviceCategory->_id),
          "serviceCategory": coalesce(
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $lang && !(_id in path("drafts.**"))][0],
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en" && !(_id in path("drafts.**"))][0],
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "vi" && !(_id in path("drafts.**"))][0],
            serviceCategory->
          ) { title, "slug": slug.current }
        }
      },
      "legacy": *[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        "resolved": coalesce(
          *[_type == "product" && defined(^._translationKey) && _translationKey == ^._translationKey && language == $lang && !(_id in path("drafts.**"))][0],
          *[_type == "product" && defined(^._translationKey) && _translationKey == ^._translationKey && language == "en" && !(_id in path("drafts.**"))][0],
          *[_type == "product" && defined(^._translationKey) && _translationKey == ^._translationKey && language == "vi" && !(_id in path("drafts.**"))][0],
          @
        ) {
          _id,
          _translationKey,
          "_metadataGroupId": *[_type == "translation.metadata" && "product" in schemaTypes && references(^._id)][0]._id,
          title,
          modelCode,
          description,
          "slug": slug.current,
          language,
          "image": image.asset->{ _id, url },
          "gallery": coalesce(gallery[].asset->{ _id, url }, []),
          "attachments": coalesce(attachments[].asset->{ _id, url, originalFilename }, []),
          "features": coalesce(features, []),
          "specifications": coalesce(specifications, []),
          "categoryIdentifier": coalesce(serviceCategory->_translationKey, serviceCategory->_id),
          "serviceCategory": coalesce(
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $lang && !(_id in path("drafts.**"))][0],
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en" && !(_id in path("drafts.**"))][0],
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "vi" && !(_id in path("drafts.**"))][0],
            serviceCategory->
          ) { title, "slug": slug.current }
        }
      }.resolved
    }
  `

  const result = await sanityClient.fetch(query, { slug, lang })
  return result?.metadata?.product || result?.legacy || null
})

async function getRelatedProducts(product: any, lang: string) {
  if (!product?.categoryIdentifier) return []

  const rawProducts: any[] = await sanityClient.fetch(
    `*[
      _type == "product" &&
      defined(slug.current) &&
      coalesce(serviceCategory->_translationKey, serviceCategory->_id) == $categoryIdentifier &&
      !(_id in path("drafts.**"))
    ] | order(_createdAt desc) {
      _id,
      _translationKey,
      "_metadataGroupId": *[_type == "translation.metadata" && "product" in schemaTypes && references(^._id)][0]._id,
      title,
      modelCode,
      description,
      "slug": slug.current,
      language,
      "image": image.asset->{ _id, url }
    }`,
    { categoryIdentifier: product.categoryIdentifier },
  )

  const groups: Record<string, any[]> = {}
  rawProducts.forEach((item) => {
    const key = item._metadataGroupId || item._translationKey || item._id
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })

  const currentGroupKey = product._metadataGroupId || product._translationKey || product._id

  return Object.entries(groups)
    .filter(([key]) => key !== currentGroupKey)
    .map(([, group]) =>
      group.find((item) => item.language === lang) ||
      group.find((item) => item.language === "en") ||
      group.find((item) => item.language === "vi") ||
      group[0]
    )
    .filter(Boolean)
    .slice(0, 3)
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const [product, siteName] = await Promise.all([getProduct(slug, lang), getSiteName()])

  if (!product) return { title: { absolute: withSiteName("Sản phẩm không tồn tại", siteName) } }

  return {
    title: { absolute: withSiteName(product.title || "Sản phẩm", siteName) },
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params

  const [dict, product] = await Promise.all([
    getDictionary(lang),
    getProduct(slug, lang),
  ])

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product, lang)
  const relatedItems = relatedProducts.map((item: any) => ({
    id: item._metadataGroupId || item._translationKey || item._id,
    href: `/${lang}/products/${item.slug}`,
    title: item.title,
    description: item.description,
    imageUrl: item.image?.url,
    eyebrow: item.modelCode || product.serviceCategory?.title,
  }))
  const productContent = {
    title: product.title,
    modelCode: product.modelCode,
    description: product.description,
    image: product.image,
    gallery: product.gallery,
    attachments: product.attachments,
    features: product.features,
    specifications: product.specifications,
    serviceCategory: product.serviceCategory,
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="content-shell relative isolate pb-24 pt-32 sm:pt-36 lg:pb-28 lg:pt-40">
        <div
          className="pointer-events-none absolute left-8 top-32 hidden size-24 border-l border-t border-primary/20 lg:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-8 top-[22rem] hidden size-24 border-b border-r border-border/70 lg:block"
          aria-hidden="true"
        />
        <nav
          className="relative z-10 mb-7 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:mb-8"
          aria-label="Breadcrumb"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Home className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Link
              href={`/${lang}`}
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {dict.common?.home || "Trang chủ"}
            </Link>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
            <Link
              href={`/${lang}/products`}
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {dict.navigation?.products || "Sản phẩm"}
            </Link>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
            <span
              className="max-w-[70vw] truncate font-medium text-primary"
              aria-current="page"
              title={product.title || "Sản phẩm ZINITEK"}
            >
              {product.title || "Sản phẩm ZINITEK"}
            </span>
          </div>
        </nav>

        <ProductDetailPageContent product={productContent} dictionary={dict} lang={lang} />
      </main>

      <DetailRelatedSection
        eyebrow={dict.navigation?.products || "Sản phẩm"}
        title={dict.products?.related_title || "Sản phẩm liên quan"}
        items={relatedItems}
        viewAllHref={`/${lang}/products`}
        viewAllLabel={dict.navigation?.view_all_products || "Xem tất cả sản phẩm"}
        readMoreLabel={dict.common?.read_more || "Xem chi tiết"}
      />

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
