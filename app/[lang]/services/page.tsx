import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { PageHeader } from "@/components/page-header"
import { ServiceListContent } from "@/components/service-list-content"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function layDanhSachDichVu(lang: string) {
  const query = `
    *[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))] | order(orderRank asc) {
      _id,
      _translationKey,
      title,
      description,
      "slug": slug.current,
      language,
      icon,
      orderRank,
      "tags": coalesce(tags, [])
    }
  `

  const allServices = await sanityClient.fetch(query)
  const groups: Record<string, any[]> = {}

  allServices.forEach((service: any) => {
    const key = service._translationKey || service._id
    if (!groups[key]) groups[key] = []
    groups[key].push(service)
  })

  return Object.values(groups)
    .map(
      (group) =>
        group.find((item) => item.language === lang) ||
        group.find((item) => item.language === "en") ||
        group.find((item) => item.language === "vi") ||
        group[0]
    )
    .filter(Boolean)
    .sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const title = dict.services?.meta_title || "Dịch vụ - ZINITEK"
  const description =
    dict.services?.meta_desc ||
    "Các giải pháp gia công CNC, khuôn mẫu và tự động hóa chất lượng Nhật Bản tại ZINITEK."

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/services`,
      languages: {
        "vi-VN": "/vi/services",
        "en-US": "/en/services",
        "ja-JP": "/jp/services",
        "ko-KR": "/kr/services",
        "zh-CN": "/cn/services",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/services`,
      siteName: "ZINITEK",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function ServicesHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [dict, services] = await Promise.all([getDictionary(lang), layDanhSachDichVu(lang)])

  const titleMain = dict.services?.title_main || "Dịch vụ"
  const titleHighlight = dict.services?.title_highlight || "Kỹ thuật"
  const pageTitle = `${titleMain} ${titleHighlight}`
  const description =
    dict.services?.hub_description ||
    "Giải pháp toàn diện từ gia công cơ khí đến tự động hóa nhà máy với kỹ thuật Nhật Bản và chi phí tối ưu."

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.services?.meta_title || "Dịch vụ ZINITEK",
    description: dict.services?.meta_desc || description,
    itemListElement: services.map((service: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://zinitek.vn/${lang}/services/${service.slug}`,
      name: service.title,
      description: service.description,
    })),
  }

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 dark:opacity-35" aria-hidden="true">
        <BlueprintBackground />
      </div>

      <div className="relative z-10">
        <PageHeader
          title={pageTitle}
          subtitle={dict.services?.badge || dict.navigation?.services || "Dịch vụ kỹ thuật"}
          description={description}
          lang={lang}
          dict={dict}
        />

        <section className="section-space" aria-label={dict.navigation?.services || "Dịch vụ"}>
          <ServiceListContent danhSachDichVu={services} lang={lang} dict={dict} />
        </section>

        <Footer lang={lang} dict={dict} />
      </div>
    </div>
  )
}
