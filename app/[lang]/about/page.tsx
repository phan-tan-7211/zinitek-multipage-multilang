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
  
  return {
    title: dict.about_page?.meta_title || "Giới thiệu - ZINITEK",
    description: dict.about_page?.header_desc || "Câu chuyện về hành trình ZINITEK",
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

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      {/* Nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* LƯU Ý: Đã xóa <Navigation /> tại đây vì nó đã được gọi ở file Layout chung.
      */}
      
      {/* Bổ sung pt-20 lg:pt-28 vào div này để nội dung không bị Navbar che khuất */}
      <div className="relative z-10 pt-20 lg:pt-28">
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