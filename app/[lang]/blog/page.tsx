


import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { BlogListContent } from "@/components/blog-list-content"
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

  return danhSachBaiVietCuoiCung.sort((doiTuongA, doiTuongB) =>
    new Date(doiTuongB.publishedAt).getTime() - new Date(doiTuongA.publishedAt).getTime()
  );
}

// --- 3. TẠO THÔNG TIN MÔ TẢ SEO ---
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const thamSoDuongDan = await params;
  const lang = thamSoDuongDan.lang;
  const tuDien = await getDictionary(lang);

  const title = tuDien.blog?.meta_title || "Blog Kỹ Thuật - ZINITEK"
  const description = tuDien.blog?.meta_desc || "Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK."

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        'vi': '/vi/blog',
        'en': '/en/blog',
        'cn': '/cn/blog',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/blog`,
      siteName: 'ZINITEK',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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

  const [tuDien, danhSachBaiViet] = await Promise.all([
    getDictionary(ngonNgu),
    layDanhSachBaiVietTuSanity(ngonNgu)
  ]);

  // Khởi tạo Schema.org (JSON-LD) cho danh sách Blog
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": tuDien.blog?.meta_title || "Blog Kỹ Thuật ZINITEK",
    "description": tuDien.blog?.meta_desc,
    "url": `https://zinitek.vn/${ngonNgu}/blog`,
    "blogPost": danhSachBaiViet.map((baiViet: any) => ({
      "@type": "BlogPosting",
      "headline": baiViet.title,
      "url": `https://zinitek.vn/${ngonNgu}/blog/${baiViet.slug}`,
      "datePublished": baiViet.publishedAt,
      "image": baiViet.mainImage?.url
    }))
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Chèn JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-10 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Loai bỏ pt-20 thừa thãi */}
      <div className="relative z-10">
        <PageHeader
          title={tuDien.blog?.title || "Blog"}
          subtitle={tuDien.blog?.subtitle || "Bài viết"}
          description={tuDien.blog?.description || "Kiến thức chuyên sâu về cơ khí chính xác và tự động hóa."}
          lang={ngonNgu}
          dict={tuDien}
        />

        <section className="pb-32 relative z-10">
          <BlogListContent
            posts={danhSachBaiViet}
            lang={ngonNgu}
            dict={tuDien}
          />
        </section>
      </div>

      <Footer lang={ngonNgu} dict={tuDien} />
    </main>
  )
}