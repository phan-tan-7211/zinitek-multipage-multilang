import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { PortfolioSection } from "@/components/portfolio-section"
import { PageHeader } from "@/components/page-header"
// Import hàm lấy từ điển để xử lý đa ngôn ngữ
import { getDictionary } from "@/lib/get-dictionary"

export const metadata = {
  title: "Dự án - ZINITEK",
  description: "Khám phá các dự án gia công cơ khí chính xác và giải pháp tự động hóa tiêu biểu của ZINITEK.",
}

// Chuyển sang async function và nhận params để lấy ngôn ngữ từ URL
export default async function PortfolioPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> | { lang: string } 
}) {
  // 1. Chờ lấy tham số lang (quan trọng cho Next.js 15+)
  const resolvedParams = await params
  const { lang } = resolvedParams
  
  // 2. Tải file ngôn ngữ (vi.json, en.json...)
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      {/* Lớp nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* 3. Truyền 'lang' và 'dict' vào đây để dập lỗi 'undefined navigation' */}
      <Navigation lang={lang} dict={dict} />
      
      <div className="relative z-10">
        <PageHeader 
          title={dict.portfolio?.title || "Dự án"}
          subtitle={dict.portfolio?.subtitle || "Thành tựu tiêu biểu"}
          description={dict.portfolio?.description || "Khám phá các dự án gia công cơ khí chính xác và giải pháp tự động hóa tiêu biểu của ZINITEK."}
        />
        
        {/* Truyền dữ liệu vào PortfolioSection nếu có đa ngôn ngữ */}
        <PortfolioSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}