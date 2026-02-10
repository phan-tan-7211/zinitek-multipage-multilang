// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Download, HardHat, ArrowRight, X, Menu, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
// Nhập thành phần hiển thị hình ảnh an toàn từ Sanity
import { SanityImage } from './sanity-image'

// --- ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ĐẦY ĐỦ ---
interface ThongSoKyThuat {
  label: string;
  value: string;
}

interface HinhAnhSanity {
  _id: string;
  url: string;
}

interface TepTinSanity {
  _id: string;
  url: string;
  originalFilename: string;
}

interface DanhMucDichVu {
  title: string;
  slug: string;
}

interface DuLieuSanPham {
  title?: string;
  modelCode?: string;
  description?: string;
  image?: HinhAnhSanity;
  gallery?: HinhAnhSanity[];
  attachments?: TepTinSanity[];
  tags?: string[];
  features?: string[];
  specifications?: ThongSoKyThuat[];
  serviceCategory?: DanhMucDichVu | null;
}

interface ProductDetailPageContentProps {
  product: DuLieuSanPham;
  dictionary: any;
  lang: string;
}

// --- THÀNH PHẦN HIỂN THỊ CHI TIẾT SẢN PHẨM ---
export function ProductDetailPageContent({ product, dictionary, lang }: ProductDetailPageContentProps) {
  // KHÔI PHỤC: Trạng thái đóng mở thanh bên (Sidebar) của mã nguồn gốc dành cho thiết bị di động
  const [dangMoThanhBen, setDangMoThanhBen] = useState(false)

  // Tăng cường An toàn Dữ liệu: Gán giá trị mặc định tránh lỗi crash khi dữ liệu từ Sanity bị null hoặc undefined
  const sanPhamAnToan = {
    title: product.title || 'Sản phẩm không có tiêu đề',
    modelCode: product.modelCode || 'N/A',
    description: product.description || 'Chưa có mô tả chi tiết.',
    image: product.image,
    gallery: product.gallery || [],
    attachments: product.attachments || [],
    tags: product.tags || [],
    features: product.features || [],
    specifications: product.specifications || [],
    serviceCategory: product.serviceCategory,
  }

  // Quản lý trạng thái hình ảnh đang được hiển thị trong trình xem chính
  const [hinhAnhHienTai, setHinhAnhHienTai] = useState(sanPhamAnToan.image)

  // Từ điển nhãn hiển thị cho nội dung sản phẩm
  const tuDienSanPham = dictionary.product || {
    specs_title: "Thông số kỹ thuật",
    features_title: "Tính năng nổi bật",
    attachments_title: "Tài liệu đính kèm",
    download_brochure: "Tải Brochure (PDF)",
    contact_for_quote: "Yêu cầu báo giá",
  }

  // Xử lý logic hiển thị bộ sưu tập ảnh (Gallery): Ưu tiên mảng gallery, nếu rỗng dùng ảnh đại diện
  const danhSachAnhGallery = sanPhamAnToan.gallery.length > 0 
    ? sanPhamAnToan.gallery 
    : (sanPhamAnToan.image ? [sanPhamAnToan.image] : [])

  return (
    <div className="container mx-auto px-4 pb-20 pt-10">
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* --- CỘT CHÍNH (8/12): HÌNH ẢNH VÀ CHI TIẾT MÔ TẢ --- */}
        <div className="lg:col-span-8">
          
          {/* Tiêu đề sản phẩm và Mã Model */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center text-sm font-medium text-[#f97316] mb-2 uppercase tracking-widest">
              <HardHat className="w-4 h-4 mr-2" />
              <span>{sanPhamAnToan.serviceCategory?.title || "Thiết bị Công nghiệp"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2 leading-tight">
              {sanPhamAnToan.title}
            </h1>
            <p className="text-xl text-muted-foreground font-mono italic border-l-2 border-[#f97316] pl-4">
              Model: {sanPhamAnToan.modelCode}
            </p>
          </motion.header>

          {/* Khung hiển thị Ảnh Chính */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative bg-[#0f172a] border border-[#334155]/50 rounded-2xl overflow-hidden mb-6 aspect-video flex items-center justify-center shadow-2xl"
          >
            <SanityImage 
              imageData={hinhAnhHienTai || sanPhamAnToan.image} 
              alt={sanPhamAnToan.title}
              width={1000} 
              height={600}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>

          {/* Danh sách ảnh thu nhỏ (Thumbnail Gallery) */}
          {danhSachAnhGallery.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {danhSachAnhGallery.map((hinhAnhMuc) => (
                <div 
                  key={hinhAnhMuc._id}
                  onClick={() => setHinhAnhHienTai(hinhAnhMuc)}
                  className={cn(
                    "w-24 h-20 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105",
                    hinhAnhHienTai?._id === hinhAnhMuc._id ? "border-[#f97316] ring-2 ring-[#f97316]/20" : "border-[#334155] opacity-60 hover:opacity-100"
                  )}
                >
                  <SanityImage
                    imageData={hinhAnhMuc}
                    alt={`Thumbnail for ${sanPhamAnToan.title}`}
                    width={96}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Khối thẻ chứa Mô tả và Tính năng */}
          <Card className="p-8 bg-[#0f172a]/80 backdrop-blur-md border border-[#334155]/50 mt-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-serif font-bold text-[#f97316] mb-6 flex items-center">
              <span className="w-8 h-px bg-[#f97316] mr-4"></span>
              {tuDienSanPham.features_title}
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed text-lg font-medium opacity-90">
              {sanPhamAnToan.description}
            </p>
            
            {/* Danh sách các tính năng kỹ thuật nổi bật */}
            {sanPhamAnToan.features.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 list-none p-0">
                {sanPhamAnToan.features.map((tinhNang, chiSo) => (
                  <motion.li 
                    key={chiSo} 
                    className="flex items-start text-foreground text-sm group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: chiSo * 0.05 }}
                  >
                    <div className="mt-1 mr-3 w-4 h-4 rounded-full border border-[#f97316] flex items-center justify-center flex-shrink-0 group-hover:bg-[#f97316] transition-colors">
                        <ArrowRight className="w-2.5 h-2.5 text-[#f97316] group-hover:text-[#020617]" />
                    </div>
                    <span className="text-base font-medium">{tinhNang}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </Card>

          {/* --- SỬA ĐỔI: CHÈN NÚT XEM TẤT CẢ SẢN PHẨM VÀO CUỐI CỘT CHÍNH --- */}
          <div className="mt-12 pt-10 border-t border-white/5">
              <Link href={`/${lang}/products`}>
                  <button className="inline-flex items-center gap-3 px-8 py-4 border border-[#f97316]/50 text-[#f97316] rounded-xl hover:bg-[#f97316] hover:text-[#020617] transition-all duration-500 font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#f97316]/10 group">
                      {dictionary.navigation?.products || "Xem tất cả sản phẩm"}
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
              </Link>
          </div>

        </div> 
        {/* --- KẾT THÚC CỘT CHÍNH --- */}

        {/* --- CỘT PHỤ (4/12): THÔNG SỐ KỸ THUẬT & TÀI LIỆU --- */}
        <div className="lg:col-span-4 sticky top-28 h-fit space-y-8">
          
          {/* Thẻ hiển thị bảng thông số */}
          <Card className="p-6 bg-[#0f172a] border border-[#334155]/50 rounded-2xl shadow-xl">
            
            <h3 className="text-2xl font-serif font-bold text-[#f97316] mb-6 border-b border-[#334155] pb-4 uppercase tracking-tight">
              {tuDienSanPham.specs_title}
            </h3>

            {/* Duyệt mảng thông số kỹ thuật */}
            {sanPhamAnToan.specifications.length > 0 ? (
              <div className="space-y-4">
                {sanPhamAnToan.specifications.map((thongSo, chiSo) => (
                  <div key={chiSo} className="flex justify-between items-start gap-4 text-sm border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">{thongSo.label}</span>
                    <span className="text-white font-black text-right">{thongSo.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Đang cập nhật thông số kĩ thuật.</p>
            )}

          </Card>

          {/* Thẻ hiển thị Tài liệu đính kèm (PDF, Manual) */}
          {sanPhamAnToan.attachments.length > 0 && (
            <Card className="p-6 bg-[#0f172a] border border-[#334155]/50 rounded-2xl">
              <h3 className="text-2xl font-serif font-bold text-[#f97316] mb-4 border-b border-[#334155] pb-2 uppercase tracking-tight">
                {tuDienSanPham.attachments_title}
              </h3>
              <div className="space-y-3">
                {sanPhamAnToan.attachments.map((tepTin) => (
                  <a 
                    key={tepTin._id}
                    href={tepTin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-[#1e293b] rounded-xl border border-white/5 hover:border-[#f97316]/50 hover:bg-[#334155] transition-all duration-300 group"
                  >
                    <span className="flex items-center text-sm text-foreground truncate pr-4 font-bold">
                      <FileText className="w-5 h-5 mr-2 text-[#f97316]" />
                      {tepTin.originalFilename}
                    </span>
                    <Download className="w-4 h-4 text-[#f97316] group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Nút Liên hệ Yêu cầu báo giá */}
          <Button 
            asChild
            className="w-full h-auto bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-black px-8 py-5 rounded-xl shadow-lg shadow-[#f97316]/25 hover:shadow-[#f97316]/40 transition-all duration-300 text-lg uppercase tracking-tight"
          >
            <Link href={`/${lang}/contact`}>
              {tuDienSanPham.contact_for_quote}
            </Link>
          </Button>

          {/* Icon Menu dự phòng cho thiết bị di động */}
          <div className="mt-6 flex justify-center lg:hidden">
             <button onClick={() => setDangMoThanhBen(!dangMoThanhBen)} className="p-3 bg-white/5 rounded-full text-white border border-white/10 hover:bg-[#f97316]/20 transition-colors">
                {dangMoThanhBen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>

        </div>
        {/* --- KẾT THÚC CỘT PHỤ --- */}
      </div>
    </div>
  )
}