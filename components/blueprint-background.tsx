"use client"

import { useEffect, useState } from "react"

export function BlueprintBackground() {
  // 1. Thêm trạng thái để kiểm tra component đã hiển thị trên trình duyệt chưa
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Nếu đang ở Server (chưa mounted), trả về null hoặc một div trống 
  // để tránh lệch dữ liệu HTML ban đầu
  if (!mounted) {
    return <div className="fixed inset-0 bg-[#020617]" />
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Technical blueprint SVG lines */}
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

      {/* Technical corner decorations */}
      <svg 
        className="absolute top-20 left-10 w-40 h-40 opacity-[0.08]"
        viewBox="0 0 200 200"
      >
        <path 
          d="M 10 10 L 10 80 L 20 80 L 20 20 L 80 20 L 80 10 Z" 
          fill="none" 
          stroke="#f97316" 
          strokeWidth="1"
        />
        <line x1="30" y1="5" x2="30" y2="15" stroke="#f97316" strokeWidth="0.5" />
        <line x1="50" y1="5" x2="50" y2="15" stroke="#f97316" strokeWidth="0.5" />
        <line x1="70" y1="5" x2="70" y2="15" stroke="#f97316" strokeWidth="0.5" />
        <line x1="5" y1="30" x2="15" y2="30" stroke="#f97316" strokeWidth="0.5" />
        <line x1="5" y1="50" x2="15" y2="50" stroke="#f97316" strokeWidth="0.5" />
        <line x1="5" y1="70" x2="15" y2="70" stroke="#f97316" strokeWidth="0.5" />
        <circle cx="10" cy="10" r="3" fill="none" stroke="#f97316" strokeWidth="0.5" />
      </svg>

      {/* Bottom right technical element - ĐÂY LÀ NƠI GÂY LỖI */}
      <svg 
        className="absolute bottom-20 right-10 w-48 h-48 opacity-[0.06]"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="60" fill="none" stroke="#f97316" strokeWidth="1" />
        <circle cx="100" cy="100" r="45" fill="none" stroke="#f97316" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="#f97316" strokeWidth="1" />
        
        {/* Gear teeth với xử lý làm tròn số để an toàn hơn */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const cos = Math.cos((angle * Math.PI) / 180);
          const sin = Math.sin((angle * Math.PI) / 180);
          return (
            <line
              key={angle}
              x1={(100 + 55 * cos).toFixed(3)}
              y1={(100 + 55 * sin).toFixed(3)}
              x2={(100 + 70 * cos).toFixed(3)}
              y2={(100 + 70 * sin).toFixed(3)}
              stroke="#f97316"
              strokeWidth="1"
            />
          );
        })}
        
        <line x1="100" y1="90" x2="100" y2="110" stroke="#f97316" strokeWidth="0.5" />
        <line x1="90" y1="100" x2="110" y2="100" stroke="#f97316" strokeWidth="0.5" />
      </svg>

      {/* Các phần SVG còn lại giữ nguyên... */}
      <svg className="absolute top-1/3 left-5 w-6 h-64 opacity-[0.08]" viewBox="0 0 30 300">
        <line x1="15" y1="0" x2="15" y2="300" stroke="#f97316" strokeWidth="0.5" />
        <line x1="5" y1="0" x2="25" y2="0" stroke="#f97316" strokeWidth="0.5" />
        <line x1="5" y1="300" x2="25" y2="300" stroke="#f97316" strokeWidth="0.5" />
        {[50, 100, 150, 200, 250].map((y) => (
          <line key={y} x1="10" y1={y} x2="20" y2={y} stroke="#f97316" strokeWidth="0.3" />
        ))}
      </svg>

      <svg className="absolute top-1/2 right-5 w-32 h-20 opacity-[0.06]" viewBox="0 0 150 100">
        <line x1="150" y1="50" x2="50" y2="50" stroke="#f97316" strokeWidth="0.5" />
        <line x1="50" y1="50" x2="10" y2="10" stroke="#f97316" strokeWidth="0.5" />
        <polygon points="55,45 50,50 55,55" fill="#f97316" />
        <rect x="0" y="0" width="40" height="20" fill="none" stroke="#f97316" strokeWidth="0.5" />
      </svg>

      <svg className="absolute top-2/3 left-1/4 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100">
        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#f97316" strokeWidth="1" />
        <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="#f97316" strokeWidth="0.5" />
      </svg>

      <svg className="absolute bottom-1/3 left-1/3 w-16 h-16 opacity-[0.05]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill="none" stroke="#f97316" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#f97316" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="5" fill="none" stroke="#f97316" strokeWidth="0.5" />
        <line x1="50" y1="10" x2="50" y2="35" stroke="#f97316" strokeWidth="0.5" />
        <line x1="50" y1="65" x2="50" y2="90" stroke="#f97316" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="35" y2="50" stroke="#f97316" strokeWidth="0.5" />
        <line x1="65" y1="50" x2="90" y2="50" stroke="#f97316" strokeWidth="0.5" />
      </svg>
    </div>
  )
}