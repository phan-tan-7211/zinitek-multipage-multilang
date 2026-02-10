// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import Link from "next/link"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"
// Import Dynamic Icon để hiển thị icon từ Sanity
import { DynamicIcon } from "@/components/ui/dynamic-icon"

// --- 1. CẤU HÌNH SANITY CLIENT ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM LẤY DỮ LIỆU DỊCH VỤ (LOGIC GOM NHÓM THÔNG MINH) ---
async function layDanhSachDichVu(ngonNguHienTai: string) {
  /**
   * TRUY VẤN: Lấy tất cả dịch vụ (không lọc ngôn ngữ ngay từ đầu)
   * Sắp xếp theo orderRank để giữ đúng thứ tự hiển thị mong muốn
   */
  const cauTruyVan = `
    *[_type == "service" && defined(slug.current)] | order(orderRank asc) {
      _id,
      _translationKey,
      title,
      description,
      "slug": slug.current,
      language,
      icon,
      orderRank
    }
  `
  const tatCaDichVu = await trinhKetNoiSanity.fetch(cauTruyVan)

  // --- THUẬT TOÁN GOM NHÓM VÀ CHỌN BẢN DỊCH TỐT NHẤT ---
  const nhomDichVu: Record<string, any[]> = {};

  // A. Gom nhóm
  tatCaDichVu.forEach((dichVu: any) => {
    const khoaNhom = dichVu._translationKey || dichVu._id;
    if (!nhomDichVu[khoaNhom]) {
      nhomDichVu[khoaNhom] = [];
    }
    nhomDichVu[khoaNhom].push(dichVu);
  });

  // B. Chọn đại diện tốt nhất
  const danhSachDichVuSauCung = Object.values(nhomDichVu).map((nhom: any[]) => {
    // Ưu tiên 1: Đúng ngôn ngữ
    const banDichDung = nhom.find((p) => p.language === ngonNguHienTai);
    if (banDichDung) return banDichDung;

    // Ưu tiên 2: Tiếng Anh
    const banDichAnh = nhom.find((p) => p.language === 'en');
    if (banDichAnh) return banDichAnh;

    // Ưu tiên 3: Tiếng Việt
    const banDichViet = nhom.find((p) => p.language === 'vi');
    if (banDichViet) return banDichViet;

    return nhom[0];
  });

  // C. Sắp xếp lại theo orderRank (nếu có) để menu không bị lộn xộn
  danhSachDichVuSauCung.sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0));

  return danhSachDichVuSauCung;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  
  return {
    title: dict.services?.meta_title || "Dịch vụ - ZINITEK",
    description: dict.services?.meta_desc || "Các giải pháp gia công CNC, khuôn mẫu và tự động hóa chất lượng Nhật Bản tại ZINITEK.",
  }
}

// --- 3. COMPONENT CHÍNH ---
export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  // Lấy dữ liệu song song
  const [dict, danhSachDichVu] = await Promise.all([
    getDictionary(lang),
    layDanhSachDichVu(lang)
  ])

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      {/* Nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-16 relative z-10">
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
            {danhSachDichVu.map((dichVu: any) => (
              <Link 
                key={dichVu._id} 
                href={`/${lang}/services/${dichVu.slug}`}
                className="group bg-[#0f172a]/50 border border-[#334155]/50 p-8 rounded-2xl hover:border-[#f97316]/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                {/* Nhãn phiên bản ngôn ngữ (Nếu khác ngôn ngữ hiện tại) */}
                {dichVu.language !== lang && (
                    <div className="absolute top-0 right-0 bg-[#f97316] text-[#020617] text-[10px] px-2 py-1 font-bold uppercase tracking-tighter opacity-80">
                        {dichVu.language || 'Original'} Version
                    </div>
                )}

                {/* Icon động từ Sanity */}
                <div className="mb-6 w-12 h-12 flex items-center justify-center bg-[#f97316]/10 rounded-xl group-hover:bg-[#f97316] transition-colors duration-300">
                    <DynamicIcon 
                        iconData={dichVu.icon} 
                        className="w-6 h-6 text-[#f97316] group-hover:text-[#020617] transition-colors" 
                    />
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-[#f97316] transition-colors">
                  {dichVu.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {dichVu.description}
                </p>
                <div className="flex items-center gap-2 text-[#f97316] font-medium text-sm mt-auto">
                  {dict.services?.read_more || "Tìm hiểu chi tiết"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Hiển thị thông báo nếu không có dữ liệu (Hiếm khi xảy ra với logic mới) */}
          {danhSachDichVu.length === 0 && (
            <div className="text-center text-muted-foreground py-20">
              Đang cập nhật dữ liệu từ hệ thống...
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}