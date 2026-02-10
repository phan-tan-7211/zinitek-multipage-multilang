"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Danh sách dự án mẫu
const projects = [
  {
    id: 1,
    title: "Khuôn dập chi tiết ô tô",
    category: "Khuôn mẫu",
    client: "Toyota Boshoku",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
  },
  {
    id: 2,
    title: "Gia công CNC linh kiện máy bay",
    category: "CNC",
    client: "Vietnam Airlines Technical",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
  },
  {
    id: 3,
    title: "Hệ thống tự động hóa nhà máy",
    category: "Tự động hóa",
    client: "Samsung Electronics",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  },
]

function ProjectCard({ 
  project, 
  index, 
  btnText 
}: { 
  project: typeof projects[0]; 
  index: number;
  btnText: string;
}) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-800 transition-all duration-500 hover:border-[#f97316]/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-95" : "opacity-80"
        }`} />

        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <span className="text-xs text-[#f97316] font-bold uppercase tracking-[0.2em] mb-3">
            {project.client}
          </span>
          <h3 className="font-serif text-2xl font-bold text-white mb-2 line-clamp-2">
            {project.title}
          </h3>
          <span className="text-sm text-slate-400 font-medium">{project.category}</span>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#f97316] text-white rounded-full hover:bg-[#ea580c] transition-all transform active:scale-95 shadow-lg shadow-[#f97316]/20">
              <Eye className="w-4 h-4" />
              {btnText}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedProjects({ dict }: { dict?: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Lấy dữ liệu từ dict.featured_projects hoặc các key liên quan
  const data = dict?.featured_projects || dict?.portfolio || {};

  return (
    <section id="projects" className="relative py-24 lg:py-32 bg-[#020617] overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#f97316]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div ref={ref} className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-[#f97316]" />
              <span className="text-[#f97316] text-sm font-bold uppercase tracking-[0.3em]">
                {data.badge || "Dự án tiêu biểu"}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              {data.title_main || "Năng lực"}{" "}
              <span className="italic text-[#f97316] font-light">
                {data.title_highlight || "thực tế"}
              </span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
              {data.description || "Minh chứng cho chất lượng gia công và kinh nghiệm thực chiến của ZINITEK qua các sản phẩm thực tế cho đối tác lớn."}
            </p>
          </div>

          <Button 
            asChild 
            variant="outline" 
            className="group border-[#f97316]/40 text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all duration-300 bg-transparent px-8 py-7 rounded-full text-lg font-semibold"
          >
            <Link href="/portfolio">
              {data.view_all || "Xem tất cả"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              btnText={data.view_details || "Xem chi tiết"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}