// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import { useState, useRef, useMemo } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ExternalLink, Eye } from "lucide-react"
import Link from "next/link"

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ĐẦY ĐỦ ---
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

interface PortfolioSectionProps {
  projects: ThongTinDuAn[];
  categories: ThongTinDanhMuc[];
  lang: string;
  dict: any;
}

// --- THÀNH PHẦN THẺ DỰ ÁN (PROJECT CARD) ---
function ProjectCard({ 
  project, 
  currentLanguage 
}: { 
  project: ThongTinDuAn; 
  currentLanguage: string 
}) {
  const [dangDiChuotQuas, setDangDiChuotQua] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-xl bg-[#0f172a] border border-[#334155]/50"
      onMouseEnter={() => setDangDiChuotQua(true)}
      onMouseLeave={() => setDangDiChuotQua(false)}
    >
      {/* Khung chứa hình ảnh dự án */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image?.url || "/placeholder.svg"}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            dangDiChuotQuas ? "grayscale-0 scale-110" : "grayscale"
          }`}
        />
        
        {/* Lớp phủ màu chuyển sắc tối */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent transition-opacity duration-500 ${
          dangDiChuotQuas ? "opacity-90" : "opacity-70"
        }`} />

        {/* Hiệu ứng đường viền màu cam rực sáng khi di chuột vào */}
        <div className={`absolute inset-0 border-2 border-[#f97316] rounded-xl transition-opacity duration-500 ${
          dangDiChuotQuas ? "opacity-50" : "opacity-0"
        }`} />
        
        <div className={`absolute inset-0 shadow-[inset_0_0_30px_rgba(249,115,22,0.3)] rounded-xl transition-opacity duration-500 ${
          dangDiChuotQuas ? "opacity-100" : "opacity-0"
        }`} />

        {/* Nhãn hiển thị phiên bản ngôn ngữ nếu đây là bài viết dự phòng (Fallback) */}
        {project.language !== currentLanguage && (
          <div className="absolute top-0 right-0 bg-[#f97316] text-[#020617] text-[10px] px-2 py-1 font-black uppercase rounded-bl-lg z-20">
            {project.language} Version
          </div>
        )}

        {/* Nội dung thông tin dự án hiển thị trên thẻ */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <span className="text-xs text-[#f97316] font-medium uppercase tracking-wider mb-2">
            {project.client}
          </span>
          <h3 className="font-serif text-lg font-bold text-white mb-2 line-clamp-2">
            {project.title}
          </h3>
          
          {/* Phần mô tả chi tiết - Chỉ hiển thị khi người dùng di chuột vào thẻ */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: dangDiChuotQuas ? 1 : 0, y: dangDiChuotQuas ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground line-clamp-2 mb-3"
          >
            {project.description}
          </motion.p>

          {/* Nhóm các nút bấm hành động tương tác */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: dangDiChuotQuas ? 1 : 0, y: dangDiChuotQuas ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex gap-2"
          >
            <Link 
              href={`/${currentLanguage}/portfolio/${project.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#f97316] text-[#020617] rounded-lg hover:bg-[#fb923c] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem chi tiết
            </Link>
            <div className="flex items-center justify-center w-9 h-9 border border-white/20 text-white rounded-lg hover:border-[#f97316]/50 hover:bg-[#f97316]/10 transition-colors cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// --- THÀNH PHẦN CHÍNH: PHẦN HIỂN THỊ DANH SÁCH DỰ ÁN ---
export function PortfolioSection({ 
  projects, 
  categories, 
  lang, 
  dict 
}: PortfolioSectionProps) {
  // Trạng thái lưu trữ định danh danh mục đang được người dùng lựa chọn để lọc (Mặc định là "all")
  const [maDanhMucDangLoc, setMaDanhMucDangLoc] = useState("all")
  const thamChieuSection = useRef(null)
  const dangTrongTamNhin = useInView(thamChieuSection, { once: true, margin: "-100px" })

  // Logic lọc danh sách dự án dựa trên định danh danh mục dịch vụ đã chọn
  const danhSachDuAnDaLoc = useMemo(() => {
    if (maDanhMucDangLoc === "all") return projects;
    return projects.filter((duAn) => duAn.categoryIdentifier === maDanhMucDangLoc);
  }, [maDanhMucDangLoc, projects]);

  return (
    <section className="relative py-24 lg:py-32 bg-[#0f172a]/50">
      {/* Lớp nền màu chuyển sắc (Gradient Background) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a]/50 to-[#020617]" />

      <div ref={thamChieuSection} className="container mx-auto px-4 lg:px-6 relative z-10">
        
        {/* Phần tiêu đề giới thiệu (Header Section) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={dangTrongTamNhin ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
            <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
              {dict.featured_projects?.badge || "Dự án"}
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Thành tựu <span className="italic text-[#f97316]">nổi bật</span>
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            {dict.featured_projects?.description || "Những dự án tiêu biểu thể hiện năng lực kỹ thuật của ZINITEK."}
          </p>
        </motion.div>

        {/* CỤM BỘ LỌC DANH MỤC ĐỘNG (Lấy dữ liệu thực tế từ Sanity) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={dangTrongTamNhin ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {/* Nút bấm để hiển thị toàn bộ dự án */}
          <button
            onClick={() => setMaDanhMucDangLoc("all")}
            className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
              maDanhMucDangLoc === "all"
                ? "bg-[#f97316] text-[#020617] border-[#f97316]"
                : "border-[#334155] text-muted-foreground hover:border-[#f97316]/50 hover:text-foreground"
            }`}
          >
            {lang === 'vi' ? 'Tất cả' : 'All'}
          </button>

          {/* Hiển thị các nút lọc dựa trên danh sách danh mục dịch vụ thực tế */}
          {categories.map((danhMuc) => (
            <button
              key={danhMuc._id}
              onClick={() => setMaDanhMucDangLoc(danhMuc._id)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
                maDanhMucDangLoc === danhMuc._id
                  ? "bg-[#f97316] text-[#020617] border-[#f97316]"
                  : "border-[#334155] text-muted-foreground hover:border-[#f97316]/50 hover:text-foreground"
              }`}
            >
              {danhMuc.title}
            </button>
          ))}
        </motion.div>

        {/* LƯỚI HIỂN THỊ CÁC DỰ ÁN (PROJECT GRID) */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {danhSachDuAnDaLoc.map((duAn) => (
              <ProjectCard key={duAn._id} project={duAn} currentLanguage={lang} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* GHI CHÚ: Nút "Xem tất cả dự án" đã được gỡ bỏ tại đây để tránh dư thừa trên trang danh sách chính */}
      </div>
    </section>
  )
}