
"use client"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DynamicIcon } from "./ui/dynamic-icon"
import { FallbackBadge } from "./fallback-badge"
import { motion, AnimatePresence } from "framer-motion"

interface ServiceListContentProps {
    danhSachDichVu: any[]
    lang: string
    dict: any
}

export function ServiceListContent({ danhSachDichVu, lang, dict }: ServiceListContentProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Lấy tất cả các tag duy nhất từ danh sách dịch vụ
    const allTags = useMemo(() => {
        const tags = new Set<string>()
        danhSachDichVu.forEach(s => {
            if (s.tags && Array.isArray(s.tags)) {
                s.tags.forEach((t: string) => tags.add(t))
            }
        })
        return Array.from(tags)
    }, [danhSachDichVu])

    // Lọc dịch vụ theo tag
    const filteredServices = useMemo(() => {
        if (!activeTag) return danhSachDichVu
        return danhSachDichVu.filter(s => s.tags && s.tags.includes(activeTag))
    }, [activeTag, danhSachDichVu])

    return (
        <div className="container mx-auto px-4">
            {/* 1. Story-style Horizontal Filter - Sticky on Mobile */}
            {/* offset top-0 because header hides on scroll down */}
            <div className="sticky top-0 md:relative md:top-0 z-40 -mx-4 px-4 md:mx-0 md:px-0 mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 md:border-0 shadow-sm md:shadow-none transition-all py-2 md:py-0">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-1 md:pb-4 gap-2 scrollbar-hide snap-x"
                >
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`flex-shrink-0 px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[12px] font-medium transition-all snap-start border ${activeTag === null
                                ? "bg-[#f97316] text-white border-[#f97316]"
                                : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary"
                            }`}
                    >
                        {dict.navigation?.view_all_services || "Tất cả"}
                    </button>

                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`flex-shrink-0 px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[12px] font-medium transition-all snap-start border ${activeTag === tag
                                    ? "bg-[#f97316] text-white border-[#f97316]"
                                    : "bg-card border-border hover:border-[#f97316]/30 text-muted-foreground"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Grid Dịch vụ - Mobile 2 Cột */}
            <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredServices.map((dichVu: any) => (
                        <motion.div
                            key={dichVu._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Link
                                href={`/${lang}/services/${dichVu.slug}`}
                                className="group bg-card border border-border p-2.5 md:p-5 rounded-2xl hover:border-[#f97316]/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden shadow-sm hover:shadow-md"
                            >
                                {/* Nhãn phiên bản dự phòng */}
                                <FallbackBadge ngonNguThucTe={dichVu.language} ngonNguNguoiDung={lang} />

                                {/* Tiêu đề & Icon cùng hàng */}
                                <div className="flex items-start gap-2 mb-2 md:gap-3 md:mb-3">
                                    {/* Icon - Thu nhỏ trên mobile */}
                                    <div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-[#f97316]/10 rounded-lg md:rounded-xl group-hover:bg-[#f97316] transition-colors duration-300">
                                        <DynamicIcon
                                            iconData={dichVu.icon}
                                            className="w-4 h-4 md:w-6 md:h-6 text-[#f97316] group-hover:text-[#020617] transition-colors"
                                        />
                                    </div>

                                    <h3 className="text-[13px] md:text-lg font-semibold text-foreground leading-snug group-hover:text-[#f97316] transition-colors line-clamp-2">
                                        {dichVu.title}
                                    </h3>
                                </div>

                                <p className="text-muted-foreground text-[11px] md:text-sm leading-relaxed mb-4 md:mb-6 flex-grow line-clamp-2 opacity-85">
                                    {dichVu.description}
                                </p>

                                <div className="flex items-center gap-2 text-[#f97316] font-medium text-[11px] md:text-sm mt-auto">
                                    {dict.services?.read_more || "Chi tiết"}
                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
