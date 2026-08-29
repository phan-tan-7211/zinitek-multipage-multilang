import React from "react";
import type { Metadata } from 'next';
import { SmartSwipeWrapper } from "@/components/smart-swipe-wrapper";
import { Navigation } from "@/components/navigation";
import { MobileWidgetIndicator } from "@/components/mobile-widget-indicator";
import { FloatingContactBar } from "@/components/floating-contact-bar";
import { SiteSettingsProvider } from "@/components/site-settings-context";
import { getDictionary } from "@/lib/get-dictionary";
import { createClient } from "next-sanity";

const trinhKetNoiSanity = createClient({ projectId: 'g4o3uumy', dataset: 'production', apiVersion: '2024-01-01', useCdn: false })

async function layDanhSachDichVuTuSanity(ngonNguHienTai: string) {
  const danhSachTho: any[] = await trinhKetNoiSanity.fetch(`
    *[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))] | order(orderRank asc) {
      _id, _translationKey, "slug": slug.current, icon, language, title, "desc": description, orderRank
    }
  `)
  const cacNhom: Record<string, any[]> = {}
  danhSachTho.forEach((item: any) => {
    const khoa = item._translationKey || item._id
    if (!cacNhom[khoa]) cacNhom[khoa] = []
    cacNhom[khoa].push(item)
  })
  return Object.values(cacNhom)
    .map((nhom: any[]) => nhom.find((p) => p.language === ngonNguHienTai) || nhom.find((p) => p.language === 'en') || nhom.find((p) => p.language === 'vi') || nhom[0])
    .sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0))
    .map((service) => ({ slug: service.slug, icon: service.icon, language: service.language, title: service.title, desc: service.desc }))
}

async function layCauHinhWebsite() {
  return await trinhKetNoiSanity.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      phoneDisplay, phoneTel, email, zaloNumber,
      wechatId, wechatUrl, lineUrl,
      facebookUrl, youtubeUrl, tiktokUrl, twitterUrl,
      addressDisplay, googleMapsUrl
    }`,
    {},
    { next: { revalidate: 60, tags: ['site-settings'] } },
  )
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const cleanDescription = dict.hero.description.replace(/<[^>]*>?/gm, '')
  const siteTitle = `ZINITEK - ${dict.hero.title_line1} ${dict.hero.title_highlight}`
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zinitek.vn'),
    title: { default: siteTitle, template: `%s | ZINITEK` },
    description: cleanDescription,
    keywords: ['CNC Machining', 'Precision Engineering', 'Zinitek', 'Gia công CNC', 'Khuôn mẫu', 'Tự động hóa', 'Ché tạo cơ khí Nhật Bản'],
    alternates: { canonical: `/${lang}`, languages: { 'vi-VN': '/vi', 'en-US': '/en', 'ja-JP': '/jp', 'ko-KR': '/kr', 'zh-CN': '/cn' } },
    openGraph: {
      type: 'website',
      locale: lang === 'vi' ? 'vi_VN' : lang === 'en' ? 'en_US' : lang === 'jp' ? 'ja_JP' : lang === 'kr' ? 'ko_KR' : 'zh_CN',
      title: siteTitle, description: cleanDescription, url: `/${lang}`, siteName: 'ZINITEK',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ZINITEK — Gia công CNC & Khuôn mẫu' }],
    },
    twitter: { card: 'summary_large_image', title: siteTitle, description: cleanDescription, images: ['/og-image.jpg'] },
  }
}

export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }, { lang: 'jp' }, { lang: 'kr' }, { lang: 'cn' }]
}

export default async function LanguageLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [dict, services, siteSettings] = await Promise.all([getDictionary(lang), layDanhSachDichVuTuSanity(lang), layCauHinhWebsite()])
  const settings = siteSettings || {}
  const effectiveDict = {
    ...dict,
    common: {
      ...dict.common,
      phone_label: settings.phoneDisplay || "",
      email_label: settings.email || "",
    },
  }
  const servicesSlugs = services.map(({ slug, icon }) => ({ slug, icon }))

  return (
    <SiteSettingsProvider value={settings}>
      <Navigation lang={lang} dict={effectiveDict} initialServices={services} />
      <SmartSwipeWrapper lang={lang} services={servicesSlugs}>
        <main className="mx-auto min-h-dvh w-full overflow-hidden xl:w-[calc(100%-10rem)] xl:max-w-[1440px] xl:border-x xl:border-border/50 xl:shadow-[0_0_50px_rgba(15,23,42,0.08)] dark:xl:shadow-[0_0_50px_rgba(0,0,0,0.28)]">
          {children}
        </main>
      </SmartSwipeWrapper>
      <MobileWidgetIndicator lang={lang} dict={effectiveDict} services={servicesSlugs} />
      <FloatingContactBar />
    </SiteSettingsProvider>
  )
}
