// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { ServicePageContent } from "@/components/service-page-content"
import { getDictionary } from "@/lib/get-dictionary"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Tắt CDN để lấy dữ liệu mới nhất
})

// --- 2. HÀM LẤY CHI TIẾT DỊCH VỤ VỚI LOGIC DỰ PHÒNG THÔNG MINH ---
async function layChiTietDichVu(duongDanSlug: string, ngonNguHienTai: string) {
  
  // BƯỚC A: Tìm tài liệu gốc dựa trên slug để lấy mã liên kết dịch thuật (_translationKey)
  // Bất kể đang ở ngôn ngữ nào, chỉ cần slug khớp là tìm ra nhóm.
  const dichVuGoc = await trinhKetNoiSanity.fetch(
    `*[_type == "service" && slug.current == $duongDanSlug][0] { _translationKey }`,
    { duongDanSlug }
  );

  if (!dichVuGoc) return null;

  const khoaLienKet = dichVuGoc._translationKey;

  // BƯỚC B: Truy vấn bản dịch tốt nhất và lấy thông tin ánh xạ ngôn ngữ
  const cauTruyVanGroq = `
    coalesce(
      *[_type == "service" && _translationKey == $khoaLienKet && language == $ngonNguHienTai][0],
      *[_type == "service" && _translationKey == $khoaLienKet && language == "en"][0],
      *[_type == "service" && _translationKey == $khoaLienKet && language == "vi"][0]
    ) {
      _id,
      title,
      shortTitle,
      "slug": slug.current,
      icon,
      description,
      // Lấy URL ảnh thực tế
      "image": image.asset->url,
      
      "tags": coalesce(tags, []),
      "features": coalesce(features, []),
      "specs": coalesce(specs, []),
      "process": coalesce(process, []),
      "labels": coalesce(labels, {
        "featuresTitle": "Tính năng nổi bật",
        "specsTitle": "Thông số kỹ thuật",
        "processTitle": "Quy trình làm việc",
        "relatedTitle": "Dịch vụ liên quan"
      }),
      language,

      // QUAN TRỌNG: Lấy danh sách các slug tương ứng ở các ngôn ngữ khác
      // Để phục vụ cho nút chuyển đổi ngôn ngữ trên Menu
      "banDichTuongUng": *[_type == "service" && _translationKey == ^._translationKey && defined(slug.current)] {
        language,
        "slug": slug.current
      }
    }
  `;

  return await trinhKetNoiSanity.fetch(cauTruyVanGroq, { khoaLienKet, ngonNguHienTai });
}

// --- 3. HÀM LẤY DỊCH VỤ LIÊN QUAN ---
async function layDichVuLienQuan(slugHienTai: string, ngonNgu: string) {
  // Lấy các dịch vụ khác cùng ngôn ngữ (hoặc fallback) để hiển thị ở cuối trang
  const cauTruyVan = `
    *[_type == "service" && defined(slug.current) && slug.current != $slugHienTai] | order(_createdAt desc)[0...3] {
      _id,
      _translationKey,
      language
    }
  `;
  
  const danhSachTho = await trinhKetNoiSanity.fetch(cauTruyVan, { slugHienTai });

  // Áp dụng logic chọn bản dịch tốt nhất cho từng mục liên quan
  const danhSachLienQuan = await Promise.all(danhSachTho.map(async (item: any) => {
    const khoa = item._translationKey || item._id;
    const queryOne = `
      coalesce(
        *[_type == "service" && _translationKey == $khoa && language == $ngonNgu][0],
        *[_type == "service" && _translationKey == $khoa && language == "en"][0],
        *[_type == "service" && _translationKey == $khoa && language == "vi"][0]
      ) {
        title,
        description,
        "slug": slug.current,
        icon,
        "image": image.asset->url
      }
    `;
    return await trinhKetNoiSanity.fetch(queryOne, { khoa, ngonNgu });
  }));

  return danhSachLienQuan.filter(Boolean); // Lọc bỏ các mục null
}

// --- 4. TẠO THÔNG TIN MÔ TẢ SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const thamSoUrl = await params
  const dichVu = await layChiTietDichVu(thamSoUrl.slug, thamSoUrl.lang)
  
  if (!dichVu) return { title: "Dịch vụ không tồn tại | ZINITEK" }

  return {
    title: `${dichVu.title} | ZINITEK`,
    description: dichVu.description,
  }
}

// --- 5. THÀNH PHẦN TRANG CHÍNH ---
export default async function ServiceDetailPage({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const thamSoUrl = await params
  const { lang, slug } = thamSoUrl
  
  const [duLieuDichVu, danhSachLienQuan, tuDien] = await Promise.all([
    layChiTietDichVu(slug, lang),
    layDichVuLienQuan(slug, lang),
    getDictionary(lang)
  ])

  if (!duLieuDichVu) {
    notFound()
  }

  return (
    <main className="bg-[#020617]">
      <ServicePageContent 
        service={duLieuDichVu} 
        relatedServices={danhSachLienQuan} 
        lang={lang}
        dict={tuDien}
      />
    </main>
  )
}