"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink, Mail, MapPin, MessageCircle, Phone, Youtube, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSiteSettings } from "@/components/site-settings-context"
import { SiteLogoMark, SiteLogoWordmark } from "@/components/site-logo"
import { resolveSiteName } from "@/lib/site-settings"
import { sanityCdnClient } from "@/lib/sanity-client"

interface LegalDocLink { _id: string; slug: string; title: string; language: string }
interface FooterLocation { _key?: string; enabled?: boolean; name?: Record<string,string>; address?: string; googleMapsUrl?: string }
function TextSocialIcon({ text }: { text: string }) { return <span className="text-[9px] font-black uppercase tracking-tight" aria-hidden="true">{text}</span> }

export function Footer({ lang, dict }: { lang: string; dict: any }) {
  const footer = dict?.footer || {}; const navigation = dict?.navigation || {}; const common = dict?.common || {}
  const siteSettings = useSiteSettings(); const siteName = resolveSiteName(siteSettings)
  const { phoneDisplay, phoneTel, email, wechatId, wechatUrl, lineUrl, facebookUrl, youtubeUrl, tiktokUrl, twitterUrl } = siteSettings
  const [services,setServices]=useState<any[]>([]); const [legalDocs,setLegalDocs]=useState<LegalDocLink[]>([]); const [locations,setLocations]=useState<FooterLocation[]>([])

  useEffect(()=>{ async function loadFooterData(){ try {
    const [allServices,allLegalDocs,locationDoc]=await Promise.all([
      sanityCdnClient.fetch(`*[_type=="service"&&defined(slug.current)&&!(_id in path("drafts.**"))]|order(orderRank asc){_id,_translationKey,language,"slug":slug.current,title}`),
      sanityCdnClient.fetch(`*[_type=="legalDoc"&&defined(slug.current)&&!(_id in path("drafts.**"))]|order(_createdAt asc){_id,language,"slug":slug.current,title}`),
      sanityCdnClient.fetch(`*[_type=="locationsSettings"&&_id=="locationsSettings"&&!(_id in path("drafts.**"))][0]{locations[]{_key,enabled,name,address,googleMapsUrl}}`),
    ])
    const groups:Record<string,any[]>={}; allServices.forEach((i:any)=>{const k=i._translationKey||i._id;(groups[k] ||= []).push(i)}); setServices(Object.values(groups).map((g:any[])=>g.find(i=>i.language===lang)||g.find(i=>i.language==="en")||g.find(i=>i.language==="vi")||g[0]))
    const normalized:LegalDocLink[]=allLegalDocs.map((i:any)=>({...i,language:typeof i.language==="string"?i.language:"vi",slug:typeof i.slug==="string"&&i.slug.includes("/")?i.slug.split("/").filter(Boolean).pop():i.slug})).filter((i:LegalDocLink)=>i.slug&&i.title); const byLang=(l:string)=>normalized.filter(i=>i.language===l); setLegalDocs((byLang(lang).length?byLang(lang):byLang("en").length?byLang("en"):byLang("vi").length?byLang("vi"):normalized).slice(0,3))
    setLocations((locationDoc?.locations||[]).filter((i:FooterLocation)=>i.enabled!==false&&i.address?.trim()))
  } catch(e){console.error("Footer data:",e);setLegalDocs([]);setLocations([])} } loadFooterData() },[lang])

  const quickLinks=[{name:navigation?.home||"Trang chủ",href:`/${lang}`},{name:navigation?.about||"Giới thiệu",href:`/${lang}/about`},{name:navigation?.services||"Dịch vụ",href:`/${lang}/services`},{name:navigation?.products||"Sản phẩm",href:`/${lang}/products`},{name:navigation?.projects||"Dự án",href:`/${lang}/portfolio`},{name:navigation?.blog||"Blog",href:`/${lang}/blog`}]
  const socialLinks=[facebookUrl?{href:facebookUrl,label:"Facebook",icon:<Facebook className="size-4"/>}:null,youtubeUrl?{href:youtubeUrl,label:"YouTube",icon:<Youtube className="size-4"/>}:null,tiktokUrl?{href:tiktokUrl,label:"TikTok",icon:<TextSocialIcon text="TT"/>}:null,lineUrl?{href:lineUrl,label:"LINE",icon:<TextSocialIcon text="LINE"/>}:null,twitterUrl?{href:twitterUrl,label:"X / Twitter",icon:<TextSocialIcon text="X"/>}:null,wechatUrl?{href:wechatUrl,label:wechatId?`WeChat ${wechatId}`:"WeChat",icon:<MessageCircle className="size-4"/>}:null].filter(Boolean) as Array<{href:string;label:string;icon:React.ReactNode}>
  const fallbackLegalLinks=[{name:footer?.privacy_policy||"Chính sách bảo mật",slug:"chinh-sach-bao-mat"},{name:footer?.terms_of_use||"Điều khoản sử dụng",slug:"dieu-khoan-su-dung"},{name:footer?.cookie_policy||"Chính sách cookie",slug:"chinh-sach-cookie"}]; const currentYear=new Date().getFullYear()

  return <footer className="relative border-t border-border/60 bg-secondary/20"><div className="content-shell py-14 lg:py-16"><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
    <div><Link href={`/${lang}`} aria-label={navigation?.home||"Home"} className="mb-6 inline-flex min-h-12 items-center gap-3 rounded-xl"><SiteLogoMark size="md"/><SiteLogoWordmark lang={lang} fallbackTagline={common?.logo_subtitle||"Engineering Solutions"} titleClassName="text-xl font-serif font-bold tracking-tight text-foreground" taglineClassName="-mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground"/></Link><p className="mb-6 max-w-sm text-sm leading-6 text-muted-foreground">{footer?.description||"Đối tác cung cấp sản phẩm và giải pháp kỹ thuật cho khách hàng."}</p>{socialLinks.length>0&&<div className="flex flex-wrap gap-2">{socialLinks.map(i=><a key={i.label} href={i.href} target="_blank" rel="noopener noreferrer" aria-label={i.label} className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground">{i.icon}</a>)}</div>}</div>
    <div><h4 className="mb-5 text-sm font-serif font-bold uppercase tracking-wider">{footer?.quick_links||"Liên kết nhanh"}</h4><ul className="space-y-1">{quickLinks.map(l=><li key={l.href}><Link href={l.href} className="group inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowRight className="size-3"/>{l.name}</Link></li>)}</ul></div>
    <div><h4 className="mb-5 text-sm font-serif font-bold uppercase tracking-wider">{navigation?.services||"Dịch vụ"}</h4><ul className="max-h-[250px] space-y-1 overflow-y-auto pr-2">{services.map((s,i)=><li key={s._id||i}><Link href={`/${lang}/services/${s.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowRight className="size-3"/>{s.title}</Link></li>)}</ul></div>
    <div><h4 className="mb-5 text-sm font-serif font-bold uppercase tracking-wider">{navigation?.contact||"Liên hệ"}</h4><div className="mb-7 space-y-3">{locations.map((location,index)=>{const mapHref=location.googleMapsUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address||"")}`;return <a key={location._key||index} href={mapHref} target="_blank" rel="noopener noreferrer" className="group flex min-h-10 items-start gap-3 text-sm text-muted-foreground hover:text-primary"><MapPin className="mt-0.5 size-5 shrink-0 text-primary"/><span>{location.name?.[lang]&&<strong className="mr-1 font-medium text-foreground">{location.name[lang]}:</strong>}{location.address}<span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-primary">Map <ExternalLink className="size-3"/></span></span></a>})}{phoneDisplay&&phoneTel&&<a href={`tel:${phoneTel}`} className="flex min-h-10 items-center gap-3 text-sm text-muted-foreground hover:text-primary"><Phone className="size-5 text-primary"/>{phoneDisplay}</a>}{email&&<a href={`mailto:${email}`} className="flex min-h-10 items-center gap-3 text-sm text-muted-foreground hover:text-primary"><Mail className="size-5 text-primary"/><span className="break-all">{email}</span></a>}</div><h4 className="mb-3 text-xs font-serif font-bold uppercase tracking-widest">{footer?.newsletter||"Bản tin"}</h4><form className="flex gap-2" onSubmit={e=>e.preventDefault()}><Input type="email" placeholder={footer?.placeholder_email||"Email của bạn"}/><Button type="submit" size="icon"><ArrowRight className="size-4"/></Button></form></div>
  </div></div><div className="border-t border-border/60 bg-secondary/35"><div className="content-shell flex flex-col items-center justify-between gap-4 py-5 md:flex-row"><p className="text-xs text-muted-foreground">{footer?.copyright||`© ${currentYear} ${siteName}. All rights reserved.`}</p><div className="flex flex-wrap gap-x-6 gap-y-2">{legalDocs.length?legalDocs.map(l=><Link key={l._id} href={`/${l.language||lang}/policy/${l.slug}`} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{l.title}</Link>):fallbackLegalLinks.map(l=><Link key={l.slug} href={`/${lang}/policy/${l.slug}`} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{l.name}</Link>)}</div></div></div></footer>
}
