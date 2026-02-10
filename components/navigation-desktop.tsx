// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
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
// Import Dynamic Icon
import { DynamicIcon } from "./ui/dynamic-icon"

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
  // Cập nhật kiểu dữ liệu để nhận thêm trường 'language'
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
    <>
      {/* --- PHẦN 1: TOP BAR DESKTOP (Giữ nguyên) --- */}
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
          <div className="flex items-center gap-6">
            <p className="text-muted-foreground italic">
              <span className="text-[#f97316]">{">"}</span> {dict.common.slogan_top}
            </p>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6 group">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold group-hover:text-slate-400 transition-colors">
                Swipe Desktop
              </span>
              <button
                onClick={() => {
                  const newValue = !isSwipeEnabled;
                  setIsSwipeEnabled(newValue);
                  localStorage.setItem("desktop-swipe", String(newValue));
                  window.dispatchEvent(new Event("storage"));
                  router.refresh(); 
                }}
                className={cn(
                  "relative w-9 h-5 rounded-full transition-all duration-300 shadow-inner",
                  mounted && isSwipeEnabled ? "bg-[#f97316]" : "bg-slate-700"
                )}
              >
                <div className={cn(
                    "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-md",
                    mounted && isSwipeEnabled ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: CHÍNH NAVIGATION --- */}
      <nav className="hidden lg:block container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
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
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                ZINI<span className="text-[#f97316]">TEK</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1 font-medium">
                {dict.common.logo_subtitle}
              </p>
            </div>
          </Link>

          {/* Menu chính */}
          <div className="flex items-center gap-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => item.hasMega && setIsMegaOpen(true)}
                onMouseLeave={() => item.hasMega && setIsMegaOpen(false)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors relative group",
                    isActive(item.href) ? "text-[#f97316]" : "text-slate-300 hover:text-[#f97316]"
                  )}
                >
                  {item.name}
                  {item.hasMega && <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isMegaOpen && "rotate-180")} />}
                  <span className={cn(
                      "absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#f97316] to-[#fb923c] transition-transform origin-left duration-300",
                      isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>

                {/* --- MEGA MENU: CẬP NHẬT HIỂN THỊ NHÃN PHIÊN BẢN --- */}
                <AnimatePresence>
                  {item.hasMega && isMegaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 group">
                      <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent" />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="relative w-[720px] p-6 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl pointer-events-auto"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          {serviceItems.map((service) => {
                            const displayTitle = service.title || "(Chưa nhập tên dịch vụ)";
                            const displayDesc = service.desc || "Mô tả đang cập nhật...";

                            return (
                              <Link
                                key={service.slug || Math.random()}
                                href={`/${lang}/services/${service.slug}`}
                                className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 group/item transition-all relative overflow-hidden"
                                onClick={() => setIsMegaOpen(false)}
                              >
                                {/* NHÃN PHIÊN BẢN NGÔN NGỮ (NẾU KHÁC NGÔN NGỮ HIỆN TẠI) */}
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
                                  <h4 className="font-semibold text-white group-hover/item:text-[#f97316] transition-colors pr-6">
                                    {displayTitle}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {displayDesc}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Cụm công cụ bên phải */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border border-white/10 rounded-lg bg-[#0f172a]/50 hover:border-[#f97316]/30 transition-all",
                  isLangOpen && "border-[#f97316]/50 text-white"
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
                    className="absolute top-full right-0 mt-2 w-44 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-[120]"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLangChange(l.code)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors",
                          lang === l.code ? "text-[#f97316] bg-[#f97316]/5" : "text-white"
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

            <Button asChild className="bg-[#f97316] text-[#020617] font-bold hover:scale-105 hover:bg-[#fb923c] transition-all shadow-lg shadow-[#f97316]/20">
              <Link href={`/${lang}/contact`}>
                {dict.common.contact_btn}
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </>
  )
}