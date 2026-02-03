"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote, Star } from "lucide-react"

// Giả định testimonials này sẽ được fetch từ Sanity sau này
// Hiện tại giữ để render cấu trúc card
const testimonials = [
  {
    id: 1,
    content: "ZINITEK đã vượt qua mọi kỳ vọng của chúng tôi về độ chính xác và tiến độ giao hàng. Họ là đối tác tin cậy cho các dự án khuôn mẫu phức tạp.",
    author: "Tanaka Hiroshi",
    position: "Giám đốc kỹ thuật",
    company: "Toyota Boshoku Vietnam",
    rating: 5,
  },
  {
    id: 2,
    content: "Đội ngũ kỹ sư ZINITEK rất chuyên nghiệp và am hiểu sâu về tự động hóa. Hệ thống PLC họ triển khai đã giúp chúng tôi tăng năng suất 40%.",
    author: "Kim Sung-ho",
    position: "Plant Manager",
    company: "Samsung Electronics Vietnam",
    rating: 5,
  },
  {
    id: 3,
    content: "Chất lượng gia công CNC của ZINITEK đạt tiêu chuẩn Nhật Bản. Đặc biệt ấn tượng với khả năng xử lý các chi tiết có dung sai cực kỳ chặt.",
    author: "Nguyễn Minh Tuấn",
    position: "Trưởng phòng R&D",
    company: "VinFast Manufacturing",
    rating: 5,
  },
]

interface TestimonialsSectionProps {
  dict: any // Nhận dictionary từ page/layout
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="relative bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10 hover:border-[#f97316]/30 transition-all duration-500">
        <div className="absolute -top-4 left-6 w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center">
          <Quote className="w-4 h-4 text-[#020617]" />
        </div>

        <div className="flex gap-1 mb-4 pt-2">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#f97316] text-[#f97316]" />
          ))}
        </div>

        <p className="text-foreground leading-relaxed mb-6 italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-lg font-bold text-[#020617]">
            {testimonial.author.charAt(0)}
          </div>
          <div>
            <h4 className="font-serif font-semibold text-foreground">
              {testimonial.author}
            </h4>
            <p className="text-sm text-muted-foreground">
              {testimonial.position}
            </p>
            <p className="text-xs text-[#f97316]">
              {testimonial.company}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-[#f97316]/30 rounded-br-lg" />
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection({ dict }: TestimonialsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Tách text từ dict để code gọn hơn
  const { 
    badge, 
    title_part1, 
    title_highlight, 
    description, 
    trusted_by 
  } = dict.testimonials

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-[#020617] to-[#0f172a]/50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f97316]/5 rounded-full blur-[150px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Header Section - Đã chuyển sang đa ngôn ngữ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
            <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
              {badge}
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {title_part1} <span className="italic text-[#f97316]">{title_highlight}</span>
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg">
            {description}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Trusted By Section - Đã chuyển sang đa ngôn ngữ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 pt-12 border-t border-[#334155]/50"
        >
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            {trusted_by}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            {["Toyota", "Samsung", "Panasonic", "LG", "VinFast", "Thaco"].map((brand) => (
              <span key={brand} className="text-xl font-serif font-bold text-foreground/60 hover:text-[#f97316] transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}