// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { PortableText } from "@portabletext/react"
import { Calendar, User, Tag, ArrowLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { SanityImage } from "@/components/sanity-image"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM TRUY VẤN CHI TIẾT DỰ ÁN VỚI DỰ PHÒNG THÔNG MINH ---
async function layChiTietDuAn(duongDanSlug: string, ngonNguHienTai: string) {
  const cauTruyVanGroq = `
    *[_type == "project" && slug.current == $duongDanSlug][0] {
      "duLieuTotNhat": coalesce(
        *[_type == "project" && _translationKey == ^._translationKey && language == $ngonNguHienTai][0],
        *[_type == "project" && _translationKey == ^._translationKey && language == "en"][0],
        *[_type == "project" && _translationKey == ^._translationKey && language == "vi"][0],
        ^
      )
    }.duLieuTotNhat {
      _id,
      title,
      client,
      projectYear,
      description,
      content,
      language,
      "slug": slug.current,
      "image": mainImage.asset->{ _id, url },
      "gallery": gallery[].asset->{ _id, url },
      "serviceCategory": coalesce(
        *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $ngonNguHienTai][0],
        *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en"][0],
        serviceCategory->
      ) { title, "slug": slug.current }
    }
  `;

  return await trinhKetNoiSanity.fetch(cauTruyVanGroq, { duongDanSlug, ngonNguHienTai });
}

// --- 3. TẠO THÔNG TIN MÔ TẢ SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const thamSoTrang = await params;
  const duAn = await layChiTietDuAn(thamSoTrang.slug, thamSoTrang.lang);
  
  if (!duAn) return { title: "Dự án không tồn tại | ZINITEK" };
  
  return { 
    title: `${duAn.title} - Dự án tiêu biểu ZINITEK`, 
    description: duAn.description 
  };
}

// --- 4. THÀNH PHẦN TRANG CHÍNH ---
export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const thamSoTrang = await params;
  const { lang, slug } = thamSoTrang;
  
  const [tuDien, duLieuDuAn] = await Promise.all([
    getDictionary(lang),
    layChiTietDuAn(slug, lang)
  ]);

  if (!duLieuDuAn) notFound();

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        
        {/* Nút quay lại và Breadcrumb */}
        <div className="flex items-center gap-4 mb-12">
          <Link 
            href={`/${lang}/portfolio`}
            className="group flex items-center gap-2 text-slate-400 hover:text-[#f97316] transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#f97316]/50">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">
                {tuDien.portfolio?.back_to_list || "Quay lại danh sách"}
            </span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* CỘT TRÁI: NỘI DUNG CHI TIẾT (8/12) */}
          <div className="lg:col-span-8">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f97316]/10 border border-[#f97316]/20 rounded-lg text-[#f97316] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Tag className="w-3 h-3" />
                {duLieuDuAn.serviceCategory?.title}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">
                {duLieuDuAn.title}
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed italic border-l-4 border-[#f97316] pl-6">
                {duLieuDuAn.description}
              </p>
            </div>

            {/* Ảnh chính dự án */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#334155]/50 mb-12 shadow-2xl">
              <SanityImage 
                imageData={duLieuDuAn.image} 
                alt={duLieuDuAn.title} 
                width={1200} 
                height={800} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Nội dung bài viết từ Sanity */}
            <div className="prose prose-invert prose-orange max-w-none mb-16">
              <PortableText value={duLieuDuAn.content} />
            </div>

            {/* Thư viện ảnh thực tế */}
            {duLieuDuAn.gallery && duLieuDuAn.gallery.length > 0 && (
              <div className="mt-16 mb-16">
                <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                  <span className="w-10 h-px bg-[#f97316]"></span>
                  {tuDien.portfolio?.gallery_title || "Hình ảnh thực tế"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {duLieuDuAn.gallery.map((anh: any) => (
                    <div key={anh._id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-[#f97316]/50 transition-all group">
                       <SanityImage imageData={anh} alt="Project Gallery" width={400} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- BƯỚC 1: CHÈN NÚT XEM TẤT CẢ VÀO CUỐI NỘI DUNG --- */}
            <div className="pt-12 border-t border-white/5">
                <Link href={`/${lang}/portfolio`}>
                    <button className="inline-flex items-center gap-2 px-8 py-4 border border-[#f97316]/50 text-[#f97316] rounded-xl hover:bg-[#f97316] hover:text-[#020617] transition-all duration-500 font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#f97316]/10">
                        {tuDien.featured_projects?.view_all || "Xem tất cả dự án"}
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </Link>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN TÓM TẮT (4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-[#0f172a] border border-[#334155]/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/5 blur-3xl rounded-full" />
                
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[#f97316] mb-8 border-b border-white/5 pb-4">
                  {tuDien.portfolio?.project_info || "Thông tin dự án"}
                </h3>

                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3" /> {tuDien.portfolio?.client_label || "Khách hàng"}
                    </span>
                    <span className="text-lg font-bold text-white">{duLieuDuAn.client || "Zinitek Partner"}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> {tuDien.portfolio?.year_label || "Năm thực hiện"}
                    </span>
                    <span className="text-lg font-bold text-white">{duLieuDuAn.projectYear || "2024"}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                      <Tag className="w-3 h-3" /> {tuDien.portfolio?.service_label || "Dịch vụ"}
                    </span>
                    <Link 
                      href={`/${lang}/services/${duLieuDuAn.serviceCategory?.slug}`}
                      className="text-lg font-bold text-[#f97316] hover:underline flex items-center gap-1 group"
                    >
                      {duLieuDuAn.serviceCategory?.title}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                <Link href={`/${lang}/contact`}>
                  <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#f97316] hover:text-[#020617] hover:border-[#f97316] transition-all duration-500 shadow-lg">
                    {tuDien.common?.contact_btn || "Liên hệ tư vấn"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}