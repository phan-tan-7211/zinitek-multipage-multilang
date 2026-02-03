import { Navigation } from "@/components/navigation"
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
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      <Navigation lang={lang} dict={dict} />
      
      <div className="relative z-10">
        <PageHeader 
          // SỬA CHỖ NÀY: Khớp với Key trong file JSON bạn đã gửi
          title={dict.about_page?.header_title || "Giới thiệu"}
          subtitle={dict.about_page?.header_subtitle || "Câu chuyện ZINITEK"}
          description={dict.about_page?.header_top_desc || "Hành trình từ xưởng cơ khí đến đối tác quốc tế."}
          lang={lang} // TRUYỀN THÊM DÒNG NÀY
          dict={dict} // TRUYỀN THÊM DÒNG NÀY
        />
        
        {/* AboutSection đã nhận lang và dict, nó sẽ tự xử lý nội dung bên trong */}
        <AboutSection lang={lang} dict={dict} />
        
        <TestimonialsSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}