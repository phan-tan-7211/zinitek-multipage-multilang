import { ProductHero } from "@/components/product-hero"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { HardHat } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
import { getSiteName, withSiteName } from "@/lib/site-settings"
import { ProductListContent } from "@/components/product-list-content"
import { sanityClient } from "@/lib/sanity-client"
import { getPublicSiteUrl } from "@/lib/runtime-config"

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
  `

  try {
    const ketQuaNhom: any[] = await sanityClient.fetch(cauTruyVanTheoNhom, { ngonNguHienTai })
    if (ketQuaNhom.length > 0) {
      return ketQuaNhom.map((nhom: any) => ({
        ...nhom.banDich,
        language: nhom.ngonNguThucTe || nhom.banDich?.language,
      }))
    }
  } catch (loi) {
    console.warn('Truy vấn theo metadata thất bại, dùng phương pháp dự phòng:', loi)
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
  `

  const tatCaSanPham: any[] = await sanityClient.fetch(cauTruyVanDuPhong)
  const nhomTheoKey: Record<string, any[]> = {}
  tatCaSanPham.forEach((sp) => {
    const khoa = sp._translationKey || sp._id
    if (!nhomTheoKey[khoa]) nhomTheoKey[khoa] = []
    nhomTheoKey[khoa].push(sp)
  })

  return Object.values(nhomTheoKey).map((cacPhienBan) =>
    cacPhienBan.find((v) => v.language === ngonNguHienTai) ||
    cacPhienBan.find((v) => v.language === 'en') ||
    cacPhienBan.find((v) => v.language === 'vi') ||
    cacPhienBan[0]
  )
}

async function layDanhSachDanhMuc(ngonNguHienTai: string) {
  const cauTruyVan = `
    *[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))] {
      _id,
      title,
      language,
      _translationKey
    }
  `
  const tatCaDanhMuc: any[] = await sanityClient.fetch(cauTruyVan)
  const nhomTheoKey: Record<string, any[]> = {}
  tatCaDanhMuc.forEach((dm) => {
    const khoa = dm._translationKey || dm._id
    if (!nhomTheoKey[khoa]) nhomTheoKey[khoa] = []
    nhomTheoKey[khoa].push(dm)
  })

  return Object.values(nhomTheoKey).map((cacPhienBan) =>
    cacPhienBan.find((v) => v.language === ngonNguHienTai) ||
    cacPhienBan.find((v) => v.language === 'en') ||
    cacPhienBan.find((v) => v.language === 'vi') ||
    cacPhienBan[0]
  )
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [dictionary, siteName] = await Promise.all([getDictionary(lang), getSiteName()])
  const title = withSiteName(dictionary.products?.meta_title || "Sản phẩm & Thiết bị", siteName)
  const description = dictionary.products?.meta_desc || "Danh mục sản phẩm, thiết bị và giải pháp được cung cấp bởi doanh nghiệp."

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/${lang}/products`,
      languages: {
        'vi-VN': '/vi/products',
        'en-US': '/en/products',
        'ja-JP': '/jp/products',
        'ko-KR': '/kr/products',
        'zh-CN': '/cn/products',
      },
    },
    openGraph: { title, description, url: `/${lang}/products`, siteName },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProductsListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [dictionary, danhSachSanPham, danhSachDanhMuc, siteName] = await Promise.all([
    getDictionary(lang),
    layDanhSachSanPham(lang),
    layDanhSachDanhMuc(lang),
    getSiteName(),
  ])
  const siteUrl = getPublicSiteUrl()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": dictionary.products?.title_main || `${siteName} Products`,
    "description": dictionary.products?.hub_description,
    "itemListElement": danhSachSanPham.map((sp: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${siteUrl}/${lang}/products/${sp.slug}`,
      "name": sp.title,
      "description": sp.description,
      "image": sp.image?.url
    }))
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

      <section className="pt-32 md:pt-44 pb-16 relative z-10">
        <ProductHero
          titleMain={dictionary.products?.title_main || "SẢN PHẨM"}
          titleHighlight={dictionary.products?.title_highlight || "CÔNG NGHỆ"}
          description={dictionary.products?.hub_description || "Khám phá danh mục sản phẩm, thiết bị và các giải pháp tiêu biểu của doanh nghiệp."}
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
