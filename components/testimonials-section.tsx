"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ExternalLink, Star } from "lucide-react"
import { motion, useInView, useReducedMotion } from "framer-motion"

interface GoogleLocalizedText {
  text?: string
  languageCode?: string
}

interface GoogleReview {
  name?: string
  rating?: number
  text?: GoogleLocalizedText
  originalText?: GoogleLocalizedText
  relativePublishTimeDescription?: string
  publishTime?: string
  googleMapsUri?: string
  author?: {
    displayName?: string
    uri?: string
    photoUri?: string
  } | null
}

interface GoogleReviewsPayload {
  configured?: boolean
  displayName?: GoogleLocalizedText
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: GoogleReview[]
}

interface TestimonialsSectionProps {
  dict: any
  lang?: string
}

const uiText: Record<string, Record<string, string>> = {
  vi: {
    reviews: "đánh giá trên Google",
    viewGoogle: "Xem trên Google",
    translated: "Được Google dịch",
    original: "Ngôn ngữ gốc",
    ordering: "Đánh giá do Google sắp xếp theo mức độ liên quan.",
  },
  en: {
    reviews: "reviews on Google",
    viewGoogle: "View on Google",
    translated: "Translated by Google",
    original: "Original language",
    ordering: "Reviews are ordered by Google by relevance.",
  },
  jp: {
    reviews: "Google のクチコミ",
    viewGoogle: "Googleで見る",
    translated: "Google による翻訳",
    original: "原文",
    ordering: "クチコミは Google の関連性順で表示されます。",
  },
  kr: {
    reviews: "Google 리뷰",
    viewGoogle: "Google에서 보기",
    translated: "Google 번역",
    original: "원문 언어",
    ordering: "리뷰는 Google의 관련성 기준으로 정렬됩니다.",
  },
  cn: {
    reviews: "Google 评价",
    viewGoogle: "在 Google 上查看",
    translated: "由 Google 翻译",
    original: "原文语言",
    ordering: "评价由 Google 按相关性排序。",
  },
}

function Stars({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${star <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-border"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, index, translatedLabel, originalLabel }: { review: GoogleReview; index: number; translatedLabel: string; originalLabel: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const translated = Boolean(
    review.text?.languageCode &&
      review.originalText?.languageCode &&
      review.text.languageCode !== review.originalText.languageCode,
  )

  return (
    <motion.article
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.07 }}
      className="group flex h-full flex-col rounded-[var(--radius-card)] border border-border/70 bg-card/85 p-5 shadow-soft backdrop-blur-sm transition-all lg:hover:-translate-y-1.5 lg:hover:border-primary/30 lg:hover:shadow-card sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Google
        </span>
      </div>

      <p className="flex-1 text-[15px] leading-7 text-foreground">
        “{review.text?.text || review.originalText?.text || ""}”
      </p>

      {translated && (
        <p className="mt-3 text-[11px] font-medium text-muted-foreground">
          {translatedLabel}
          {review.originalText?.languageCode ? ` · ${originalLabel}: ${review.originalText.languageCode}` : ""}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
        {review.author?.photoUri ? (
          <img
            src={review.author.photoUri}
            alt=""
            className="size-10 rounded-full border border-border object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
            {(review.author?.displayName || "G").charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {review.author?.uri ? (
            <a
              href={review.author.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {review.author.displayName || "Google user"}
            </a>
          ) : (
            <div className="truncate font-semibold text-foreground">{review.author?.displayName || "Google user"}</div>
          )}
          <div className="text-xs text-muted-foreground">{review.relativePublishTimeDescription || "Google Maps"}</div>
        </div>
        {review.googleMapsUri && (
          <a
            href={review.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open review on Google Maps"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </motion.article>
  )
}

export function TestimonialsSection({ dict, lang = "vi" }: TestimonialsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const reduceMotion = useReducedMotion()
  const [data, setData] = useState<GoogleReviewsPayload | null>(null)

  const labels = uiText[lang] || uiText.vi
  const t = dict?.testimonials || {}

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/google-reviews?lang=${encodeURIComponent(lang)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Google reviews ${response.status}`)
        return response.json()
      })
      .then((payload) => setData(payload))
      .catch((error) => {
        if (error?.name !== "AbortError") console.error("Google reviews:", error)
        setData({ configured: false, reviews: [] })
      })

    return () => controller.abort()
  }, [lang])

  const reviews = useMemo(
    () => (data?.reviews || []).filter((review) => review.text?.text || review.originalText?.text).slice(0, 5),
    [data],
  )

  if (data && (!data.configured || reviews.length === 0)) return null

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-secondary/20 py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.045] blur-[140px]" aria-hidden="true" />

      <div ref={ref} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.badge || "Google Reviews"}</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary" aria-hidden="true" />
          </div>

          <h2 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {t.title_part1 || "Đối tác"} <span className="italic text-primary">{t.title_highlight || "tin cậy"}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[65ch] text-base leading-7 text-muted-foreground sm:text-lg">
            {t.description || "Những đánh giá thực tế từ khách hàng và đối tác trên Google."}
          </p>

          {data && (
            <div className="mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-border/70 bg-background/90 px-4 py-2.5 shadow-soft">
              <Stars rating={data.rating || 0} />
              <strong className="text-lg text-foreground">{Number(data.rating || 0).toFixed(1)}</strong>
              <span className="text-sm text-muted-foreground">· {data.userRatingCount || 0} {labels.reviews}</span>
              {data.googleMapsUri && (
                <a
                  href={data.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {labels.viewGoogle}<ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </motion.div>

        {!data ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-[var(--radius-card)] border border-border/60 bg-card/60" />)}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.name || `${review.author?.displayName}-${index}`}
                review={review}
                index={index}
                translatedLabel={labels.translated}
                originalLabel={labels.original}
              />
            ))}
          </div>
        )}

        {data && reviews.length > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">{labels.ordering}</p>
        )}
      </div>
    </section>
  )
}
