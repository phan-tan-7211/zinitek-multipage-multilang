"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { CheckCircle2, Award, Target, Zap } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Độ chính xác cao",
    desc: "Dung sai dưới 0.005mm theo tiêu chuẩn Nhật Bản",
  },
  {
    icon: Award,
    title: "Chứng nhận chất lượng",
    desc: "ISO 9001:2015 và tiêu chuẩn JIS",
  },
  {
    icon: Zap,
    title: "Công nghệ hiện đại",
    desc: "Máy CNC 5 trục và phần mềm CAD/CAM tiên tiến",
  },
  {
    icon: CheckCircle2,
    title: "Cam kết tiến độ",
    desc: "Giao hàng đúng hẹn với chất lượng đảm bảo",
  },
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#f97316]/5 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Section label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-medium mb-6 uppercase tracking-wider">
              Giới thiệu
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight text-balance">
              Từ <span className="text-[#f97316]">Đồng Thanh Phú</span> đến 
              <span className="italic font-light"> ZINITEK</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Khởi nguồn từ xưởng cơ khí <strong className="text-foreground">Đồng Thanh Phú</strong>, 
                ZINITEK đã trải qua hành trình chuyển đổi mạnh mẽ để trở thành đối tác tin cậy 
                của các doanh nghiệp Nhật Bản, Hàn Quốc và quốc tế trong lĩnh vực gia công chính xác.
              </p>
              <p>
                Với đội ngũ kỹ sư được đào tạo theo tiêu chuẩn Nhật Bản và hệ thống máy móc CNC hiện đại, 
                chúng tôi cam kết mang đến các giải pháp kỹ thuật với độ chính xác cao nhất, 
                đáp ứng mọi yêu cầu khắt khe của khách hàng.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl bg-[#0f172a]/50 border border-white/5 hover:border-[#f97316]/30 transition-colors group"
                >
                  <feature.icon className="w-8 h-8 text-[#f97316] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-serif font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main visual card */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-[#f97316]/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 border border-[#334155]/50 rounded-full" />
              <div className="absolute inset-8 border border-[#334155]/30 rounded-full" />
              
              {/* Center content */}
              <div className="absolute inset-12 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-full border border-[#f97316]/30 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="font-serif text-6xl font-bold text-[#f97316] mb-2">10+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Năm kinh nghiệm</div>
                  <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#f97316] to-transparent mx-auto" />
                  <div className="mt-4 text-xs text-muted-foreground">
                    Bến Cát, Bình Dương
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-8 px-4 py-2 bg-[#0f172a] border border-[#f97316]/30 rounded-lg shadow-lg"
              >
                <span className="text-xs text-[#f97316] font-semibold">ISO 9001:2015</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 left-0 px-4 py-2 bg-[#0f172a] border border-[#f97316]/30 rounded-lg shadow-lg"
              >
                <span className="text-xs text-[#f97316] font-semibold">JIS Standard</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 px-4 py-2 bg-[#0f172a] border border-[#f97316]/30 rounded-lg shadow-lg"
              >
                <span className="text-xs text-[#f97316] font-semibold">CNC 5-Axis</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
