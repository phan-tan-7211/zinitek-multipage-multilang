"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { DynamicIcon } from "./ui/dynamic-icon"
import { FallbackBadge } from "./fallback-badge"
import { cn } from "@/lib/utils"

interface ServiceListContentProps {
  danhSachDichVu: any[]
  lang: string
  dict: any
}

export function ServiceListContent({ danhSachDichVu, lang, dict }: ServiceListContentProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    danhSachDichVu.forEach((service) => {
      if (!Array.isArray(service.tags)) return
      service.tags.forEach((tag: unknown) => {
        if (typeof tag === "string" && tag.trim()) tags.add(tag.trim())
      })
    })
    return Array.from(tags)
  }, [danhSachDichVu])

  const filteredServices = useMemo(() => {
    if (!activeTag) return danhSachDichVu
    return danhSachDichVu.filter(
      (service) => Array.isArray(service.tags) && service.tags.includes(activeTag)
    )
  }, [activeTag, danhSachDichVu])

  const filterButtonClass = (active: boolean) =>
    cn(
      "min-h-11 shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-semibold transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      active
        ? "border-primary bg-primary text-primary-foreground shadow-brand"
        : "border-border/70 bg-card/80 text-muted-foreground hover:border-primary/35 hover:text-foreground"
    )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {allTags.length > 0 && (
        <div className="sticky top-0 z-40 -mx-4 mb-8 border-b border-border/50 bg-background/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:relative lg:mx-0 lg:mb-10 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-7 bg-gradient-to-r from-background to-transparent lg:hidden" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-7 bg-gradient-to-l from-background to-transparent lg:hidden" aria-hidden="true" />

          <div className="flex snap-x gap-2 overflow-x-auto pb-1 no-scrollbar lg:flex-wrap lg:overflow-visible lg:pb-0">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              aria-pressed={activeTag === null}
              className={filterButtonClass(activeTag === null)}
            >
              {dict.navigation?.view_all_services || "Tất cả"}
            </button>

            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                aria-pressed={activeTag === tag}
                className={filterButtonClass(activeTag === tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <motion.div layout={!shouldReduceMotion} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredServices.map((service: any, index: number) => (
            <motion.article
              key={service._id || service.slug}
              layout={!shouldReduceMotion}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: Math.min(index * 0.035, 0.18) }}
              className="h-full"
            >
              <Link
                href={`/${lang}/services/${service.slug}`}
                className={cn(
                  "group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-border/70 bg-card p-5 shadow-card transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "lg:hover:-translate-y-2 lg:hover:scale-[1.015] lg:hover:border-primary/45 lg:hover:shadow-brand"
                )}
              >
                <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 opacity-60 blur-3xl transition-all duration-500 lg:group-hover:scale-150 lg:group-hover:opacity-100" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/50 to-transparent transition-transform duration-500 lg:group-hover:scale-x-100" aria-hidden="true" />

                <FallbackBadge ngonNguThucTe={service.language} ngonNguNguoiDung={lang} />

                <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 transition-all duration-300 lg:group-hover:rotate-3 lg:group-hover:scale-110 lg:group-hover:bg-primary">
                    <DynamicIcon
                      iconData={service.icon}
                      className="size-6 text-primary transition-colors duration-300 lg:group-hover:text-primary-foreground"
                    />
                  </div>

                  <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-all duration-300 lg:group-hover:translate-x-1 lg:group-hover:-translate-y-1 lg:group-hover:text-primary" aria-hidden="true" />
                </div>

                <div className="relative z-10 flex flex-1 flex-col">
                  <h2 className="text-balance text-lg font-semibold leading-snug text-foreground transition-colors duration-300 lg:group-hover:text-primary">
                    {service.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>

                  {Array.isArray(service.tags) && service.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary">
                    {dict.services?.read_more || "Chi tiết"}
                    <ArrowRight className="size-4 transition-transform duration-300 lg:group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredServices.length === 0 && (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <p className="text-base font-medium text-foreground">
            {dict.services?.no_results || "Không có dịch vụ phù hợp với bộ lọc này."}
          </p>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="mt-4 min-h-11 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {dict.navigation?.view_all_services || "Xem tất cả dịch vụ"}
          </button>
        </div>
      )}
    </div>
  )
}
