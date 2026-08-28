"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FallbackBadge } from "./fallback-badge"

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  mainImage?: { url?: string }
  publishedAt?: string
  category?: string
  author?: string
  readTime?: string
  language?: string
}

export function BlogListContent({ posts, lang, dict }: { posts: BlogPost[]; lang: string; dict: any }) {
  const reduceMotion = useReducedMotion()
  const locale = lang === "vi" ? "vi-VN" : lang === "jp" ? "ja-JP" : lang === "kr" ? "ko-KR" : lang === "cn" ? "zh-CN" : "en-US"

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => {
          const publishDate = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })
            : ""

          return (
            <motion.article
              key={post._id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all lg:hover:-translate-y-2 lg:hover:scale-[1.015] lg:hover:border-primary/45 lg:hover:shadow-card"
            >
              <FallbackBadge ngonNguThucTe={post.language} ngonNguNguoiDung={lang} />
              <Link href={`/${lang}/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <Image
                  src={post.mainImage?.url || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 lg:group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-soft">
                  {post.category || "TECH"}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {publishDate && <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-primary" aria-hidden="true" />{publishDate}</span>}
                  <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary" aria-hidden="true" />{post.readTime || "5 min"}</span>
                </div>

                <Link href={`/${lang}/blog/${post.slug}`} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <h2 className="line-clamp-2 text-balance font-serif text-xl font-bold leading-snug text-foreground transition-colors lg:group-hover:text-primary">{post.title}</h2>
                </Link>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt || ""}</p>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"><span className="flex size-8 items-center justify-center rounded-full bg-secondary"><User className="size-4" aria-hidden="true" /></span><span className="truncate">{post.author || "ZINITEK"}</span></div>
                  <Link href={`/${lang}/blog/${post.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:group-hover:gap-3">
                    {dict.blog?.read_more || dict.common?.read_more || "Read more"}<ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/20 px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">{dict.blog?.empty || "No articles are available yet."}</p>
        </div>
      )}
    </div>
  )
}
