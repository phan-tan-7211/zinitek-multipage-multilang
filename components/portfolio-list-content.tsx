
"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import { FallbackBadge } from "./fallback-badge"

interface ThongTinDanhMuc {
    _id: string;
    title: string;
}

interface ThongTinDuAn {
    _id: string;
    title: string;
    client: string;
    description: string;
    slug: string;
    language: string;
    image: { url: string };
    categoryIdentifier: string;
}

interface PortfolioListContentProps {
    projects: ThongTinDuAn[];
    categories: ThongTinDanhMuc[];
    lang: string;
    dict: any;
}

export function PortfolioListContent({
    projects,
    categories,
    lang,
    dict
}: PortfolioListContentProps) {
    const [activeCategoryId, setActiveCategoryId] = useState("all")
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const filteredProjects = useMemo(() => {
        if (activeCategoryId === "all") return projects;
        return projects.filter((duAn) => duAn.categoryIdentifier === activeCategoryId);
    }, [activeCategoryId, projects]);

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
                        onClick={() => setActiveCategoryId("all")}
                        className={`flex-shrink-0 px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[12px] font-medium transition-all snap-start border ${activeCategoryId === "all"
                                ? "bg-[#f97316] text-white border-[#f97316]"
                                : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary"
                            }`}
                    >
                        {lang === 'vi' ? 'Tất cả' : 'All'}
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveCategoryId(cat._id)}
                            className={`flex-shrink-0 px-4 py-1.5 md:py-2 rounded-full text-[13px] md:text-[12px] font-medium transition-all snap-start border ${activeCategoryId === cat._id
                                    ? "bg-[#f97316] text-white border-[#f97316]"
                                    : "bg-card border-border hover:border-[#f97316]/30 text-muted-foreground"
                                }`}
                        >
                            {cat.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Optimized Project Grid - Social Density */}
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Link
                                href={`/${lang}/portfolio/${project.slug}`}
                                className="group bg-card border border-border/50 rounded-xl md:rounded-3xl hover:border-[#f97316]/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden shadow-sm hover:shadow-md"
                            >
                                {/* Fallback Badge */}
                                <FallbackBadge ngonNguThucTe={project.language} ngonNguNguoiDung={lang} />

                                {/* Project Image - Aspect Ratio App-like */}
                                <div className="relative aspect-square md:aspect-[4/3] overflow-hidden bg-secondary/20">
                                    <img
                                        src={project.image?.url || "/placeholder.svg"}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Client Badge */}
                                    <div className="absolute top-2.5 left-2.5 z-20">
                                        <span className="px-2 py-0.5 backdrop-blur-md bg-black/40 border border-white/10 rounded-full text-[9px] font-bold text-white uppercase tracking-wider shadow-sm">
                                            {project.client}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section - Micro Typography */}
                                <div className="p-2.5 md:p-5 flex flex-col flex-grow">
                                    <h3 className="text-[13px] md:text-lg font-semibold text-foreground mb-1 md:mb-2 leading-tight group-hover:text-[#f97316] transition-colors line-clamp-2">
                                        {project.title}
                                    </h3>

                                    <p className="text-muted-foreground text-[11px] md:text-sm leading-normal md:leading-relaxed mb-3 flex-grow line-clamp-2 opacity-85">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                        <div className="flex items-center gap-1 text-[#f97316] font-medium text-[11px] md:text-sm">
                                            <span>{dict.common?.read_more || "Chi tiết"}</span>
                                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>

                                        <Eye className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-[#f97316] transition-colors" />
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
