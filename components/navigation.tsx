"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Cog, Box, ScanLine, Cpu, CircleDot, CircuitBoard, Monitor } from "lucide-react"
import { DesktopNavigation } from "./navigation-desktop"
import { MobileNavigation } from "./navigation-mobile"
import { cn } from "@/lib/utils"

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

  // Hàm xử lý tải trước ngôn ngữ khi rê chuột
  const handlePrefetchLang = (targetLang: string) => {
    const segments = pathname.split("/")
    segments[1] = targetLang
    const newPath = segments.join("/")
    router.prefetch(newPath)
  }

  // 1. TỐI ƯU PREFETCH: Tải trước các trang quan trọng sau 2 giây để giữ điểm hiệu năng
  useEffect(() => {
    const timer = setTimeout(() => {
      const routesToPrefetch = [
        `/${lang}/about`,
        `/${lang}/services`,
        `/${lang}/portfolio`,
        `/${lang}/blog`,
        `/${lang}/contact`,
      ]
      routesToPrefetch.forEach((route) => {
        router.prefetch(route)
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, lang])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.touchAction = "auto"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "VN" },
    { code: "en", name: "English", flag: "US" },
    { code: "jp", name: "日本語", flag: "JP" },
    { code: "kr", name: "한국어", flag: "KR" },
    { code: "cn", name: "中文", flag: "CN" },
  ]

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

  return (
    <>
      // WEB demo (By Phan Tấn)
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
            isScrolled
              ? "bg-[#020617]/90 backdrop-blur-xl border-b border-[#f97316]/20 shadow-lg"
              : "bg-transparent"
          )}
        >
        {/* DESKTOP NAVIGATION */}
        <DesktopNavigation
          lang={lang}
          dict={dict}
          pathname={pathname}
          isScrolled={isScrolled}
          isMegaOpen={isMegaOpen}
          isLangOpen={isLangOpen}
          setIsMegaOpen={setIsMegaOpen}
          setIsLangOpen={setIsLangOpen}
          handleLangChange={handleLangChange}
          handlePrefetchLang={handlePrefetchLang}
          menuItems={menuItems}
          serviceItems={serviceItems}
          currentLang={currentLang}
        />

        {/* MOBILE MENU BUTTON */}
        <nav className="lg:hidden container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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

            <MobileNavigation
              lang={lang}
              dict={dict}
              pathname={pathname}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              handleLangChange={handleLangChange}
              menuItems={menuItems}
              serviceItems={serviceItems}
            />
          </div>
        </nav>
      </motion.header>
    </>
  )
}