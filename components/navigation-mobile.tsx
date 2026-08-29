"use client"

import Link from "next/link"
import { m, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion"
import { X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DynamicIcon } from "./ui/dynamic-icon"
import { ThemeSwitcher } from "./theme-switcher"
import { SiteLogoMark, SiteLogoWordmark } from "./site-logo"

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "VN" },
  { code: "en", name: "English", flag: "US" },
  { code: "jp", name: "日本語", flag: "JP" },
  { code: "kr", name: "한국어", flag: "KR" },
  { code: "cn", name: "中文", flag: "CN" },
]

interface MobileNavigationProps {
  lang: string
  dict: any
  pathname: string
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  handleLangChange: (lang: string) => void
  menuItems: Array<{ name: string; href: string; hasMega?: boolean }>
  serviceItems: Array<{ icon: any; slug: string; title?: string; desc?: string; language?: string }>
}

export function MobileNavigation({
  lang,
  dict,
  pathname,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLangChange,
  menuItems,
  serviceItems,
}: MobileNavigationProps) {
  const reduceMotion = useReducedMotion()
  const isActive = (href: string) => href === `/${lang}` ? pathname === `/${lang}` : pathname.startsWith(href)

  return (
    <LazyMotion features={domAnimation}>
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground shadow-soft transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={reduceMotion ? false : { opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed inset-0 z-[99999] flex w-full flex-col bg-background lg:hidden"
            style={{ height: "100dvh" }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-lg">
              <Link href={`/${lang}`} aria-label={dict.navigation.home || "Home"} className="flex min-h-11 items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <SiteLogoMark size="md" />
                <SiteLogoWordmark
                  lang={lang}
                  fallbackTagline={dict.common.logo_subtitle}
                  titleClassName="text-xl font-bold tracking-tight text-foreground"
                  taglineClassName="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                />
              </Link>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 touch-pan-y">
              <div className="grid gap-4 sm:grid-cols-[1.15fr_.85fr]">
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
                  <div className="border-b border-border/60 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Menu</p>
                  </div>
                  <nav aria-label="Mobile primary navigation">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex min-h-12 items-center border-b border-border/40 px-4 text-sm font-bold transition-colors last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                          isActive(item.href) ? "bg-primary/8 text-primary" : "text-foreground active:bg-secondary hover:bg-secondary/60"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                  <ThemeSwitcher lang={lang} dict={dict} />
                  <div className="mt-5 border-t border-border/60 pt-4">
                    <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Language</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => handleLangChange(l.code)}
                          className={cn(
                            "flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            lang === l.code ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="text-[10px] font-black">{l.flag}</span>
                          <span className="truncate text-xs font-bold">{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <section className="mt-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft" aria-labelledby="mobile-services-title">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p id="mobile-services-title" className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{dict.navigation.services}</p>
                  <Link href={`/${lang}/services`} onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-semibold text-muted-foreground hover:text-primary">View all →</Link>
                </div>
                <div className="flex flex-col">
                  {serviceItems.map((service, index) => (
                    <Link
                      key={service.slug || `service-${index}`}
                      href={`/${lang}/services/${service.slug}`}
                      prefetch
                      className="group flex min-h-14 items-center gap-3 border-b border-border/40 px-1 py-2.5 last:border-0 active:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-active:bg-primary/20">
                        <DynamicIcon iconData={service.icon} className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">{service.title || "Dịch vụ"}</span>
                          {service.language && service.language !== lang && (
                            <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[8px] font-black uppercase text-primary-foreground">{service.language}</span>
                          )}
                        </div>
                        {service.desc && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{service.desc}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <div className="shrink-0 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-lg">
              <Button asChild className="min-h-12 w-full rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-soft">
                <Link href={`/${lang}/contact`} onClick={() => setIsMobileMenuOpen(false)}>{dict.common.contact_btn}</Link>
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
