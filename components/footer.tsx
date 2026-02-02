"use client"

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

export function Footer({ lang, dict }: { lang: string; dict: any }) {
  // Khai báo các biến con từ dict để code gọn gàng và tránh lỗi undefined
  const footerDict = dict?.footer || {}
  const navDict = dict?.navigation || {}
  const servicesDict = dict?.services || {}
  const commonDict = dict?.common || {}

  // Mảng liên kết nhanh (Sử dụng tên từ dict)
  const quickLinks = [
    { name: navDict?.home || "Trang chủ", href: `/${lang}` },
    { name: navDict?.about || "Giới thiệu", href: `/${lang}/about` },
    { name: navDict?.services || "Dịch vụ", href: `/${lang}/services` },
    { name: navDict?.projects || "Dự án", href: `/${lang}/portfolio` },
    { name: navDict?.blog || "Blog", href: `/${lang}/blog` },
    { name: navDict?.contact || "Liên hệ", href: `/${lang}/contact` },
  ]

  // Mảng liên kết dịch vụ (Lấy tiêu đề từ dict)
  const serviceLinks = [
    { name: servicesDict?.cnc?.title || "Gia công CNC", href: `/${lang}/services/cnc` },
    { name: servicesDict?.molds?.title || "Thiết kế khuôn mẫu", href: `/${lang}/services/molds` },
    { name: servicesDict?.plc?.title || "PLC & Tự động hóa", href: `/${lang}/services/plc` },
    { name: servicesDict?.ems?.title || "Lắp ráp điện tử", href: `/${lang}/services/ems` },
  ]

  // Mảng chính sách pháp lý (Lấy từ dict)
  const legalLinks = [
    { name: footerDict?.privacy_policy || "Chính sách bảo mật", href: "#" },
    { name: footerDict?.terms_of_use || "Điều khoản sử dụng", href: "#" },
    { name: footerDict?.cookie_policy || "Chính sách cookie", href: "#" },
  ]

  return (
    <footer className="relative bg-[#0f172a] border-t border-[#334155]/50">
      {/* Main footer */}
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Cột 1: Thông tin công ty */}
          <div className="lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-lg flex items-center justify-center">
                  <Cog className="w-6 h-6 text-[#020617]" />
                </div>
              </div>
              {/* Logo Section trong Footer */}
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tight text-foreground">
                  ZINI<span className="text-[#f97316]">TEK</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground -mt-0.5">
                  {dict.common.logo_subtitle}  {/* DÙNG CHUNG */}
                </p>
              </div>
            </Link>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {footerDict?.description || "Đối tác tin cậy trong lĩnh vực gia công cơ khí chính xác theo tiêu chuẩn Nhật Bản."}
            </p>

            {/* Mạng xã hội */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "Youtube" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e293b] text-muted-foreground hover:text-[#f97316] hover:bg-[#f97316]/10 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-5">
              {footerDict?.quick_links || "Liên kết nhanh"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Danh sách dịch vụ */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-5">
              {navDict?.services || "Dịch vụ"}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Bản tin */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-5">
              {navDict?.contact || "Liên hệ"}
            </h4>
            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#f97316] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {footerDict?.address_label || "KCN Mỹ Phước 3, Bến Cát, Bình Dương"}        
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-[#f97316] flex-shrink-0" />
                <a href="tel:+84274123456" className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors">
                  {commonDict?.phone_label || "+84 274 123 456"}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-[#f97316] flex-shrink-0" />
                <a href="mailto:info@zinitek.vn" className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors">
                  {commonDict?.email_label || "info@zinitek.vn"}
                </a>
              </div>
            </div>

            <h4 className="font-serif font-bold text-foreground mb-3 text-sm">
              {footerDict?.newsletter || "Bản tin"}
            </h4>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder={footerDict?.placeholder_email || "Email của bạn"}
                className="bg-[#1e293b] border-[#334155] focus:border-[#f97316] text-sm flex-1"
              />
              <Button 
                type="submit"
                size="icon"
                className="bg-[#f97316] hover:bg-[#ea580c] text-[#020617]"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Thanh bản quyền & Chính sách dưới cùng */}
      <div className="border-t border-[#334155]/50">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {footerDict?.copyright || "© 2026 ZINITEK. Tất cả quyền được bảo lưu."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {legalLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-[#f97316] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Đường kẻ trang trí */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316]" />
    </footer>
  )
}