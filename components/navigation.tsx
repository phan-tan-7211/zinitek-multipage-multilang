// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Cog } from "lucide-react"
import { DesktopNavigation } from "./navigation-desktop"
import { MobileNavigation } from "./navigation-mobile"
import { cn } from "@/lib/utils"
import { createClient } from "next-sanity"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  
  // State chứa danh sách dịch vụ đã được xử lý logic đa ngôn ngữ
  const [danhSachDichVu, setDanhSachDichVu] = useState<any[]>([])

  const pathname = usePathname()
  const router = useRouter()

  // 1. TỐI ƯU SCROLL (GIỮ NGUYÊN)
  useEffect(() => {
    const xuLyCuonTrang = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", xuLyCuonTrang)
    return () => window.removeEventListener("scroll", xuLyCuonTrang)
  }, [])

  // 2. FETCH DỮ LIỆU DỊCH VỤ VỚI LOGIC "PER-ITEM FALLBACK" (NÂNG CẤP)
  useEffect(() => {
    async function layDichVuDaNgonNgu() {
      try {
        /**
         * LOGIC MỚI:
         * 1. Lấy tất cả dịch vụ (không lọc theo language ngay từ đầu để tránh mất bài).
         * 2. Lấy đủ các trường cần thiết: _id, _translationKey, language, slug, title, desc.
         */
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

        // --- BẮT ĐẦU THUẬT TOÁN GOM NHÓM VÀ CHỌN BẢN DỊCH TỐT NHẤT ---
        const nhomDichVu: Record<string, any[]> = {};

        // A. Gom nhóm các bản dịch lại với nhau
        tatCaDichVu.forEach((dichVu: any) => {
            const khoaNhom = dichVu._translationKey || dichVu._id;
            if (!nhomDichVu[khoaNhom]) {
                nhomDichVu[khoaNhom] = [];
            }
            nhomDichVu[khoaNhom].push(dichVu);
        });

        // B. Chọn đại diện tốt nhất cho từng nhóm
        const danhSachDichVuSauCung = Object.values(nhomDichVu).map((nhom: any[]) => {
            // Ưu tiên 1: Đúng ngôn ngữ hiện tại
            const banDichDung = nhom.find((p) => p.language === lang);
            if (banDichDung) return banDichDung;

            // Ưu tiên 2: Tiếng Anh
            const banDichAnh = nhom.find((p) => p.language === 'en');
            if (banDichAnh) return banDichAnh;

            // Ưu tiên 3: Tiếng Việt
            const banDichViet = nhom.find((p) => p.language === 'vi');
            if (banDichViet) return banDichViet;

            // Đường cùng: Lấy cái đầu tiên tìm thấy
            return nhom[0];
        });

        // Cập nhật State để truyền xuống Desktop/Mobile Navigation
        setDanhSachDichVu(danhSachDichVuSauCung);

      } catch (loi) {
        console.error("Lỗi tải menu dịch vụ:", loi)
      }
    }

    layDichVuDaNgonNgu()
  }, [lang]) // Chạy lại khi ngôn ngữ thay đổi

  // 3. KHÓA CUỘN NÂNG CAO (GIỮ NGUYÊN)
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
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

  // 4. LOGIC CHUYỂN ĐỔI NGÔN NGỮ THÔNG MINH (GIỮ NGUYÊN LOGIC CŨ TỐT)
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
    
    // Kiểm tra bản đồ dịch thuật từ trang chi tiết (đã làm ở bước trước)
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
              serviceItems={danhSachDichVu} // Truyền danh sách đã lọc thông minh xuống
              currentLang={currentLang}
            />
          </div>

          {/* MOBILE: NAVIGATION BAR */}
          <div className="lg:hidden container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={`/${lang}`} className="flex items-center gap-2 relative z-[110]">
              <div className="w-9 h-9 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded flex items-center justify-center shadow-lg shadow-[#f97316]/20">
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
              serviceItems={danhSachDichVu} // Truyền danh sách đã lọc thông minh xuống
            />
          </div>
        </motion.div>
      </header>
    </>
  )
}