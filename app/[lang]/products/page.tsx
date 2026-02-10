// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { Footer } from "@/components/footer"
import { Suspense } from 'react';
import { BlueprintBackground } from "@/components/blueprint-background"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"
import { ProductsGridSkeleton } from "@/components/product-card-skeleton"
import { ProductListContent } from "@/components/product-list-content"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY (SANITY CLIENT) ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Đảm bảo lấy dữ liệu mới nhất từ máy chủ
})

// --- 2. HÀM XỬ LÝ LOGIC GOM NHÓM VÀ TỰ ĐỘNG DỊCH DANH MỤC ---
async function layDuLieuSanPhamVaDanhMuc(ngonNguHienTai: string) {
  
  /**
   * TRUY VẤN 1: Lấy tất cả các nhóm dịch thuật (Translation Metadata)
   * SỬA ĐỔI: Thêm trường 'taiLieuDinhKemUrl' để lấy đường dẫn tệp tin PDF đầu tiên.
   */
  const cauTruyVanNhomDich = `
    *[_type == "translation.metadata" && "product" in schemaTypes] {
      translations[] {
        ...value->{
          _id,
          title,
          description,
          "slug": slug.current,
          language,
          "image": image.asset->{ url },
          // Lấy đường dẫn URL của tài liệu đính kèm đầu tiên trong mảng attachments
          "taiLieuDinhKemUrl": attachments[0].asset->url,
          // Logic: Tự động tìm bản dịch của Dịch vụ khớp với ngôn ngữ hiện tại
          "categoryInfo": coalesce(
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $ngonNguHienTai][0],
            *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en"][0],
            serviceCategory->
          ) { _id, title }
        }
      }
    }
  `;

  /**
   * TRUY VẤN 2: Lấy tất cả sản phẩm đơn lẻ (Dự phòng cho sản phẩm chưa có Metadata)
   * SỬA ĐỔI: Thêm trường 'taiLieuDinhKemUrl' tương tự như trên.
   */
  const cauTruyVanTatCaSanPham = `
    *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))] {
      _id,
      title,
      description,
      "slug": slug.current,
      language,
      "image": image.asset->{ url },
      // Lấy đường dẫn URL của tài liệu đính kèm đầu tiên trong mảng attachments
      "taiLieuDinhKemUrl": attachments[0].asset->url,
      "categoryInfo": coalesce(
        *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == $ngonNguHienTai][0],
        *[_type == "service" && _translationKey == ^.serviceCategory->_translationKey && language == "en"][0],
        serviceCategory->
      ) { _id, title }
    }
  `;

  /**
   * TRUY VẤN 3: Lấy danh sách Dịch vụ để làm nhãn cho bộ lọc
   */
  const cauTruyVanDanhMucLoc = `
    *[_type == "service" && language == $ngonNguHienTai] | order(orderRank asc) {
      _id,
      title
    }
  `;

  // Thực hiện truy vấn dữ liệu song song để tối ưu tốc độ
  const [cacNhomDichThuatthuat, tatCaSanPhamTho, danhSachDanhMucLoc] = await Promise.all([
    trinhKetNoiSanity.fetch(cauTruyVanNhomDich, { ngonNguHienTai }),
    trinhKetNoiSanity.fetch(cauTruyVanTatCaSanPham, { ngonNguHienTai }),
    trinhKetNoiSanity.fetch(cauTruyVanDanhMucLoc, { ngonNguHienTai })
  ]);

  // --- THUẬT TOÁN GOM NHÓM VÀ LỌC BẢN DỊCH TỐT NHẤT ---
  const danhSachSanPhamCuoiCung: any[] = [];
  const tapHopIdDaXuLy = new Set<string>(); 

  // Bước A: Ưu tiên xử lý sản phẩm từ các nhóm Metadata
  cacNhomDichThuatthuat.forEach((nhom: any) => {
    const cacPhienBan = nhom.translations || [];
    
    // Đánh dấu tất cả ID trong nhóm này là đã xử lý
    cacPhienBan.forEach((phienBan: any) => {
        if (phienBan && phienBan._id) tapHopIdDaXuLy.add(phienBan._id);
    });

    // Chọn bản dịch ưu tiên: Hiện tại -> Tiếng Anh -> Tiếng Việt -> Đầu tiên
    let banDichDuocChon = cacPhienBan.find((p: any) => p?.language === ngonNguHienTai);
    if (!banDichDuocChon) banDichDuocChon = cacPhienBan.find((p: any) => p?.language === 'en');
    if (!banDichDuocChon) banDichDuocChon = cacPhienBan.find((p: any) => p?.language === 'vi');
    if (!banDichDuocChon && cacPhienBan.length > 0) banDichDuocChon = cacPhienBan[0];

    if (banDichDuocChon) danhSachSanPhamCuoiCung.push(banDichDuocChon);
  });

  // Bước B: Bổ sung các sản phẩm chưa có trong Metadata (Sản phẩm đơn lẻ)
  tatCaSanPhamTho.forEach((sanPham: any) => {
    if (!tapHopIdDaXuLy.has(sanPham._id)) {
        danhSachSanPhamCuoiCung.push(sanPham);
    }
  });

  // Sắp xếp danh sách theo tiêu đề để hiển thị ổn định
  danhSachSanPhamCuoiCung.sort((doiTuongA, doiTuongB) => 
    (doiTuongA.title || "").localeCompare(doiTuongB.title || "")
  );

  return { 
    danhSachSanPham: danhSachSanPhamCuoiCung, 
    danhSachDanhMuc: danhSachDanhMucLoc 
  };
}

// --- 3. THÀNH PHẦN GRID (SERVER COMPONENT) ---
async function ProductsGrid({ lang, dictionary }: { lang: string, dictionary: any }) {
    const { danhSachSanPham, danhSachDanhMuc } = await layDuLieuSanPhamVaDanhMuc(lang);

    return (
        <ProductListContent 
            initialProducts={danhSachSanPham} 
            categories={danhSachDanhMuc}
            dictionary={dictionary}
            currentLanguage={lang}
        />
    );
}

// --- 4. TẠO THÔNG TIN SEO ĐỘNG ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const thamSoUrl = await params;
  return {
    title: "Sản phẩm & Thiết bị - ZINITEK",
    description: "Khám phá danh mục máy móc và các sản phẩm gia công cơ khí chính xác của ZINITEK.",
  }
}

// --- 5. COMPONENT CHÍNH CỦA TRANG ---
export default async function ProductsListPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const thamSoDuongDan = await params;
  const ngonNguHienTai = thamSoDuongDan.lang;
  const tuDienNgonNgu = await getDictionary(ngonNguHienTai);

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      {/* Nền Blueprint đặc trưng của Zinitek */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Hero Section: Giữ nguyên tiêu đề và mô tả theo yêu cầu */}
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

      {/* Hiển thị danh sách sản phẩm với cơ chế Skeleton Loading */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsGridSkeleton count={10} />}>
            <ProductsGrid lang={ngonNguHienTai} dictionary={tuDienNgonNgu} />
          </Suspense>
        </div>
      </section>

      <Footer lang={ngonNguHienTai} dict={tuDienNgonNgu} />
    </main>
  )
}