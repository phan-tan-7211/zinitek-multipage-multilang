


import Link from "next/link"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"
import { DynamicIcon } from "@/components/ui/dynamic-icon"
// SỬA: Import FallbackBadge chuẩn
import { FallbackBadge } from "@/components/fallback-badge"
import { ServiceListContent } from "@/components/service-list-content"

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
      orderRank,
      tags
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
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Lới kỹ thuật mờ (giống các trang khác) */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#f97316 1px, transparent 1px),
            linear-gradient(90deg, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Hero Section - Tối ưu spacing mobile (pt-28 thay vì pt-40) */}
      <section className="pt-28 md:pt-40 pb-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 uppercase">
            {dict.services?.title_main || "Dịch vụ"}{" "}
            <span className="text-[#f97316] italic">{dict.services?.title_highlight || "Kỹ thuật"}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {dict.services?.hub_description || "Giải pháp toàn diện từ gia công cơ khí đến tự động hóa nhà máy với kỹ thuật Nhật Bản và chi phí tối ưu."}
          </p>
        </div>
      </section>

      {/* Grid danh sách dịch vụ (Client Component xử lý Filter) */}
      <section className="pb-24 relative z-10">
        <ServiceListContent
          danhSachDichVu={danhSachDichVu}
          lang={lang}
          dict={dict}
        />
      </section>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}