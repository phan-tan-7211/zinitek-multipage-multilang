// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { ServicePageContent } from "@/components/service-page-content"
import { getDictionary } from "@/lib/get-dictionary"
// SỬA LỖI: Thêm Footer vào trang chi tiết dịch vụ
// ServicePageContent là "use client" nên Footer phải đặt ở server component (page.tsx) này
import { Footer } from "@/components/footer"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM LẤY CHI TIẾT DỊCH VỤ VỚI LOGIC DỰ PHÒNG THÔNG MINH ---
async function layChiTietDichVu(duongDanSlug: string, ngonNguHienTai: string) {

  // BƯỚC A: Tìm tài liệu gốc dựa trên slug để lấy mã liên kết dịch thuật (_translationKey)
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
  const cauTruyVan = `
    *[_type == "service" && defined(slug.current) && slug.current != $slugHienTai] | order(_createdAt desc)[0...3] {
      _id,
      _translationKey,
      language
    }
  `;

  const danhSachTho = await trinhKetNoiSanity.fetch(cauTruyVan, { slugHienTai });

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

  return danhSachLienQuan.filter(Boolean);
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
    <main className="bg-[#020617] min-h-screen">
      <ServicePageContent
        service={duLieuDichVu}
        relatedServices={danhSachLienQuan}
        lang={lang}
        dict={tuDien}
      />
      {/* SỬA LỖI: Footer được đặt ở đây, ở ngoài ServicePageContent (là client component) */}
      <Footer lang={lang} dict={tuDien} />
    </main>
  )
}