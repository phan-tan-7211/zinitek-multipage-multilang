// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Cog, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Youtube, 
  Linkedin,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "next-sanity"

// --- CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export function Footer({ lang, dict }: { lang: string; dict: any }) {
  // Khai báo các biến con từ từ điển để mã nguồn gọn gàng
  const tuDienFooter = dict?.footer || {}
  const tuDienDieuHuong = dict?.navigation || {}
  const tuDienChung = dict?.common || {}

  // Trạng thái lưu trữ danh sách dịch vụ động từ Sanity
  const [danhSachDichVuDong, setDanhSachDichVuDong] = useState<any[]>([])

  // --- FETCH DỮ LIỆU DỊCH VỤ ĐỘNG CHO FOOTER ---
  useEffect(() => {
    async function layDanhSachDichVuChoFooter() {
      try {
        // Lấy tất cả dịch vụ để xử lý logic dự phòng (Fallback)
        const cauTruyVan = `*[_type == "service" && defined(slug.current)] | order(orderRank asc) {
          _id,
          _translationKey,
          language,
          "slug": slug.current,
          title
        }`
        
        const tatCaDichVu = await trinhKetNoiSanity.fetch(cauTruyVan)

        // Thuật toán gom nhóm và chọn bản dịch tốt nhất (Smart Fallback)
        const nhomDichVu: Record<string, any[]> = {};
        tatCaDichVu.forEach((muc: any) => {
          const khoaNhom = muc._translationKey || muc._id;
          if (!nhomDichVu[khoaNhom]) nhomDichVu[khoaNhom] = [];
          nhomDichVu[khoaNhom].push(muc);
        });

        const ketQuaSauCung = Object.values(nhomDichVu).map((nhom: any[]) => {
          return nhom.find((phienBan) => phienBan.language === lang) || 
                 nhom.find((phienBan) => phienBan.language === 'en') || 
                 nhom.find((phienBan) => phienBan.language === 'vi') || 
                 nhom[0];
        });

        // Giới hạn hiển thị khoảng 5-6 dịch vụ tiêu biểu ở Footer
        setDanhSachDichVuDong(ketQuaSauCung.slice(0, 6));
      } catch (loi) {
        console.error("Lỗi tải dịch vụ tại Footer:", loi)
      }
    }

    layDanhSachDichVuChoFooter()
  }, [lang])

  // Mảng liên kết nhanh (Đồng bộ theo ngôn ngữ)
  const lienKetNhanh = [
    { name: tuDienDieuHuong?.home || "Trang chủ", href: `/${lang}` },
    { name: tuDienDieuHuong?.about || "Giới thiệu", href: `/${lang}/about` },
    { name: tuDienDieuHuong?.services || "Dịch vụ", href: `/${lang}/services` },
    { name: tuDienDieuHuong?.products || "Sản phẩm", href: `/${lang}/products` },
    { name: tuDienDieuHuong?.projects || "Dự án", href: `/${lang}/portfolio` },
    { name: tuDienDieuHuong?.blog || "Blog", href: `/${lang}/blog` },
  ]

  // Mảng chính sách pháp lý
  const lienKetPhapLy = [
    { name: tuDienFooter?.privacy_policy || "Chính sách bảo mật", href: "#" },
    { name: tuDienFooter?.terms_of_use || "Điều khoản sử dụng", href: "#" },
    { name: tuDienFooter?.cookie_policy || "Chính sách cookie", href: "#" },
  ]

  return (
    <footer className="relative bg-[#0f172a] border-t border-[#334155]/50">
      {/* Nội dung chính của Footer */}
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center shadow-lg shadow-[#f97316]/20">
                  <Cog className="w-6 h-6 text-[#020617]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tight text-white">
                  ZINI<span className="text-[#f97316]">TEK</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground -mt-0.5 font-medium">
                  {tuDienChung?.logo_subtitle || "Kỹ Thuật Cơ Khí"}
                </p>
              </div>
            </Link>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {tuDienFooter?.description || "Đối tác tin cậy trong lĩnh vực gia công cơ khí chính xác theo tiêu chuẩn Nhật Bản."}
            </p>

            {/* Các biểu tượng mạng xã hội */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "Youtube" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((mangXaHoi) => (
                <a
                  key={mangXaHoi.label}
                  href={mangXaHoi.href}
                  aria-label={mangXaHoi.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e293b] text-muted-foreground hover:text-[#f97316] hover:bg-[#f97316]/10 transition-all duration-300"
                >
                  <mangXaHoi.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Danh mục liên kết nhanh */}
          <div>
            <h4 className="font-serif font-bold text-white mb-6 uppercase tracking-wider text-sm">
              {tuDienFooter?.quick_links || "Liên kết nhanh"}
            </h4>
            <ul className="space-y-3">
              {lienKetNhanh.map((link, chiSo) => (
                <li key={chiSo}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#f97316] transition-all duration-300 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Danh sách dịch vụ kỹ thuật (ĐÃ ĐỤC LỖ ĐỘNG) */}
          <div>
            <h4 className="font-serif font-bold text-white mb-6 uppercase tracking-wider text-sm">
              {tuDienDieuHuong?.services || "Dịch vụ"}
            </h4>
            <ul className="space-y-3">
              {danhSachDichVuDong.length > 0 ? (
                danhSachDichVuDong.map((dichVu, chiSo) => (
                  <li key={dichVu._id || chiSo}>
                    <Link 
                      href={`/${lang}/services/${dichVu.slug}`}
                      className="text-sm text-muted-foreground hover:text-[#f97316] transition-all duration-300 flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {dichVu.title}
                    </Link>
                  </li>
                ))
              ) : (
                // Hiển thị trạng thái chờ nếu dữ liệu chưa tải xong
                <li className="text-xs text-slate-600 italic">Đang tải dữ liệu...</li>
              )}
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ & Đăng ký bản tin */}
          <div>
            <h4 className="font-serif font-bold text-white mb-6 uppercase tracking-wider text-sm">
              {tuDienDieuHuong?.contact || "Liên hệ"}
            </h4>
            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#f97316] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tuDienFooter?.address_label || "KCN Mỹ Phước 3, Bến Cát, Bình Dương"}        
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-[#f97316] flex-shrink-0" />
                <a href={`tel:${tuDienChung?.phone_label}`} className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors">
                  {tuDienChung?.phone_label || "+84 274 123 456"}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-[#f97316] flex-shrink-0" />
                <a href={`mailto:${tuDienChung?.email_label}`} className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors">
                  {tuDienChung?.email_label || "info@zinitek.vn"}
                </a>
              </div>
            </div>

            <h4 className="font-serif font-bold text-white mb-3 text-xs uppercase tracking-widest">
              {tuDienFooter?.newsletter || "Bản tin"}
            </h4>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={tuDienFooter?.placeholder_email || "Email của bạn"}
                className="bg-[#1e293b] border-[#334155] focus:border-[#f97316] text-sm flex-1 h-10 rounded-lg"
              />
              <Button 
                type="submit"
                size="icon"
                className="bg-[#f97316] hover:bg-[#ea580c] text-[#020617] h-10 w-10 rounded-lg transition-transform active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Thanh bản quyền và chính sách dưới cùng */}
      <div className="border-t border-[#334155]/30 bg-[#020617]/50">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 text-center md:text-left font-medium">
              {tuDienFooter?.copyright || "© 2026 ZINITEK. Tất cả quyền được bảo lưu."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {lienKetPhapLy.map((link, chiSo) => (
                <Link
                  key={chiSo}
                  href={link.href}
                  className="text-[11px] uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors font-bold"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Đường kẻ trang trí màu cam thương hiệu */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316]" />
    </footer>
  )
}