import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { BlogListContent } from "@/components/blog-list-content"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"

const sanityClient = createClient({ projectId: "g4o3uumy", dataset: "production", apiVersion: "2024-01-01", useCdn: false })

async function getBlogPosts(lang: string) {
  const raw = await sanityClient.fetch(`*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] {
    _id, _translationKey, title, "slug": slug.current, language, excerpt,
    "mainImage": mainImage.asset->{ url }, publishedAt, author, readTime,
    "category": category->title
  }`)
  const groups: Record<string, any[]> = {}
  raw.forEach((post: any) => {
    const key = post._translationKey || post._id
    if (!groups[key]) groups[key] = []
    groups[key].push(post)
  })
  return Object.values(groups)
    .map((group) => group.find((p) => p.language === lang) || group.find((p) => p.language === "en") || group.find((p) => p.language === "vi") || group[0])
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const title = dict.blog?.meta_title || "Blog Kỹ Thuật - ZINITEK"
  const description = dict.blog?.meta_desc || "Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK."
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        "vi-VN": "/vi/blog",
        "en-US": "/en/blog",
        "ja-JP": "/jp/blog",
        "ko-KR": "/kr/blog",
        "zh-CN": "/cn/blog",
        "x-default": "/vi/blog",
      },
    },
    openGraph: { title, description, url: `/${lang}/blog`, siteName: "ZINITEK", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [dict, posts] = await Promise.all([getDictionary(lang), getBlogPosts(lang)])
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: dict.blog?.meta_title || "Blog Kỹ Thuật ZINITEK",
    description: dict.blog?.meta_desc,
    url: `https://zinitek.vn/${lang}/blog`,
    blogPost: posts.map((post: any) => ({ "@type": "BlogPosting", headline: post.title, url: `https://zinitek.vn/${lang}/blog/${post.slug}`, datePublished: post.publishedAt, image: post.mainImage?.url })),
  }

  return (
    <main className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25 dark:opacity-15" aria-hidden="true"><BlueprintBackground /></div>
      <div className="relative z-10">
        <PageHeader title={dict.blog?.title || "Blog"} subtitle={dict.blog?.subtitle || "Insights"} description={dict.blog?.description || "Kiến thức chuyên sâu về cơ khí chính xác và tự động hóa."} lang={lang} dict={dict} />
        <section className="pb-24 pt-10 sm:pt-12 lg:pb-28"><BlogListContent posts={posts} lang={lang} dict={dict} /></section>
      </div>
      <Footer lang={lang} dict={dict} />
    </main>
  )
}
