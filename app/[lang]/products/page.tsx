// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import Link from "next/link"
import { Footer } from "@/components/footer"
import { Suspense } from 'react';
import { BlueprintBackground } from "@/components/blueprint-background"
import { ArrowRight, HardHat } from "lucide-react" 
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"
// Import Component Skeleton đã tạo ở bước 6.1
import { ProductsGridSkeleton } from "@/components/product-card-skeleton"
import { ProductListContent } from "@/components/product-list-content"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const khachHangSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM LẤY VÀ LỌC DỮ LIỆU THÔNG MINH ---
async function layDuLieuSanPhamVaDanhMuc(ngonNguHienTai: string) {
  // Lấy tất cả sản phẩm hiện có (không lấy bản nháp)
  const cauTruyVan = `
    *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      _id,
      _translationKey,
      title,
      description,
      "slug": slug.current,
      language,
      image,
      serviceCategory->{ title }
    }
  `;

  const tatCaSanpham: any[] = await khachHangSanity.fetch(cauTruyVan);

  /**
   * LÔ-GIC LỌC BẢN DỊCH TỐT NHẤT (SMART FALLBACK):
   * Chúng ta gom các bài viết có cùng '_translationKey' thành một nhóm.
   * Với mỗi nhóm, ta chọn ra một bản dịch tốt nhất theo thứ tự ưu tiên:
   * Ngôn ngữ hiện tại > Tiếng Anh > Tiếng Việt > Bản đầu tiên tìm thấy.
   */
  const nhomSanPhanTheoKey: Record<string, any[]> = {};

  tatCaSanpham.forEach((sanPham) => {
    // Nếu không có mã liên kết, dùng ID làm khóa duy nhất
    const khoaDinhDanh = sanPham._translationKey || sanPham._id;
    if (!nhomSanPhanTheoKey[khoaDinhDanh]) {
      nhomSanPhanTheoKey[khoaDinhDanh] = [];
    }
    nhomSanPhanTheoKey[khoaDinhDanh].push(sanPham);
  });

  const danhSachRutGon = Object.values(nhomSanPhanTheoKey).map((cacPhienBan) => {
    const banDichDungNgonNgu = cacPhienBan.find((v) => v.language === ngonNguHienTai);
    const banDichTiengAnh = cacPhienBan.find((v) => v.language === 'en');
    const banDichTiengViet = cacPhienBan.find((v) => v.language === 'vi');

    // Trả về bản dịch theo độ ưu tiên
    return banDichDungNgonNgu || banDichTiengAnh || banDichTiengViet || cacPhienBan[0];
  });

  return danhSachRutGon;
}

// --- 3. THÀNH PHẦN HIỂN THỊ LƯỚI SẢN PHẨM ---
async function ProductsGrid({ lang, dictionary }: { lang: string, dictionary: any }) {
    const productsFromSanity = await layDuLieuSanPhamVaDanhMuc(lang)

    if (productsFromSanity.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-20">
                <HardHat className="mx-auto w-12 h-12 mb-4 text-[#334155]" />
                Hiện chưa có sản phẩm nào. Dữ liệu đang được cập nhật.
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsFromSanity.map((product: any) => (
              <Link 
                key={product._id} 
                href={`/${lang}/products/${product.slug}`}
                className="group bg-[#0f172a]/50 border border-[#334155]/50 p-8 rounded-2xl hover:border-[#f97316]/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                {/* Hiện nhãn thông báo nếu bài này chưa được dịch sang ngôn ngữ đang xem */}
                {product.language !== lang && (
                    <div className="absolute top-0 right-0 bg-[#f97316] text-[#020617] text-[10px] px-2 py-1 font-bold uppercase tracking-tighter opacity-80">
                        {product.language || 'Original'} Version
                    </div>
                )}

                <div className="flex items-center text-sm font-medium text-[#f97316] mb-2">
                    <HardHat className="w-4 h-4 mr-1" />
                    <span>{product.serviceCategory?.title || "Thiết bị Công nghiệp"}</span>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-[#f97316] transition-colors">
                  {/* Sửa: Dùng đúng tên biến 'title' để khớp dữ liệu Sanity */}
                  {product.title} 
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {/* Sửa: Dùng đúng tên biến 'description' để khớp dữ liệu Sanity */}
                  {product.description} 
                </p>
                
                <div className="flex items-center gap-2 text-[#f97316] font-medium text-sm mt-auto">
                  {dictionary.common?.read_more || "Chi tiết"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
        </div>
    );
}

// --- 4. TẠO THÔNG TIN SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return {
    title: "Sản phẩm & Thiết bị - ZINITEK",
    description: "Danh sách các máy móc, thiết bị và sản phẩm gia công chính xác của ZINITEK.",
  }
}

// --- 5. COMPONENT CHÍNH ---
export default async function ProductsListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      <section className="pt-40 pb-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase">
            Sản phẩm & <span className="text-[#f97316] italic">Thiết bị</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-pretty">
            Khám phá danh mục máy móc và các sản phẩm gia công CNC tiêu biểu được thực hiện bởi ZINITEK.
          </p>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsGridSkeleton count={6} />}>
            <ProductsGrid lang={lang} dictionary={dictionary} />
          </Suspense>
        </div>
      </section>

      <Footer lang={lang} dict={dictionary} />
    </main>
  )
}