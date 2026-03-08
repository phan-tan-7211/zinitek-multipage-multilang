// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import Link from "next/link"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ArrowRight, HardHat } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"
import { FallbackBadge } from "@/components/fallback-badge"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const khachHangSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM LẤY VÀ LỌC DỮ LIỆU THÔNG MINH ---
// NGUYÊN TẮC SMART FALLBACK: Ưu tiên ngôn ngữ hiện tại → EN → VI → bản đầu tiên tìm thấy
// Mỗi nhóm translation chỉ hiển thị 1 bản ghi duy nhất.
async function layDanhSachSanPham(ngonNguHienTai: string) {
  /**
   * CHIẾN LƯỢC TRUY VẤN MỚI:
   * 1. Truy vấn tất cả translation.metadata của type 'product'.
   * 2. Với mỗi nhóm metadata, lấy bản dịch tốt nhất theo thứ tự ưu tiên.
   * Cách này đảm bảo mỗi sản phẩm chỉ xuất hiện 1 lần dù có bao nhiêu bản dịch.
   */
  const cauTruyVanTheoNhom = `
    *[_type == "translation.metadata" && "product" in schemaTypes] {
      "banDich": coalesce(
        translations[_key == $ngonNguHienTai][0].value->,
        translations[_key == "en"][0].value->,
        translations[_key == "vi"][0].value->
      ) {
        _id,
        title,
        description,
        "slug": slug.current,
        language,
        "image": image.asset->{ url },
        "serviceCategory": serviceCategory->{ _id, title }
      },
      "ngonNguThucTe": coalesce(
        select(defined(translations[_key == $ngonNguHienTai][0].value) => $ngonNguHienTai),
        select(defined(translations[_key == "en"][0].value) => "en"),
        select(defined(translations[_key == "vi"][0].value) => "vi")
      )
    }[defined(banDich)]
  `;

  // Thử phương pháp 1: Dùng translation.metadata (chuẩn)
  try {
    const ketQuaNhom: any[] = await khachHangSanity.fetch(cauTruyVanTheoNhom, { ngonNguHienTai });

    if (ketQuaNhom.length > 0) {
      return ketQuaNhom.map((nhom: any) => ({
        ...nhom.banDich,
        language: nhom.ngonNguThucTe || nhom.banDich?.language,
      }));
    }
  } catch (loi) {
    console.warn('Truy vấn theo metadata thất bại, dùng phương pháp dự phòng:', loi);
  }

  // Phương pháp 2 (DỰ PHÒNG): Dùng _translationKey nếu metadata không tồn tại
  const cauTruyVanDuPhong = `
    *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      _id,
      _translationKey,
      title,
      description,
      "slug": slug.current,
      language,
      "image": image.asset->{ url },
      "serviceCategory": serviceCategory->{ _id, title }
    }
  `;

  const tatCaSanPham: any[] = await khachHangSanity.fetch(cauTruyVanDuPhong);

  // Gom nhóm theo _translationKey
  const nhomTheoKey: Record<string, any[]> = {};
  tatCaSanPham.forEach((sp) => {
    const khoa = sp._translationKey || sp._id;
    if (!nhomTheoKey[khoa]) nhomTheoKey[khoa] = [];
    nhomTheoKey[khoa].push(sp);
  });

  return Object.values(nhomTheoKey).map((cacPhienBan) => {
    return (
      cacPhienBan.find((v) => v.language === ngonNguHienTai) ||
      cacPhienBan.find((v) => v.language === 'en') ||
      cacPhienBan.find((v) => v.language === 'vi') ||
      cacPhienBan[0]
    );
  });
}

// --- 3. TẠO THÔNG TIN SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.products?.meta_title || "Sản phẩm & Thiết bị - ZINITEK",
    description: dictionary.products?.meta_desc || "Danh sách các máy móc, thiết bị và sản phẩm gia công chính xác của ZINITEK.",
  }
}

// --- 4. COMPONENT CHÍNH ---
export default async function ProductsListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const [dictionary, danhSachSanPham] = await Promise.all([
    getDictionary(lang),
    layDanhSachSanPham(lang)
  ])

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      {/* Nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Lớp lưới kỹ thuật mờ (tương tự các trang khác) */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#f97316 1px, transparent 1px),
            linear-gradient(90deg, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Hero Section */}
      <section className="pt-40 pb-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase">
            {dictionary.products?.title_main || "Sản phẩm"}{" "}
            <span className="text-[#f97316] italic">
              {dictionary.products?.title_highlight || "Thiết bị"}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-pretty">
            {dictionary.products?.hub_description || "Khám phá danh mục máy móc và các sản phẩm gia công CNC tiêu biểu được thực hiện bởi ZINITEK."}
          </p>
        </div>
      </section>

      {/* Grid danh sách sản phẩm */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4">
          {danhSachSanPham.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <HardHat className="mx-auto w-12 h-12 mb-4 text-[#334155]" />
              Hiện chưa có sản phẩm nào. Dữ liệu đang được cập nhật.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {danhSachSanPham.map((sanPham: any) => (
                <Link
                  key={sanPham._id}
                  href={`/${lang}/products/${sanPham.slug}`}
                  className="group bg-[#0f172a]/50 border border-[#334155]/50 p-8 rounded-2xl hover:border-[#f97316]/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                >
                  {/* Nhãn phiên bản dự phòng — chỉ hiện khi sản phẩm không có bản dịch ng.ngữ hiện tại */}
                  <FallbackBadge ngonNguThucTe={sanPham.language} ngonNguNguoiDung={lang} />

                  <div className="flex items-center text-sm font-medium text-[#f97316] mb-2">
                    <HardHat className="w-4 h-4 mr-1" />
                    <span>{sanPham.serviceCategory?.title || "Thiết bị Công nghiệp"}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-[#f97316] transition-colors">
                    {sanPham.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {sanPham.description}
                  </p>

                  <div className="flex items-center gap-2 text-[#f97316] font-medium text-sm mt-auto">
                    {dictionary.common?.read_more || "Chi tiết"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} dict={dictionary} />
    </main>
  )
}