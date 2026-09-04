"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Home, Info, Settings, Package, Briefcase, FileText, Phone, Circle } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

const resolveIconName = (iconData: any): string => {
  if (typeof iconData === "string") return iconData
  if (typeof iconData?.icon === "string") return iconData.icon
  if (typeof iconData?.name === "string") return iconData.name
  if (typeof iconData?.metadata?.iconName === "string") return iconData.metadata.iconName
  return "Circle"
}

const toPascalCase = (iconData: any) => {
  const rawName = resolveIconName(iconData)
  const name = rawName.includes(":") ? rawName.split(":").pop() || "Circle" : rawName

  return name
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("") || "Circle"
}

const DynamicIcon = ({ name, ...props }: { name: any } & any) => {
  const compName = toPascalCase(name)
  const IconComponent = (LucideIcons as any)[compName]

  if (!IconComponent || typeof IconComponent !== "object" && typeof IconComponent !== "function") {
    return <Circle {...props} />
  }

  return <IconComponent {...props} />
}

interface ServiceIndicatorItem {
  slug: string
  icon?: any
}

export function MobileWidgetIndicator({ lang, dict, services = [] }: { lang: string, dict: any, services?: ServiceIndicatorItem[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const subMenuContainerRef = useRef<HTMLDivElement>(null)

  const isAtSubService = pathname.startsWith(`/${lang}/services/`) && pathname !== `/${lang}/services`
  const [swipeData, setSwipeData] = useState({ active: false, distance: 0, rawDistance: 0 })
  const [contactDocked, setContactDocked] = useState(false)

  useEffect(() => {
    const handleTouch = (e: any) => {
      setSwipeData({
        active: e.detail.active,
        distance: Math.abs(e.detail.distance || 0),
        rawDistance: e.detail.distance || 0,
      })
    }
    window.addEventListener("swipe-active", handleTouch)
    return () => window.removeEventListener("swipe-active", handleTouch)
  }, [])

  useEffect(() => {
    const syncInitialState = () => {
      setContactDocked(document.documentElement.dataset.contactDocked === "true")
    }

    const handleContactDock = (event: Event) => {
      const customEvent = event as CustomEvent<{ active?: boolean }>
      setContactDocked(Boolean(customEvent.detail?.active))
    }

    syncInitialState()
    window.addEventListener("zinitek-contact-dock", handleContactDock)
    return () => window.removeEventListener("zinitek-contact-dock", handleContactDock)
  }, [])

  const d = swipeData.distance
  const raw = swipeData.rawDistance
  const isMainThreshold = d > 130
  const isSubThreshold = d > 30
  const isMoving = d > 5

  let arrowColor = "#ffffff"
  let arrowOpacity = 0.2
  let arrowScale = 1

  if (isMainThreshold) {
    arrowColor = "#f97316"
    arrowOpacity = 1
    arrowScale = 1.4
  } else if (isSubThreshold) {
    arrowColor = "#ffffff"
    arrowOpacity = 1
    arrowScale = 1.1
  } else if (isMoving) {
    arrowOpacity = 0.4
    arrowScale = 0.95
  }

  const subServices: ServiceIndicatorItem[] = services.length > 0 ? services : [
    { slug: "cnc", icon: "Wrench" },
    { slug: "molds", icon: "Box" },
    { slug: "3d-scan", icon: "ScanLine" },
    { slug: "plc", icon: "Cpu" },
    { slug: "coils", icon: "Wind" },
    { slug: "ems", icon: "Zap" },
    { slug: "it-software", icon: "Code" },
  ]

  const routes = [
    { path: `/${lang}`, label: dict.navigation?.home || "Trang chủ", icon: Home },
    { path: `/${lang}/about`, label: dict.navigation?.about || "Giới thiệu", icon: Info },
    { path: `/${lang}/services`, label: dict.navigation?.services || "Dịch vụ", icon: Settings },
    { path: `/${lang}/products`, label: dict.navigation?.products || "Sản phẩm", icon: Package },
    { path: `/${lang}/portfolio`, label: dict.navigation?.projects || "Dự án", icon: Briefcase },
    { path: `/${lang}/blog`, label: dict.navigation?.blog || "Tin tức", icon: FileText },
    { path: `/${lang}/contact`, label: dict.navigation?.contact || "Liên hệ", icon: Phone },
  ]

  const currentIndex = routes.findIndex((route) => route.path === `/${lang}` ? pathname === route.path : pathname.startsWith(route.path))
  const currentServiceSlug = isAtSubService ? pathname.split("/").pop() : null
  const currentSubIndex = subServices.findIndex((service) => service.slug === currentServiceSlug)

  useEffect(() => {
    if (isAtSubService && subMenuContainerRef.current) {
      const activeItem = subMenuContainerRef.current.querySelector('[data-active="true"]')
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [pathname, isAtSubService])

  if (currentIndex === -1) return null

  return (
    <>
      <AnimatePresence>
        {swipeData.active && (
          <div className="fixed inset-y-0 left-0 right-0 pointer-events-none z-[110] flex items-center justify-between px-6 lg:hidden">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: raw > 0 ? arrowOpacity : 0.1,
                scale: raw > 0 ? arrowScale : 0.8,
                color: arrowColor,
                x: 0,
              }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <ChevronLeft
                className="w-14 h-14 stroke-[1.5px]"
                style={{ filter: `drop-shadow(0 0 10px ${arrowColor}${isSubThreshold ? "cc" : "44"})` }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: raw < 0 ? arrowOpacity : 0.1,
                scale: raw < 0 ? arrowScale : 0.8,
                color: arrowColor,
                x: 0,
              }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <ChevronRight
                className="w-14 h-14 stroke-[1.5px]"
                style={{ filter: `drop-shadow(0 0 10px ${arrowColor}${isSubThreshold ? "cc" : "44"})` }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAtSubService && !contactDocked && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.97 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className={cn(
              "fixed z-[100] lg:hidden",
              "bottom-4 left-1/2 -translate-x-1/2 w-[95%] flex flex-row items-center justify-center",
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
                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }}
              aria-label="Service navigation"
            >
              {subServices.map((service, dotIdx) => {
                const isActive = dotIdx === currentSubIndex

                return (
                  <motion.div
                    key={service.slug || dotIdx}
                    data-active={isActive}
                    role="button"
                    tabIndex={0}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(15)
                      router.push(`/${lang}/services/${service.slug}`)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        router.push(`/${lang}/services/${service.slug}`)
                      }
                    }}
                    className={cn(
                      "relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl cursor-pointer transition-all duration-500",
                      isActive ? "bg-primary/15" : "hover:bg-white/5"
                    )}
                    aria-label={`Sub-service ${service.slug}`}
                  >
                    {isActive && <div className="absolute inset-0 bg-primary/30 blur-xl rounded-2xl -z-10 animate-pulse" />}

                    <DynamicIcon
                      name={service.icon}
                      className={cn(
                        "w-8 h-8 z-10 transition-all duration-500",
                        isActive ? "text-primary drop-shadow-[0_0_12px_rgba(249,115,22,1)] scale-110" : "text-white/30"
                      )}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />

                    {isActive && (
                      <div className="hidden landscape:block absolute -right-1 w-1.5 h-4 bg-primary rounded-full shadow-[0_0_15px_#f97316]" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
