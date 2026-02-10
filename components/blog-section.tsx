// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import Link from "next/link"

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO BÀI VIẾT BLOG ---
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

interface BlogSectionProps {
  posts: BaiVietBlog[];
  lang: string;
  dict: any;
}

// --- THÀNH PHẦN THẺ BÀI VIẾT (BLOG CARD) ---
function BlogCard({ 
  baiViet, 
  chiSo, 
  ngonNguHienTai 
}: { 
  baiViet: BaiVietBlog; 
  chiSo: number; 
  ngonNguHienTai: string 
}) {
  const thamChieuThe = useRef(null)
  const dangTrongTamNhin = useInView(thamChieuThe, { once: true, margin: "-50px" })

  // Định dạng ngày tháng hiển thị theo chuẩn Việt Nam
  const ngayDangBai = new Date(baiViet.publishedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <motion.article
      ref={thamChieuThe}
      initial={{ opacity: 0, y: 50 }}
      animate={dangTrongTamNhin ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: chiSo * 0.15 }}
      className="group bg-[#0f172a] rounded-xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/30 transition-all duration-500 relative"
    >
      {/* Nhãn hiển thị nếu đây là bản dịch dự phòng (Fallback Version) */}
      {baiViet.language !== ngonNguHienTai && (
        <div className="absolute top-0 right-0 z-20 bg-[#f97316] text-[#020617] text-[10px] font-black px-2 py-1 uppercase tracking-tighter rounded-bl-lg shadow-lg">
          {baiViet.language} Version
        </div>
      )}

      {/* Khung chứa hình ảnh đại diện */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={baiViet.mainImage?.url || "/placeholder.svg"}
          alt={baiViet.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        
        {/* Nhãn danh mục bài viết */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium bg-[#f97316] text-[#020617] rounded-full shadow-lg">
            {baiViet.category || "Tin tức"}
          </span>
        </div>
      </div>

      {/* Nội dung tóm tắt bài viết */}
      <div className="p-6">
        {/* Thông tin Meta: Ngày đăng và Thời gian đọc */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
            {ngayDangBai}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#f97316]" />
            {baiViet.readTime || "5 phút"}
          </span>
        </div>

        <Link href={`/${ngonNguHienTai}/blog/${baiViet.slug}`}>
          <h3 className="font-serif text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-[#f97316] transition-colors">
            {baiViet.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {baiViet.excerpt}
        </p>

        {/* Thông tin tác giả và nút xem chi tiết */}
        <div className="flex items-center justify-between pt-4 border-t border-[#334155]/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {baiViet.author || "ZINITEK Team"}
            </span>
          </div>

          <Link 
            href={`/${ngonNguHienTai}/blog/${baiViet.slug}`}
            className="flex items-center gap-1.5 text-sm text-[#f97316] font-bold group-hover:gap-2.5 transition-all uppercase tracking-tighter"
          >
            Đọc thêm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// --- THÀNH PHẦN CHÍNH: PHẦN HIỂN THỊ BLOG ---
export function BlogSection({ posts, lang, dict }: BlogSectionProps) {
  const thamChieuSection = useRef(null)
  const dangTrongTamNhin = useInView(thamChieuSection, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 lg:py-32 bg-[#020617]">
      {/* Hiệu ứng trang trí nền tảng */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#f97316]/3 blur-[150px] rounded-full pointer-events-none" />

      <div ref={thamChieuSection} className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Tiêu đề phần Blog */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={dangTrongTamNhin ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
              <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
                {dict.news_section?.badge || "Blog & Tin tức"}
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Kiến thức <span className="italic text-[#f97316]">chuyên sâu</span>
            </h2>
            
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
              {dict.news_section?.description || "Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK."}
            </p>
          </div>

          {/* GHI CHÚ: Nút "Xem tất cả" đã được gỡ bỏ tại đây để tránh dư thừa trên trang danh sách chính */}
        </motion.div>

        {/* Lưới hiển thị danh sách bài viết */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((baiViet, chiSo) => (
            <BlogCard 
              key={baiViet._id} 
              baiViet={baiViet} 
              chiSo={chiSo} 
              ngonNguHienTai={lang} 
            />
          ))}
        </div>

        {/* Hiển thị thông báo nếu không có bài viết nào */}
        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-muted-foreground italic">Hiện chưa có bài viết nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </section>
  )
}