import { notFound } from "next/navigation"
import { Navigation } from "@/components/navigation"
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
  // Nếu bạn chỉ có tiếng Việt thì để nguyên, nếu có nhiều lang thì cần map thêm lang vào đây.
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

      {/* 4. Truyền lang và dict vào Navigation & Footer để hết lỗi crash */}
      <Navigation lang={lang} dict={dict} />
      
      <div className="relative z-10">
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