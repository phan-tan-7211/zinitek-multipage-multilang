"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { FileText, Download, HardHat, ArrowRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SanityImage } from "./sanity-image"

interface Spec { label: string; value: string }
interface SanityImageData { _id: string; url: string }
interface Attachment { _id: string; url: string; originalFilename: string }
interface ServiceCategory { title: string; slug: string }
interface ProductData {
  title?: string
  modelCode?: string
  description?: string
  image?: SanityImageData
  gallery?: SanityImageData[]
  attachments?: Attachment[]
  tags?: string[]
  features?: string[]
  specifications?: Spec[]
  serviceCategory?: ServiceCategory | null
}

export function ProductDetailPageContent({ product, dictionary, lang }: { product: ProductData; dictionary: any; lang: string }) {
  const reduceMotion = useReducedMotion()
  const safe = {
    title: product.title || "Sản phẩm không có tiêu đề",
    modelCode: product.modelCode || "N/A",
    description: product.description || "Chưa có mô tả chi tiết.",
    image: product.image,
    gallery: product.gallery || [],
    attachments: product.attachments || [],
    features: product.features || [],
    specifications: product.specifications || [],
    serviceCategory: product.serviceCategory,
  }
  const labels = dictionary.product || {}
  const gallery = safe.gallery.length > 0 ? safe.gallery : safe.image ? [safe.image] : []
  const [activeImage, setActiveImage] = useState(safe.image)

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
      <div className="lg:col-span-8">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <HardHat className="size-4" aria-hidden="true" />
            <span>{safe.serviceCategory?.title || "Thiết bị Công nghiệp"}</span>
          </div>
          <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {safe.title}
          </h1>
          <p className="mt-5 border-l-2 border-primary pl-4 font-mono text-base italic text-muted-foreground sm:text-lg">
            Model: {safe.modelCode}
          </p>
        </motion.header>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-5 flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card"
        >
          <SanityImage imageData={activeImage || safe.image} alt={safe.title} width={1200} height={720} className="h-full w-full object-contain" priority />
        </motion.div>

        {gallery.length > 1 && (
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {gallery.map((image) => (
              <button
                key={image._id}
                type="button"
                onClick={() => setActiveImage(image)}
                aria-label={`Xem ảnh ${safe.title}`}
                className={cn(
                  "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeImage?._id === image._id ? "border-primary ring-2 ring-primary/20" : "border-border/60 opacity-70 hover:opacity-100 lg:hover:scale-[1.04]"
                )}
              >
                <SanityImage imageData={image} alt="" width={96} height={80} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <Card className="mt-8 rounded-3xl border-border/70 bg-card/85 p-5 shadow-card sm:p-8">
          <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-foreground sm:text-3xl">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {labels.features_title || "Tính năng nổi bật"}
          </h2>
          <p className="mb-8 text-base leading-8 text-muted-foreground sm:text-lg">{safe.description}</p>
          {safe.features.length > 0 && (
            <ul className="grid gap-4 md:grid-cols-2 md:gap-x-8">
              {safe.features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="group flex items-start gap-3 text-sm text-foreground sm:text-base">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-all lg:group-hover:bg-primary lg:group-hover:text-primary-foreground">
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </span>
                  <span className="leading-7">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="mt-10 border-t border-border/60 pt-8">
          <Link
            href={`/${lang}/products`}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-primary/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hover:scale-[1.02]"
          >
            {dictionary.navigation?.products || "Xem tất cả sản phẩm"}
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
        <Card className="rounded-3xl border-border/70 bg-card p-6 shadow-card">
          <h2 className="mb-5 border-b border-border/60 pb-4 font-serif text-xl font-bold text-foreground">
            {labels.specs_title || "Thông số kỹ thuật"}
          </h2>
          {safe.specifications.length > 0 ? (
            <dl className="space-y-4">
              {safe.specifications.map((spec, index) => (
                <div key={`${spec.label}-${index}`} className="flex items-start justify-between gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right text-sm font-bold text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm italic text-muted-foreground">Đang cập nhật thông số kỹ thuật.</p>
          )}
        </Card>

        {safe.attachments.length > 0 && (
          <Card className="rounded-3xl border-border/70 bg-card p-6 shadow-card">
            <h2 className="mb-4 border-b border-border/60 pb-4 font-serif text-xl font-bold text-foreground">
              {labels.attachments_title || "Tài liệu đính kèm"}
            </h2>
            <div className="space-y-3">
              {safe.attachments.map((file) => (
                <a key={file._id} href={file.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-12 items-center justify-between rounded-xl border border-border/60 bg-secondary/40 p-3 transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
                    <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate">{file.originalFilename}</span>
                  </span>
                  <Download className="size-4 shrink-0 text-primary transition-transform lg:group-hover:scale-110" aria-hidden="true" />
                </a>
              ))}
            </div>
          </Card>
        )}

        <Button asChild className="min-h-14 w-full rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-brand transition-transform lg:hover:scale-[1.02]">
          <Link href={`/${lang}/contact`}>{labels.contact_for_quote || "Yêu cầu báo giá"}</Link>
        </Button>
      </aside>
    </div>
  )
}
