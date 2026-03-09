
import React from "react";
import type { Metadata } from 'next';
import { SmartSwipeWrapper } from "@/components/smart-swipe-wrapper";
import { Navigation } from "@/components/navigation";
import { MobileWidgetIndicator } from "@/components/mobile-widget-indicator";
import { getDictionary } from "@/lib/get-dictionary";
import { createClient } from "next-sanity";

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// --- 2. HÀM LẤY DANH SÁCH DỊCH VỤ TỪ SANITY ---
async function layDanhSachDichVuTuSanity(ngonNguHienTai: string) {
  const cauTruyVan = `
    *[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))] {
      _id,
      _translationKey,
      "slug": slug.current,
      "icon": icon.metadata.iconName,
      language
    }
  `;

  const danhSachTho = await trinhKetNoiSanity.fetch(cauTruyVan);

  // Lọc bản dịch tốt nhất
  const cacNhom: Record<string, any[]> = {};
  danhSachTho.forEach((item: any) => {
    const khoa = item._translationKey || item._id;
    if (!cacNhom[khoa]) cacNhom[khoa] = [];
    cacNhom[khoa].push(item);
  });

  const danhSachCuoiCung = Object.values(cacNhom).map((nhom: any[]) => {
    const banDungNgonNgu = nhom.find((p) => p.language === ngonNguHienTai);
    const banTiengAnh = nhom.find((p) => p.language === 'en');
    const banTiengViet = nhom.find((p) => p.language === 'vi');
    return banDungNgonNgu || banTiengAnh || banTiengViet || nhom[0];
  });

  return danhSachCuoiCung.map(s => ({ slug: s.slug, icon: s.icon || 'star' }));
}

// --- TỐI ƯU SEO QUỐC TẾ (DYNAMIC METADATA) ---
export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang);

  // Xử lý loại bỏ thẻ HTML khỏi mô tả để SEO sạch sẽ
  const cleanDescription = dict.hero.description.replace(/<[^>]*>?/gm, '');
  const siteTitle = `ZINITEK - ${dict.hero.title_line1} ${dict.hero.title_highlight}`;

  return {
    metadataBase: new URL(
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    ),
    title: {
      default: siteTitle,
      template: `%s | ZINITEK`
    },
    description: cleanDescription,
    keywords: ['CNC Machining', 'Precision Engineering', 'Zinitek'],
    // ... các trường metadata khác giữ nguyên
    alternates: {
      canonical: `/${lang}`,
      languages: { 'vi-VN': '/vi', 'en-US': '/en', 'ja-JP': '/jp' },
    },
    openGraph: {
      title: siteTitle,
      description: cleanDescription,
      url: `/${lang}`,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }, { lang: 'jp' }, { lang: 'kr' }, { lang: 'cn' }];
}

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // BẮT BUỘC: Phải dùng await params trong Next.js 16
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  // Lấy dữ liệu ngôn ngữ và danh sách dịch vụ động từ Sanity
  const [dict, servicesSlugs] = await Promise.all([
    getDictionary(lang),
    layDanhSachDichVuTuSanity(lang)
  ]);

  return (
    <>
      {/* 1. THANH ĐIỀU HƯỚNG CỐ ĐỊNH Ở TRÊN CÙNG */}
      <Navigation lang={lang} dict={dict} />

      {/* 2. KHUNG BAO QUẢN LÝ VUỐT CHUYỂN TRANG */}
      <SmartSwipeWrapper lang={lang}>
        <main className="min-h-screen">
          {children}
        </main>
      </SmartSwipeWrapper>

      {/* 3. THANH CHỈ BÁO VỊ TRÍ TRANG TRÊN DI ĐỘNG KÈM DỮ LIỆU ĐỘNG */}
      <MobileWidgetIndicator lang={lang} dict={dict} services={servicesSlugs} />
    </>
  );
}