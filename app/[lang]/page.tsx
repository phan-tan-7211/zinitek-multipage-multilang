
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { FeaturedProjects } from "@/components/featured-projects"
import { AboutSummary } from "@/components/about-summary"
import { Button } from "@/components/ui/button"
import { BlogCarousel } from "@/components/blog-carousel"
import Link from "next/link"
import Image from "next/image" // Thêm Image cho chuẩn SEO
import { ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/get-dictionary"
// Import hàm lấy dữ liệu tối ưu hóa tìm kiếm (SEO) từ Sanity
import { fetchSeoData } from "@/lib/fetch-seo-data"
import { createClient } from "next-sanity"

const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

/**
 * 1. HÀM TẠO METADATA (SEO)
 * Bổ sung alternates/canonical để giải quyết Duplicate Content.
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const thamSoGiaiMa = await params;
  const ngonNguHienTai = thamSoGiaiMa.lang;

  // Lấy dữ liệu SEO từ Sanity cho trang chủ ('home')
  const duLieuSeo = await fetchSeoData(ngonNguHienTai, 'home');

  const tieuDeMacDinh = 'ZINITEK - Kỹ thuật Nhật Bản, Chi phí Việt Nam | Gia công CNC & Khuôn mẫu';
  const moTaMacDinh = 'ZINITEK cung cấp giải pháp gia công CNC chính xác, thiết kế khuôn mẫu và tự động hóa nhà máy theo tiêu chuẩn chất lượng Nhật Bản.';
  const duongDanAnhSeo = duLieuSeo?.openGraphImage?.asset?.url;

  return {
    title: duLieuSeo?.metaTitle || tieuDeMacDinh,
    description: duLieuSeo?.metaDescription || moTaMacDinh,
    // FIX #10: Sync đủ 5 ngôn ngữ — trước đó thiếu jp và kr
    alternates: {
      canonical: `/${ngonNguHienTai}`,
      languages: {
        'vi-VN': '/vi',
        'en-US': '/en',
        'zh-CN': '/cn',
        'ja-JP': '/jp',
        'ko-KR': '/kr',
      },
    },
    openGraph: {
      type: 'website',
      title: duLieuSeo?.metaTitle || tieuDeMacDinh,
      description: duLieuSeo?.metaDescription || moTaMacDinh,
      url: `/${ngonNguHienTai}`,
      siteName: 'ZINITEK',
      images: duongDanAnhSeo ? [{ url: duongDanAnhSeo }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: duLieuSeo?.metaTitle || tieuDeMacDinh,
      description: duLieuSeo?.metaDescription || moTaMacDinh,
      images: duongDanAnhSeo ? [duongDanAnhSeo] : [],
    },
  };
}

/**
 * 2. COMPONENT TRANG CHỦ (HOME)
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  // Giải nén tham số ngôn ngữ (Bắt buộc dùng await trong Next.js 16)
  const thamSoGiaiMa = await params;
  const lang = thamSoGiaiMa.lang;

  // Lấy nội dung từ điển
  const dictionary = await getDictionary(lang);

  // Ép kiểu dữ liệu để tránh lỗi TypeScript khi truy cập dữ liệu JSON
  const blogDictionary = (dictionary.blog as any) || {};
  const newsDictionary = (dictionary.news_section as any) || {};

  // Lấy 3 bài viết blog mới nhất từ Sanity
  const blogQuery = `
    *[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      "imageUrl": mainImage.asset->url,
      "categoryName": category->title,
      language,
      _translationKey
    }
  `;
  const allPosts = await trinhKetNoiSanity.fetch(blogQuery);

  // Lọc lấy 3 bài viết đúng ngôn ngữ hiện tại (hoặc tiếng Anh/tiếng Việt làm dự phòng)
  const postsByTranslationKey: Record<string, any[]> = {};
  allPosts.forEach((post: any) => {
    const key = post._translationKey || post.slug;
    if (!postsByTranslationKey[key]) postsByTranslationKey[key] = [];
    postsByTranslationKey[key].push(post);
  });

  const latestPosts = Object.values(postsByTranslationKey).map((group: any[]) => {
    return group.find(p => p.language === lang) 
        || group.find(p => p.language === 'en') 
        || group.find(p => p.language === 'vi') 
        || group[0];
  }).slice(0, 5);

  // Lấy danh sách dự án mới nhất từ Sanity
  const projectQuery = `
    *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      title,
      "slug": slug.current,
      client,
      "categoryName": serviceCategory->title,
      "imageUrl": mainImage.asset->url,
      language,
      _translationKey
    }
  `;
  const allProjects = await trinhKetNoiSanity.fetch(projectQuery);

  const projectsByTranslationKey: Record<string, any[]> = {};
  allProjects.forEach((project: any) => {
    const key = project._translationKey || project.slug;
    if (!projectsByTranslationKey[key]) projectsByTranslationKey[key] = [];
    projectsByTranslationKey[key].push(project);
  });

  const latestProjects = Object.values(projectsByTranslationKey).map((group: any[]) => {
    return group.find(p => p.language === lang) 
        || group.find(p => p.language === 'en') 
        || group.find(p => p.language === 'vi') 
        || group[0];
  }).slice(0, 6);

  // FIX #11: Nâng cấp JSON-LD — thêm LocalBusiness, address, sameAs, image
  // → Giúp Google Maps liên kết, Knowledge Panel hiện social links, Local SEO mạnh hơn
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "ZINITEK",
    "url": `https://zinitek.vn/${lang}`,
    "logo": {
      "@type": "ImageObject",
      "url": "https://zinitek.vn/logo.png",
      "width": 200,
      "height": 60
    },
    "image": "https://zinitek.vn/og-image.jpg",
    "description": "Chuyên gia công CNC, thiết kế khuôn mẫu và tự động hóa theo tiêu chuẩn Nhật Bản.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Khu Công Nghệ Cao",
      "addressLocality": "TP. Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-77-622-0031",
      "contactType": "customer service",
      "availableLanguage": ["Vietnamese", "English", "Japanese", "Korean", "Chinese"]
    },
    "sameAs": [
      "https://www.facebook.com/zinitek",
      "https://zalo.me/zinitek"
    ],
    "priceRange": "$$"
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Chèn JSON-LD phục vụ Google Bot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nền Blueprint hiển thị phía dưới cùng */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" aria-hidden="true">
        <BlueprintBackground />
      </div>

      <div className="relative z-10 pt-20 lg:pt-28">

        {/* Các component cốt lõi - Đã cấu hình Prop đúng theo yêu cầu hệ thống */}
        <HeroSection dict={dictionary} />
        <AboutSummary dict={dictionary} lang={lang} />
        <FeaturedProjects dict={dictionary} projects={latestProjects} />

        {/* --- Section Tin tức & Blog --- */}
        <section aria-labelledby="news-section-title" className="py-24 bg-transparent relative">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-px bg-[#f97316]"></div>
                  <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
                    {newsDictionary?.badge || "Kiến thức & Tin tức"}
                  </span>
                </div>
                <h2 id="news-section-title" className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {newsDictionary?.title_main || "Góc nhìn"}{" "}
                  <span className="italic text-[#f97316]">
                    {newsDictionary?.title_highlight || "Chuyên gia"}
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  {newsDictionary?.description || "Cập nhật xu hướng công nghệ cơ khí và kinh nghiệm gia công từ đội ngũ ZINITEK."}
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="group border-[#f97316]/40 text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all duration-300 bg-transparent px-8 py-7 rounded-full text-lg font-semibold dark:hover:text-white"
              >
                <Link href={`/${lang}/blog`} aria-label="Xem tất cả bài viết trên blog">
                  {newsDictionary?.view_all || "Xem tất cả bài viết"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              {latestPosts.length > 0 ? (
                <BlogCarousel 
                  posts={latestPosts} 
                  lang={lang} 
                  readMoreText={blogDictionary?.read_more} 
                  categoryNewsText={blogDictionary?.category_news}
                />
              ) : (
                <p className="text-muted-foreground italic col-span-3 text-center">{blogDictionary?.no_posts || "Đang cập nhật bài viết mới..."}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer lang={lang} dict={dictionary} />
    </main>
  );
}