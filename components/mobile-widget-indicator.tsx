"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileWidgetIndicator({ lang, dict }: { lang: string, dict: any }) {
  const pathname = usePathname()
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

  const subServiceSlugs = ["cnc", "molds", "3d-scan", "plc", "coils", "ems", "it-software"];
  const routes = [
    { path: `/${lang}`, label: dict.navigation?.home },
    { path: `/${lang}/about`, label: dict.navigation?.about },
    { path: `/${lang}/services`, label: dict.navigation?.services },
    { path: `/${lang}/products`, label: dict.navigation?.products }, 
    { path: `/${lang}/portfolio`, label: dict.navigation?.projects },
    { path: `/${lang}/blog`, label: dict.navigation?.blog },
    { path: `/${lang}/contact`, label: dict.navigation?.contact },
  ]

  const currentIndex = routes.findIndex(r => r.path === `/${lang}` ? pathname === r.path : pathname.startsWith(r.path));
  const isAtSubService = pathname.startsWith(`/${lang}/services/`) && pathname !== `/${lang}/services`;
  const currentServiceSlug = isAtSubService ? pathname.split('/').pop() : null;
  const currentSubIndex = subServiceSlugs.indexOf(currentServiceSlug || "");

  if (currentIndex === -1) return null;

  return (
    <>
      <AnimatePresence>
        {swipeData.active && (
          <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-[110] flex items-center justify-between px-6">
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

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 lg:hidden">
        <AnimatePresence mode="wait">
          {isAtSubService && (
            <motion.div key={currentServiceSlug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-1 px-3 py-1 bg-[#f97316] rounded-full shadow-lg border border-white/20">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                {dict.services?.[currentServiceSlug?.replace("-", "_") || ""]?.title}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 px-5 py-3 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl relative">
          {routes.map((route, index) => {
            const isActive = index === currentIndex;
            const isServiceTab = route.path?.includes('/services');
            
            return (
              <div key={route.path} className="relative flex flex-col items-center">
                {isActive && (
                  <motion.span layoutId="label" className="absolute -top-7 text-[9px] font-black text-[#f97316] uppercase tracking-tighter">
                    {route.label}
                  </motion.span>
                )}
                
                <div className="flex flex-col items-center gap-1.5">
                  <motion.div animate={{ width: isActive ? 22 : 6, backgroundColor: isActive ? "#f97316" : "rgba(255,255,255,0.2)" }}
                    className={cn("h-1.5 rounded-full relative", isActive && "shadow-[0_0_12px_#f97316]")} />
                  
                  <div className="h-1 flex justify-center items-center">
                    {isServiceTab && isAtSubService && (
                      <div className="flex gap-1">
                        {subServiceSlugs.map((_, dotIdx) => (
                          <div key={dotIdx} className={cn("h-1 rounded-full transition-all duration-300", 
                            dotIdx === currentSubIndex ? "w-3 bg-white shadow-[0_0_8px_white]" : "w-1 bg-white/20")} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
}