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

  // 1. TỐI ƯU SCROLL: Theo dõi cuộn trang để bật/tắt nền
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 2. KHÓA CUỘN NÂNG CAO: Ngăn chặn triệt để lỗi cuộn nền trên iOS và Android
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Khóa cuộn trang chính hoàn toàn
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Ngăn chặn thao tác chạm cuộn nền
      document.body.style.position = "fixed";    // Ép trang đứng yên tại chỗ
      document.body.style.width = "100%";        // Giữ layout không bị co lại khi chuyển sang fixed
    } else {
      // Trả lại trạng thái bình thường khi đóng menu
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Cleanup function: Đảm bảo trang web hoạt động bình thường nếu component bị unmount
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen])

  // --- DỮ LIỆU MENU ---
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
    { icon: Cog, slug: "cnc" }, { icon: Box, slug: "molds" },
    { icon: ScanLine, slug: "3d-scan" }, { icon: Cpu, slug: "plc" },
    { icon: CircleDot, slug: "coils" }, { icon: CircuitBoard, slug: "ems" },
    { icon: Monitor, slug: "it-software" },
  ]

  const handlePrefetchLang = (targetLang: string) => {
    const segments = pathname.split("/")
    segments[1] = targetLang
    router.prefetch(segments.join("/"))
  }

  return (
    <>
      {/* 1. HEADER BAR: Chỉ chứa thanh điều hướng ngang */}
      <header 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 9998 }}
        className={cn(
          "transition-all duration-500",
          isScrolled 
            ? "bg-[#020617]/95 backdrop-blur-md shadow-2xl border-b border-white/5" 
            : "bg-transparent"
        )}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* PC: DESKTOP NAVIGATION */}
          <div className="hidden lg:block">
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
          </div>

          {/* MOBILE: NAVIGATION BAR (Chỉ chứa Logo & Nút mở menu) */}
          <div className="lg:hidden container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={`/${lang}`} className="flex items-center gap-2 relative z-[110]">
              <div className="w-9 h-9 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded flex items-center justify-center">
                <Cog className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                ZINI<span className="text-[#f97316]">TEK</span>
              </span>
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
        </motion.div>
      </header>

      {/* LƯU Ý QUAN TRỌNG: 
        MobileNavigation chứa cả nút bấm và phần Overlay đã tối ưu z-index 99999.
      */}
    </>
  )
}