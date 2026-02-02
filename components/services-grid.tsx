"use client"

import React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Cog, 
  Box, 
  ScanLine, 
  Cpu, 
  CircleDot, 
  CircuitBoard, 
  Monitor,
  ArrowRight
} from "lucide-react"

const services = [
  {
    icon: Cog,
    title: "Gia công CNC chính xác",
    description: "Phay, Tiện, Cắt dây EDM với độ chính xác dưới 0.005mm. Đáp ứng tiêu chuẩn khắt khe của thị trường Nhật Bản.",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    tags: ["Phay CNC", "Tiện CNC", "EDM"]
  },
  {
    icon: Box,
    title: "Thiết kế khuôn mẫu",
    description: "Thiết kế và chế tạo khuôn dập nguội chính xác cho ngành công nghiệp ô tô, điện tử và thiết bị gia dụng.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    tags: ["Khuôn dập", "Khuôn ép", "CAD/CAM"]
  },
  {
    icon: ScanLine,
    title: "Quét 3D & Phân tích ngược",
    description: "Dịch vụ quét 3D và reverse engineering sử dụng Geomagic Design X, chuyển đổi mẫu vật thành bản vẽ CAD.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tags: ["3D Scan", "Geomagic", "Reverse"]
  },
  {
    icon: Cpu,
    title: "PLC & Tự động hóa",
    description: "Lập trình và tích hợp hệ thống PLC Mitsubishi, Siemens. Giải pháp tự động hóa toàn diện cho nhà máy.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    tags: ["Mitsubishi", "Siemens", "HMI"]
  },
  {
    icon: CircleDot,
    title: "Cuộn dây đồng",
    description: "Sản xuất cuộn dây Toroidal, biến áp, cuộn cảm chất lượng cao cho ngành điện tử và năng lượng.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebb6122?w=800&q=80",
    tags: ["Toroidal", "Biến áp", "Cuộn cảm"]
  },
  {
    icon: CircuitBoard,
    title: "Lắp ráp điện tử",
    description: "Dịch vụ EMS lắp ráp PCB, SMT với kiểm soát chất lượng nghiêm ngặt. Hỗ trợ từ prototype đến sản xuất hàng loạt.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    tags: ["PCB", "SMT", "EMS"]
  },
  {
    icon: Monitor,
    title: "CNTT & Phần mềm CN",
    description: "Cài đặt, training Mastercam, Solidworks, Creo. Sửa chữa máy tính công nghiệp và hệ thống mạng nhà máy.",
    image: "https://images.unsplash.com/photo-1537432376149-e84978a29b5a?w=800&q=80",
    tags: ["Mastercam", "Solidworks", "Creo"]
  },
]

function HexagonIcon({ icon: Icon, index }: { icon: React.ElementType; index: number }) {
  return (
    <motion.div 
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-500"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`hexGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        <polygon 
          points="50,3 95,25 95,75 50,97 5,75 5,25" 
          fill="none" 
          stroke={`url(#hexGradient-${index})`}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <polygon 
          points="50,3 95,25 95,75 50,97 5,75 5,25" 
          fill="#f97316"
          opacity="0.1"
          className="group-hover:opacity-25 transition-opacity duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-7 h-7 text-[#f97316]" />
      </div>
    </motion.div>
  )
}

function ServiceCard({ 
  service, 
  index 
}: { 
  service: typeof services[0]
  index: number 
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-[#0f172a] rounded-xl overflow-hidden border border-[#334155]/50 hover:border-[#f97316]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#f97316]/10"
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
        
        {/* Glowing border effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 border-2 border-[#f97316]/40 rounded-t-xl" />
          <div className="absolute inset-0 bg-[#f97316]/5" />
        </div>

        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {service.tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium bg-[#020617]/80 text-[#f97316] rounded border border-[#f97316]/30 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {/* Hexagon icon positioned between image and content */}
        <div className="absolute -top-8 left-6">
          <HexagonIcon icon={service.icon} index={index} />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-[#f97316] transition-colors duration-300 mb-3">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {service.description}
          </p>
        </div>

        {/* Learn more link */}
        <div className="mt-4 flex items-center gap-2 text-[#f97316] text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Tìm hiểu thêm</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#f97316]/30" />
        </div>
      </div>
    </motion.div>
  )
}

export function ServicesGrid() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-[#020617]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#f97316]/3 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Section header */}
      <div ref={headerRef} className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
            <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
              Dịch vụ
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Giải pháp <span className="italic text-[#f97316]">toàn diện</span> cho mọi nhu cầu
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty">
            Từ gia công CNC chính xác đến tự động hóa nhà máy, chúng tôi cung cấp 
            các dịch vụ kỹ thuật đạt tiêu chuẩn quốc tế.
          </p>
        </motion.div>
      </div>

      {/* Services grid - 7 cards in responsive layout */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto">
          {services.slice(4).map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index + 4} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 lg:px-6 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-2xl p-8 md:p-12 border border-[#334155]/50 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full blur-[100px]" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                Bạn cần tư vấn giải pháp?
              </h3>
              <p className="text-muted-foreground">
                Liên hệ ngay để nhận báo giá và tư vấn kỹ thuật miễn phí từ đội ngũ chuyên gia.
              </p>
            </div>
            <button className="flex-shrink-0 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-semibold px-8 py-4 rounded-lg shadow-lg shadow-[#f97316]/25 hover:shadow-[#f97316]/40 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              Yêu cầu tư vấn
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
