import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const title = dict.about_page?.meta_title || "Giới thiệu - ZINITEK"
  const description = dict.about_page?.header_desc || "Câu chuyện về hành trình ZINITEK"

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/about`,
      languages: {
        "vi-VN": "/vi/about",
        "en-US": "/en/about",
        "ja-JP": "/jp/about",
        "ko-KR": "/kr/about",
        "zh-CN": "/cn/about",
        "x-default": "/vi/about",
      },
    },
    openGraph: { title, description, url: `/${lang}/about`, siteName: "ZINITEK", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `https://zinitek.vn/${lang}/about/#webpage`,
        url: `https://zinitek.vn/${lang}/about`,
        name: dict.about_page?.meta_title || "Giới thiệu - ZINITEK",
        description: dict.about_page?.header_desc,
      },
      {
        "@type": "Organization",
        "@id": "https://zinitek.vn/#organization",
        name: "ZINITEK",
        url: "https://zinitek.vn",
        logo: "https://zinitek.vn/logo.png",
      },
    ],
  }

  return (
    <main className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-30 dark:opacity-20" aria-hidden="true">
        <BlueprintBackground />
      </div>
      <div className="relative z-10">
        <PageHeader
          title={dict.about_page?.header_title || "Giới thiệu"}
          subtitle={dict.about_page?.header_subtitle || "Câu chuyện ZINITEK"}
          description={dict.about_page?.header_top_desc || "Hành trình từ xưởng cơ khí đến đối tác quốc tế."}
          lang={lang}
          dict={dict}
        />
        <AboutSection lang={lang} dict={dict} />
        <TestimonialsSection lang={lang} dict={dict} />
      </div>
      <Footer lang={lang} dict={dict} />
    </main>
  )
}
