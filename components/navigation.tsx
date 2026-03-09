
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Cog } from "lucide-react"
import { DesktopNavigation } from "./navigation-desktop"
import { MobileNavigation } from "./navigation-mobile"
import { cn } from "@/lib/utils"
import { createClient } from "next-sanity"
import * as LucideIcons from "lucide-react"

const toPascalCase = (str: string) => {
  if (!str) return "Circle";
  const name = str.includes(":") ? str.split(":")[1] : str;
  return name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
};

const DynamicIcon = ({ name, ...props }: { name: string } & any) => {
  const compName = toPascalCase(name);
  const Icon = (LucideIcons as any)[compName] || LucideIcons.Circle;
  return <Icon {...props} />;
};

// --- CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Bật CDN để Navbar load cực nhanh
})

interface NavigationProps {
  lang: string
  dict: any
}

export function Navigation({ lang, dict }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  // State chứa danh sách dịch vụ đã được xử lý logic đa ngôn ngữ
  const [danhSachDichVu, setDanhSachDichVu] = useState<any[]>([])

  const pathname = usePathname()
  const router = useRouter()

  // Ref cho thanh menu chính để auto-scroll
  const mobileMainMenuRef = useRef<HTMLDivElement>(null);

  // 1. TỐI ƯU SCROLL (HIDE ON SCROLL LOGIC - FIX HIỆU NĂNG)
  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 1. Kiểm tra trạng thái cuộn để đổi style
      setIsScrolled(currentScrollY > 10)

      // 2. Logic ẩn hiện Header
      if (window.innerWidth < 1024) {
        if (currentScrollY > prevY + 5 && currentScrollY > 80) {
          setIsVisible(false)
        } else if (currentScrollY < prevY - 10 || currentScrollY <= 80) {
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }

      prevY = currentScrollY;
      setLastScrollY(currentScrollY);
    }

    // Passive listener để ko làm lag cuộn
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Dependency array trống để ko reregister listener liên tục

  // 2. FETCH DỮ LIỆU DỊCH VỤ VỚI LOGIC "PER-ITEM FALLBACK"
  useEffect(() => {
    async function layDichVuDaNgonNgu() {
      try {
        const cauTruyVan = `*[_type == "service" && defined(slug.current)] | order(orderRank asc) {
          _id,
          _translationKey,
          language,
          icon,
          "slug": slug.current,
          title,
          "desc": description
        }`

        const tatCaDichVu = await trinhKetNoiSanity.fetch(cauTruyVan)
        const nhomDichVu: Record<string, any[]> = {};

        tatCaDichVu.forEach((dichVu: any) => {
          const khoaNhom = dichVu._translationKey || dichVu._id;
          if (!nhomDichVu[khoaNhom]) {
            nhomDichVu[khoaNhom] = [];
          }
          nhomDichVu[khoaNhom].push(dichVu);
        });

        const danhSachDichVuSauCung = Object.values(nhomDichVu).map((nhom: any[]) => {
          const banDichDung = nhom.find((p) => p.language === lang);
          if (banDichDung) return banDichDung;
          const banDichAnh = nhom.find((p) => p.language === 'en');
          if (banDichAnh) return banDichAnh;
          const banDichViet = nhom.find((p) => p.language === 'vi');
          if (banDichViet) return banDichViet;
          return nhom[0];
        });

        setDanhSachDichVu(danhSachDichVuSauCung);
      } catch (loi) {
        console.error("Lỗi tải menu dịch vụ:", loi)
      }
    }
    layDichVuDaNgonNgu()
  }, [lang])

  // 3. KHÓA CUỘN NÂNG CAO
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      document.body.style.touchAction = "";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.style.touchAction = "";
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

  // 4. AUTO-SCROLL CHO MAIN MENU MOBILE
  useEffect(() => {
    if (mobileMainMenuRef.current) {
      const activeItem = mobileMainMenuRef.current.querySelector('[data-active="true"]');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [pathname]);

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "VN" },
    { code: "en", name: "English", flag: "US" },
    { code: "jp", name: "日本語", flag: "JP" },
    { code: "kr", name: "한국어", flag: "KR" },
    { code: "cn", name: "中文", flag: "CN" },
  ]
  const currentLang = languages.find((l) => l.code === lang) || languages[0]

  const handleLangChange = (ngonNguMoi: string) => {
    if (ngonNguMoi === lang) return;
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
    const mangDuongDan = pathname.split("/");
    const banDoDichThuat = (window as any).zinitekTranslations;

    if (mangDuongDan.length === 4 && mangDuongDan[2] === "services" && banDoDichThuat && banDoDichThuat[ngonNguMoi]) {
      mangDuongDan[1] = ngonNguMoi;
      mangDuongDan[3] = banDoDichThuat[ngonNguMoi];
      router.push(mangDuongDan.join("/"));
    } else {
      mangDuongDan[1] = ngonNguMoi;
      router.push(mangDuongDan.join("/"));
    }
  };

  const menuItems = [
    { name: dict.navigation.home, href: `/${lang}` },
    { name: dict.navigation.about, href: `/${lang}/about` },
    { name: dict.navigation.services, href: `/${lang}/services`, hasMega: true },
    { name: dict.navigation.products, href: `/${lang}/products` },
    { name: dict.navigation.projects, href: `/${lang}/portfolio` },
    { name: dict.navigation.blog, href: `/${lang}/blog` },
    { name: dict.navigation.contact, href: `/${lang}/contact` },
  ]

  const handlePrefetchLang = (targetLang: string) => {
    const segments = pathname.split("/")
    segments[1] = targetLang
    router.prefetch(segments.join("/"))
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 9998,
          transform: isVisible ? 'translateY(0)' : 'translateY(-110%)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s, background-color 0.5s',
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        className={cn(
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/50 text-foreground shadow-sm"
            : "bg-transparent text-foreground"
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
              serviceItems={danhSachDichVu}
              currentLang={currentLang}
            />
          </div>

          {/* MOBILE: NAVIGATION BAR - TỐI ƯU CHIỀU CAO CỰC ĐẠI (PHASE 18) */}
          <div className="lg:hidden container mx-auto px-4 py-1.5 flex items-center justify-between gap-1 overflow-hidden">
            <Link href={`/${lang}`} className="flex-shrink-0 flex items-center gap-1.5 relative z-[110]">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded flex items-center justify-center shadow-lg shadow-[#f97316]/20">
                <Cog className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight hidden xs:block landscape:block">
                ZINI<span className="text-[#f97316]">TEK</span>
              </span>
            </Link>

            {/* MAIN MENU - THU NHỎ HƠN ĐÚNG THEO YÊU CẦU (PHASE 18) */}
            <div
              ref={mobileMainMenuRef}
              className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-1.5 h-10 touch-pan-x bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl ml-1 mr-1 relative"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
              }}
            >
              {menuItems.map((item, idx) => {
                const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
                const Icon = item.name === dict.navigation.home ? LucideIcons.Home :
                  item.name === dict.navigation.about ? LucideIcons.Info :
                    item.name === dict.navigation.services ? LucideIcons.Settings :
                      item.name === dict.navigation.products ? LucideIcons.Package :
                        item.name === dict.navigation.projects ? LucideIcons.Briefcase :
                          item.name === dict.navigation.blog ? LucideIcons.FileText :
                            LucideIcons.Phone;

                return (
                  <motion.div
                    key={idx}
                    data-active={isActive}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
                      router.push(item.href);
                    }}
                    className={cn(
                      "flex-shrink-0 flex flex-col items-center justify-center min-w-[60px] h-8 rounded-xl transition-all duration-300 relative",
                      isActive ? "bg-[#f97316]/10" : "hover:bg-card/60"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-[#f97316]/20 blur-sm rounded-xl -z-10" />
                    )}

                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 mb-0.5 transition-all duration-300",
                        isActive ? "text-[#f97316]" : "text-muted-foreground"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className={cn(
                      "text-[8px] font-bold whitespace-nowrap uppercase tracking-tighter",
                      isActive ? "text-[#f97316]" : "text-muted-foreground"
                    )}>
                      {item.name}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            <div className="flex-shrink-0 flex items-center gap-1 relative z-[110]">
              <MobileNavigation
                lang={lang}
                dict={dict}
                pathname={pathname}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                handleLangChange={handleLangChange}
                menuItems={menuItems}
                serviceItems={danhSachDichVu}
              />
            </div>
          </div>
        </motion.div>
      </header>
    </>
  )
}