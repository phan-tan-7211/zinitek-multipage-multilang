// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { FeaturedProjects } from "@/components/featured-projects"
import { AboutSummary } from "@/components/about-summary"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
// Import hàm lấy dữ liệu tối ưu hóa tìm kiếm (SEO) từ Sanity
import { fetchSeoData } from "@/lib/fetch-seo-data"

/**
 * 1. HÀM TẠO METADATA (SEO)
 * Sử dụng await params để tương thích với Next.js 16
 */
export async function generateMetadata({ 
    params 
}: { 
    params: Promise<{ lang: string }> 
}) {
    const thamSoGiaiMa = await params;
    const ngonNguHienTai = thamSoGiaiMa.lang;

    // Lấy dữ liệu SEO từ Sanity cho trang chủ ('home')
    const duLieuSeo = await fetchSeoData(ngonNguHienTai, 'home'); 

    const tieuDeMacDinh = 'ZINITEK - Kỹ thuật Nhật Bản, Chi phí Việt Nam | Gia công CNC & Khuôn mẫu';
    const moTaMacDinh = 'ZINITEK cung cấp giải pháp gia công CNC chính xác, thiết kế khuôn mẫu và tự động hóa nhà máy theo tiêu chuẩn chất lượng Nhật Bản.';
    const duongDanAnhSeo = duLieuSeo?.openGraphImage?.asset?.url;

    return {
        title: duLieuSeo?.metaTitle || tieuDeMacDinh,
        description: duLieuSeo?.metaDescription || moTaMacDinh,
        openGraph: {
            title: duLieuSeo?.metaTitle || tieuDeMacDinh,
            description: duLieuSeo?.metaDescription || moTaMacDinh,
            url: `/${ngonNguHienTai}`,
            siteName: 'ZINITEK',
            images: duongDanAnhSeo ? [{ url: duongDanAnhSeo }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: duLieuSeo?.metaTitle || tieuDeMacDinh,
            description: duLieuSeo?.metaDescription || moTaMacDinh,
            images: duongDanAnhSeo ? [duongDanAnhSeo] : [],
        },
    };
}

/**
 * 2. COMPONENT TRANG CHỦ (HOME)
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  // Giải nén tham số ngôn ngữ (Bắt buộc dùng await trong Next.js 16)
  const thamSoGiaiMa = await params;
  const lang = thamSoGiaiMa.lang;
  
  // Lấy nội dung từ điển
  const dictionary = await getDictionary(lang);
  
  // Ép kiểu dữ liệu để tránh lỗi TypeScript khi truy cập dữ liệu JSON
  const blogDictionary = (dictionary.blog as any) || {};
  const newsDictionary = (dictionary.news_section as any) || {};

  return (
    <main className="min-h-screen bg-[#020617] text-white relative overflow-x-hidden">
      {/* Nền Blueprint hiển thị phía dưới cùng */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>
      
      <div className="relative z-10 pt-20 lg:pt-28">
        
        {/* Các component cốt lõi - Đã cấu hình Prop đúng theo yêu cầu hệ thống */}
        <HeroSection dict={dictionary} /> 
        <AboutSummary dict={dictionary} lang={lang} /> 
        <FeaturedProjects dict={dictionary} /> 

        {/* --- Section Tin tức & Blog --- */}
        <section className="py-24 bg-transparent relative">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-px bg-[#f97316]"></div>
                  <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
                    {newsDictionary?.badge || "Kiến thức & Tin tức"}
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  {newsDictionary?.title_main || "Góc nhìn"}{" "}
                  <span className="italic text-[#f97316]">
                    {newsDictionary?.title_highlight || "Chuyên gia"}
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  {newsDictionary?.description || "Cập nhật xu hướng công nghệ cơ khí và kinh nghiệm gia công từ đội ngũ ZINITEK."}
                </p>
              </div>
              <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-[#f97316] hover:gap-3 transition-all font-medium">
                {newsDictionary?.view_all || "Xem tất cả bài viết"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Bài viết số 1 */}
              <article className="group bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=500" alt="CNC Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                    {blogDictionary?.category_cnc || "Kỹ thuật CNC"}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {blogDictionary?.post1_title || "Cách tối ưu máy CNC Nhật bãi"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {blogDictionary?.post1_desc || "Chia sẻ mẹo hiệu chỉnh thông số cắt cho các dòng máy CNC đời cũ."}
                  </p>
                  <Link href={`/${lang}/blog`} className="text-sm font-semibold text-white flex items-center gap-2">
                    {blogDictionary?.read_more || "Đọc tiếp"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* Bài viết số 2 */}
              <article className="group bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500" alt="Molds Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                    {blogDictionary?.category_mold || "Khuôn mẫu"}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {blogDictionary?.post2_title || "Thép SKD11 trong chế tạo khuôn dập"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {blogDictionary?.post2_desc || "Phân tích ưu nhược điểm của vật liệu thép độ bền cao."}
                  </p>
                  <Link href={`/${lang}/blog`} className="text-sm font-semibold text-white flex items-center gap-2">
                    {blogDictionary?.read_more || "Đọc tiếp"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* Bài viết số 3 */}
              <article className="group bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500" alt="Automation Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                    {blogDictionary?.category_auto || "Tự động hóa"}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {blogDictionary?.post3_title || "Tích hợp PLC Mitsubishi cho dây chuyền"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {blogDictionary?.post3_desc || "Nâng cấp hệ thống điều khiển giúp tăng năng suất vượt trội."}
                  </p>
                  <Link href={`/${lang}/blog`} className="text-sm font-semibold text-white flex items-center gap-2">
                    {blogDictionary?.read_more || "Đọc tiếp"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <Footer lang={lang} dict={dictionary} />
    </main>
  );
}