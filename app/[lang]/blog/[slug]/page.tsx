// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { PortableText } from "@portabletext/react"
import { Calendar, User, Tag, ArrowLeft, Clock, Share2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SanityImage } from "@/components/sanity-image"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY (SANITY CLIENT) ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Lấy dữ liệu mới nhất trực tiếp từ máy chủ
})

// --- 2. HÀM TRUY VẤN CHI TIẾT BÀI VIẾT VỚI DỰ PHÒNG THÔNG MINH ---
async function layChiTietBaiViet(duongDanSlug: string, ngonNguHienTai: string) {
  const cauTruyVanGroq = `
    *[_type == "blogPost" && slug.current == $duongDanSlug][0] {
      "duLieuTotNhat": coalesce(
        *[_type == "blogPost" && _translationKey == ^._translationKey && language == $ngonNguHienTai][0],
        *[_type == "blogPost" && _translationKey == ^._translationKey && language == "en"][0],
        *[_type == "blogPost" && _translationKey == ^._translationKey && language == "vi"][0],
        ^
      )
    }.duLieuTotNhat {
      _id,
      title,
      excerpt,
      body,
      publishedAt,
      author,
      readTime,
      language,
      "slug": slug.current,
      "mainImage": mainImage.asset->{ _id, url },
      "category": category->{ title, "slug": slug.current },
      "banDichTuongUng": *[_type == "blogPost" && _translationKey == ^._translationKey && defined(slug.current)] {
        language,
        "slug": slug.current
      }
    }
  `;

  const ketQuaTruyVan = await trinhKetNoiSanity.fetch(cauTruyVanGroq, { duongDanSlug, ngonNguHienTai });
  return ketQuaTruyVan;
}

// --- 3. HÀM LẤY BÀI VIẾT LIÊN QUAN ---
async function layBaiVietLienQuan(idHienTai: string, ngonNgu: string) {
  const cauTruyVan = `
    *[_type == "blogPost" && language == $ngonNgu && _id != $idHienTai][0...3] {
      _id,
      title,
      "slug": slug.current,
      "mainImage": mainImage.asset->{ url },
      publishedAt
    }
  `;
  return await trinhKetNoiSanity.fetch(cauTruyVan, { idHienTai, ngonNgu });
}

// --- 4. TẠO THÔNG TIN MÔ TẢ SEO ĐỘNG ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const thamSoTrang = await params;
  const baiViet = await layChiTietBaiViet(thamSoTrang.slug, thamSoTrang.lang);
  
  if (!baiViet) return { title: "Bài viết không tồn tại | ZINITEK" };
  
  return { 
    title: `${baiViet.title} - Blog ZINITEK`, 
    description: baiViet.excerpt 
  };
}

// --- 5. THÀNH PHẦN TRANG CHI TIẾT ---
export default async function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const thamSoTrang = await params;
  const { lang, slug } = thamSoTrang;
  
  const [tuDienNgonNgu, duLieuBaiViet] = await Promise.all([
    getDictionary(lang),
    layChiTietBaiViet(slug, lang)
  ]);

  if (!duLieuBaiViet) {
    notFound();
  }

  const danhSachLienQuan = await layBaiVietLienQuan(duLieuBaiViet._id, duLieuBaiViet.language);

  const ngayDangBai = new Date(duLieuBaiViet.publishedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        
        {/* Nút quay lại danh sách Blog (Breadcrumb) */}
        <div className="mb-12">
          <Link 
            href={`/${lang}/blog`}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-[#f97316] transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#f97316]/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">
                {tuDienNgonNgu.blog?.back_to_blog || "Quay lại Blog"}
            </span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Đầu bài viết: Tiêu đề và Thông tin Meta */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full text-[#f97316] text-xs font-black uppercase tracking-widest mb-8">
              <Tag className="w-3.5 h-3.5" />
              {duLieuBaiViet.category?.title || "Kỹ thuật"}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 text-balance">
              {duLieuBaiViet.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 border-y border-white/5 py-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#f97316]" />
                <span className="font-medium text-slate-200">{duLieuBaiViet.author || "ZINITEK Team"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#f97316]" />
                <span>{ngayDangBai}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f97316]" />
                <span>{duLieuBaiViet.readTime || "5 phút"} đọc</span>
              </div>
            </div>
          </header>

          {/* Ảnh đại diện bài viết */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-[#334155]/50 mb-16 shadow-2xl">
            <SanityImage 
              imageData={duLieuBaiViet.mainImage} 
              alt={duLieuBaiViet.title} 
              width={1600} 
              height={900} 
              className="w-full h-full object-cover" 
              priority
            />
            {duLieuBaiViet.language !== lang && (
              <div className="absolute top-6 right-6 bg-[#f97316] text-[#020617] text-xs font-black px-3 py-1 rounded-lg uppercase shadow-xl">
                {duLieuBaiViet.language} Version
              </div>
            )}
          </div>

          {/* Nội dung chi tiết bài viết (Portable Text) */}
          <article className="prose prose-invert prose-orange max-w-none prose-headings:font-serif prose-p:text-slate-300 prose-p:leading-relaxed prose-img:rounded-2xl prose-a:text-[#f97316]">
            <PortableText value={duLieuBaiViet.body} />
          </article>

          {/* --- SỬA ĐỔI: CHÈN NÚT XEM TẤT CẢ BÀI VIẾT VÀO ĐÂY --- */}
          <div className="mt-16 pt-10 border-t border-white/5">
            <Link href={`/${lang}/blog`}>
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-[#f97316]/50 text-[#f97316] rounded-lg hover:bg-[#f97316]/10 transition-colors font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#f97316]/5 group">
                {tuDienNgonNgu.news_section?.view_all || "Xem tất cả bài viết"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Chân bài viết: Chia sẻ và Liên hệ */}
          <footer className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
               <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Chia sẻ:</span>
               <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#f97316] hover:text-[#020617] transition-all">
                  <Share2 className="w-4 h-4" />
               </button>
            </div>
            <Link href={`/${lang}/contact`}>
              <button className="px-8 py-4 bg-[#f97316] text-[#020617] font-black rounded-xl hover:bg-[#fb923c] transition-all uppercase tracking-tighter shadow-lg shadow-[#f97316]/20">
                Liên hệ tư vấn kỹ thuật
              </button>
            </Link>
          </footer>
        </div>

        {/* Khối bài viết liên quan */}
        {danhSachLienQuan.length > 0 && (
          <div className="mt-32">
            <h3 className="text-2xl font-serif font-bold mb-12 flex items-center gap-4">
              <span className="w-12 h-px bg-[#f97316]"></span>
              Bài viết liên quan
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {danhSachLienQuan.map((baiLienQuan: any) => (
                <Link key={baiLienQuan._id} href={`/${lang}/blog/${baiLienQuan.slug}`} className="group">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <SanityImage imageData={baiLienQuan.mainImage} alt={baiLienQuan.title} width={600} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-[#f97316] transition-colors line-clamp-2">{baiLienQuan.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}