"use client"

import React, { useState, useEffect } from "react"
import { Phone, MapPin, ArrowUp } from "lucide-react"

export function FloatingContactBar() {
  const [hienThiNutTop, setHienThiNutTop] = useState(false)

  // Theo dõi sự kiện cuộn trang để hiện/ẩn nút "Lên Top"
  useEffect(() => {
    const kiemTraCuonTrang = () => {
      if (window.scrollY > 300) {
        setHienThiNutTop(true)
      } else {
        setHienThiNutTop(false)
      }
    }

    window.addEventListener("scroll", kiemTraCuonTrang)
    return () => window.removeEventListener("scroll", kiemTraCuonTrang)
  }, [])

  // Hàm cuộn lên đầu trang mượt mà
  const cuonLenTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    // Bỏ overflow-hidden để các tooltip (absolute) có thể tràn ra ngoài
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col bg-background border border-l-0 border-border rounded-r-xl shadow-lg transition-all duration-300">
      {/* 1. Nút Hotline */}
      <a
        href="tel:+84776220031"
        className="relative flex flex-col items-center justify-center p-3 w-16 h-16 sm:w-20 sm:h-20 border-b border-border hover:bg-orange-50 dark:hover:bg-orange-950/20 group transition-colors text-center rounded-tr-xl"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#f97316] mb-1 group-hover:scale-110 transition-transform relative z-10" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-[#f97316] transition-colors relative z-10">
          Hotline
        </span>

        {/* Tooltip hiển thị khi Hover */}
        <div className="absolute left-full top-[-1px] h-[calc(100%+2px)] flex items-center px-4 sm:px-6 bg-[#f97316] text-white text-sm sm:text-base font-bold rounded-r-xl shadow-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-x-2 group-hover:translate-x-0 transition-all duration-300 border border-[#f97316] -z-10">
          +84 77 622 0031
        </div>
      </a>

      {/* 2. Nút Zalo */}
      <a
        href="https://zalo.me/0776220031"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex flex-col items-center justify-center p-3 w-16 h-16 sm:w-20 sm:h-20 border-b border-border hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-colors text-center"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#0068ff] rounded-full flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform shadow-sm relative z-10">
          <span className="text-[10px] sm:text-xs font-bold leading-none">Zalo</span>
        </div>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-[#0068ff] transition-colors relative z-10">
          Zalo
        </span>

        {/* Tooltip hiển thị khi Hover */}
        <div className="absolute left-full top-[-1px] h-[calc(100%+2px)] flex items-center px-4 sm:px-6 bg-[#0068ff] text-white text-sm sm:text-base font-bold rounded-r-xl shadow-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-x-2 group-hover:translate-x-0 transition-all duration-300 border border-[#0068ff] -z-10">
          Chat Zalo ngay
        </div>
      </a>

      {/* 3. Nút Bản đồ (Map) */}
      <a
        href="https://maps.google.com/?q=KCN+My+Phuoc+3+Ben+Cat+Binh+Duong"
        target="_blank"
        rel="noopener noreferrer"
        className={`relative flex flex-col items-center justify-center p-3 w-16 h-16 sm:w-20 sm:h-20 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-colors text-center ${!hienThiNutTop ? 'border-none rounded-br-xl' : 'border-b border-border'}`}
      >
        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-1 group-hover:scale-110 transition-transform relative z-10" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-red-500 transition-colors relative z-10">
          Map
        </span>

        {/* Tooltip hiển thị khi Hover */}
        <div className="absolute left-full top-[-1px] h-[calc(100%+2px)] flex items-center px-4 sm:px-6 bg-red-500 text-white text-sm sm:text-base font-bold rounded-r-xl shadow-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-x-2 group-hover:translate-x-0 transition-all duration-300 border border-red-500 -z-10">
          Chỉ đường Google Maps
        </div>
      </a>

      {/* 4. Nút Lên Top (Chỉ hiện khi cuộn xuống) */}
      <button
        onClick={cuonLenTop}
        className={`relative flex flex-col items-center justify-center p-3 w-16 sm:w-20 hover:bg-secondary/50 group transition-all duration-300 text-center rounded-br-xl ${
          hienThiNutTop ? "opacity-100 h-16 sm:h-20 border-t border-border" : "opacity-0 h-0 py-0 border-0 overflow-hidden"
        }`}
        aria-hidden={!hienThiNutTop}
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#f97316] mb-1 group-hover:-translate-y-1 transition-transform relative z-10" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-[#f97316] transition-colors relative z-10">
          Lên Top
        </span>

        {/* Tooltip hiển thị khi Hover */}
        <div className="absolute left-full top-[-1px] h-[calc(100%+2px)] flex items-center px-4 sm:px-6 bg-[#f97316] text-white text-sm sm:text-base font-bold rounded-r-xl shadow-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-x-2 group-hover:translate-x-0 transition-all duration-300 border border-[#f97316] -z-10">
          Lên đầu trang
        </div>
      </button>
    </div>
  )
}
