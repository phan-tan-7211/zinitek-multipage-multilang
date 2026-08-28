"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const copy = {
  vi: { badge: "Lỗi 404", title: "Trang không", highlight: "tìm thấy", description: "Đường dẫn này không còn tồn tại hoặc đã được thay đổi. Bạn có thể quay lại trang trước hoặc về trang chủ.", home: "Về trang chủ", back: "Quay lại" },
  en: { badge: "Error 404", title: "Page", highlight: "Not Found", description: "This page no longer exists or may have moved. Return to the previous page or continue from the home page.", home: "Back to Home", back: "Go Back" },
  jp: { badge: "404 エラー", title: "ページが", highlight: "見つかりません", description: "このページは存在しないか、移動された可能性があります。前のページまたはホームに戻ってください。", home: "ホームへ戻る", back: "戻る" },
  kr: { badge: "404 오류", title: "페이지를", highlight: "찾을 수 없습니다", description: "이 페이지가 존재하지 않거나 이동되었습니다. 이전 페이지 또는 홈으로 돌아가 주세요.", home: "홈으로", back: "뒤로" },
  cn: { badge: "404 错误", title: "页面", highlight: "未找到", description: "此页面不存在或已移动。您可以返回上一页或回到首页。", home: "返回首页", back: "返回" },
}

function Gear({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="relative flex size-40 items-center justify-center rounded-full border-8 border-primary/20 sm:size-48"
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <span key={angle} className="absolute left-1/2 top-1/2 h-8 w-4 -translate-x-1/2 -translate-y-[6.5rem] rounded-sm bg-primary sm:-translate-y-[7.75rem]" style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-72px)` }} />
      ))}
      <div className="flex size-24 items-center justify-center rounded-full bg-primary shadow-brand sm:size-28">
        <div className="size-10 rounded-full border-4 border-primary-foreground/70 bg-background" />
      </div>
    </motion.div>
  )
}

export default function NotFound() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const segment = (pathname.split("/")[1] || "vi") as keyof typeof copy
  const lang = copy[segment] ? segment : "vi"
  const t = copy[lang]

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-30 dark:opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-10 flex justify-center"><Gear reduceMotion={!!reduceMotion} /></div>
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex min-h-10 items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t.badge}</span>
          <h1 className="mt-6 text-balance font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{t.title} <span className="text-primary italic">{t.highlight}</span></h1>
          <p className="mx-auto mt-5 max-w-[55ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{t.description}</p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="min-h-12 rounded-xl bg-primary px-6 text-primary-foreground transition-transform lg:hover:scale-[1.03]">
              <Link href={`/${lang}`}><Home className="mr-2 size-4" aria-hidden="true" />{t.home}</Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()} className="min-h-12 rounded-xl border-border bg-background px-6 hover:border-primary/40 hover:text-primary">
              <ArrowLeft className="mr-2 size-4" aria-hidden="true" />{t.back}
            </Button>
          </div>

          <p className="mt-12 font-mono text-xs text-muted-foreground/60">ERR_CODE: 404 · ZINITEK</p>
        </motion.div>
      </div>
    </main>
  )
}
