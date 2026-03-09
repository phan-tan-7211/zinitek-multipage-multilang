
import Link from "next/link"
import { ProductHero } from "@/components/product-hero"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ArrowRight, HardHat } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"
import { FallbackBadge } from "@/components/fallback-badge"
import { ProductListContent } from "@/components/product-list-content"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const khachHangSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM LẤY VÀ LỌC DỮ LIỆU THÔNG MINH ---
async function layDanhSachSanPham(ngonNguHienTai: string) {
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
    <main className="min-h-screen bg-background text-foreground relative">
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-10 pointer-events-none">
        <BlueprintBackground />
      </div>

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

      {/* Hero Section - Tối ưu pt-32 thay vì pt-44 để khớp Header mới */}
      <section className="pt-32 md:pt-44 pb-16 relative z-10">
        <ProductHero
          titleMain={dictionary.products?.title_main || "SẢN PHẨM"}
          titleHighlight={dictionary.products?.title_highlight || "CÔNG NGHỆ"}
          description={dictionary.products?.hub_description || "Khám phá danh mục máy móc và các sản phẩm gia công CNC tiêu biểu được thực hiện bởi ZINITEK."}
        />
      </section>

      <section className="pb-32 relative z-10">
        {danhSachSanPham.length === 0 ? (
          <div className="container mx-auto px-4">
            <div className="text-center text-muted-foreground py-20 bg-card/50 rounded-3xl border border-dashed border-border">
              <HardHat className="mx-auto w-12 h-12 mb-4 text-[#334155] opacity-20" />
              Hiện chưa có sản phẩm nào. Dữ liệu đang được cập nhật.
            </div>
          </div>
        ) : (
          <ProductListContent
            danhSachSanPham={danhSachSanPham}
            lang={lang}
            dict={dictionary}
          />
        )}
      </section>

      <Footer lang={lang} dict={dictionary} />
    </main>
  )
}