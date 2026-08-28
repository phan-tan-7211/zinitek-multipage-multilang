"use client"

import React, { useState, useEffect } from "react"
import { Phone, MapPin, ArrowUp } from "lucide-react"

const baseItem = "group relative flex size-14 flex-col items-center justify-center gap-1 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:size-16"

export function FloatingContactBar() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTop = () => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  }

  return (
    <aside
      className="fixed bottom-4 right-3 z-50 flex overflow-visible rounded-2xl border border-border/70 bg-background/92 shadow-card backdrop-blur-xl xl:bottom-auto xl:right-0 xl:top-1/2 xl:-translate-y-1/2 xl:flex-col xl:rounded-l-2xl xl:rounded-r-none"
      aria-label="Quick contact"
    >
      <a
        href="tel:+84776220031"
        aria-label="Hotline +84 77 622 0031"
        className={`${baseItem} rounded-l-2xl hover:bg-primary/10 xl:rounded-bl-none xl:rounded-tl-2xl xl:rounded-tr-none`}
      >
        <Phone className="size-5 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Hotline</span>
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground opacity-0 shadow-soft transition-all group-hover:opacity-100 group-focus-visible:opacity-100 xl:bottom-auto xl:left-auto xl:right-full xl:top-1/2 xl:mb-0 xl:mr-2 xl:block xl:-translate-x-0 xl:-translate-y-1/2">
          +84 77 622 0031
        </span>
      </a>

      <a
        href="https://zalo.me/0776220031"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className={`${baseItem} border-l border-border/60 hover:bg-secondary/70 xl:border-l-0 xl:border-t`}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-[#0068ff] text-[9px] font-black text-white transition-transform group-hover:scale-110">Z</span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Zalo</span>
      </a>

      <a
        href="https://maps.google.com/?q=KCN+My+Phuoc+3+Ben+Cat+Binh+Duong"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Google Maps"
        className={`${baseItem} border-l border-border/60 hover:bg-secondary/70 xl:border-l-0 xl:border-t`}
      >
        <MapPin className="size-5 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Map</span>
      </a>

      {showTop && (
        <button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          className={`${baseItem} border-l border-border/60 rounded-r-2xl hover:bg-primary/10 xl:border-l-0 xl:border-t xl:rounded-br-none xl:rounded-bl-2xl xl:rounded-tr-none`}
        >
          <ArrowUp className="size-5 text-primary transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[10px]">Top</span>
        </button>
      )}
    </aside>
  )
}
