import { Cog } from "lucide-react"

export default function loading() {
  return (
    <div className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center bg-[#020617]">
      
      {/* 1. THANH TIẾN TRÌNH (TOP BAR) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#f97316]/20 overflow-hidden">
        <div className="h-full bg-[#f97316] shadow-[0_0_10px_#f97316] animate-progress-fast"></div>
      </div>

      <div className="relative">
        {/* 2. VÒNG XOAY QUỸ ĐẠO MỜ */}
        <div className="w-24 h-24 border-4 border-t-[#f97316] border-r-transparent border-b-[#f97316]/10 border-l-transparent rounded-full animate-spin duration-700"></div>
        
        {/* 3. BÁNH RĂNG TRUNG TÂM */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Cog 
            className="w-10 h-10 text-[#f97316] animate-spin-slow" 
            style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))" }}
          />
        </div>
      </div>
      
      {/* 4. CHỮ LOADING CÓ HIỆU ỨNG CHỮ CHẠY */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <span className="text-[#f97316] font-black text-sm tracking-[0.3em] uppercase animate-pulse">
          ZINITEK
        </span>
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#f97316] to-transparent"></div>
      </div>
    </div>
  )
}