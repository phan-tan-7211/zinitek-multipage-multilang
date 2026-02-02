import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ContactSection } from "@/components/contact-section"
import { PageHeader } from "@/components/page-header"
// Import hàm lấy từ điển - quan trọng nhất
import { getDictionary } from "@/lib/get-dictionary"

export const metadata = {
  title: "Liên hệ - ZINITEK",
  description: "Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.",
}

// 1. Thêm 'async' và nhận 'params'
export default async function ContactPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> | { lang: string } 
}) {
  // 2. Chờ lấy tham số lang từ URL
  const resolvedParams = await params
  const { lang } = resolvedParams
  
  // 3. Lấy dữ liệu ngôn ngữ (dict)
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* 4. Truyền lang và dict vào Navigation để hết lỗi 'undefined navigation' */}
      <Navigation lang={lang} dict={dict} />
      
      <div className="relative z-10">
        <PageHeader 
          title={dict.contact?.title || "Liên hệ"}
          subtitle={dict.contact?.subtitle || "Yêu cầu báo giá"}
          description={dict.contact?.description || "Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn."}
        />
        
        {/* Truyền dữ liệu vào ContactSection nếu component này có đa ngôn ngữ */}
        <ContactSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}