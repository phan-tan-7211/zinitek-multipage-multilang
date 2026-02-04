import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ServicePageContent } from "@/components/service-page-content"
import { getServiceBySlug, getServiceSlugs, services } from "@/lib/services-data"
// 1. Import hàm lấy từ điển
import { getDictionary } from "@/lib/get-dictionary"

interface ServicePageProps {
  // Sửa params để nhận cả lang và slug
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = getServiceSlugs()
  // Đối với đa ngôn ngữ, static params thường cần cả lang. 
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  
  if (!service) {
    return {
      title: "Dịch vụ không tìm thấy - ZINITEK",
    }
  }

  return {
    title: `${service.title} - ZINITEK`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  // 2. Lấy lang và slug từ params
  const { lang, slug } = await params
  
  // 3. Lấy dữ liệu ngôn ngữ (dict)
  const dict = await getDictionary(lang)
  
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  // Lấy các dịch vụ liên quan
  const relatedServices = services.filter(s => s.slug !== slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* ĐÃ XÓA <Navigation /> TẠI ĐÂY 
          để tránh hiện tượng 2 Navbar đè lên nhau do đã có ở Layout chung.
      */}
      
      {/* 4. Thêm pt-20 lg:pt-28 vào div này để bù đắp khoảng trống cho Navbar cố định */}
      <div className="relative z-10 pt-20 lg:pt-28">
        <ServicePageContent 
          service={service} 
          relatedServices={relatedServices} 
          lang={lang} 
          dict={dict} 
        />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}