"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Play, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Bộ đếm số phiên bản siêu ổn định
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timeout = setTimeout(() => {
      let start = 0
      const end = value
      const duration = 2000
      const frameRate = 1000 / 60
      const totalFrames = Math.round(duration / frameRate)
      const increment = end / totalFrames

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, frameRate)
      return () => clearInterval(timer)
    }, 500)
    return () => clearTimeout(timeout)
  }, [value])

  if (!mounted) return <span className="text-4xl md:text-5xl font-serif font-bold text-white">0{suffix}</span>

  const displayValue = value < 1 ? count.toFixed(3) : Math.floor(count)

  return (
    <span className="text-4xl md:text-5xl font-serif font-bold text-white group-hover:text-[#f97316] transition-colors duration-300 inline-block">
      {prefix}{displayValue}{suffix}
    </span>
  )
}

export function HeroSection({ dict }: { dict: any }) {
  // Logic xử lý dữ liệu: Tự động tìm cấp độ đúng của "hero" trong file dict
  const data = dict?.hero || dict;

  const stats = [
    { value: 500, suffix: "+", label: data?.stats?.projects || "Dự án hoàn thành" },
    { value: 10, suffix: "+", label: data?.stats?.experience || "Năm kinh nghiệm" },
    { value: 100, suffix: "%", label: data?.stats?.quality || "Sản phẩm đạt chuẩn" },
    { value: 50, suffix: "+", label: data?.stats?.experts || "Kỹ sư chuyên gia" },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#020617]">
      {/* Background Overlays - Đảm bảo lớp nền thấp nhất */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#f97316]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#f97316]/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)`, backgroundSize: '100px 100px'}} />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-sm font-medium mb-8"
          >
            <CheckCircle2 className="w-4 h-4" />
            {data?.badge || "Vận hành theo tiêu chuẩn Nhật Bản"}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] mb-8 text-balance uppercase"
          >
            <span className="block text-white">{data?.title_line1 || "Kỹ thuật tin cậy"}</span>
            <span className="block mt-2">
              <span className="italic font-light text-[#f97316] normal-case">{data?.title_highlight || "Hiệu quả"}</span>
            </span>
            <span className="block text-white mt-2">{data?.title_line2 || "Vượt mong đợi"}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed text-pretty"
            dangerouslySetInnerHTML={{ __html: data?.description || "ZINITEK chuyên gia công CNC và thiết kế khuôn mẫu." }}
          />

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button size="lg" asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-8 py-6 text-lg shadow-2xl transition-all duration-500 hover:scale-105 group border-none">
              <Link href="/services">
                {data?.cta_primary || "Khám phá dịch vụ"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-slate-700 text-white hover:bg-[#f97316]/10 px-8 py-6 text-lg transition-all duration-300 bg-transparent">
              <Link href="/portfolio">
                <Play className="mr-2 w-5 h-5 text-[#f97316]" />
                {data?.cta_secondary || "Dự án tiêu biểu"}
              </Link>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pt-12 border-t border-slate-800"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group cursor-default">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <div className="text-xs sm:text-sm text-slate-400 mt-2 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs uppercase tracking-widest">{data?.scroll_text || "Cuộn xuống"}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-[#f97316]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-32 left-8 w-32 h-32 border-l-2 border-t-2 border-slate-800/50 hidden lg:block" />
      <div className="absolute bottom-32 right-8 w-32 h-32 border-r-2 border-b-2 border-slate-800/50 hidden lg:block" />
    </section>
  )
}