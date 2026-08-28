"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import { useReducedMotion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface BlogPost {
  title: string
  slug?: string
  excerpt?: string
  imageUrl?: string
  categoryName?: string
}

interface BlogCarouselProps {
  posts: BlogPost[]
  lang: string
  readMoreText?: string
  categoryNewsText?: string
}

export function BlogCarousel({ posts, lang, readMoreText, categoryNewsText }: BlogCarouselProps) {
  const shouldReduceMotion = useReducedMotion()
  const autoplay = React.useRef(
    Autoplay({
      delay: 4200,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  )

  return (
    <Carousel
      data-swipe-zone="horizontal"
      opts={{ align: "start", loop: true }}
      plugins={shouldReduceMotion ? [] : [autoplay.current]}
      className="w-full"
      aria-label={categoryNewsText || "Tin tức và bài viết"}
    >
      <CarouselContent className="-ml-4">
        {posts.map((post, index) => {
          const href = post.slug ? `/${lang}/blog/${post.slug}` : `/${lang}/blog`

          return (
            <CarouselItem
              key={post.slug || `${post.title}-${index}`}
              className="pl-4 basis-[88%] sm:basis-[72%] md:basis-[48%] lg:basis-1/3"
            >
              <article className="group h-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-[border-color,box-shadow,transform] duration-500 lg:hover:-translate-y-2 lg:hover:scale-[1.015] lg:hover:border-primary/40 lg:hover:shadow-card">
                <Link
                  href={href}
                  className="flex h-full flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`${readMoreText || "Đọc tiếp"}: ${post.title}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={post.imageUrl || "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80"}
                      alt={post.title || ""}
                      fill
                      sizes="(max-width: 768px) 88vw, (max-width: 1024px) 48vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out lg:group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100" aria-hidden="true" />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {post.categoryName || categoryNewsText || "Tin tức"}
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-balance text-xl font-bold leading-snug text-foreground transition-colors duration-300 lg:group-hover:text-primary">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                    )}

                    <div className="mt-5 flex min-h-11 items-center justify-between gap-4 border-t border-border/70 pt-4 text-sm font-semibold text-foreground">
                      <span>{readMoreText || "Đọc tiếp"}</span>
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-[background-color,color,transform] duration-300 lg:group-hover:scale-110 lg:group-hover:bg-primary lg:group-hover:text-primary-foreground" aria-hidden="true">
                        <ArrowRight className="size-4 transition-transform duration-300 lg:group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <div className="mt-6 flex justify-end gap-3">
        <CarouselPrevious className="static size-11 translate-y-0 border-border bg-background shadow-sm hover:border-primary/30 hover:bg-primary/10" />
        <CarouselNext className="static size-11 translate-y-0 border-border bg-background shadow-sm hover:border-primary/30 hover:bg-primary/10" />
      </div>
    </Carousel>
  )
}
