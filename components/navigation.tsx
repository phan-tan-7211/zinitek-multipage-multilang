"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  ChevronDown,
  Cog,
  Box,
  ScanLine,
  Cpu,
  CircleDot,
  CircuitBoard,
  Monitor,
  Globe,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "VN" },
  { code: "en", name: "English", flag: "US" },
  { code: "jp", name: "日本語", flag: "JP" },
  { code: "kr", name: "한국어", flag: "KR" },
  { code: "cn", name: "中文", flag: "CN" },
]

interface NavigationProps {
  lang: string
  dict: any
}

export function Navigation({ lang, dict }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.touchAction = "auto"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentLang = languages.find((l) => l.code === lang) || languages[0]

  const handleLangChange = (newLang: string) => {
    const segments = pathname.split("/")
    segments[1] = newLang
    router.push(segments.join("/"))
    setIsLangOpen(false)
    setIsMobileMenuOpen(false)
  }

  const menuItems = [
    { name: dict.navigation.home, href: `/${lang}` },
    { name: dict.navigation.about, href: `/${lang}/about` },
    { name: dict.navigation.services, href: `/${lang}/services`, hasMega: true },
    { name: dict.navigation.projects, href: `/${lang}/portfolio` },
    { name: dict.navigation.blog, href: `/${lang}/blog` },
    { name: dict.navigation.contact, href: `/${lang}/contact` },
  ]

  const serviceItems = [
    { icon: Cog, slug: "cnc" },
    { icon: Box, slug: "molds" },
    { icon: ScanLine, slug: "3d-scan" },
    { icon: Cpu, slug: "plc" },
    { icon: CircleDot, slug: "coils" },
    { icon: CircuitBoard, slug: "ems" },
    { icon: Monitor, slug: "it-software" },
  ]

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`
    return pathname.startsWith(href)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          isMobileMenuOpen ? "opacity-0 pointer-events-none" : (
            isScrolled
            ? "bg-[#020617]/90 backdrop-blur-xl border-b border-[#f97316]/20 shadow-lg"
            : "bg-transparent"
          )
        )}
      >
        {/* Top bar Desktop */}
        <div className="hidden lg:block border-b border-[#334155]/50 bg-[#0f172a]/50">
          <div className="container mx-auto px-6 py-2 flex justify-between items-center text-sm">
            <div className="flex items-center gap-6 text-muted-foreground">
              <a href={`tel:${dict.common.phone_label}`} className="flex items-center gap-2 hover:text-[#f97316] transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>{dict.common.phone_label}</span>
              </a>
              <a href={`mailto:${dict.common.email_label}`} className="flex items-center gap-2 hover:text-[#f97316] transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span>{dict.common.email_label}</span>
              </a>
            </div>
            <p className="text-muted-foreground italic">
              <span className="text-[#f97316]">{">"}</span> {dict.common.slogan_top}
            </p>
          </div>
        </div>

        <nav className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${lang}`} className="flex items-center gap-3 group relative z-[110]">
              <div className="relative">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.7 }}
                >
                  <Cog className="w-6 h-6 text-[#020617]" />
                </motion.div>
                <div className="absolute inset-0 bg-[#f97316] rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              </div>
            {/* Logo Section trong Navigation */}
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                ZINI<span className="text-[#f97316]">TEK</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">
                {dict.common.logo_subtitle}  {/* DÙNG CHUNG */}
              </p>
            </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasMega && setIsMegaOpen(true)}
                  onMouseLeave={() => item.hasMega && setIsMegaOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors relative group",
                      isActive(item.href) ? "text-[#f97316]" : "text-muted-foreground hover:text-[#f97316]"
                    )}
                  >
                    {item.name}
                    {item.hasMega && <ChevronDown className={cn("w-4 h-4 transition-transform", isMegaOpen && "rotate-180")} />}
                    <span className={cn(
                      "absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#f97316] to-[#fb923c] transition-transform origin-left",
                      isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )} />
                  </Link>

                  <AnimatePresence>
                    {item.hasMega && isMegaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] p-6 mt-2 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          {serviceItems.map((service) => {
                            const sData = dict.services[service.slug.replace("-", "_")];
                            return (
                              <Link
                                key={service.slug}
                                href={`/${lang}/services/${service.slug}`}
                                className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#1e293b]/50 group/item transition-colors"
                                onClick={() => setIsMegaOpen(false)}
                              >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#f97316]/10 rounded-lg group-hover/item:bg-[#f97316]/20 transition-colors">
                                  <service.icon className="w-6 h-6 text-[#f97316]" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white group-hover/item:text-[#f97316] transition-colors">{sData?.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{sData?.desc}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Section Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)} 
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-white/10 rounded-lg bg-[#0f172a]/50 hover:border-[#f97316]/30 transition-colors"
                >
                  <Globe className="w-4 h-4" /> 
                  <span>{currentLang.flag}</span>
                  {/* THÊM MŨI TÊN Ở ĐÂY */}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isLangOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-44 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                      {languages.map((l) => (
                        <button key={l.code} onClick={() => handleLangChange(l.code)} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#1e293b]", lang === l.code ? "text-[#f97316]" : "text-white")}>
                          <span>{l.flag}</span> <span>{l.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button asChild className="bg-[#f97316] text-[#020617] font-bold hover:scale-105 transition-all">
                <Link href={`/${lang}/contact`}>{dict.common.contact_btn}</Link>
              </Button>
            </div>

            {/* Nút Hamburger Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-white"
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </nav>
      </motion.header>

     {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-[#020617] lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 bg-[#020617]">
              {/* LOGO SECTION - Đã sửa để có subtitle động */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center">
                  <Cog className="w-6 h-6 text-[#020617]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white tracking-tight leading-none">
                    ZINI<span className="text-[#f97316]">TEK</span>
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
                    {dict.common.logo_subtitle}  {/* DÙNG CHUNG */}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white bg-white/5 rounded-full"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
              <div className="space-y-6">
                {/* Menu Links */}
                <div className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "block py-4 px-5 font-semibold text-lg border-b border-white/5 last:border-0",
                        isActive(item.href) ? "text-[#f97316] bg-[#f97316]/5" : "text-slate-200"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Services Section */}
                <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#f97316] mb-4 px-2 font-bold opacity-80">
                    {dict.navigation.services}
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {serviceItems.map((service) => {
                      const sData = dict.services[service.slug.replace("-", "_")];
                      return (
                        <Link
                          key={service.slug}
                          href={`/${lang}/services/${service.slug}`}
                          className="flex items-center gap-4 py-3 px-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-9 h-9 flex items-center justify-center bg-slate-800 rounded-lg">
                              <service.icon className="w-5 h-5 text-[#f97316]" />
                          </div>
                          <span className="font-medium">{sData?.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-4">
                   <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-4 px-2 font-bold">Language</p>
                   <div className="grid grid-cols-2 gap-2">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => handleLangChange(l.code)}
                          className={cn(
                            "py-3 px-3 rounded-xl border text-sm transition-all",
                            lang === l.code ? "border-[#f97316] text-[#f97316] bg-[#f97316]/5" : "border-white/5 text-slate-400 bg-white/5"
                          )}
                        >
                          {l.flag} {l.name}
                        </button>
                      ))}
                   </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Button asChild className="w-full h-16 bg-[#f97316] text-[#020617] font-black text-xl rounded-2xl">
                    <Link href={`/${lang}/contact`} onClick={() => setIsMobileMenuOpen(false)}>
                      {dict.common.contact_btn}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}