"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Xu hướng CNC 5 trục trong gia công linh kiện hàng không",
    excerpt: "Phân tích chi tiết về công nghệ CNC 5 trục và ứng dụng trong ngành công nghiệp hàng không vũ trụ tại Việt Nam.",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    category: "Công nghệ CNC",
    author: "Nguyễn Văn A",
    date: "15/01/2026",
    readTime: "8 phút",
  },
  {
    id: 2,
    title: "Tối ưu hóa quy trình sản xuất với PLC Mitsubishi",
    excerpt: "Hướng dẫn tích hợp hệ thống PLC Mitsubishi để nâng cao hiệu suất và giảm chi phí vận hành nhà máy.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    category: "Tự động hóa",
    author: "Trần Thị B",
    date: "08/01/2026",
    readTime: "6 phút",
  },
  {
    id: 3,
    title: "Reverse Engineering: Từ mẫu vật đến bản vẽ CAD",
    excerpt: "Quy trình chuyển đổi từ sản phẩm thực tế sang mô hình 3D sử dụng công nghệ quét 3D và Geomagic Design X.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "Kỹ thuật",
    author: "Lê Minh C",
    date: "02/01/2026",
    readTime: "10 phút",
  },
]

function BlogCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group bg-[#0f172a] rounded-xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium bg-[#f97316] text-[#020617] rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-[#f97316] transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Author and read more */}
        <div className="flex items-center justify-between pt-4 border-t border-[#334155]/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">{post.author}</span>
          </div>

          <button className="flex items-center gap-1.5 text-sm text-[#f97316] font-medium group-hover:gap-2.5 transition-all">
            Đọc thêm
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function BlogSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 lg:py-32 bg-[#020617]">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#f97316]/3 blur-[150px] rounded-full pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
              <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
                Blog & Tin tức
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Kiến thức <span className="italic text-[#f97316]">chuyên sâu</span>
            </h2>
            
            <p className="text-muted-foreground text-base lg:text-lg">
              Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#f97316]/50 text-[#f97316] rounded-lg hover:bg-[#f97316]/10 transition-colors font-medium text-sm">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
