"use client"

import React, { useEffect, useState } from "react"
import { Phone, MapPin, ArrowUp } from "lucide-react"
import { useSiteSettings } from "@/components/site-settings-context"

const baseItem = "group relative flex size-14 flex-col items-center justify-center gap-1 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:size-16"

export function FloatingContactBar() {
  const { phoneDisplay, phoneTel, zaloNumber } = useSiteSettings()
  const [showTop, setShowTop] = useState(false)
  const [nearFooter, setNearFooter] = useState(false)

  useEffect(() => {
    let raf = 0
    let previousFooter: HTMLElement | null = null

    const update = () => {
      raf = 0
      setShowTop(window.scrollY > 300)

      const footer = document.querySelector("footer") as HTMLElement | null
      const isMobileLayout = window.innerWidth < 1280
      const rect = footer?.getBoundingClientRect()
      const active = Boolean(isMobileLayout && rect && rect.top <= window.innerHeight - 12)

      if (previousFooter && previousFooter !== footer) previousFooter.style.paddingBottom = ""
      previousFooter = footer

      if (footer) {
        footer.style.paddingBottom = active
          ? "calc(4.75rem + env(safe-area-inset-bottom))"
          : ""
      }

      setNearFooter(active)
    }

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (raf) window.cancelAnimationFrame(raf)
      if (previousFooter) previousFooter.style.paddingBottom = ""
    }
  }, [])

  const scrollTop = () => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  }

  const shellClass = nearFooter
    ? "fixed bottom-0 left-1/2 z-50 flex -translate-x-1/2 flex-row overflow-visible rounded-t-2xl rounded-b-none border border-b-0 border-border/70 bg-background/95 shadow-card backdrop-blur-xl transition-all duration-300 xl:bottom-auto xl:left-auto xl:right-0 xl:top-1/2 xl:-translate-x-0 xl:-translate-y-1/2 xl:flex-col xl:rounded-l-2xl xl:rounded-r-none xl:border-b"
    : "fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col overflow-visible rounded-l-2xl rounded-r-none border border-r-0 border-border/70 bg-background/92 shadow-card backdrop-blur-xl transition-all duration-300"

  const separatorClass = nearFooter
    ? "border-l border-border/60 xl:border-l-0 xl:border-t"
    : "border-t border-border/60"

  const zaloHref = zaloNumber ? `https://zalo.me/${zaloNumber.replace(/\D/g, "")}` : undefined

  return (
    <aside className={shellClass} aria-label="Quick contact">
      {phoneDisplay && phoneTel && (
        <a
          href={`tel:${phoneTel}`}
          aria-label={`Hotline ${phoneDisplay}`}
          className={`${baseItem} ${nearFooter ? "rounded-tl-2xl xl:rounded-bl-none" : "rounded-tl-2xl"} hover:bg-primary/10`}
        >
          <Phone className="size-5 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Hotline</span>
          <span className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground opacity-0 shadow-soft transition-all group-hover:opacity-100 group-focus-visible:opacity-100 xl:block">
            {phoneDisplay}
          </span>
        </a>
      )}

      {zaloHref && (
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          className={`${baseItem} ${separatorClass} hover:bg-secondary/70`}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-[#0068ff] text-[9px] font-black text-white transition-transform group-hover:scale-110">Z</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Zalo</span>
        </a>
      )}

      <a
        href="https://maps.google.com/?q=KCN+My+Phuoc+3+Ben+Cat+Binh+Duong"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Google Maps"
        className={`${baseItem} ${separatorClass} hover:bg-secondary/70`}
      >
        <MapPin className="size-5 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Map</span>
      </a>

      {showTop && (
        <button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          className={`${baseItem} ${separatorClass} ${nearFooter ? "rounded-tr-2xl xl:rounded-tr-none xl:rounded-bl-2xl" : "rounded-bl-2xl"} hover:bg-primary/10`}
        >
          <ArrowUp className="size-5 text-primary transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Top</span>
        </button>
      )}
    </aside>
  )
}
