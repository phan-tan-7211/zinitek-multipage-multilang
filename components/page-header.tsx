"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle: string
  description: string
  lang: string
  dict: any
  breadcrumbs?: { name: string; href: string }[]
}

export function PageHeader({
  title,
  subtitle,
  description,
  lang,
  dict,
  breadcrumbs,
}: PageHeaderProps) {
  const shouldReduceMotion = useReducedMotion()

  const defaultBreadcrumbs = [
    {
      name: dict.common?.home || (lang === "vi" ? "Trang chủ" : "Home"),
      href: `/${lang}`,
    },
    { name: title, href: "#" },
  ]

  const crumbs = breadcrumbs || defaultBreadcrumbs
  const reveal = (delay = 0, distance = 18) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.48, delay },
  })

  return (
    <header className="relative isolate overflow-hidden border-b border-border/60 bg-background pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.025] via-transparent to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-35 dark:opacity-55" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.nav
          {...reveal(0, 12)}
          className="mb-7 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:mb-8"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1

            return (
              <div key={`${crumb.name}-${index}`} className="flex min-w-0 items-center gap-2">
                {index === 0 && (
                  <Home className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
                {index > 0 && (
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
                )}

                {isLast ? (
                  <span className="max-w-[70vw] truncate font-medium text-primary" aria-current="page" title={crumb.name}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            )
          })}
        </motion.nav>

        <div className="max-w-4xl">
          <motion.div
            {...reveal(0.06, 14)}
            className="mb-5 inline-flex min-h-10 items-center rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:mb-6"
          >
            {subtitle}
          </motion.div>

          <motion.h1
            {...reveal(0.12, 20)}
            className="max-w-4xl text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          <motion.p
            {...reveal(0.18, 20)}
            className="mt-5 max-w-[68ch] text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8"
          >
            {description}
          </motion.p>
        </div>
      </div>

      <div className="pointer-events-none absolute left-8 top-32 hidden size-24 border-l border-t border-primary/20 lg:block" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-8 right-8 hidden size-24 border-b border-r border-border/70 lg:block" aria-hidden="true" />
    </header>
  )
}
