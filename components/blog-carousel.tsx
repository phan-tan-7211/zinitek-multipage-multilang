"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  categoryName: string
}

interface BlogCarouselProps {
  posts: BlogPost[]
  lang: string
  readMoreText: string
  categoryNewsText: string
}

export function BlogCarousel({ posts, lang, readMoreText, categoryNewsText }: BlogCarouselProps) {
  return (
    <Carousel
      data-swipe-zone="horizontal"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-6">
        {posts.map((post, index) => (
          <CarouselItem key={index} className="pl-6 basis-[85%] md:basis-[45%] lg:basis-1/3">
            <article className="h-full group bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-[#f97316]/30 transition-all shadow-md flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=500"} 
                  alt={post.title || "Blog post image"} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 500px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs text-[#f97316] mb-3 uppercase tracking-wider">
                  {post.categoryName || categoryNewsText || "Tin tức"}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                  {post.excerpt}
                </p>
                <Link 
                  href={`/${lang}/blog/${post.slug}`} 
                  className="text-sm font-semibold text-foreground flex items-center gap-2 hover:text-[#f97316] transition-colors mt-auto"
                  aria-label={`Đọc tiếp: ${post.title}`}
                >
                  {readMoreText || "Đọc tiếp"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

