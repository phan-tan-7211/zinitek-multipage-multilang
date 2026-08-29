
import Link from "next/link"
import { ProductHero } from "@/components/product-hero"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ArrowRight, HardHat } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { getSiteName, replaceLegacySiteName, withSiteName } from "@/lib/site-settings"
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

// --- 2.1. HÀM LẤY DANH MỤC DỊCH VỤ (CATEGORIES) ---
async function layDanhSachDanhMuc(ngonNguHienTai: string) {
  const cauTruyVan = `
    *[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))] {
      _id,
      title,
      language,
      _translationKey
    }
  `;
  const tatCaDanhMuc: any[] = await khachHangSanity.fetch(cauTruyVan);
  
  const nhomTheoKey: Record<string, any[]> = {};
  tatCaDanhMuc.forEach((dm) => {
    const khoa = dm._translationKey || dm._id;
    if (!nhomTheoKey[khoa]) nhomTheoKey[khoa] = [];
    nhomTheoKey[khoa].push(dm);
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
  const [dictionary, siteName] = await Promise.all([getDictionary(lang), getSiteName()])
  
  const title = withSiteName(dictionary.products?.meta_title || "Sản phẩm & Thiết bị - ZINITEK", siteName)
  const description = replaceLegacySiteName(dictionary.products?.meta_desc || "Danh sách các máy móc, thiết bị và sản phẩm gia công chính xác của ZINITEK.", siteName)

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/${lang}/products`,
      languages: {
        'vi': '/vi/products',
        'en': '/en/products',
        'cn': '/cn/products',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/products`,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// --- 4. COMPONENT CHÍNH ---
export default async function ProductsListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const [dictionary, danhSachSanPham, danhSachDanhMuc, siteName] = await Promise.all([
    getDictionary(lang),
    layDanhSachSanPham(lang),
    layDanhSachDanhMuc(lang),
    getSiteName(),
  ])

  // Khởi tạo Schema.org (JSON-LD) cho danh sách sản phẩm
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": replaceLegacySiteName(dictionary.products?.title_main || "Danh mục Sản phẩm ZINITEK", siteName),
    "description": dictionary.products?.hub_description,
    "itemListElement": danhSachSanPham.map((sp: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://zinitek.vn/${lang}/products/${sp.slug}`,
      "name": sp.title,
      "description": sp.description,
      "image": sp.image?.url
    }))
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Chèn JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            danhSachDanhMuc={danhSachDanhMuc}
            lang={lang}
            dict={dictionary}
          />
        )}
      </section>

      <Footer lang={lang} dict={dictionary} />
    </main>
  )
}
