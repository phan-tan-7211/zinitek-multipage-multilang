"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { CheckCircle2, Award, Target, Zap } from "lucide-react"

export function AboutSection({ lang, dict }: { lang: string; dict: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const reduceMotion = useReducedMotion()
  const data = dict?.about_summary || {}
  const aboutPage = dict?.about_page || {}
  const stats = dict?.hero?.stats || {}

  const features = [
    { icon: Target, title: data.feature2_title || "High Precision", desc: data.feature2_desc || "Micron-level tolerance standards" },
    { icon: Award, title: aboutPage.quality_title || "Quality Certified", desc: aboutPage.quality_desc || "ISO 9001:2015 & JIS/DIN standards" },
    { icon: Zap, title: data.feature1_title || "Modern Technology", desc: data.feature1_desc || "Multi-axis CNC & automation solutions" },
    { icon: CheckCircle2, title: data.feature3_title || "On-time Delivery", desc: data.feature3_desc || "Optimized workflow and reliable delivery" },
  ]

  const reveal = (x: number, delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, x },
    animate: isInView ? { opacity: 1, x: 0 } : {},
    transition: reduceMotion ? { duration: 0 } : { duration: 0.7, delay },
  })

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary/[0.045] to-transparent" aria-hidden="true" />
      <div ref={ref} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div {...reveal(-40)}>
            <div className="mb-5 inline-flex min-h-10 items-center rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {data.badge || "About ZINITEK"}
            </div>
            <h2 className="max-w-2xl text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {data.title_main || aboutPage.header_title || "Precision engineering"}{" "}
              <span className="text-primary">{data.title_highlight || "built for industry"}</span>
            </h2>
            <div className="mt-7 max-w-[68ch] space-y-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              <p>{aboutPage.header_desc || "ZINITEK delivers precision machining and automation solutions for demanding industrial applications."}</p>
              <p className="border-l-2 border-primary pl-5 font-medium text-foreground/90">{aboutPage.description_2 || "Our engineering platform combines modern equipment, process discipline and practical manufacturing experience."}</p>
              <p>{aboutPage.commitment || "We focus on repeatable quality, dependable delivery and long-term technical partnership."}</p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: 0.15 + index * 0.08 }}
                  className="group rounded-2xl border border-border/70 bg-card/70 p-5 shadow-soft transition-all lg:hover:-translate-y-1 lg:hover:border-primary/40 lg:hover:shadow-card"
                >
                  <feature.icon className="mb-3 size-7 text-primary transition-transform lg:group-hover:scale-110 lg:group-hover:-rotate-3" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal(40, 0.15)} className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square">
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/25"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-5 rounded-full border border-border/70" />
              <div className="absolute inset-10 rounded-full border border-border/50" />
              <div className="absolute inset-14 flex items-center justify-center rounded-full border border-primary/25 bg-card shadow-card">
                <div className="px-8 text-center">
                  <div className="font-serif text-6xl font-bold text-primary">10+</div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{data.exp_label || stats.experience || "Years Experience"}</div>
                  <div className="mx-auto mt-4 h-px w-16 bg-primary" />
                  <div className="mt-4 text-xs text-muted-foreground">Bình Dương, Việt Nam</div>
                </div>
              </div>
              {[{ label: "ISO 9001:2015", pos: "right-4 top-3", d: 3.2 }, { label: "JIS Standard", pos: "bottom-8 left-0", d: 4 }, { label: "CNC 5-Axis", pos: "bottom-20 right-0", d: 3.6 }].map((badge) => (
                <motion.div
                  key={badge.label}
                  animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: badge.d, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute ${badge.pos} z-20 rounded-xl border border-primary/25 bg-card px-4 py-2 shadow-soft`}
                >
                  <span className="text-xs font-bold text-primary">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
