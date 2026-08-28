"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, CheckCircle2, Award, Target, Zap, Cog } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AboutSummary({ lang, dict }: { lang: string; dict: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px", amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  const aboutData = dict?.about_page || {}
  const serviceData = dict?.services?.cnc || {}
  const heroStats = dict?.hero?.stats || {}
  const common = dict?.common || {}
  const nav = dict?.navigation || {}

  const features = [
    {
      icon: Target,
      title: serviceData.title || (lang === "vi" ? "Gia công CNC" : "CNC Machining"),
      desc: lang === "vi" ? "Dung sai dưới 0.005mm" : "Tolerance under 0.005mm",
    },
    {
      icon: Award,
      title: lang === "vi" ? "Chứng chỉ ISO" : "ISO Certification",
      desc: lang === "vi" ? "ISO 9001:2015" : "Quality Management",
    },
    {
      icon: Zap,
      title: lang === "vi" ? "Công nghệ cao" : "High-Tech",
      desc: lang === "vi" ? "Vận hành chuyên nghiệp" : "Professional Operation",
    },
    {
      icon: CheckCircle2,
      title: lang === "vi" ? "Đảm bảo tiến độ" : "On-time Delivery",
      desc: lang === "vi" ? "Giao hàng đúng hẹn" : "Commitment to schedule",
    },
  ]

  const tags = [
    { icon: Award, label: "ISO 9001:2015", position: "right-0 top-[10%]" },
    { icon: CheckCircle2, label: "JIS Standard", position: "-left-2 bottom-[28%]" },
    { icon: Cog, label: "CNC 5-Axis", position: "right-[8%] bottom-[8%]" },
  ]

  return (
    <section
      aria-labelledby="about-summary-title"
      className="relative overflow-hidden border-t border-border/60 bg-card/35 py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-30" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            animate={
              shouldReduceMotion || isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -24 }
            }
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 inline-flex min-h-10 items-center rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {nav.about || (lang === "vi" ? "Giới thiệu" : "About Us")}
            </div>

            <h2
              id="about-summary-title"
              className="max-w-2xl text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              <span className="text-primary">ZINITEK</span> —{" "}
              {aboutData.header_subtitle ||
                (lang === "vi" ? "Kỹ thuật thực chiến" : "Practical Engineering")}
            </h2>

            <p className="mt-5 max-w-[62ch] text-base leading-7 text-muted-foreground sm:text-lg">
              {aboutData.header_desc ||
                (lang === "vi"
                  ? "Chúng tôi tập trung vào việc hiện thực hóa bản vẽ kỹ thuật với độ hoàn thiện cao."
                  : "We focus on realizing technical drawings with high precision.")}
            </p>

            <ul className="mt-9 grid gap-4 sm:grid-cols-2" role="list">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="group flex min-h-24 gap-3 rounded-2xl border border-border/80 bg-background/75 p-4 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-6 text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-9 min-h-12 rounded-full bg-primary px-7 font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link href={`/${lang}/about`} className="flex items-center gap-2">
                {common.read_more || (lang === "vi" ? "Xem chi tiết" : "Read More")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={
              shouldReduceMotion || isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.97 }
            }
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative mx-auto flex w-full max-w-[500px] items-center justify-center py-8"
            aria-label={lang === "vi" ? "Các tiêu chuẩn và năng lực chính của ZINITEK" : "ZINITEK standards and capabilities"}
          >
            <div className="relative aspect-square w-full max-w-[460px]">
              <div className="absolute inset-0 rounded-full border border-primary/15 bg-primary/[0.03]" aria-hidden="true" />
              <div className="absolute inset-[12%] rounded-full border border-border/80" aria-hidden="true" />
              <div className="absolute inset-[24%] rounded-full border border-dashed border-primary/25" aria-hidden="true" />

              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-[6%] rounded-full border border-primary/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                />
              )}

              <div className="absolute inset-[30%] z-10 flex flex-col items-center justify-center rounded-full border border-border bg-background/95 px-6 text-center shadow-card">
                <div className="font-serif text-5xl font-bold leading-none tracking-tight text-primary sm:text-6xl lg:text-7xl">
                  10+
                </div>
                <div className="mt-3 max-w-32 text-xs font-semibold uppercase leading-5 tracking-[0.14em] text-muted-foreground sm:text-sm">
                  {heroStats.experience ||
                    (lang === "vi" ? "Năm kinh nghiệm" : "Years Experience")}
                </div>
              </div>

              {tags.map((tag) => (
                <div
                  key={tag.label}
                  className={`absolute ${tag.position} z-20 flex min-h-11 items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-semibold text-foreground shadow-soft backdrop-blur-sm sm:text-sm`}
                >
                  <tag.icon className="size-4 text-primary" aria-hidden="true" />
                  <span>{tag.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
