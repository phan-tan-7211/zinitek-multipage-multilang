"use client";
import { useDrag } from "@use-gesture/react";
import { motion, useAnimation } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Hàm kiểm tra xem element nguồn có nằm trong một scrollable container ngang không
// Giống cách TikTok/Facebook xử lý: vuốt trong carousel → carousel scroll, không chuyển trang
function isInsideHorizontalScroller(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  let el: Element | null = target;
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflowX = style.overflowX;
    const isScrollableX = (overflowX === 'auto' || overflowX === 'scroll');
    if (isScrollableX && el.scrollWidth > el.clientWidth) return true;
    // Kiểm tra data attribute để component có thể tự đánh dấu vùng cuộn ngang
    if (el.getAttribute('data-swipe-zone') === 'horizontal') return true;
    el = el.parentElement;
  }
  return false;
}

export function SmartSwipeWrapper({ children, lang, services = [] }: { children: React.ReactNode; lang: string; services?: { slug: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimation();
  const [desktopSwipeEnabled, setDesktopSwipeEnabled] = useState(false);
  const touchStartTarget = useRef<EventTarget | null>(null);

  const mainRoutes = [`/${lang}`, `/${lang}/about`, `/${lang}/services`, `/${lang}/products`, `/${lang}/portfolio`, `/${lang}/blog`, `/${lang}/contact`];
  const subServices = services.length > 0
    ? services.map(s => `/${lang}/services/${s.slug}`)
    : [`/${lang}/services/cnc`, `/${lang}/services/molds`, `/${lang}/services/3d-scan`, `/${lang}/services/plc`, `/${lang}/services/coils`, `/${lang}/services/ems`, `/${lang}/services/it-software`];

  useEffect(() => {
    const checkStatus = () => {
      const saved = localStorage.getItem("desktop-swipe");
      setDesktopSwipeEnabled(saved === "true");
    };
    checkStatus();
    window.addEventListener("storage", checkStatus);
    return () => window.removeEventListener("storage", checkStatus);
  }, []);

  // Ghi lại element bắt đầu touch để kiểm tra zone sau
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartTarget.current = e.target;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    return () => window.removeEventListener('touchstart', onTouchStart);
  }, []);

  const bind = useDrag(({ active, movement: [mx], velocity: [vx], event }) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("swipe-active", {
        detail: { active, velocity: vx, distance: mx }
      }));
    }

    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && !desktopSwipeEnabled) return;

    // --- ZONE CHECK: nếu bắt đầu vuốt trong vùng cuộn ngang → nhường quyền, không chuyển trang ---
    const startTarget = touchStartTarget.current || (event as TouchEvent | MouseEvent)?.target;
    if (isInsideHorizontalScroller(startTarget)) return;

    if (!active) {
      const distance = Math.abs(mx);
      const isRight = mx > 0; // Kéo sang phải → Về trước
      const isLeft = mx < 0;  // Kéo sang trái → Tiếp theo

      const subIndex = subServices.indexOf(pathname);
      const isOnSubPage = subIndex !== -1;

      // Ngưỡng vuốt: trang con cần sâu hơn (130px), trang thường chỉ cần 60px
      const isCamThreshold = distance > (isOnSubPage ? 130 : 60);
      const isWhiteThreshold = distance > 30;

      if (isCamThreshold || isWhiteThreshold) {
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

      controls.start({ x: 0, transition: { type: "spring", stiffness: 450, damping: 40 } });
    } else {
      controls.set({ x: mx / 1.5 });
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
    <motion.div {...(bind() as any)} animate={controls} className="touch-pan-y will-change-transform" style={{ touchAction: 'pan-y' }}>
      {children}
    </motion.div>
  );
}