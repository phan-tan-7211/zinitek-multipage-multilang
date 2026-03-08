// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { ProductDetailPageContent } from "@/components/product-detail-page-content"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM TRUY VẤN CHI TIẾT SẢN PHẨM VỚI LOGIC DỰ PHÒNG THÔNG MINH ---
async function layThongTinSanPham(duongDanSlug: string, ngonNguHienTai: string) {
  const cauTruyVanGroq = `
    *[_type == "product" && slug.current == $duongDanSlug][0] {
      "duLieuDaXuLy": coalesce(
        *[_type == "product" && _translationKey == ^._translationKey && language == $ngonNguHienTai][0],
        *[_type == "product" && _translationKey == ^._translationKey && language == "en"][0],
        *[_type == "product" && _translationKey == ^._translationKey && language == "vi"][0],
        ^
      ) {
        _id,
        title,
        modelCode,
        description,
        "slug": slug.current,
        language,
        "image": image.asset->{ _id, url },
        "gallery": gallery[].asset->{ _id, url },
        "attachments": attachments[].asset->{ _id, url, originalFilename },
        "tags": coalesce(tags, []),
        "features": coalesce(features, []),
        "specifications": coalesce(specifications, []),
        "serviceCategory": coalesce(
          *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $ngonNguHienTai][0],
          *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en"][0],
          serviceCategory->
        ) { title, "slug": slug.current }
      }
    }.duLieuDaXuLy
  `;

  return await trinhKetNoiSanity.fetch(cauTruyVanGroq, { duongDanSlug, ngonNguHienTai });
}

// --- 3. TẠO THÔNG TIN MÔ TẢ SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const thamSoTrang = await params;
  const sanPham = await layThongTinSanPham(thamSoTrang.slug, thamSoTrang.lang);

  if (!sanPham) return { title: "Sản phẩm không tồn tại | ZINITEK" };

  return {
    title: `${sanPham.title || "Sản phẩm Zinitek"} - ZINITEK`,
    description: sanPham.description
  };
}

// --- 4. THÀNH PHẦN TRANG CHÍNH ---
export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const thamSoTrang = await params;
  const { lang, slug } = thamSoTrang;

  const [tuDien, duLieuSanPham] = await Promise.all([
    getDictionary(lang),
    layThongTinSanPham(slug, lang)
  ]);

  if (!duLieuSanPham) {
    notFound();
  }

  return (
    // SỬA LỖI: Giảm padding top để tránh khoảng trống thừa dưới header cố định
    <main className="min-h-screen bg-[#020617] text-foreground relative pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-6">

        {/* Nút quay lại danh sách */}
        <div className="mb-10">
          <Link
            href={`/${lang}/products`}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-[#f97316] transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#f97316]/50">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">
              {tuDien.navigation?.products || "Danh mục sản phẩm"}
            </span>
          </Link>
        </div>

        {/* Nội dung chi tiết sản phẩm */}
        <ProductDetailPageContent product={duLieuSanPham} dictionary={tuDien} lang={lang} />
      </div>

      {/* SỬA LỖI: Thêm Footer vào trang chi tiết sản phẩm */}
      <Footer lang={lang} dict={tuDien} />
    </main>
  );
}