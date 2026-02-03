import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { services } from "@/lib/services-data"
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  
  return {
    title: dict.services?.meta_title || "Dịch vụ - ZINITEK",
    description: dict.services?.meta_desc || "Các giải pháp gia công CNC, khuôn mẫu và tự động hóa chất lượng Nhật Bản tại ZINITEK.",
  }
}

export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string }
}) {
  // 1. Lấy ngôn ngữ từ URL
  const resolvedParams = await params
  const { lang } = resolvedParams
  
  // 2. Lấy từ điển
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* 3. Truyền dict để Navigation không bị crash */}
      <Navigation lang={lang} dict={dict} />

      {/* Hero Section của trang Dịch vụ */}
      <section className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase">
            {dict.services?.title_main || "Dịch vụ"}{" "}
            <span className="text-[#f97316] italic">{dict.services?.title_highlight || "Kỹ thuật"}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {dict.services?.hub_description || "Giải pháp toàn diện từ gia công cơ khí đến tự động hóa nhà máy với kỹ thuật Nhật Bản và chi phí tối ưu."}
          </p>
        </div>
      </section>

      {/* Grid danh sách dịch vụ */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link 
                key={service.slug} 
                // 4. Thêm ${lang} vào href để giữ ngôn ngữ khi chuyển trang chi tiết
                href={`/${lang}/services/${service.slug}`}
                className="group bg-[#0f172a]/50 border border-[#334155]/50 p-8 rounded-2xl hover:border-[#f97316]/50 transition-all duration-300 flex flex-col h-full"
              >
                <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-[#f97316] transition-colors">
                  {/* Nếu services-data của bạn có đa ngôn ngữ, hãy xử lý ở đây */}
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-[#f97316] font-medium text-sm">
                  {dict.services?.read_more || "Tìm hiểu chi tiết"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}