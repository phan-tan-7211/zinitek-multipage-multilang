"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown, Cog, Globe, Phone, Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { DynamicIcon } from "./ui/dynamic-icon"
import { ThemeToggle } from "./theme-toggle"

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "VN" },
  { code: "en", name: "English", flag: "US" },
  { code: "jp", name: "日本語", flag: "JP" },
  { code: "kr", name: "한국어", flag: "KR" },
  { code: "cn", name: "中文", flag: "CN" },
]

interface DesktopNavigationProps {
  lang: string
  dict: any
  pathname: string
  isScrolled: boolean
  isMegaOpen: boolean
  isLangOpen: boolean
  setIsMegaOpen: (open: boolean) => void
  setIsLangOpen: (open: boolean) => void
  handleLangChange: (lang: string) => void
  handlePrefetchLang: (lang: string) => void
  menuItems: Array<{ name: string; href: string; hasMega?: boolean }>
  serviceItems: Array<{ icon: any; slug: string; title?: string; desc?: string; language?: string }>
  currentLang: { code: string; name: string; flag: string }
}

export function DesktopNavigation({
  lang,
  dict,
  pathname,
  isScrolled,
  isMegaOpen,
  isLangOpen,
  setIsMegaOpen,
  setIsLangOpen,
  handleLangChange,
  handlePrefetchLang,
  menuItems,
  serviceItems,
  currentLang,
}: DesktopNavigationProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("desktop-swipe") === "true"
    setIsSwipeEnabled(saved)
  }, [])

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`
    return pathname.startsWith(href)
  }

  return (
    <div className="relative z-[10010] overflow-visible">
      <div className="hidden lg:block border-b border-border/50 bg-background/50">
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

          <div className="flex items-center gap-4">
            <p className="text-muted-foreground italic pr-4 border-r border-border/50">
              <span className="text-[#f97316]">{">"}</span> {dict.common.slogan_top}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer" onClick={() => {
                  const newValue = !isSwipeEnabled
                  setIsSwipeEnabled(newValue)
                  localStorage.setItem("desktop-swipe", String(newValue))
                  window.dispatchEvent(new Event("storage"))
                  router.refresh()
                }}>
                  {dict.common.swipe_desktop || "Swipe Desktop"}
                </span>
                <button
                  type="button"
                  aria-pressed={mounted && isSwipeEnabled}
                  onClick={() => {
                    const newValue = !isSwipeEnabled
                    setIsSwipeEnabled(newValue)
                    localStorage.setItem("desktop-swipe", String(newValue))
                    window.dispatchEvent(new Event("storage"))
                    router.refresh()
                  }}
                  className={cn(
                    "relative w-9 h-5 rounded-full transition-all duration-300 shadow-inner",
                    mounted && isSwipeEnabled ? "bg-[#f97316]" : "bg-secondary"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-md transform",
                    mounted && isSwipeEnabled ? "translate-x-4" : "translate-x-0"
                  )} />
                </button>
              </div>

              <div className="w-px h-4 bg-border/50" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden lg:block container mx-auto px-6 py-4 overflow-visible relative z-[10020]">
        <div className="flex items-center justify-between overflow-visible">
          <Link href={`/${lang}`} className="flex items-center gap-3 group relative z-[110]">
            <div className="relative">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center shadow-lg shadow-[#f97316]/20"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.7 }}
              >
                <Cog className="w-6 h-6 text-[#020617]" />
              </motion.div>
              <div className="absolute inset-0 bg-[#f97316] rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                ZINI<span className="text-[#f97316]">TEK</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1 font-medium">
                {dict.common.logo_subtitle}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 overflow-visible relative z-[10030]">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className={cn(
                  "relative h-full flex items-center overflow-visible",
                  item.hasMega && "z-[10040]"
                )}
                onMouseEnter={() => item.hasMega && setIsMegaOpen(true)}
                onMouseLeave={() => item.hasMega && setIsMegaOpen(false)}
                onFocusCapture={() => item.hasMega && setIsMegaOpen(true)}
                onBlurCapture={(event) => {
                  if (!item.hasMega) return
                  const nextTarget = event.relatedTarget as Node | null
                  if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                    setIsMegaOpen(false)
                  }
                }}
              >
                <Link
                  href={item.href}
                  aria-haspopup={item.hasMega ? "menu" : undefined}
                  aria-expanded={item.hasMega ? isMegaOpen : undefined}
                  className={cn(
                    "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors relative group",
                    isActive(item.href) ? "text-[#f97316]" : "text-foreground hover:text-[#f97316]"
                  )}
                >
                  {item.name}
                  {item.hasMega && <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isMegaOpen && "rotate-180")} />}
                  <span className={cn(
                    "absolute bottom-2 left-4 right-4 h-[1.5px] bg-gradient-to-r from-[#f97316] to-[#fb923c] transition-transform origin-left duration-300",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>

                <AnimatePresence>
                  {item.hasMega && isMegaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.99 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute left-1/2 top-full z-[10060] -translate-x-1/2 pt-3"
                      role="menu"
                    >
                      <div className="absolute left-0 right-0 top-0 h-4 bg-transparent" aria-hidden="true" />
                      <div className="relative w-[720px] rounded-xl border border-border/60 bg-card/98 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-3">
                          {serviceItems.map((service, index) => {
                            const displayTitle = service.title || "(Chưa nhập tên dịch vụ)"
                            const displayDesc = service.desc || "Mô tả đang cập nhật..."

                            return (
                              <Link
                                key={service.slug || `service-${index}`}
                                href={`/${lang}/services/${service.slug}`}
                                role="menuitem"
                                className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary group/item transition-all relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                onClick={() => setIsMegaOpen(false)}
                              >
                                {service.language && service.language !== lang && (
                                  <span className="absolute top-2 right-2 text-[9px] font-black text-[#020617] bg-[#f97316] px-1.5 py-0.5 rounded uppercase tracking-tighter opacity-80">
                                    {service.language}
                                  </span>
                                )}

                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#f97316]/10 rounded-lg group-hover/item:bg-[#f97316] transition-all duration-300">
                                  <DynamicIcon
                                    iconData={service.icon}
                                    className="w-6 h-6 text-[#f97316] group-hover/item:text-[#020617] transition-colors"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground group-hover/item:text-[#f97316] transition-colors pr-6">
                                    {displayTitle}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {displayDesc}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}

                          {serviceItems.length === 0 && (
                            <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                              {dict.navigation?.services || "Dịch vụ"}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 relative z-[10030]">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-border/50 rounded-lg bg-secondary/50 hover:border-[#f97316]/30 transition-all text-foreground",
                  isLangOpen && "border-[#f97316]/50 text-foreground"
                )}
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{currentLang.flag}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isLangOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-44 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden z-[10060]"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onMouseEnter={() => handlePrefetchLang(l.code)}
                        onFocus={() => handlePrefetchLang(l.code)}
                        onClick={() => handleLangChange(l.code)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors",
                          lang === l.code ? "text-[#f97316] bg-[#f97316]/5" : "text-foreground"
                        )}
                      >
                        <span className="opacity-80">{l.flag}</span>
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button asChild className="bg-[#f97316] text-white font-bold hover:scale-105 hover:bg-[#fb923c] transition-all shadow-md">
              <Link href={`/${lang}/contact`}>
                {dict.common.contact_btn}
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
