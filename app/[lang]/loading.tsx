// app/[lang]/loading.tsx
import { Cog } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center">
      {/* Hiệu ứng nền mờ phía sau */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f97316]/10 blur-[100px] rounded-full animate-pulse" />
      
      <div className="relative">
        {/* Vòng tròn xoay bên ngoài */}
        <div className="w-20 h-20 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
        
        {/* Icon Cog của Zinitek ở giữa xoay ngược chiều */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-[spin_3s_linear_infinite_reverse]">
            <Cog className="w-10 h-10 text-[#f97316]" />
          </div>
        </div>
      </div>

      {/* Chữ Loading với hiệu ứng chữ chạy */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-xl font-serif font-bold tracking-widest text-white">
          ZINI<span className="text-[#f97316]">TEK</span>
        </h2>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  )
}