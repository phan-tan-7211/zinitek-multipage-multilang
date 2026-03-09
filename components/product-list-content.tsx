
"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, HardHat, Camera } from "lucide-react"
import { FallbackBadge } from "./fallback-badge"
import { motion, AnimatePresence } from "framer-motion"

interface ProductListContentProps {
  danhSachSanPham: any[]
  lang: string
  dict: any
}

export function ProductListContent({ danhSachSanPham, lang, dict }: ProductListContentProps) {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {danhSachSanPham.map((sanPham) => (
            <motion.div
              key={sanPham._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              <Link
                href={`/${lang}/products/${sanPham.slug}`}
                className="group block bg-card rounded-2xl md:rounded-3xl border border-border/50 overflow-hidden hover:border-[#f97316]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#f97316]/5 h-full flex flex-col"
              >
                {/* Image Container - Social Media Style */}
                <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-secondary/30">
                  {sanPham.image?.url ? (
                    <Image
                      src={sanPham.image.url}
                      alt={sanPham.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40">
                      <Camera className="w-10 h-10 mb-2 stroke-[1.5px]" />
                      <span className="text-[10px] uppercase tracking-widest font-medium">No Image</span>
                    </div>
                  )}

                  {/* Badge đè lên ảnh (Overlay Badge) */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2 py-1 backdrop-blur-md bg-background/60 dark:bg-[#020617]/60 border border-white/10 dark:border-white/5 rounded-full text-[10px] md:text-[11px] font-bold text-[#f97316] uppercase tracking-wider shadow-sm">
                      {sanPham.serviceCategory?.title || "INDUSTRIAL"}
                    </span>
                  </div>

                  <FallbackBadge ngonNguThucTe={sanPham.language} ngonNguNguoiDung={lang} />

                  {/* Gradient Overlay bottom to top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <h3 className="text-[14px] md:text-lg font-bold text-foreground mb-1.5 md:mb-2 leading-tight group-hover:text-[#f97316] transition-colors line-clamp-2">
                    {sanPham.title}
                  </h3>

                  <p className="text-muted-foreground text-[11px] md:text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                    {sanPham.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-[#f97316] font-bold text-[11px] md:text-sm">
                      <span>{dict.common?.read_more || "Chi tiết"}</span>
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>

                    {/* Small tag icon for industrial feel */}
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary/50 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <HardHat className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#f97316]" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
