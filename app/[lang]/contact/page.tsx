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

      {/* LƯU Ý: Đã xóa component <Navigation /> ở đây.
        Navbar hiện tại được quản lý tập trung tại file layout.tsx 
        để đảm bảo tính năng cố định (fixed) hoạt động tốt nhất.
      */}
      
      {/* 4. Thêm pt-20 lg:pt-28 để nội dung bắt đầu dưới thanh Navigation cố định */}
      <div className="relative z-10 pt-20 lg:pt-28">
        <PageHeader 
          title={dict.contact?.title || (lang === 'vi' ? "Liên hệ" : "Contact")}
          subtitle={dict.contact?.subtitle || (lang === 'vi' ? "Kết nối" : "Get in touch")}
          description={dict.contact?.description || (lang === 'vi' ? "ZINITEK luôn sẵn sàng lắng nghe và tư vấn các giải pháp kỹ thuật tối ưu cho dự án của bạn." : "ZINITEK is always ready to listen and provide optimal technical solutions for your projects.")}
          lang={lang}
          dict={dict}
        />
        
        {/* Truyền dữ liệu vào ContactSection */}
        <ContactSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}