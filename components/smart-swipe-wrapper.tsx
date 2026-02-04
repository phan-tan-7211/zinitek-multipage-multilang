"use client";
import { useDrag } from "@use-gesture/react";
import { motion, useAnimation } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SmartSwipeWrapper({ children, lang }: { children: React.ReactNode; lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimation();
  
  // Trạng thái cho phép vuốt trên Desktop
  const [desktopSwipeEnabled, setDesktopSwipeEnabled] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra trạng thái lưu trữ khi load trang
    const checkStatus = () => {
      const saved = localStorage.getItem("desktop-swipe");
      setDesktopSwipeEnabled(saved === "true");
    };

    checkStatus();

    // 2. Lắng nghe sự kiện thay đổi từ công tắc ở Navigation
    window.addEventListener("storage", checkStatus);
    return () => window.removeEventListener("storage", checkStatus);
  }, []);

  const menuRoutes = [
    `/${lang}`,
    `/${lang}/about`,
    `/${lang}/services`,
    `/${lang}/portfolio`,
    `/${lang}/blog`,
    `/${lang}/contact`,
  ];

  const currentIndex = menuRoutes.indexOf(pathname);

  const bind = useDrag(({ active, movement: [mx, my], velocity: [vx], direction: [dx], cancel }) => {
    if (currentIndex === -1) return;

    // LOGIC NÂNG CẤP: Kiểm tra thiết bị
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint
    
    // Nếu là Desktop mà công tắc đang TẮT thì không làm gì cả
    if (isDesktop && !desktopSwipeEnabled) return;

    if (Math.abs(my) > Math.abs(mx)) {
      cancel();
      return;
    }

    if (!active) {
      if (Math.abs(vx) > 0.4 && Math.abs(mx) > 60) {
        if (dx < 0 && currentIndex < menuRoutes.length - 1) {
          router.push(menuRoutes[currentIndex + 1]);
        } else if (dx > 0 && currentIndex > 0) {
          router.push(menuRoutes[currentIndex - 1]);
        } else {
          controls.start({ x: 0 });
        }
      } else {
        controls.start({ x: 0 });
      }
    } else {
      const isBoundary = (dx < 0 && currentIndex === menuRoutes.length - 1) || (dx > 0 && currentIndex === 0);
      controls.set({ x: isBoundary ? mx / 10 : mx / 2 }); 
    }
  }, { 
    axis: 'x', 
    pointer: { touch: true },
    filterTaps: true // Ngăn chặn nhảy trang khi chỉ click chuột vào link
  });

  useEffect(() => {
    controls.set({ x: 0 });
  }, [pathname, controls]);

  return (
    <motion.div 
      {...bind()} 
      animate={controls} 
      className="touch-pan-y will-change-transform"
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </motion.div>
  );
}