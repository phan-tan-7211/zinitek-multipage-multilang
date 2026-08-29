import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { ProductDetailPageContent } from "@/components/product-detail-page-content"
import { Footer } from "@/components/footer"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function getProduct(slug: string, lang: string) {
  const query = `
    *[_type == "product" && slug.current == $slug][0] {
      "resolved": coalesce(
        *[_type == "product" && _translationKey == ^._translationKey && language == $lang][0],
        *[_type == "product" && _translationKey == ^._translationKey && language == "en"][0],
        *[_type == "product" && _translationKey == ^._translationKey && language == "vi"][0],
        ^
      ) {
        _id,
        title,
        modelCode,
        description,
        "slug": slug.current,
        language,
        "image": image.asset->{ _id, url },
        "gallery": gallery[].asset->{ _id, url },
        "attachments": attachments[].asset->{ _id, url, originalFilename },
        "tags": coalesce(tags, []),
        "features": coalesce(features, []),
        "specifications": coalesce(specifications, []),
        "serviceCategory": coalesce(
          *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $lang][0],
          *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en"][0],
          serviceCategory->
        ) { title, "slug": slug.current }
      }
    }.resolved
  `

  return sanityClient.fetch(query, { slug, lang })
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const product = await getProduct(slug, lang)

  if (!product) return { title: "Sản phẩm không tồn tại | ZINITEK" }

  return {
    title: `${product.title || "Sản phẩm Zinitek"} - ZINITEK`,
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

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="content-shell relative isolate pb-24 pt-32 sm:pt-36 lg:pb-28 lg:pt-40">
        <div
          className="pointer-events-none absolute left-8 top-32 hidden size-24 border-l border-t border-primary/20 lg:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-8 right-8 hidden size-24 border-b border-r border-border/70 lg:block"
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

        <ProductDetailPageContent product={product} dictionary={dict} lang={lang} />
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
