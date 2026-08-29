"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Home, Info, Settings, Package, Briefcase, FileText, Phone, Circle } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

const toPascalCase = (str: string) => {
  if (!str) return "Circle";
  // Loại bỏ prefix nếu có (ví dụ "lucide:wrench" -> "wrench")
  const name = str.includes(":") ? str.split(":")[1] : str;
  // Chuyển kebab-case sang PascalCase (ví dụ "arrow-right" -> "ArrowRight")
  return name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
};

const DynamicIcon = ({ name, ...props }: { name: string } & any) => {
  const compName = toPascalCase(name);
  const Icon = (LucideIcons as any)[compName] || LucideIcons.Circle;
  return <Icon {...props} />;
};

export function MobileWidgetIndicator({ lang, dict, services = [] }: { lang: string, dict: any, services?: { slug: string, icon: string }[] }) {
  const pathname = usePathname()
  const router = useRouter()
  // Ref cho container sub-menu để auto-scroll
  const subMenuContainerRef = useRef<HTMLDivElement>(null);

  // LOGIC: Chỉ hiển thị dải Sub-menu này khi người dùng đang ở trang dịch vụ chi tiết (ví dụ: /vi/services/[slug])
  const isAtSubService = pathname.startsWith(`/${lang}/services/`) && pathname !== `/${lang}/services`;
  // Lưu thêm rawDistance để biết hướng kéo Trái/Phải
  const [swipeData, setSwipeData] = useState({ active: false, distance: 0, rawDistance: 0 })

  useEffect(() => {
    const handleTouch = (e: any) => {
      setSwipeData({
        active: e.detail.active,
        distance: Math.abs(e.detail.distance || 0),
        rawDistance: e.detail.distance || 0
      });
    };
    window.addEventListener("swipe-active", handleTouch);
    return () => window.removeEventListener("swipe-active", handleTouch);
  }, []);

  const d = swipeData.distance;
  const raw = swipeData.rawDistance;

  // ĐỒNG BỘ NGƯỠNG 1:1 VỚI WRAPPER
  const isMainThreshold = d > 130; // Màu Cam
  const isSubThreshold = d > 30;   // Màu Trắng
  const isMoving = d > 5;

  let arrowColor = "#ffffff";
  let arrowOpacity = 0.2;
  let arrowScale = 1;

  if (isMainThreshold) {
    arrowColor = "#f97316";
    arrowOpacity = 1;
    arrowScale = 1.4;
  } else if (isSubThreshold) {
    arrowColor = "#ffffff";
    arrowOpacity = 1;
    arrowScale = 1.1;
  } else if (isMoving) {
    arrowOpacity = 0.4;
    arrowScale = 0.95;
  }

  const subServices = services && services.length > 0 ? services : [
    { slug: "cnc", icon: "Wrench" },
    { slug: "molds", icon: "Box" },
    { slug: "3d-scan", icon: "ScanLine" },
    { slug: "plc", icon: "Cpu" },
    { slug: "coils", icon: "Wind" },
    { slug: "ems", icon: "Zap" },
    { slug: "it-software", icon: "Code" }
  ];
  const routes = [
    { path: `/${lang}`, label: dict.navigation?.home || "Trang chủ", icon: Home },
    { path: `/${lang}/about`, label: dict.navigation?.about || "Giới thiệu", icon: Info },
    { path: `/${lang}/services`, label: dict.navigation?.services || "Dịch vụ", icon: Settings },
    { path: `/${lang}/products`, label: dict.navigation?.products || "Sản phẩm", icon: Package },
    { path: `/${lang}/portfolio`, label: dict.navigation?.projects || "Dự án", icon: Briefcase },
    { path: `/${lang}/blog`, label: dict.navigation?.blog || "Tin tức", icon: FileText },
    { path: `/${lang}/contact`, label: dict.navigation?.contact || "Liên hệ", icon: Phone },
  ]

  const currentIndex = routes.findIndex(r => r.path === `/${lang}` ? pathname === r.path : pathname.startsWith(r.path));
  const currentServiceSlug = isAtSubService ? pathname.split('/').pop() : null;
  const currentSubIndex = subServices.findIndex(s => s.slug === currentServiceSlug);

  // Tự động cuộn Sub-menu icon đang active vào giữa
  useEffect(() => {
    if (isAtSubService && subMenuContainerRef.current) {
      const activeItem = subMenuContainerRef.current.querySelector('[data-active="true"]');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [pathname, isAtSubService]);

  if (currentIndex === -1) return null;

  return (
    <>
      <AnimatePresence>
        {swipeData.active && (
          <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-[110] flex items-center justify-between px-6 lg:hidden">
            {/* Mũi tên trái: Chỉ hiện rõ khi kéo sang PHẢI (về trước) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: raw > 0 ? arrowOpacity : 0.1,
                scale: raw > 0 ? arrowScale : 0.8,
                color: arrowColor,
                x: 0
              }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <ChevronLeft
                className="w-14 h-14 stroke-[1.5px]"
                style={{ filter: `drop-shadow(0 0 10px ${arrowColor}${isSubThreshold ? 'cc' : '44'})` }}
              />
            </motion.div>

            {/* Mũi tên phải: Chỉ hiện rõ khi kéo sang TRÁI (tiếp theo) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: raw < 0 ? arrowOpacity : 0.1,
                scale: raw < 0 ? arrowScale : 0.8,
                color: arrowColor,
                x: 0
              }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <ChevronRight
                className="w-14 h-14 stroke-[1.5px]"
                style={{ filter: `drop-shadow(0 0 10px ${arrowColor}${isSubThreshold ? 'cc' : '44'})` }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
          ADAPTIVE SUB-MENU (Dải Icon dịch vụ con)
          - Portrait: Cố định Bottom, cuộn ngang.
          - Landscape: Cố định Bên phải, cuộn dọc/nằm dọc.
      */}
      {isAtSubService && (
        <div
          className={cn(
            "fixed z-[100] transition-all duration-500 lg:hidden",
            // Portrait: Dưới cùng
            "bottom-4 left-1/2 -translate-x-1/2 w-[95%] flex flex-row items-center justify-center",
            // Landscape: Bên phải
            "landscape:right-4 landscape:top-1/2 landscape:bottom-auto landscape:left-auto landscape:-translate-y-1/2 landscape:-translate-x-0 landscape:w-20 landscape:flex-col landscape:h-auto landscape:max-h-[85vh]"
          )}
        >
          <div
            ref={subMenuContainerRef}
            className={cn(
              "flex items-center gap-3 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-x-auto no-scrollbar scroll-smooth touch-pan-x",
              "landscape:flex-col landscape:overflow-y-auto landscape:overflow-x-hidden landscape:h-full landscape:w-full landscape:py-6 landscape:touch-pan-y"
            )}
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            {subServices.map((service, dotIdx) => {
              const isActive = dotIdx === currentSubIndex;
              return (
                <motion.div
                  key={dotIdx}
                  data-active={isActive}
                  role="button"
                  tabIndex={0}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
                    router.push(`/${lang}/services/${service.slug}`);
                  }}
                  className={cn(
                    "relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl cursor-pointer transition-all duration-500",
                    isActive ? "bg-[#f97316]/15" : "hover:bg-white/5"
                  )}
                  aria-label={`Sub-service ${service.slug}`}
                >
                  {/* Active Glow Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-[#f97316]/30 blur-xl rounded-2xl -z-10 animate-pulse" />
                  )}

                  <DynamicIcon
                    name={service.icon}
                    className={cn(
                      "w-8 h-8 z-10 transition-all duration-500",
                      isActive ? "text-[#f97316] drop-shadow-[0_0_12px_rgba(249,115,22,1)] scale-110" : "text-white/30"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />

                  {/* Chấm chỉ định Active cho Landscape cho rõ ràng */}
                  {isActive && (
                    <div className="hidden landscape:block absolute -right-1 w-1.5 h-4 bg-[#f97316] rounded-full shadow-[0_0_15px_#f97316]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </>
  )
}