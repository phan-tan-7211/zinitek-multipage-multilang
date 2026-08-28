import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { FeaturedProjects } from "@/components/featured-projects"
import { AboutSummary } from "@/components/about-summary"
import { Button } from "@/components/ui/button"
import { BlogCarousel } from "@/components/blog-carousel"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { fetchSeoData } from "@/lib/fetch-seo-data"
import { createClient } from "next-sanity"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

type LocalizedContent = {
  language?: string
  _translationKey?: string
  slug?: string
}

type BlogPost = LocalizedContent & {
  title: string
  excerpt?: string
  imageUrl?: string
  categoryName?: string
}

type Project = LocalizedContent & {
  title: string
  client?: string
  imageUrl?: string
  categoryName?: string
}

function selectLocalizedItems<T extends LocalizedContent>(
  items: T[],
  lang: string,
  limit: number,
): T[] {
  const grouped = new Map<string, T[]>()

  for (const item of items) {
    const key = item._translationKey || item.slug || crypto.randomUUID()
    const group = grouped.get(key) || []
    group.push(item)
    grouped.set(key, group)
  }

  return Array.from(grouped.values())
    .map(
      (group) =>
        group.find((item) => item.language === lang) ||
        group.find((item) => item.language === "en") ||
        group.find((item) => item.language === "vi") ||
        group[0],
    )
    .filter(Boolean)
    .slice(0, limit)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const seo = await fetchSeoData(lang, "home")

  const fallbackTitle =
    "ZINITEK - Kỹ thuật Nhật Bản, Chi phí Việt Nam | Gia công CNC & Khuôn mẫu"
  const fallbackDescription =
    "ZINITEK cung cấp giải pháp gia công CNC chính xác, thiết kế khuôn mẫu và tự động hóa nhà máy theo tiêu chuẩn chất lượng Nhật Bản."
  const ogImage = seo?.openGraphImage?.asset?.url

  return {
    title: seo?.metaTitle || fallbackTitle,
    description: seo?.metaDescription || fallbackDescription,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "vi-VN": "/vi",
        "en-US": "/en",
        "zh-CN": "/cn",
        "ja-JP": "/jp",
        "ko-KR": "/kr",
      },
    },
    openGraph: {
      type: "website",
      title: seo?.metaTitle || fallbackTitle,
      description: seo?.metaDescription || fallbackDescription,
      url: `/${lang}`,
      siteName: "ZINITEK",
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.metaTitle || fallbackTitle,
      description: seo?.metaDescription || fallbackDescription,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const blogDictionary = (dictionary.blog as Record<string, string>) || {}
  const newsDictionary =
    (dictionary.news_section as Record<string, string>) || {}

  const blogQuery = `
    *[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      "imageUrl": mainImage.asset->url,
      "categoryName": category->title,
      language,
      _translationKey
    }
  `

  const projectQuery = `
    *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      title,
      "slug": slug.current,
      client,
      "categoryName": serviceCategory->title,
      "imageUrl": mainImage.asset->url,
      language,
      _translationKey
    }
  `

  const [allPosts, allProjects] = await Promise.all([
    sanityClient.fetch<BlogPost[]>(blogQuery),
    sanityClient.fetch<Project[]>(projectQuery),
  ])

  const latestPosts = selectLocalizedItems(allPosts, lang, 5)
  const latestProjects = selectLocalizedItems(allProjects, lang, 6)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "ZINITEK",
    url: `https://zinitek.vn/${lang}`,
    logo: {
      "@type": "ImageObject",
      url: "https://zinitek.vn/logo.png",
      width: 200,
      height: 60,
    },
    image: "https://zinitek.vn/og-image.jpg",
    description:
      "Chuyên gia công CNC, thiết kế khuôn mẫu và tự động hóa theo tiêu chuẩn Nhật Bản.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Khu Công Nghệ Cao",
      addressLocality: "TP. Hồ Chí Minh",
      addressCountry: "VN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-77-622-0031",
      contactType: "customer service",
      availableLanguage: [
        "Vietnamese",
        "English",
        "Japanese",
        "Korean",
        "Chinese",
      ],
    },
    sameAs: ["https://www.facebook.com/zinitek", "https://zalo.me/zinitek"],
    priceRange: "$$",
  }

  return (
    <>
      <main
        id="main-content"
        className="relative min-h-dvh overflow-x-clip bg-background text-foreground"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          aria-hidden="true"
        >
          <BlueprintBackground />
        </div>

        <div className="relative z-10 pt-20 lg:pt-24">
          <HeroSection dict={dictionary} lang={lang} />
          <AboutSummary dict={dictionary} lang={lang} />
          <FeaturedProjects
            dict={dictionary}
            projects={latestProjects}
            lang={lang}
          />

          <section
            aria-labelledby="news-section-title"
            className="relative border-y border-border/70 bg-card/40 py-20 sm:py-24 lg:py-28"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col gap-7 md:mb-12 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="h-px w-10 bg-primary sm:w-12"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                      {newsDictionary.badge || "Kiến thức & Tin tức"}
                    </span>
                  </div>

                  <h2
                    id="news-section-title"
                    className="max-w-xl text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
                  >
                    {newsDictionary.title_main || "Góc nhìn"}{" "}
                    <span className="text-primary">
                      {newsDictionary.title_highlight || "Chuyên gia"}
                    </span>
                  </h2>

                  <p className="mt-5 max-w-[65ch] text-base leading-7 text-muted-foreground sm:text-lg">
                    {newsDictionary.description ||
                      "Cập nhật xu hướng công nghệ cơ khí và kinh nghiệm gia công từ đội ngũ ZINITEK."}
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="group min-h-12 w-fit rounded-full border-primary/40 bg-background/70 px-6 text-base font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Link
                    href={`/${lang}/blog`}
                    aria-label={newsDictionary.view_all || "Xem tất cả bài viết"}
                  >
                    {newsDictionary.view_all || "Xem tất cả bài viết"}
                    <ArrowRight
                      className="ml-2 size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>

              {latestPosts.length > 0 ? (
                <BlogCarousel
                  posts={latestPosts}
                  lang={lang}
                  readMoreText={blogDictionary.read_more}
                  categoryNewsText={blogDictionary.category_news}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 px-6 py-12 text-center">
                  <p className="text-base text-muted-foreground">
                    {blogDictionary.no_posts || "Đang cập nhật bài viết mới..."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer lang={lang} dict={dictionary} />
    </>
  )
}
