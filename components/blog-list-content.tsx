
"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, ArrowRight, User, ChevronRight } from "lucide-react"
import Link from "next/link"
import { FallbackBadge } from "./fallback-badge"

interface BaiVietBlog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    mainImage: { url: string };
    publishedAt: string;
    category: string;
    author?: string;
    readTime?: string;
    language: string;
}

interface BlogListContentProps {
    posts: BaiVietBlog[];
    lang: string;
    dict: any;
}

export function BlogListContent({ posts, lang, dict }: BlogListContentProps) {
    return (
        <div className="container mx-auto px-4">
            {/* Blog Grid - Social News Feed Style */}
            <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {posts.map((post, index) => {
                        const publishDate = new Date(post.publishedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });

                        return (
                            <motion.article
                                key={post._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="group bg-card rounded-xl md:rounded-3xl overflow-hidden border border-border/50 hover:border-[#f97316]/50 transition-all duration-500 relative shadow-sm hover:shadow-md flex flex-col h-full"
                            >
                                {/* Fallback Badge */}
                                <FallbackBadge ngonNguThucTe={post.language} ngonNguNguoiDung={lang} />

                                {/* Cover Image */}
                                <div className="relative aspect-video overflow-hidden bg-secondary/20">
                                    <img
                                        src={post.mainImage?.url || "/placeholder.svg"}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    {/* Category Tag */}
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className="px-2 py-0.5 text-[9px] font-bold bg-[#f97316] text-white rounded-full shadow-lg uppercase tracking-wider">
                                            {post.category || "TECH"}
                                        </span>
                                    </div>
                                </div>

                                {/* Content - Micro Typography */}
                                <div className="p-2.5 md:p-5 flex flex-col flex-grow">
                                    {/* Meta info */}
                                    <div className="flex items-center gap-3 text-[9px] md:text-[11px] text-muted-foreground mb-2 opacity-70">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-2.5 h-2.5 text-[#f97316]" />
                                            {publishDate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5 text-[#f97316]" />
                                            {post.readTime || "5m"}
                                        </span>
                                    </div>

                                    <Link href={`/${lang}/blog/${post.slug}`} className="flex-grow">
                                        <h3 className="text-[13px] md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-[#f97316] transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                    </Link>

                                    <p className="text-[11px] md:text-sm text-muted-foreground line-clamp-2 mb-4 leading-normal opacity-85">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer - High Density */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center border border-border/30">
                                                <User className="w-2.5 h-2.5 text-muted-foreground" />
                                            </div>
                                            <span className="text-[10px] md:text-sm text-muted-foreground font-medium truncate max-w-[80px]">
                                                {post.author || "ZINITEK"}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/${lang}/blog/${post.slug}`}
                                            className="flex items-center gap-1 text-[11px] md:text-sm text-[#f97316] font-bold group-hover:gap-1.5 transition-all"
                                        >
                                            <span className="hidden md:inline">Đọc thêm</span>
                                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {posts.length === 0 && (
                <div className="text-center py-20 border border-dashed border-border/30 rounded-3xl bg-secondary/10">
                    <p className="text-muted-foreground italic text-sm">Hiện chưa có bài viết nào.</p>
                </div>
            )}
        </div>
    )
}
