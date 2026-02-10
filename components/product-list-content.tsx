// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, ExternalLink, Filter, ChevronDown, Check, HardHat } from "lucide-react"
import { cn } from "@/lib/utils"

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface DanhMucHienThi {
  _id: string;
  title: string;
}

interface SanPhamHienThi {
  _id: string;
  title: string;
  description: string;
  slug: string;
  language: string;
  image?: { url: string }; 
  // SỬA ĐỔI: Thêm thuộc tính để nhận đường dẫn tài liệu từ Sanity
  taiLieuDinhKemUrl?: string; 
  categoryInfo?: DanhMucHienThi;
}

interface ProductListContentProps {
  initialProducts: SanPhamHienThi[];
  categories: DanhMucHienThi[];
  dictionary: any;
  currentLanguage: string;
}

export function ProductListContent({
  initialProducts,
  categories,
  dictionary,
  currentLanguage
}: ProductListContentProps) {
  const [maDanhMucDangChon, setMaDanhMucDangChon] = useState<string>("all");
  const [dangMoMenuDropdown, setDangMoMenuDropdown] = useState(false);
  const vungChuaBoLoc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function xuLyNhanRaNgoai(suKien: MouseEvent) {
      if (vungChuaBoLoc.current && !vungChuaBoLoc.current.contains(suKien.target as Node)) {
        setDangMoMenuDropdown(false);
      }
    }
    document.addEventListener("mousedown", xuLyNhanRaNgoai);
    return () => document.removeEventListener("mousedown", xuLyNhanRaNgoai);
  }, []);

  const danhSachSanPhamSauKhiLoc = useMemo(() => {
    if (maDanhMucDangChon === "all") return initialProducts;
    return initialProducts.filter(
      (sanPham) => sanPham.categoryInfo?._id === maDanhMucDangChon
    );
  }, [maDanhMucDangChon, initialProducts]);

  const tenDanhMucHienTai = useMemo(() => {
    if (maDanhMucDangChon === "all") return "Tất cả sản phẩm";
    return categories.find(danhMuc => danhMuc._id === maDanhMucDangChon)?.title || "Phân loại";
  }, [maDanhMucDangChon, categories]);

  return (
    <div className="space-y-12">
      
      {/* --- PHẦN 1: BỘ LỌC THÔNG MINH --- */}
      <div className="flex flex-col items-center gap-6 relative z-50">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.5em] font-black">
           Công nghệ ứng dụng
        </div>

        <div className="hidden w800:flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setMaDanhMucDangChon("all")}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border uppercase tracking-wider",
              maDanhMucDangChon === "all"
                ? "bg-[#f97316] border-[#f97316] text-[#020617] shadow-[0_10px_20px_-10px_#f97316]"
                : "border-white/10 text-slate-400 hover:border-[#f97316]/50 hover:text-white"
            )}
          >
            Tất cả
          </button>
          {categories.map((muc) => (
            <button
              key={muc._id}
              onClick={() => setMaDanhMucDangChon(muc._id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border uppercase tracking-wider",
                maDanhMucDangChon === muc._id
                  ? "bg-[#f97316] border-[#f97316] text-[#020617] shadow-[0_10px_20px_-10px_#f97316]"
                  : "border-white/10 text-slate-400 hover:border-[#f97316]/50 hover:text-white"
              )}
            >
              {muc.title}
            </button>
          ))}
        </div>

        <div className="w800:hidden relative w-full max-w-[280px]" ref={vungChuaBoLoc}>
          <button
            onClick={() => setDangMoMenuDropdown(!dangMoMenuDropdown)}
            className={cn(
              "flex items-center justify-between w-full px-5 py-4 rounded-2xl border transition-all duration-500 bg-[#0f172a]/80 backdrop-blur-xl",
              dangMoMenuDropdown ? "border-[#f97316]" : "border-white/10 shadow-xl"
            )}
          >
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-[#f97316]" />
              <span className="text-sm font-bold text-white truncate max-w-[150px]">
                {tenDanhMucHienTai}
              </span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform", dangMoMenuDropdown && "rotate-180")} />
          </button>

          <AnimatePresence>
            {dangMoMenuDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-full bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[60]"
              >
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={() => { setMaDanhMucDangChon("all"); setDangMoMenuDropdown(false); }}
                    className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all", 
                      maDanhMucDangChon === "all" ? "bg-[#f97316] text-[#020617]" : "text-slate-400")}
                  >
                    <span>Tất cả sản phẩm</span>
                    {maDanhMucDangChon === "all" && <Check className="w-4 h-4" />}
                  </button>
                  {categories.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => { setMaDanhMucDangChon(item._id); setDangMoMenuDropdown(false); }}
                      className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all text-left", 
                        maDanhMucDangChon === item._id ? "bg-[#f97316] text-[#020617]" : "text-slate-400")}
                    >
                      <span className="truncate">{item.title}</span>
                      {maDanhMucDangChon === item._id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- PHẦN 2: LƯỚI SẢN PHẨM MẬT ĐỘ CAO --- */}
      <motion.div 
        layout 
        className="grid grid-cols-2 w600:grid-cols-3 w800:grid-cols-4 laptop:grid-cols-5 gap-x-4 gap-y-6 w-full min-h-[600px]"
      >
        <AnimatePresence mode="popLayout">
          {danhSachSanPhamSauKhiLoc.map((sanPham) => (
            <motion.div
              layout
              key={sanPham._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative overflow-hidden rounded-2xl bg-[#0f172a] border border-[#334155]/50 aspect-[3/4.2]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={sanPham.image?.url || "/images/placeholder-machine.webp"}
                  alt={sanPham.title}
                  className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 border-2 border-[#f97316] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
              </div>

              {sanPham.language !== currentLanguage && (
                <div className="absolute top-0 left-4 bg-[#f97316] text-[#020617] text-[9px] px-2 py-1 font-black uppercase rounded-b-md z-30 shadow-lg">
                  {sanPham.language} ver
                </div>
              )}

              <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                <div className="flex items-center gap-1.5 text-[10px] text-[#f97316] font-bold uppercase tracking-[0.2em] mb-2 opacity-90">
                    <HardHat className="w-3 h-3" />
                    <span>{sanPham.categoryInfo?.title || "MÁY MÓC"}</span>
                </div>
                
                <h3 className="font-serif text-sm md:text-base font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#f97316] transition-colors">
                  {sanPham.title}
                </h3>

                <div className="transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                  <p className="text-[11px] text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {sanPham.description}
                  </p>
                  <div className="flex gap-2">
                    <Link 
                      href={`/${currentLanguage}/products/${sanPham.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-[10px] font-black bg-[#f97316] text-[#020617] rounded-lg hover:bg-[#fb923c] transition-colors uppercase tracking-tight"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Chi tiết
                    </Link>

                    {/* SỬA ĐỔI: Biến khối div biểu tượng ExternalLink thành một liên kết tải tài liệu thực tế */}
                    <a
                      href={sanPham.taiLieuDinhKemUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg border border-white/20 text-white transition-all duration-300",
                        sanPham.taiLieuDinhKemUrl 
                          ? "hover:border-[#f97316]/50 hover:bg-[#f97316]/10 cursor-pointer" 
                          : "opacity-20 cursor-not-allowed pointer-events-none"
                      )}
                      title={sanPham.taiLieuDinhKemUrl ? "Tải tài liệu kỹ thuật" : "Không có tài liệu"}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-3 h-3 border-r border-b border-white/20 z-10 opacity-50 group-hover:opacity-100 group-hover:border-[#f97316] transition-all" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* HIỂN THỊ KHI KHÔNG CÓ KẾT QUẢ */}
      {danhSachSanPhamSauKhiLoc.length === 0 && (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[3rem]"
        >
          <div className="p-5 bg-[#1e293b] rounded-3xl mb-6">
            <Filter className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Không tìm thấy máy móc phù hợp</p>
        </motion.div>
      )}
    </div>
  )
}