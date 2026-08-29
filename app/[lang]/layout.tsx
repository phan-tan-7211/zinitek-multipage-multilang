
import React from "react";
import type { Metadata } from 'next';
import { SmartSwipeWrapper } from "@/components/smart-swipe-wrapper";
import { Navigation } from "@/components/navigation";
import { MobileWidgetIndicator } from "@/components/mobile-widget-indicator";
import { FloatingContactBar } from "@/components/floating-contact-bar";
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
      // FIX #6: Hardcode domain production — tránh VERCEL_URL preview ngẫu nhiên
      process.env.NEXT_PUBLIC_SITE_URL || 'https://zinitek.vn'
    ),
    title: {
      default: siteTitle,
      template: `%s | ZINITEK`
    },
    description: cleanDescription,
    keywords: [
      'CNC Machining', 'Precision Engineering', 'Zinitek',
      'Gia công CNC', 'Khuôn mẫu', 'Tự động hóa', 'Ché tạo cơ khí Nhật Bản'
    ],
    // FIX #9: Sync đủ 5 ngôn ngữ với generateStaticParams
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'vi-VN': '/vi',
        'en-US': '/en',
        'ja-JP': '/jp',
        'ko-KR': '/kr',
        'zh-CN': '/cn',
      },
    },
    // FIX #8: Thêm type, locale, siteName cho OG chuẩn i18n
    openGraph: {
      type: 'website',
      locale: lang === 'vi' ? 'vi_VN'
            : lang === 'en' ? 'en_US'
            : lang === 'jp' ? 'ja_JP'
            : lang === 'kr' ? 'ko_KR'
            : 'zh_CN',
      title: siteTitle,
      description: cleanDescription,
      url: `/${lang}`,
      siteName: 'ZINITEK',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ZINITEK — Gia công CNC & Khuôn mẫu' }],
    },
    // FIX #7: Thêm Twitter Card — trước đó hoàn toàn thiếu
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: cleanDescription,
      images: ['/og-image.jpg'],
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
      <SmartSwipeWrapper lang={lang} services={servicesSlugs}>
        <main className="min-h-screen">
          {children}
        </main>
      </SmartSwipeWrapper>

      {/* 3. THANH CHỈ BÁO VỊ TRÍ TRANG TRÊN DI ĐỘNG KÈM DỮ LIỆU ĐỘNG */}
      <MobileWidgetIndicator lang={lang} dict={dict} services={servicesSlugs} />

      {/* 4. THANH LIÊN HỆ NỔI BÊN TRÁI (HOTLINE, ZALO, MAP, LÊN TOP) */}
      <FloatingContactBar />
    </>
  );
}