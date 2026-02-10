"use client"

import { useEffect, useState, memo } from "react"

// Sử dụng memo để tránh re-render không cần thiết khi các component cha thay đổi
export const BlueprintBackground = memo(function BlueprintBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-50'}`}>
      
      {/* 1. Technical blueprint SVG lines (Giữ nguyên logic pattern) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="blueprintGrid" 
            width="100" 
            height="100" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 100 0 L 0 0 0 100" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="0.5"
            />
            <path 
              d="M 50 0 L 50 100 M 0 50 L 100 50" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="0.25"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
      </svg>

      {/* 2. Chỉ render các chi tiết SVG phức tạp sau khi đã mounted để tránh lỗi Hydration */}
      {mounted && (
        <>
          {/* Technical corner decorations */}
          <svg className="absolute top-20 left-10 w-40 h-40 opacity-[0.08]" viewBox="0 0 200 200">
            <path d="M 10 10 L 10 80 L 20 80 L 20 20 L 80 20 L 80 10 Z" fill="none" stroke="#f97316" strokeWidth="1" />
            <circle cx="10" cy="10" r="3" fill="none" stroke="#f97316" strokeWidth="0.5" />
            {/* Các vạch thước kẻ nhỏ chuyển thành Path tĩnh thay vì lặp */}
            <path d="M30,5 L30,15 M50,5 L50,15 M70,5 L70,15 M5,30 L15,30 M5,50 L15,50 M5,70 L15,70" stroke="#f97316" strokeWidth="0.5" />
          </svg>

          {/* Gear Element - ĐÃ TỐI ƯU: Thay thế vòng lặp .map() bằng Path tĩnh */}
          <svg className="absolute bottom-20 right-10 w-48 h-48 opacity-[0.06]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="60" fill="none" stroke="#f97316" strokeWidth="1" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="#f97316" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="#f97316" strokeWidth="1" />
            <path 
              d="M155,100 L170,100 M147.6,127.5 L160.6,135 M127.5,147.6 L135,160.6 M100,155 L100,170 M72.5,147.6 L65,160.6 M52.4,127.5 L39.4,135 M45,100 L30,100 M52.4,72.5 L39.4,65 M72.5,52.4 L65,39.4 M100,45 L100,30 M127.5,52.4 L135,39.4 M147.6,72.5 L160.6,65" 
              stroke="#f97316" strokeWidth="1.5" 
            />
            <path d="M100,90 L100,110 M90,100 L110,100" stroke="#f97316" strokeWidth="0.5" />
          </svg>

          {/* Thước đo bên trái - Tối ưu thành Path tĩnh */}
          <svg className="absolute top-1/3 left-5 w-6 h-64 opacity-[0.08]" viewBox="0 0 30 300">
            <line x1="15" y1="0" x2="15" y2="300" stroke="#f97316" strokeWidth="0.5" />
            <path d="M5,0 L25,0 M5,300 L25,300 M10,50 L20,50 M10,100 L20,100 M10,150 L20,150 M10,200 L20,200 M10,250 L20,250" stroke="#f97316" strokeWidth="0.5" />
          </svg>

          {/* Technical Arrow element */}
          <svg className="absolute top-1/2 right-5 w-32 h-20 opacity-[0.06]" viewBox="0 0 150 100">
            <path d="M150,50 L50,50 M50,50 L10,10" stroke="#f97316" strokeWidth="0.5" fill="none" />
            <polygon points="55,45 50,50 55,55" fill="#f97316" />
            <rect x="0" y="0" width="40" height="20" fill="none" stroke="#f97316" strokeWidth="0.5" />
          </svg>

          {/* Hexagon trang trí */}
          <svg className="absolute top-2/3 left-1/4 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#f97316" strokeWidth="1" />
            <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="#f97316" strokeWidth="0.5" />
          </svg>

          {/* Crosshair element */}
          <svg className="absolute bottom-1/3 left-1/3 w-16 h-16 opacity-[0.05]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#f97316" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#f97316" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="5" fill="none" stroke="#f97316" strokeWidth="0.5" />
            <path d="M50,10 L50,35 M50,65 L50,90 M10,50 L35,50 M65,50 L90,50" stroke="#f97316" strokeWidth="0.5" />
          </svg>
        </>
      )}
    </div>
  )
})