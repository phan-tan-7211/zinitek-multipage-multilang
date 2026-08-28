"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const copy = {
  vi: { badge: "Lỗi 404", title: "Trang không", highlight: "tìm thấy", description: "Đường dẫn này không còn tồn tại hoặc đã được thay đổi. Bạn có thể quay lại trang trước hoặc về trang chủ.", home: "Về trang chủ", back: "Quay lại", status: "TRẠNG THÁI: KHÔNG TÌM THẤY", gear: "BÁNH RĂNG: BỊ HỎNG" },
  en: { badge: "Error 404", title: "Page", highlight: "Not Found", description: "This page no longer exists or may have moved. Return to the previous page or continue from the home page.", home: "Back to Home", back: "Go Back", status: "STATUS: NOT FOUND", gear: "GEAR: BROKEN" },
  jp: { badge: "404 エラー", title: "ページが", highlight: "見つかりません", description: "このページは存在しないか、移動された可能性があります。前のページまたはホームに戻ってください。", home: "ホームへ戻る", back: "戻る", status: "ステータス: 未検出", gear: "ギア: 破損" },
  kr: { badge: "404 오류", title: "페이지를", highlight: "찾을 수 없습니다", description: "이 페이지가 존재하지 않거나 이동되었습니다. 이전 페이지 또는 홈으로 돌아가 주세요.", home: "홈으로", back: "뒤로", status: "상태: 찾을 수 없음", gear: "기어: 고장" },
  cn: { badge: "404 错误", title: "页面", highlight: "未找到", description: "此页面不存在或已移动。您可以返回上一页或回到首页。", home: "返回首页", back: "返回", status: "状态: 未找到", gear: "齿轮: 损坏" },
}

function BrokenGear({
  className,
  delay = 0,
  reduceMotion = false,
}: {
  className?: string
  delay?: number
  reduceMotion?: boolean
}) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ rotate: 0 }}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "linear", delay }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gear-gradient-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.72)" />
        </linearGradient>
      </defs>

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
        <rect
          key={angle}
          x="46"
          y="5"
          width="8"
          height="15"
          rx="1.5"
          fill={index === 2 || index === 5 ? "hsl(var(--muted-foreground) / 0.28)" : `url(#gear-gradient-${delay})`}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}

      <circle cx="50" cy="50" r="31" fill={`url(#gear-gradient-${delay})`} />
      <circle cx="50" cy="50" r="22" fill="hsl(var(--background))" opacity="0.18" />
      <circle cx="50" cy="50" r="12" fill="hsl(var(--background))" />
      <circle cx="50" cy="50" r="8" fill="none" stroke="hsl(var(--primary-foreground) / 0.55)" strokeWidth="1.5" />
      <path d="M29 31 L38 38 M62 62 L71 71" stroke="hsl(var(--background) / 0.3)" strokeWidth="2.2" strokeLinecap="round" />

      <motion.path
        d="M 50 20 L 56 35 L 44 35 Z"
        fill="hsl(var(--primary))"
        initial={{ y: 0, opacity: 1 }}
        animate={reduceMotion ? undefined : { y: [0, 80, 80], opacity: [1, 1, 0], rotate: [0, 45, 90] }}
        transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  )
}

function FloatingPart({
  delay,
  x,
  y,
  reduceMotion,
}: {
  delay: number
  x: number
  y: number
  reduceMotion: boolean
}) {
  return (
    <motion.div
      className="pointer-events-none absolute size-3 rounded-sm bg-primary/20 sm:size-4"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: reduceMotion ? 0.25 : 0, scale: reduceMotion ? 1 : 0 }}
      animate={reduceMotion ? undefined : { opacity: [0, 0.65, 0], scale: [0, 1, 0.5], y: [0, -50, -100], rotate: [0, 180, 360] }}
      transition={reduceMotion ? undefined : { duration: 3, delay, repeat: Infinity, repeatDelay: 2 }}
      aria-hidden="true"
    />
  )
}

export default function NotFound() {
  const pathname = usePathname()
  const reduceMotion = !!useReducedMotion()
  const segment = (pathname.split("/")[1] || "vi") as keyof typeof copy
  const lang = copy[segment] ? segment : "vi"
  const t = copy[lang]

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-30 dark:opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-primary/[0.04] blur-3xl" aria-hidden="true" />

      <FloatingPart delay={0} x={20} y={30} reduceMotion={reduceMotion} />
      <FloatingPart delay={0.5} x={70} y={40} reduceMotion={reduceMotion} />
      <FloatingPart delay={1} x={30} y={60} reduceMotion={reduceMotion} />
      <FloatingPart delay={1.5} x={80} y={70} reduceMotion={reduceMotion} />
      <FloatingPart delay={2} x={15} y={50} reduceMotion={reduceMotion} />

      <BrokenGear className="pointer-events-none absolute left-6 top-16 size-24 text-primary opacity-10 sm:left-10 sm:top-20" delay={0} reduceMotion={reduceMotion} />
      <BrokenGear className="pointer-events-none absolute bottom-16 right-5 size-32 text-primary opacity-10 sm:bottom-20 sm:right-10" delay={2} reduceMotion={reduceMotion} />

      <div className="pointer-events-none absolute left-6 top-8 size-20 border-l border-t border-primary/15 sm:left-8 sm:size-24" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-8 right-6 size-20 border-b border-r border-border/60 sm:right-8 sm:size-24" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="relative mx-auto mb-8 size-48 sm:size-56">
          <BrokenGear className="size-full drop-shadow-[0_0_28px_hsl(var(--primary)/0.22)]" reduceMotion={reduceMotion} />
          <motion.div
            className="absolute right-[25%] top-[25%] size-2 rounded-full bg-primary"
            animate={reduceMotion ? undefined : { opacity: [0, 1, 0], scale: [0, 1.7, 0] }}
            transition={reduceMotion ? undefined : { duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            aria-hidden="true"
          />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55 }}
        >
          <span className="inline-flex min-h-10 items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {t.badge}
          </span>

          <h1 className="mt-6 text-balance font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t.title} <span className="italic text-primary">{t.highlight}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[55ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {t.description}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="min-h-12 rounded-xl bg-primary px-6 text-primary-foreground transition-transform lg:hover:scale-[1.03]">
              <Link href={`/${lang}`}>
                <Home className="mr-2 size-4" aria-hidden="true" />
                {t.home}
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()} className="min-h-12 rounded-xl border-border bg-background px-6 hover:border-primary/40 hover:text-primary">
              <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
              {t.back}
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] text-muted-foreground/55 sm:text-xs">
            <span>ERR_CODE: 404</span>
            <span>{t.status}</span>
            <span>{t.gear}</span>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
