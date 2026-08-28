import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { ProductDetailPageContent } from "@/components/product-detail-page-content"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
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
      <main className="content-shell pb-24 pt-32 sm:pt-36 lg:pb-28 lg:pt-40">
        <nav className="mb-8 sm:mb-10" aria-label="Breadcrumb">
          <Link
            href={`/${lang}/products`}
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
              <ArrowLeft className="size-4 text-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.12em] text-foreground transition-colors group-hover:text-primary">
              {dict.navigation?.products || "Danh mục sản phẩm"}
            </span>
          </Link>
        </nav>

        <ProductDetailPageContent product={product} dictionary={dict} lang={lang} />
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
