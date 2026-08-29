
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ContactSection } from "@/components/contact-section"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"

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
        'vi': '/vi/contact',
        'en': '/en/contact',
        'cn': '/cn/contact',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/contact`,
      siteName: 'ZINITEK',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ lang: string }> | { lang: string }
}) {
  const resolvedParams = await params
  const { lang } = resolvedParams
  const dict = await getDictionary(lang)

  // Khởi tạo Schema.org (JSON-LD) cho trang Liên hệ & Local Business
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `https://zinitek.vn/${lang}/contact/#webpage`,
        "url": `https://zinitek.vn/${lang}/contact`,
        "name": dict.contact?.title || "Liên hệ - ZINITEK",
        "description": dict.contact?.description
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://zinitek.vn/#localbusiness",
        "name": "ZINITEK",
        "image": "https://zinitek.vn/logo.png",
        "url": "https://zinitek.vn",
        "telephone": "+84776220031",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Số 200, Đường 2, KP. Nội Hóa 1, Phường Bình An",
          "addressLocality": "Dĩ An",
          "addressRegion": "Bình Dương",
          "postalCode": "820000",
          "addressCountry": "VN"
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Chèn JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-10 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Loai bỏ pt-20 thừa thãi */}
      <div className="relative z-10">
        <PageHeader
          title={dict.contact?.title || (lang === 'vi' ? "Liên hệ" : "Contact")}
          subtitle={dict.contact?.subtitle || (lang === 'vi' ? "Kết nối" : "Get in touch")}
          description={dict.contact?.description || (lang === 'vi' ? "ZINITEK luôn sẵn sàng lắng nghe và tư vấn các giải pháp kỹ thuật tối ưu cho dự án của bạn." : "ZINITEK is always ready to listen and provide optimal technical solutions for your projects.")}
          lang={lang}
          dict={dict}
        />

        <ContactSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}