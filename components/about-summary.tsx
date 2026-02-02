"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ArrowRight, CheckCircle2, Award, Target, Zap, Cog } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AboutSummary({ lang, dict }: { lang: string; dict: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.2 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const aboutData = dict?.about_page || {}
  const serviceData = dict?.services?.cnc || {}
  const heroStats = dict?.hero?.stats || {}
  const common = dict?.common || {}

  const features = [
    { icon: Target, title: serviceData.title || "Gia công CNC", desc: "Dung sai dưới 0.005mm" },
    { icon: Award, title: "ISO 9001:2015", desc: "Chứng nhận chất lượng" },
    { icon: Zap, title: "Công nghệ Nhật", desc: "Vận hành chuyên nghiệp" },
    { icon: CheckCircle2, title: "Cam kết tiến độ", desc: "Giao hàng đúng hẹn" },
  ]

  if (!mounted) return null

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#020617]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* CỘT TRÁI: NỘI DUNG */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-bold mb-6 uppercase tracking-widest">
              {dict?.navigation?.about || "Giới thiệu"}
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">
              <span className="text-[#f97316]">ZINITEK</span> — {aboutData.header_subtitle || "Kỹ thuật thực chiến"}
            </h2>

            <p className="text-slate-400 text-lg mb-10 max-w-xl">
              {aboutData.header_desc || "Chúng tôi tập trung vào việc hiện thực hóa bản vẽ kỹ thuật với độ hoàn thiện cao."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-[#f97316]/30 transition-all">
                  <feature.icon className="w-6 h-6 text-[#f97316] shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full px-8 py-6 h-auto">
              <Link href={`/${lang}/about`} className="flex items-center gap-2 font-bold uppercase text-sm">
                {common.read_more || "Xem chi tiết"} <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>

          {/* CỘT PHẢI: HÌNH ẢNH DECOR (Giống trang GT) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center items-center py-10"
          >
            <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
              
              {/* Hệ thống vòng tròn xoay tầng tầng lớp lớp */}
              <div className="absolute inset-0 border border-[#f97316]/10 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-8 border border-slate-800 rounded-full" />
              <div className="absolute inset-16 border border-[#f97316]/5 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              
              {/* Khối trung tâm */}
              <div className="absolute inset-24 bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-full border border-slate-700 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.1)] z-10 text-center px-6">
                <div className="text-[#f97316] font-bold text-6xl lg:text-8xl tracking-tighter">10+</div>
                <div className="text-slate-400 text-xs lg:text-sm uppercase tracking-[0.3em] font-semibold mt-2">
                  {heroStats.experience || "Năm kinh nghiệm"}
                </div>
                <div className="mt-4 text-[10px] text-slate-500 font-mono">Bến Cát, Bình Dương</div>
              </div>

              {/* Các thẻ Tag bay lơ lửng xung quanh (Floating Tags) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-[5%] right-[5%] z-20 bg-slate-900/90 backdrop-blur-md border border-[#f97316]/40 px-4 py-2 rounded-lg shadow-xl shadow-black/50"
              >
                <div className="flex items-center gap-2 text-white text-[10px] font-bold">
                  <Award size={14} className="text-[#f97316]" /> ISO 9001:2015
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-[20%] -left-5 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-2 text-white text-[10px] font-bold">
                  <CheckCircle2 size={14} className="text-[#f97316]" /> JIS Standard
                </div>
              </motion.div>

              <motion.div 
                animate={{ x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute bottom-[5%] right-[10%] z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-2 text-white text-[10px] font-bold">
                  <Cog size={14} className="text-[#f97316]" /> CNC 5-Axis
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}