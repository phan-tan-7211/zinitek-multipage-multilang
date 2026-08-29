
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"

// SỬA METADATA: Chuyển thành function để hỗ trợ đa ngôn ngữ cho SEO
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
        'vi': '/vi/about',
        'en': '/en/about',
        'cn': '/cn/about',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/about`,
      siteName: 'ZINITEK',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ lang: string }> | { lang: string }
}) {
  const resolvedParams = await params
  const { lang } = resolvedParams

  const dict = await getDictionary(lang)

  // Khởi tạo Schema.org (JSON-LD) cho trang Giới thiệu
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `https://zinitek.vn/${lang}/about/#webpage`,
        "url": `https://zinitek.vn/${lang}/about`,
        "name": dict.about_page?.meta_title || "Giới thiệu - ZINITEK",
        "description": dict.about_page?.header_desc
      },
      {
        "@type": "Organization",
        "@id": "https://zinitek.vn/#organization",
        "name": "ZINITEK",
        "url": "https://zinitek.vn",
        "logo": "https://zinitek.vn/logo.png"
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
      
      {/* Nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* LƯU Ý: Đã xóa Navigation tại đây vì nó đã được gọi ở file Layout chung. */}

      {/* Loai bỏ pt-20 thừa thãi gây ra "ghost strip" khi Header ẩn đi */}
      <div className="relative z-10">
        <PageHeader
          title={dict.about_page?.header_title || "Giới thiệu"}
          subtitle={dict.about_page?.header_subtitle || "Câu chuyện ZINITEK"}
          description={dict.about_page?.header_top_desc || "Hành trình từ xưởng cơ khí đến đối tác quốc tế."}
          lang={lang}
          dict={dict}
        />

        {/* AboutSection và TestimonialsSection giữ nguyên */}
        <AboutSection lang={lang} dict={dict} />
        <TestimonialsSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}