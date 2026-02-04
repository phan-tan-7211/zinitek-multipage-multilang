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

  // 2. KHÓA CUỘN NÂNG CAO (ĐÃ TỐI ƯU CHO iOS): 
  // Sử dụng kỹ thuật lưu vị trí cuộn để ngăn trang web bị nhảy lên đầu trên Safari iPhone
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY; // Lưu lại vị trí cuộn hiện tại
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`; // Cố định trang tại vị trí đang đứng
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      document.body.style.touchAction = "none";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.style.touchAction = "auto";
      
      // Trả trang về đúng vị trí cũ khi đóng menu
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.style.touchAction = "auto";
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

  // 3. TỐI ƯU CHUYỂN NGÔN NGỮ: Đảm bảo đóng tất cả menu trước khi chuyển trang
  const handleLangChange = (newLang: string) => {
    if (newLang === lang) return;

    // Đóng các menu đang mở ngay lập tức để UI mượt mà
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);

    const segments = pathname.split("/");
    segments[1] = newLang;
    
    // Thực hiện chuyển hướng
    router.push(segments.join("/"));
  };

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

          {/* MOBILE: NAVIGATION BAR */}
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
    </>
  )
}