import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PageHeader } from "@/components/page-header"
// SỬA DÒNG NÀY: Thêm "get-" vào trước dictionary
import { getDictionary } from "@/lib/get-dictionary" 

export const metadata = {
  title: "Giới thiệu - ZINITEK",
  description: "Câu chuyện về hành trình từ Đồng Thanh Phú đến ZINITEK - đối tác tin cậy trong gia công cơ khí chính xác.",
}

export default async function AboutPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> | { lang: string } 
}) {
  // 1. Lấy lang an toàn (hỗ trợ Next.js 15+)
  const resolvedParams = await params
  const { lang } = resolvedParams
  
  // 2. Lấy nội dung từ điển
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* 3. Truyền đủ props để không bị lỗi "undefined navigation" */}
      <Navigation lang={lang} dict={dict} />
      
      <div className="relative z-10">
        <PageHeader 
          title={dict.about?.title || "Giới thiệu"}
          subtitle={dict.about?.subtitle || "Câu chuyện ZINITEK"}
          description={dict.about?.description || "Hành trình từ xưởng cơ khí truyền thống đến đối tác tin cậy của các doanh nghiệp quốc tế."}
        />
        
        {/* Truyền dict vào các section nếu các section đó có dùng đa ngôn ngữ */}
        <AboutSection lang={lang} dict={dict} />
        <TestimonialsSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}