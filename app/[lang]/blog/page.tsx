// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { BlogSection } from "@/components/blog-section"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM TRUY VẤN DANH SÁCH BÀI VIẾT VỚI LOGIC DỰ PHÒNG THÔNG MINH ---
async function layDanhSachBaiVietTuSanity(ngonNguHienTai: string) {
  /**
   * LÔ-GIC: 
   * 1. Lấy tất cả tài liệu có kiểu là 'post' (bài viết blog).
   * 2. Gom nhóm theo _translationKey để tránh trùng lặp bản dịch.
   * 3. Ưu tiên lấy bản dịch theo thứ tự: Ngôn ngữ hiện tại > Tiếng Anh > Tiếng Việt.
   */
  const cauTruyVanBaiViet = `
    *[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] {
      _id,
      _translationKey,
      title,
      "slug": slug.current,
      language,
      excerpt,
      "mainImage": mainImage.asset->{ url },
      publishedAt,
      "category": category->title
    }
  `;

  const danhSachBaiVietTho = await trinhKetNoiSanity.fetch(cauTruyVanBaiViet);

  // Thuật toán lọc bản dịch tốt nhất cho từng bài viết
  const cacNhomBaiViet: Record<string, any[]> = {};

  danhSachBaiVietTho.forEach((baiViet: any) => {
    const khoaDinhDanh = baiViet._translationKey || baiViet._id;
    if (!cacNhomBaiViet[khoaDinhDanh]) {
      cacNhomBaiViet[khoaDinhDanh] = [];
    }
    cacNhomBaiViet[khoaDinhDanh].push(baiViet);
  });

  const danhSachBaiVietCuoiCung = Object.values(cacNhomBaiViet).map((nhomPhienBan: any[]) => {
    const banDichDungNgonNgu = nhomPhienBan.find((phienBan) => phienBan.language === ngonNguHienTai);
    const banDichTiengAnh = nhomPhienBan.find((phienBan) => phienBan.language === 'en');
    const banDichTiengViet = nhomPhienBan.find((phienBan) => phienBan.language === 'vi');

    return banDichDungNgonNgu || banDichTiengAnh || banDichTiengViet || nhomPhienBan[0];
  });

  // Sắp xếp bài viết theo ngày đăng mới nhất
  return danhSachBaiVietCuoiCung.sort((doiTuongA, doiTuongB) => 
    new Date(doiTuongB.publishedAt).getTime() - new Date(doiTuongA.publishedAt).getTime()
  );
}

// --- 3. TẠO THÔNG TIN MÔ TẢ SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const thamSoDuongDan = await params;
  const tuDien = await getDictionary(thamSoDuongDan.lang);
  
  return {
    title: tuDien.blog?.meta_title || "Blog Kỹ Thuật - ZINITEK",
    description: tuDien.blog?.meta_desc || "Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK.",
  }
}

// --- 4. THÀNH PHẦN TRANG CHÍNH ---
export default async function BlogPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const thamSoDuongDan = await params;
  const ngonNgu = thamSoDuongDan.lang;
  
  // Lấy từ điển và dữ liệu bài viết song song
  const [tuDien, danhSachBaiViet] = await Promise.all([
    getDictionary(ngonNgu),
    layDanhSachBaiVietTuSanity(ngonNgu)
  ]);

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      <div className="relative z-10 pt-20 lg:pt-28">
        <PageHeader 
          heading={tuDien.blog?.title || "Blog"}
          text={tuDien.blog?.description || "Kiến thức chuyên sâu về cơ khí chính xác và tự động hóa."}
          lang={ngonNgu}
          dict={tuDien}
        />
        
        {/* 
            TRUYỀN DỮ LIỆU ĐỘNG VÀO BLOG SECTION:
            - posts: Danh sách bài viết đã qua lọc Fallback.
        */}
        <BlogSection 
          posts={danhSachBaiViet} 
          lang={ngonNgu} 
          dict={tuDien} 
        />
      </div>

      <Footer lang={ngonNgu} dict={tuDien} />
    </main>
  )
}