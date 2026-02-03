"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { CheckCircle2, Award, Target, Zap } from "lucide-react"

export function AboutSection({ lang, dict }: { lang: string; dict: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Lấy dữ liệu từ dict
  const data = dict?.about_summary || {}
  const aboutPage = dict?.about_page || {}
  const stats = dict?.hero?.stats || {}

  const features = [
    {
      icon: Target,
      title: data.feature2_title || (lang === 'vi' ? "Độ chính xác cao" : "High Precision"),
      desc: data.feature2_desc || (lang === 'vi' ? "Dung sai dưới 0.005mm theo tiêu chuẩn Nhật Bản" : "Precision tolerance"),
    },
    {
      icon: Award,
      title: lang === 'vi' ? "Chứng nhận chất lượng" : "Quality Certified",
      desc: lang === 'vi' ? "ISO 9001:2015 và tiêu chuẩn JIS" : "ISO & JIS standards",
    },
    {
      icon: Zap,
      title: data.feature1_title || (lang === 'vi' ? "Công nghệ hiện đại" : "Modern Tech"),
      desc: data.feature1_desc || (lang === 'vi' ? "Máy CNC 5 trục và phần mềm tiên tiến" : "Advanced CNC systems"),
    },
    {
      icon: CheckCircle2,
      title: data.feature3_title || (lang === 'vi' ? "Cam kết tiến độ" : "On-time Delivery"),
      desc: data.feature3_desc || (lang === 'vi' ? "Giao hàng đúng hẹn, kiểm soát chặt chẽ" : "Strict schedule control"),
    },
  ]

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#f97316]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Section label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-bold mb-6 uppercase tracking-wider">
              {data.badge || (lang === 'vi' ? "Giới thiệu" : "About Us")}
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-foreground leading-tight text-balance">
              {lang === 'vi' ? (
                <>Từ <span className="text-[#f97316]">Đồng Thanh Phú</span> đến <span className="italic font-light"> ZINITEK</span></>
              ) : (
                <>{data.title_main || "From Dong Thanh Phu to"} <span className="text-[#f97316]">{data.title_highlight || "ZINITEK"}</span></>
              )}
            </h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed text-base md:text-lg">
              {/* ĐOẠN 1: Lịch sử từ Đồng Thanh Phú */}
              <p>
                {aboutPage.header_desc || (
                   lang === 'vi' 
                   ? "Khởi nguồn từ xưởng cơ khí Đồng Thanh Phú, ZINITEK đã trải qua hành trình chuyển đổi mạnh mẽ để trở thành đối tác tin cậy của các doanh nghiệp Nhật Bản, Hàn Quốc và quốc tế trong lĩnh vực gia công chính xác."
                   : "Starting as Dong Thanh Phu workshop, ZINITEK has transformed into a trusted partner for international firms."
                )}
              </p>
              
              {/* ĐOẠN 2: Đối tác tin cậy */}
              <p className="border-l-4 border-[#f97316] pl-5 py-1 text-foreground/90 font-medium">
                {aboutPage.description_2 || (
                  lang === 'vi'
                  ? "Với nền tảng kỹ thuật vững chắc và hệ thống máy móc hiện đại, ZINITEK tự hào là đối tác tin cậy trong lĩnh vực cơ khí chính xác tại Việt Nam."
                  : "With a solid technical foundation, we are a reliable partner in precision engineering."
                )}
              </p>

              {/* ĐOẠN 3: CAM KẾT (Đã bỏ điều kiện chặn) */}
              <p>
                {aboutPage.commitment || (
                lang === 'vi' 
                  ? "Chúng tôi cam kết mang đến các giải pháp kỹ thuật với độ chính xác cao nhất, đáp ứng mọi yêu cầu khắt khe của khách hàng thông qua đội ngũ kỹ sư giàu kinh nghiệm."
                  : "We are committed to providing technical solutions with the highest precision, meeting all strict requirements of customers through our experienced engineering team."
                )}
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border hover:border-[#f97316]/30 transition-all group"
                >
                  <feature.icon className="w-8 h-8 text-[#f97316] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-snug">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right content - Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 border-2 border-[#f97316]/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 border border-[#334155]/50 rounded-full" />
              <div className="absolute inset-8 border border-[#334155]/30 rounded-full" />
              
              <div className="absolute inset-12 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-full border border-[#f97316]/30 flex items-center justify-center shadow-2xl">
                <div className="text-center px-8">
                  <div className="font-serif text-6xl font-bold text-[#f97316] mb-2">10+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                    {data.exp_label || stats.experience || "Năm kinh nghiệm"}
                  </div>
                  <div className="mt-4 w-16 h-0.5 bg-[#f97316] mx-auto" />
                  <div className="mt-4 text-xs text-muted-foreground">Bến Cát, Bình Dương</div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-8 px-4 py-2 bg-card border border-[#f97316]/30 rounded-lg shadow-lg z-20"
              >
                <span className="text-xs text-[#f97316] font-bold">ISO 9001:2015</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 left-0 px-4 py-2 bg-card border border-[#f97316]/30 rounded-lg shadow-lg z-20"
              >
                <span className="text-xs text-[#f97316] font-bold">JIS Standard</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 px-4 py-2 bg-card border border-[#f97316]/30 rounded-lg shadow-lg z-20"
              >
                <span className="text-xs text-[#f97316] font-bold">CNC 5-Axis</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}