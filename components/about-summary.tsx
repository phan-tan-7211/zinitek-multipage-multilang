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
  const [particles, setParticles] = useState<any[]>([])
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
    const newParticles = [...Array(380)].map(() => ({
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? "#f97316" : "#00f2ff",
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [])

  const aboutData = dict?.about_page || {}
  const serviceData = dict?.services?.cnc || {}
  const heroStats = dict?.hero?.stats || {}
  const common = dict?.common || {}
  const nav = dict?.navigation || {}

  const features = [
    { icon: Target, title: serviceData.title || (lang === 'vi' ? "Gia công CNC" : "CNC Machining"), desc: lang === 'vi' ? "Dung sai dưới 0.005mm" : "Tolerance under 0.005mm" },
    { icon: Award, title: lang === 'vi' ? "Chứng chỉ ISO" : "ISO Certification", desc: lang === 'vi' ? "ISO 9001:2015" : "Quality Management" },
    { icon: Zap, title: lang === 'vi' ? "Công nghệ cao" : "High-Tech", desc: lang === 'vi' ? "Vận hành chuyên nghiệp" : "Professional Operation" },
    { icon: CheckCircle2, title: lang === 'vi' ? "Đảm bảo tiến độ" : "On-time Delivery", desc: lang === 'vi' ? "Giao hàng đúng hẹn" : "Commitment to schedule" },
  ]

  if (!mounted) return null

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#020617]">
      <style jsx global>{`
        @keyframes twinkle-galaxy {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* CỘT TRÁI: NỘI DUNG */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-bold mb-6 uppercase tracking-widest">
              {nav.about || (lang === 'vi' ? "Giới thiệu" : "About Us")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight text-balance">
              <span className="text-[#f97316]">ZINITEK</span> — {aboutData.header_subtitle || (lang === 'vi' ? "Kỹ thuật thực chiến" : "Practical Engineering")}
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl">
              {aboutData.header_desc || (lang === 'vi' ? "Chúng tôi tập trung vào việc hiện thực hóa bản vẽ kỹ thuật với độ hoàn thiện cao." : "We focus on realizing technical drawings with high precision.")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-[#f97316]/30 transition-all group">
                  <feature.icon className="w-6 h-6 text-[#f97316] shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full px-8 py-6 h-auto transition-transform hover:scale-105">
              <Link href={`/${lang}/about`} className="flex items-center gap-2 font-bold uppercase text-sm">
                {common.read_more || (lang === 'vi' ? "Xem chi tiết" : "Read More")} <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>

          {/* CỘT PHẢI: GALAXY DECOR */}
          <motion.div
            className="relative flex justify-center items-center py-10 z-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
              
              {/* LỚP 1: XOAY NỀN CỐ ĐỊNH (40S) */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-[spin_40s_linear_infinite_reverse]">
                {/* LỚP 2: GIA TỐC KHI HOVER (DURATION: 12) */}
                <motion.div 
                  className="absolute inset-0"
                  animate={{ 
                    rotate: isHovered ? -360 : 0,
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ 
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" }, 
                    scale: { duration: 0.6 } 
                  }}
                >
                  <div className="absolute inset-0">
                    {particles.map((p, i) => (
                      <div key={i} className="absolute rounded-full"
                        style={{
                          width: `${p.size}px`, height: `${p.size}px`,
                          left: `${p.left}%`, top: `${p.top}%`,
                          backgroundColor: p.color,
                          boxShadow: `0 0 8px ${p.color}`,
                          animation: `twinkle-galaxy ${p.duration}s ease-in-out infinite alternate`,
                          animationDelay: `${p.delay}s`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Decor Rings */}
              <div className="absolute inset-0 border border-[#f97316]/10 rounded-full" />
              <div className="absolute inset-12 border border-slate-800/50 rounded-full" />
              
              {/* Central Stats */}
              <div className="absolute inset-28 bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-full border border-slate-700 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.2)] z-10 text-center px-6">
                <div className="text-[#f97316] font-bold text-6xl lg:text-8xl tracking-tighter leading-none">10+</div>
                <div className="text-slate-400 text-xs lg:text-sm uppercase tracking-[0.3em] font-semibold mt-2">
                  {heroStats.experience || (lang === 'vi' ? "Năm kinh nghiệm" : "Years Experience")}
                </div>
              </div>

              {/* --- ĐÃ KHÔI PHỤC ĐỦ 3 TAGS Ở ĐÂY --- */}
              
              {/* Tag 1: ISO */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[8%] right-[8%] z-20 bg-slate-900/95 backdrop-blur-md border border-[#f97316]/40 px-4 py-2 rounded-full shadow-xl">
                <div className="flex items-center gap-2 text-white text-[10px] font-bold"><Award size={14} className="text-[#f97316]" /> ISO 9001:2015</div>
              </motion.div>

              {/* Tag 2: JIS Standard */}
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute bottom-[25%] -left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-full shadow-xl">
                <div className="flex items-center gap-2 text-white text-[10px] font-bold"><CheckCircle2 size={14} className="text-[#f97316]" /> JIS Standard</div>
              </motion.div>

              {/* Tag 3: CNC 5-Axis (Đã khôi phục) */}
              <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute bottom-[8%] right-[12%] z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-full shadow-xl">
                <div className="flex items-center gap-2 text-white text-[10px] font-bold"><Cog size={14} className="text-[#f97316]" /> CNC 5-Axis</div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}