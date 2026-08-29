
"use client"

import Link from "next/link"
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion"
import {
  X, Cog, Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// Import Dynamic Icon
import { DynamicIcon } from "./ui/dynamic-icon"
import { ThemeSwitcher } from "./theme-switcher"

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" }, // Sử dụng emoji cờ cho Mobile
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "jp", name: "日本語", flag: "🇯🇵" },
  { code: "kr", name: "한국어", flag: "🇰🇷" },
  { code: "cn", name: "中文", flag: "🇨🇳" },
]

interface MobileNavigationProps {
  lang: string
  dict: any
  pathname: string
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  handleLangChange: (lang: string) => void
  menuItems: Array<{ name: string; href: string; hasMega?: boolean }>
  // Cập nhật kiểu dữ liệu để nhận thêm trường 'language'
  serviceItems: Array<{ icon: any; slug: string; title?: string; desc?: string; language?: string }>
}

export function MobileNavigation({
  lang,
  dict,
  pathname,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLangChange,
  menuItems,
  serviceItems,
}: MobileNavigationProps) {
  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === `/${lang}`
    return pathname.startsWith(href)
  }

  return (
    <LazyMotion features={domAnimation}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
      >
        <Menu className="w-8 h-8" />
      </button>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-background lg:hidden flex flex-col w-full touch-none"
            style={{ height: '100dvh' }}
          >
            {/* --- PHẦN 1: LOGO & HEADER MOBILE --- */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-5 border-b border-border/50 bg-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center shadow-lg shadow-[#f97316]/20">
                  <Cog className="w-6 h-6 text-[#020617]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
                    ZINI<span className="text-[#f97316]">TEK</span>
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1 font-medium">
                    {dict.common.logo_subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-foreground bg-secondary/50 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* --- PHẦN 2 & 3: MENU CHÍNH & DỊCH VỤ --- */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 touch-pan-y">
              <div className="grid grid-cols-10 gap-3">
                {/* CỘT TRÁI (6/10): MENU CHÍNH */}
                <div className="col-span-6 bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex-1 py-4 px-4 font-bold text-sm border-b border-border/30 last:border-0 transition-colors flex items-center",
                        isActive(item.href) ? "text-[#f97316] bg-[#f97316]/5" : "text-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* CỘT PHẢI (4/10): NGÔN NGỮ & GIAO DIỆN */}
                <div className="col-span-4 bg-card rounded-2xl border border-border/50 p-3 flex flex-col gap-6 justify-center">
                  {/* Theme Switcher mới */}
                  <ThemeSwitcher lang={lang} dict={dict} />

                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] uppercase tracking-tighter text-muted-foreground px-1 font-black text-center">
                      Language
                    </p>
                    <div className="flex flex-col gap-2 w-full">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => handleLangChange(l.code)}
                          className={cn(
                            "w-full py-2.5 px-2 rounded-xl border flex items-center gap-2 transition-all",
                            lang === l.code
                              ? "border-[#f97316] text-[#f97316] bg-[#f97316]/10"
                              : "border-border text-muted-foreground bg-secondary/50"
                          )}
                        >
                          <span className="text-base flex-shrink-0">{l.flag}</span>
                          <span className="text-[10px] font-bold uppercase tracking-tight truncate">
                            {l.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DỊCH VỤ - SỬA LỖI LOGIC HIỂN THỊ - SOCIAL STYLE */}
              <div className="bg-card rounded-2xl border border-border/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#f97316] mb-4 px-2 font-bold opacity-80">
                  {dict.navigation.services}
                </p>
                <div className="max-h-[300px] overflow-y-auto scrollbar-hide -mx-2 px-2">
                  <div className="flex flex-col">
                    {serviceItems.map((service) => {
                      const displayTitle = service.title || "(Chưa nhập tên dịch vụ)";

                      return (
                        <Link
                          key={service.slug || Math.random()}
                          href={`/${lang}/services/${service.slug}`}
                          prefetch={true}
                          className="flex items-center gap-3 py-2.5 px-3 text-muted-foreground hover:text-foreground active:bg-secondary/80 hover:bg-secondary/50 transition-all group border-b border-border/40 last:border-0"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-secondary/50 group-hover:bg-[#f97316]/20 rounded-lg transition-colors">
                            <DynamicIcon
                              iconData={service.icon}
                              className="w-4 h-4 text-[#f97316]"
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                            <span className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors line-clamp-1">
                              {displayTitle}
                            </span>

                            {/* NHÃN PHIÊN BẢN NGÔN NGỮ (MOBILE) */}
                            {service.language && service.language !== lang && (
                              <span className="flex-shrink-0 text-[8px] font-black text-[#020617] bg-[#f97316] px-1.5 py-0.5 rounded uppercase tracking-tighter opacity-90">
                                {service.language}
                              </span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* --- PHẦN 4: NÚT CONTACT DƯỚI CÙNG --- */}
            <div className="flex-shrink-0 px-4 py-4 border-t border-border/30 bg-background">
              <Button asChild className="w-full h-16 bg-[#f97316] text-[#020617] font-black text-xl rounded-2xl shadow-xl shadow-[#f97316]/10">
                <Link href={`/${lang}/contact`} onClick={() => setIsMobileMenuOpen(false)}>
                  {dict.common.contact_btn}
                </Link>
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}