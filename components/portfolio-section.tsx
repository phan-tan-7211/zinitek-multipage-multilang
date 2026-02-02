"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ExternalLink, Eye } from "lucide-react"

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "cnc", name: "CNC" },
  { id: "mold", name: "Khuôn mẫu" },
  { id: "automation", name: "Tự động hóa" },
  { id: "assembly", name: "Lắp ráp" },
]

const projects = [
  {
    id: 1,
    title: "Khuôn dập chi tiết ô tô",
    category: "mold",
    client: "Toyota Boshoku",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    description: "Thiết kế và chế tạo khuôn dập nguội cho chi tiết nội thất ô tô.",
  },
  {
    id: 2,
    title: "Gia công CNC linh kiện máy bay",
    category: "cnc",
    client: "Vietnam Airlines Technical",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    description: "Gia công chính xác các linh kiện nhôm hàng không với dung sai 0.002mm.",
  },
  {
    id: 3,
    title: "Hệ thống tự động hóa nhà máy",
    category: "automation",
    client: "Samsung Electronics",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    description: "Tích hợp PLC Mitsubishi cho dây chuyền sản xuất linh kiện điện tử.",
  },
  {
    id: 4,
    title: "Lắp ráp PCB công nghiệp",
    category: "assembly",
    client: "Panasonic Vietnam",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    description: "Dịch vụ EMS lắp ráp board mạch cho thiết bị điện gia dụng.",
  },
  {
    id: 5,
    title: "Khuôn ép nhựa chính xác",
    category: "mold",
    client: "LG Electronics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description: "Khuôn ép nhựa cho vỏ remote và các thiết bị điều khiển.",
  },
  {
    id: 6,
    title: "Robot hàn tự động",
    category: "automation",
    client: "Thaco Industries",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebb6122?w=800&q=80",
    description: "Triển khai hệ thống robot hàn cho khung gầm xe tải.",
  },
]

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-xl bg-[#0f172a] border border-[#334155]/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "grayscale-0 scale-110" : "grayscale"
          }`}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-90" : "opacity-70"
        }`} />

        {/* Glow border on hover */}
        <div className={`absolute inset-0 border-2 border-[#f97316] rounded-xl transition-opacity duration-500 ${
          isHovered ? "opacity-50" : "opacity-0"
        }`} />
        <div className={`absolute inset-0 shadow-[inset_0_0_30px_rgba(249,115,22,0.3)] rounded-xl transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`} />

        {/* Content overlay */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <span className="text-xs text-[#f97316] font-medium uppercase tracking-wider mb-2">
            {project.client}
          </span>
          <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2">
            {project.title}
          </h3>
          
          {/* Description - visible on hover */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground line-clamp-2 mb-3"
          >
            {project.description}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex gap-2"
          >
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#f97316] text-[#020617] rounded-lg hover:bg-[#fb923c] transition-colors">
              <Eye className="w-3.5 h-3.5" />
              Xem chi tiết
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-white/20 text-foreground rounded-lg hover:border-[#f97316]/50 hover:bg-[#f97316]/10 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("all")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <section className="relative py-24 lg:py-32 bg-[#0f172a]/50">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a]/50 to-[#020617]" />

      <div ref={ref} className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f97316]" />
            <span className="text-[#f97316] text-sm font-medium uppercase tracking-widest">
              Dự án
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#f97316]" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Thành tựu <span className="italic text-[#f97316]">nổi bật</span>
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            Những dự án tiêu biểu thể hiện năng lực kỹ thuật và cam kết chất lượng của ZINITEK.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-[#f97316] text-[#020617] border-[#f97316]"
                  : "border-[#334155] text-muted-foreground hover:border-[#f97316]/50 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid - Masonry-like layout */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-[#f97316]/50 text-[#f97316] rounded-lg hover:bg-[#f97316]/10 transition-colors font-medium">
            Xem tất cả dự án
            <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
