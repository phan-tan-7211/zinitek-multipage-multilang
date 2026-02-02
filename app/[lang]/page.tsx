import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { FeaturedProjects } from "@/components/featured-projects"
import { AboutSummary } from "@/components/about-summary"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary" // Hãy đảm bảo file này tồn tại

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string }
}) {
  // 1. Chờ lấy ngôn ngữ từ URL (Hỗ trợ cả Promise và Object để tương thích Next.js 15+)
  const resolvedParams = await params
  const { lang } = resolvedParams
  
  // 2. Lấy nội dung từ điển dựa trên ngôn ngữ
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-white relative overflow-x-hidden">
      {/* Nền Blueprint - Đảm bảo nó nằm dưới cùng */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>
      
      {/* 3. Navigation - Truyền dict để hiển thị menu đa ngôn ngữ */}
      <Navigation lang={lang} dict={dict} /> 
      
      {/* Nội dung chính - Dùng z-10 để nổi lên trên nền */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <HeroSection dict={dict} lang={lang} />

        {/* About Summary */}
        <AboutSummary lang={lang} dict={dict} />

        {/* Featured Projects */}
        <FeaturedProjects lang={lang} dict={dict} />

        {/* --- Section Tin tức & Blog --- */}
        <section className="py-24 bg-transparent relative">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-px bg-[#f97316]"></div>
                  <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
                    {dict.news_section?.badge || "Kiến thức & Tin tức"}
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  {dict.news_section?.title_main || "Góc nhìn"}{" "}
                  <span className="italic text-[#f97316]">
                    {dict.news_section?.title_highlight || "Chuyên gia"}
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  {dict.news_section?.description || "Cập nhật xu hướng công nghệ cơ khí và kinh nghiệm gia công từ đội ngũ ZINITEK."}
                </p>
              </div>
              <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-[#f97316] hover:gap-3 transition-all font-medium">
                {dict.news_section?.view_all || "Xem tất cả bài viết"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Bài viết 1 */}
              <article className="group bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=500" alt="CNC Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                    {dict.blog?.category_cnc || "Kỹ thuật CNC"}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {dict.blog?.post1_title || "Cách tối ưu máy CNC Nhật bãi để đạt độ bóng bề mặt cao nhất"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {dict.blog?.post1_desc || "Chia sẻ các mẹo hiệu chỉnh thông số cắt và chọn dao phù hợp cho các dòng máy CNC đời cũ..."}
                  </p>
                  <Link href={`/${lang}/blog`} className="text-sm font-semibold text-white flex items-center gap-2">
                    {dict.blog?.read_more || "Đọc tiếp"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* Bài viết 2 */}
              <article className="group bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500" alt="Molds Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                    {dict.blog?.category_mold || "Khuôn mẫu"}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {dict.blog?.post2_title || "Tại sao nên chọn thép SKD11 cho khuôn dập progressive?"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {dict.blog?.post2_desc || "Phân tích ưu nhược điểm của vật liệu thép trong chế tạo khuôn mẫu độ bền cao..."}
                  </p>
                  <Link href={`/${lang}/blog`} className="text-sm font-semibold text-white flex items-center gap-2">
                    {dict.blog?.read_more || "Đọc tiếp"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* Bài viết 3 */}
              <article className="group bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500" alt="Automation Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                    {dict.blog?.category_auto || "Tự động hóa"}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {dict.blog?.post3_title || "Giải pháp tích hợp PLC Mitsubishi cho dây chuyền sản xuất cũ"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {dict.blog?.post3_desc || "Nâng cấp hệ thống điều khiển giúp tăng năng suất 30% mà không cần mua máy mới..."}
                  </p>
                  <Link href={`/${lang}/blog`} className="text-sm font-semibold text-white flex items-center gap-2">
                    {dict.blog?.read_more || "Đọc tiếp"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}