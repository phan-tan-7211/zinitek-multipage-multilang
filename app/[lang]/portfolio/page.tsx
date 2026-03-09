


import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { PortfolioListContent } from "@/components/portfolio-list-content"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"
import { createClient } from "next-sanity"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Tắt CDN để đảm bảo dữ liệu hiển thị ngay lập tức sau khi Publish
})

// --- 2. HÀM TRUY VẤN DỮ LIỆU DỰ ÁN VÀ DANH MỤC LỌC ---
async function layDuLieuPortfolio(ngonNguHienTai: string) {
  // A. Truy vấn lấy toàn bộ các dự án (không lọc ngôn ngữ ở đây để làm Fallback)
  const cauTruyVanDuAn = `
    *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))] {
      _id,
      _translationKey,
      title,
      client,
      description,
      "slug": slug.current,
      language,
      "image": mainImage.asset->{ url },
      "categoryIdentifier": serviceCategory->_id // Lấy ID của dịch vụ để làm mã lọc
    }
  `;

  // B. Truy vấn lấy danh sách Dịch vụ hiện có để làm các nút bấm bộ lọc
  const cauTruyVanDanhMuc = `
    *[_type == "service" && language == $ngonNguHienTai] | order(orderRank asc) {
      _id,
      title
    }
  `;

  const [danhSachDuAnTho, danhSachDanhMucLoc] = await Promise.all([
    trinhKetNoiSanity.fetch(cauTruyVanDuAn),
    trinhKetNoiSanity.fetch(cauTruyVanDanhMuc, { ngonNguHienTai })
  ]);

  // --- THUẬT TOÁN GOM NHÓM VÀ LỌC BẢN DỊCH TỐT NHẤT (SMART FALLBACK) ---
  const nhomDuAn: Record<string, any[]> = {};

  danhSachDuAnTho.forEach((duAn: any) => {
    // Gom các dự án là bản dịch của nhau vào chung một nhóm dựa trên _translationKey
    const khoaDinhDanh = duAn._translationKey || duAn._id;
    if (!nhomDuAn[khoaDinhDanh]) {
      nhomDuAn[khoaDinhDanh] = [];
    }
    nhomDuAn[khoaDinhDanh].push(duAn);
  });

  const danhSachDuAnCuoiCung = Object.values(nhomDuAn).map((danhSachPhienBan: any[]) => {
    // Thứ tự ưu tiên: Ngôn ngữ đang xem -> Tiếng Anh -> Tiếng Việt -> Bản đầu tiên
    return banDichDungNgonNgu || banDichTiengAnh || banDichTiengViet || danhSachPhienBan[0];
  });

  return {
    danhSachDuAn: danhSachDuAnCuoiCung,
    danhSachDanhMuc: danhSachDanhMucLoc
  };
}

// --- 3. TẠO THÔNG TIN MÔ TẢ SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const thamSoUrl = await params;
  return {
    title: "Dự án tiêu biểu - ZINITEK",
    description: "Khám phá các dự án gia công cơ khí chính xác và giải pháp tự động hóa tiêu biểu của ZINITEK.",
  };
}

// --- 4. THÀNH PHẦN TRANG CHÍNH ---
export default async function PortfolioPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const thamSoUrl = await params;
  const { lang } = thamSoUrl;

  // Lấy từ điển và dữ liệu Sanity song song
  const [tuDien, duLieuPortfolio] = await Promise.all([
    getDictionary(lang),
    layDuLieuPortfolio(lang)
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Nền bản vẽ Blueprint đặc trưng */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Loai bỏ pt-20 thừa thãi gây ra "ghost strip" */}
      <div className="relative z-10">
        {/* Phần đầu trang: Lấy tiêu đề và mô tả từ file JSON theo ngôn ngữ */}
        <PageHeader
          // Sửa heading thành title
          title={tuDien.portfolio?.title || "Dự án"}
          // Sửa text thành description
          description={tuDien.portfolio?.description || "Khám phá các dự án gia công cơ khí chính xác và giải pháp tự động hóa tiêu biểu của ZINITEK."}
          // Bổ sung subtitle (vì linh kiện PageHeader yêu cầu)
          subtitle={tuDien.portfolio?.subtitle || "Thành tựu tiêu biểu"}
          lang={lang}
          dict={tuDien}
        />

        {/* 
            TRUYỀN DỮ LIỆU ĐỘNG VÀO COMPONENT HIỂN THỊ:
            - projects: Danh sách dự án đã qua xử lý Fallback.
            - categories: Danh sách dịch vụ thực tế để làm bộ lọc.
        */}
        <section className="pb-32 relative z-10">
          <PortfolioListContent
            projects={duLieuPortfolio.danhSachDuAn}
            categories={duLieuPortfolio.danhSachDanhMuc}
            lang={lang}
            dict={tuDien}
          />
        </section>
      </div>

      <Footer lang={lang} dict={tuDien} />
    </main>
  );
}