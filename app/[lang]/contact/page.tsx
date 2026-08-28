import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ContactSection } from "@/components/contact-section"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{phoneTel}`)
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const title = dict.contact?.title || "Liên hệ - ZINITEK"
  const description = dict.contact?.description || "Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn."

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: {
        "vi-VN": "/vi/contact",
        "en-US": "/en/contact",
        "ja-JP": "/jp/contact",
        "ko-KR": "/kr/contact",
        "zh-CN": "/cn/contact",
        "x-default": "/vi/contact",
      },
    },
    openGraph: { title, description, url: `/${lang}/contact`, siteName: "ZINITEK", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [dict, siteSettings] = await Promise.all([getDictionary(lang), getSiteSettings()])
  const localBusiness: Record<string, any> = {
    "@type": "LocalBusiness",
    "@id": "https://zinitek.vn/#localbusiness",
    name: "ZINITEK",
    image: "https://zinitek.vn/logo.png",
    url: "https://zinitek.vn",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Số 200, Đường 2, KP. Nội Hóa 1, Phường Bình An",
      addressLocality: "Dĩ An",
      addressRegion: "Bình Dương",
      postalCode: "820000",
      addressCountry: "VN",
    },
  }
  if (siteSettings?.phoneTel) localBusiness.telephone = siteSettings.phoneTel

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `https://zinitek.vn/${lang}/contact/#webpage`,
        url: `https://zinitek.vn/${lang}/contact`,
        name: dict.contact?.title || "Liên hệ - ZINITEK",
        description: dict.contact?.description,
      },
      localBusiness,
    ],
  }

  return (
    <main className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25 dark:opacity-15" aria-hidden="true">
        <BlueprintBackground />
      </div>
      <div className="relative z-10">
        <PageHeader
          title={dict.contact?.title || "Contact"}
          subtitle={dict.contact?.subtitle || "Get in touch"}
          description={dict.contact?.description || "ZINITEK is ready to discuss the right technical solution for your project."}
          lang={lang}
          dict={dict}
        />
        <ContactSection lang={lang} dict={dict} />
      </div>
      <Footer lang={lang} dict={dict} />
    </main>
  )
}
