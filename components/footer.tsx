
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

  // Trạng thái lưu trữ danh sách dịch vụ và văn bản pháp lý động từ Sanity
  const [danhSachDichVuDong, setDanhSachDichVuDong] = useState<any[]>([])
  const [danhSachPhapLyDong, setDanhSachPhapLyDong] = useState<any[]>([])

  // --- FETCH DỮ LIỆU DỊCH VỤ ĐỘNG CHO FOOTER ---
  useEffect(() => {
    async function layDuLieuFooter() {
      try {
        // 1. LẤY DANH SÁCH DỊCH VỤ
        const truyVanDichVu = `*[_type == "service" && defined(slug.current)] | order(orderRank asc) {
          _id, _translationKey, language, "slug": slug.current, title
        }`

        // 2. LẤY DANH SÁCH VĂN BẢN PHÁP LÝ (Lọc theo ngôn ngữ hiện tại)
        const truyVanPhapLy = `*[_type == "legalDoc" && language == $lang && defined(slug.current)] {
          _id, "slug": slug.current, title
        }`

        const [tatCaDichVu, danhSachPhapLy] = await Promise.all([
          trinhKetNoiSanity.fetch(truyVanDichVu),
          trinhKetNoiSanity.fetch(truyVanPhapLy, { lang })
        ])

        // Thuật toán Smart Fallback cho Dịch vụ
        const nhomDichVu: Record<string, any[]> = {};
        tatCaDichVu.forEach((muc: any) => {
          const khoa = muc._translationKey || muc._id;
          if (!nhomDichVu[khoa]) nhomDichVu[khoa] = [];
          nhomDichVu[khoa].push(muc);
        });
        const dvSauCung = Object.values(nhomDichVu).map((nhom: any[]) =>
          nhom.find((p) => p.language === lang) || nhom.find((p) => p.language === 'en') || nhom.find((p) => p.language === 'vi') || nhom[0]
        );
        setDanhSachDichVuDong(dvSauCung);

        // Làm sạch Slug: Loại bỏ tiền tố ngôn ngữ (ví dụ "vi/", "en/") nếu có để tránh URL trùng lặp kiểu /vi/policy/vi/slug
        const phapLyDaLamSach = danhSachPhapLy.map((item: any) => ({
          ...item,
          slug: item.slug.includes('/') ? item.slug.split('/').pop() : item.slug
        }));

        setDanhSachPhapLyDong(phapLyDaLamSach);

      } catch (loi) {
        console.error("Lỗi tải dữ liệu tại Footer:", loi)
      }
    }

    layDuLieuFooter()
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

  // Mảng chính sách pháp lý (Dùng tạm thời cho đến khi CMS tải xong) - KHÔNG CÒN CẦN THIẾT NHƯNG GIỮ ĐỂ TRÁNH LỖI PHỤ THUỘC NẾU CÓ
  const lienKetPhapLy = [
    { name: tuDienFooter?.privacy_policy || "Chính sách bảo mật", href: "#" },
    { name: tuDienFooter?.terms_of_use || "Điều khoản sử dụng", href: "#" },
    { name: tuDienFooter?.cookie_policy || "Chính sách cookie", href: "#" },
  ]

  return (
    <footer className="relative bg-secondary/20 border-t border-border/50">
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
                <span className="text-xl font-serif font-bold tracking-tight text-foreground">
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
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-card text-muted-foreground hover:text-[#f97316] hover:bg-[#f97316]/10 transition-all duration-300 shadow-sm border border-border/50"
                >
                  <mangXaHoi.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Danh mục liên kết nhanh */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
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
            <h4 className="font-serif font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
              {tuDienDieuHuong?.services || "Dịch vụ"}
            </h4>
            <div className="group/scroll">
              <ul className="space-y-3 max-height-[250px] overflow-y-auto pr-2 
                scrollbar-thin scrollbar-thumb-transparent group-hover/scroll:scrollbar-thumb-[#f97316] scrollbar-track-transparent
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                group-hover/scroll:[&::-webkit-scrollbar-thumb]:bg-[#f97316]
                transition-all duration-300"
                style={{ maxHeight: '250px' }}
              >
                {danhSachDichVuDong.length > 0 ? (
                  danhSachDichVuDong.map((dichVu, chiSo) => (
                    <li key={dichVu._id || chiSo}>
                      <Link
                        href={`/${lang}/services/${dichVu.slug}`}
                        className="text-sm text-muted-foreground hover:text-[#f97316] transition-all duration-300 flex items-center gap-1.5 group/item hover:translate-x-1"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover/item:opacity-100 group-hover/item:ml-0 transition-all" />
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
          </div>

          {/* Cột 4: Thông tin liên hệ & Đăng ký bản tin */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
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

            <h4 className="font-serif font-bold text-foreground mb-3 text-xs uppercase tracking-widest">
              {tuDienFooter?.newsletter || "Bản tin"}
            </h4>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={tuDienFooter?.placeholder_email || "Email của bạn"}
                className="bg-background border-border focus:border-[#f97316] text-sm flex-1 h-10 rounded-lg"
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
      <div className="border-t border-border/50 bg-secondary/40">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left font-medium">
              {tuDienFooter?.copyright || "© 2026 ZINITEK. Tất cả quyền được bảo lưu."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {danhSachPhapLyDong.length > 0 ? (
                danhSachPhapLyDong.map((link, chiSo) => (
                  <Link
                    key={link._id || chiSo}
                    href={`/${lang}/policy/${link.slug}`}
                    className="text-[11px] uppercase tracking-widest text-slate-500 hover:text-[#f97316] transition-colors font-bold"
                  >
                    {link.title}
                  </Link>
                ))
              ) : (
                // Hiển thị fallback từ từ điển nếu CMS chưa có dữ liệu
                [
                  { name: tuDienFooter?.privacy_policy || "Privacy", href: "#" },
                  { name: tuDienFooter?.terms_of_use || "Terms", href: "#" },
                  { name: tuDienFooter?.cookie_policy || "Cookies", href: "#" },
                ].map((link, chiSo) => (
                  <span key={chiSo} className="text-[11px] uppercase tracking-widest text-slate-600 font-bold opacity-50 cursor-not-allowed">
                    {link.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Đường kẻ trang trí màu cam thương hiệu */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316]" />
    </footer>
  )
}