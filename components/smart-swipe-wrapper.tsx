"use client";
import { useDrag } from "@use-gesture/react";
import { motion, useAnimation } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SmartSwipeWrapper({ children, lang }: { children: React.ReactNode; lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimation();
  const [desktopSwipeEnabled, setDesktopSwipeEnabled] = useState(false);

  const mainRoutes = [`/${lang}`, `/${lang}/about`, `/${lang}/services`, `/${lang}/portfolio`, `/${lang}/blog`, `/${lang}/contact` ];
  const subServices = [`/${lang}/services/cnc`, `/${lang}/services/molds`, `/${lang}/services/3d-scan`, `/${lang}/services/plc`, `/${lang}/services/coils`, `/${lang}/services/ems`, `/${lang}/services/it-software` ];

  useEffect(() => {
    const checkStatus = () => {
      const saved = localStorage.getItem("desktop-swipe");
      setDesktopSwipeEnabled(saved === "true");
    };
    checkStatus();
    window.addEventListener("storage", checkStatus);
    return () => window.removeEventListener("storage", checkStatus);
  }, []);

  const bind = useDrag(({ active, movement: [mx], velocity: [vx] }) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("swipe-active", { 
        detail: { active, velocity: vx, distance: mx } 
      }));
    }

    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && !desktopSwipeEnabled) return;

    if (!active) {
      const distance = Math.abs(mx);
      const isRight = mx > 0; // Kéo sang phải (Về trước)
      const isLeft = mx < 0;  // Kéo sang trái (Tiếp theo)
      
      // ĐỒNG BỘ NGƯỠNG TUYỆT ĐỐI
      const isCamThreshold = distance > 130; // Khoảng cách để chuyển trang CHA (Màu Cam)
      const isWhiteThreshold = distance > 30; // Khoảng cách để chuyển trang CON (Màu Trắng)

      if (isCamThreshold || isWhiteThreshold) {
        const subIndex = subServices.indexOf(pathname);
        const isOnSubPage = subIndex !== -1;

        // 1. ƯU TIÊN CHUYỂN TRANG CHA (CAM)
        if (isCamThreshold) {
          const mainIndex = mainRoutes.findIndex(r => r === `/${lang}` ? pathname === r : pathname.startsWith(r));
          if (mainIndex !== -1) {
            if (isLeft && mainIndex < mainRoutes.length - 1) {
              triggerHaptic(40);
              return router.push(mainRoutes[mainIndex + 1]);
            }
            if (isRight && mainIndex > 0) {
              triggerHaptic(40);
              return router.push(mainRoutes[mainIndex - 1]);
            }
          }
        } 
        // 2. CHUYỂN TRANG CON (TRẮNG)
        else if (isOnSubPage && isWhiteThreshold) {
          if (isLeft && subIndex < subServices.length - 1) {
            triggerHaptic(10);
            return router.push(subServices[subIndex + 1]);
          }
          if (isRight && subIndex > 0) {
            triggerHaptic(10);
            return router.push(subServices[subIndex - 1]);
          }
        }
      }
      
      controls.start({ x: 0, transition: { type: "spring", stiffness: 450, damping: 35 } });
    } else {
      controls.set({ x: mx / 3.8 }); 
    }
  }, { axis: 'x', pointer: { touch: true }, filterTaps: true });

  const triggerHaptic = (ms: number) => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(ms);
    }
  };

  useEffect(() => {
    controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
  }, [pathname, controls]);

  return (
    <motion.div {...bind()} animate={controls} className="touch-pan-y will-change-transform" style={{ touchAction: 'pan-y' }}>
      {children}
    </motion.div>
  );
}