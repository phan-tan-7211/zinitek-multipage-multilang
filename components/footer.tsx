"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Cog, ExternalLink, Mail, MapPin, MessageCircle, Phone, Youtube, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "next-sanity"
import { useSiteSettings } from "@/components/site-settings-context"

const sanityClient = createClient({ projectId: "g4o3uumy", dataset: "production", apiVersion: "2024-01-01", useCdn: true })

interface LegalDocLink { _id: string; slug: string; title: string; language: string }

function TextSocialIcon({ text }: { text: string }) {
  return <span className="text-[9px] font-black uppercase tracking-tight" aria-hidden="true">{text}</span>
}

export function Footer({ lang, dict }: { lang: string; dict: any }) {
  const footer = dict?.footer || {}
  const navigation = dict?.navigation || {}
  const common = dict?.common || {}
  const {
    phoneDisplay, phoneTel, email, addressDisplay, googleMapsUrl,
    wechatId, wechatUrl, lineUrl, facebookUrl, youtubeUrl, tiktokUrl, twitterUrl,
  } = useSiteSettings()
  const [services, setServices] = useState<any[]>([])
  const [legalDocs, setLegalDocs] = useState<LegalDocLink[]>([])

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [allServices, allLegalDocs] = await Promise.all([
          sanityClient.fetch(`*[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))] | order(orderRank asc){_id,_translationKey,language,"slug":slug.current,title}`),
          sanityClient.fetch(`*[_type == "legalDoc" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_createdAt asc){_id,language,"slug":slug.current,title}`),
        ])
        const groups: Record<string, any[]> = {}
        allServices.forEach((item: any) => {
          const key = item._translationKey || item._id
          if (!groups[key]) groups[key] = []
          groups[key].push(item)
        })
        setServices(Object.values(groups).map((group: any[]) => group.find((i) => i.language === lang) || group.find((i) => i.language === "en") || group.find((i) => i.language === "vi") || group[0]))

        const normalizedDocs: LegalDocLink[] = allLegalDocs.map((item: any) => ({
          ...item,
          language: typeof item.language === "string" ? item.language : "vi",
          slug: typeof item.slug === "string" && item.slug.includes("/") ? item.slug.split("/").filter(Boolean).pop() : item.slug,
        })).filter((item: LegalDocLink) => item.slug && item.title)
        const byLang = (language: string) => normalizedDocs.filter((item) => item.language === language)
        const selected = byLang(lang).length ? byLang(lang) : byLang("en").length ? byLang("en") : byLang("vi").length ? byLang("vi") : normalizedDocs
        setLegalDocs(selected.slice(0, 3))
      } catch (error) {
        console.error("Lỗi tải dữ liệu tại Footer:", error)
        setLegalDocs([])
      }
    }
    loadFooterData()
  }, [lang])

  const quickLinks = [
    { name: navigation?.home || "Trang chủ", href: `/${lang}` },
    { name: navigation?.about || "Giới thiệu", href: `/${lang}/about` },
    { name: navigation?.services || "Dịch vụ", href: `/${lang}/services` },
    { name: navigation?.products || "Sản phẩm", href: `/${lang}/products` },
    { name: navigation?.projects || "Dự án", href: `/${lang}/portfolio` },
    { name: navigation?.blog || "Blog", href: `/${lang}/blog` },
  ]

  const socialLinks = [
    facebookUrl ? { href: facebookUrl, label: "Facebook", icon: <Facebook className="size-4" aria-hidden="true" /> } : null,
    youtubeUrl ? { href: youtubeUrl, label: "YouTube", icon: <Youtube className="size-4" aria-hidden="true" /> } : null,
    tiktokUrl ? { href: tiktokUrl, label: "TikTok", icon: <TextSocialIcon text="TT" /> } : null,
    lineUrl ? { href: lineUrl, label: "LINE", icon: <TextSocialIcon text="LINE" /> } : null,
    twitterUrl ? { href: twitterUrl, label: "X / Twitter", icon: <TextSocialIcon text="X" /> } : null,
    wechatUrl ? { href: wechatUrl, label: wechatId ? `WeChat ${wechatId}` : "WeChat", icon: <MessageCircle className="size-4" aria-hidden="true" /> } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: React.ReactNode }>

  const fallbackLegalLinks = [
    { name: footer?.privacy_policy || "Chính sách bảo mật", slug: "chinh-sach-bao-mat" },
    { name: footer?.terms_of_use || "Điều khoản sử dụng", slug: "dieu-khoan-su-dung" },
    { name: footer?.cookie_policy || "Chính sách cookie", slug: "chinh-sach-cookie" },
  ]
  const mapHref = googleMapsUrl || (addressDisplay ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressDisplay)}` : undefined)

  return (
    <footer className="relative border-t border-border/60 bg-secondary/20">
      <div className="content-shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Link href={`/${lang}`} className="mb-6 inline-flex min-h-12 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/75 shadow-lg shadow-primary/20"><Cog className="size-6 text-primary-foreground" aria-hidden="true" /></div>
              <div><span className="text-xl font-serif font-bold tracking-tight text-foreground">ZINI<span className="text-primary">TEK</span></span><p className="-mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">{common?.logo_subtitle || "Kỹ Thuật Cơ Khí"}</p></div>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-6 text-muted-foreground">{footer?.description || "Đối tác tin cậy trong lĩnh vực gia công cơ khí chính xác theo tiêu chuẩn Nhật Bản."}</p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} title={item.label} className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.icon}</a>
                ))}
              </div>
            )}
            {wechatId && !wechatUrl && <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground"><MessageCircle className="size-4 text-primary" />WeChat: <span className="font-semibold text-foreground">{wechatId}</span></p>}
          </div>

          <div>
            <h4 className="mb-5 text-sm font-serif font-bold uppercase tracking-wider text-foreground">{footer?.quick_links || "Liên kết nhanh"}</h4>
            <ul className="space-y-1">{quickLinks.map((link) => <li key={link.href}><Link href={link.href} className="group inline-flex min-h-10 items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />{link.name}</Link></li>)}</ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-serif font-bold uppercase tracking-wider text-foreground">{navigation?.services || "Dịch vụ"}</h4>
            <ul className="max-h-[250px] space-y-1 overflow-y-auto pr-2 scrollbar-hide">{services.length > 0 ? services.map((service, index) => <li key={service._id || `${service.slug}-${index}`}><Link href={`/${lang}/services/${service.slug}`} className="group inline-flex min-h-10 items-center gap-2 rounded-md text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />{service.title}</Link></li>) : <li className="text-xs italic text-muted-foreground">{navigation?.services || "Dịch vụ"}</li>}</ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-serif font-bold uppercase tracking-wider text-foreground">{navigation?.contact || "Liên hệ"}</h4>
            <div className="mb-7 space-y-3">
              {addressDisplay && mapHref && <a href={mapHref} target="_blank" rel="noopener noreferrer" className="group flex min-h-10 items-start gap-3 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Mở Google Maps: ${addressDisplay}`}><MapPin className="mt-0.5 size-5 shrink-0 text-primary transition-transform group-hover:scale-110" aria-hidden="true" /><span className="leading-6">{addressDisplay}<span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">Map <ExternalLink className="size-3" aria-hidden="true" /></span></span></a>}
              {phoneDisplay && phoneTel && <a href={`tel:${phoneTel}`} className="flex min-h-10 items-center gap-3 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />{phoneDisplay}</a>}
              {email && <a href={`mailto:${email}`} className="flex min-h-10 items-center gap-3 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Mail className="size-5 shrink-0 text-primary" aria-hidden="true" /><span className="break-all">{email}</span></a>}
              {wechatId && <div className="flex min-h-10 items-center gap-3 text-sm text-muted-foreground"><MessageCircle className="size-5 shrink-0 text-primary" aria-hidden="true" /><span>WeChat: <span className="font-medium text-foreground">{wechatId}</span></span></div>}
            </div>
            <h4 className="mb-3 text-xs font-serif font-bold uppercase tracking-widest text-foreground">{footer?.newsletter || "Bản tin"}</h4>
            <form className="flex gap-2" onSubmit={(event) => event.preventDefault()}><Input type="email" aria-label={footer?.placeholder_email || "Email của bạn"} placeholder={footer?.placeholder_email || "Email của bạn"} className="h-11 flex-1 rounded-xl border-border bg-background text-sm focus-visible:ring-ring" /><Button type="submit" size="icon" aria-label="Submit email" className="size-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"><ArrowRight className="size-4" aria-hidden="true" /></Button></form>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 bg-secondary/35"><div className="content-shell flex flex-col items-center justify-between gap-4 py-5 md:flex-row"><p className="text-center text-xs font-medium text-muted-foreground md:text-left">{footer?.copyright || "© 2026 ZINITEK. Tất cả quyền được bảo lưu."}</p><div className="flex flex-wrap justify-center gap-x-6 gap-y-2">{legalDocs.length > 0 ? legalDocs.map((link, index) => <Link key={link._id || `${link.slug}-${index}`} href={`/${link.language || lang}/policy/${link.slug}`} className="rounded-md text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{link.title}</Link>) : fallbackLegalLinks.map((link) => <Link key={link.slug} href={`/${lang}/policy/${link.slug}`} className="rounded-md text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{link.name}</Link>)}</div></div></div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" aria-hidden="true" />
    </footer>
  )
}
