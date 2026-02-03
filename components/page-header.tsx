"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  lang: string;
  dict: any;
  breadcrumbs?: { name: string; href: string }[]
}

export function PageHeader({ title, subtitle, description, lang, dict, breadcrumbs }: PageHeaderProps) {
  const defaultBreadcrumbs = [
    { 
      // Thứ tự: 1. Lấy từ dict | 2. Nếu ko có lấy Tiếng Anh | 3. Cuối cùng là Tiếng Việt
      name: dict.common?.home || (lang === 'vi' ? "Trang chủ" : "Home"), // Lấy từ file JSON
      href: `/${lang}`                       // Đường dẫn động theo ngôn ngữ
    },
    { name: title, href: "#" },
  ]

  const crumbs = breadcrumbs || defaultBreadcrumbs

  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#f97316]/5 blur-[150px] rounded-full" />
      
      {/* Technical grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#f97316 1px, transparent 1px),
            linear-gradient(90deg, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-sm mb-8"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, index) => (
            <div key={crumb.name} className="flex items-center gap-2">
              {index === 0 && <Home className="w-4 h-4 text-muted-foreground" />}
              {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              {index === crumbs.length - 1 ? (
                <span className="text-[#f97316] font-medium">{crumb.name}</span>
              ) : (
                <Link 
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </motion.nav>

        {/* Header content */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-medium mb-6 uppercase tracking-wider"
          >
            {subtitle}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-32 left-8 w-24 h-24 border-l-2 border-t-2 border-[#334155]/30 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#334155]/30 hidden lg:block" />
    </section>
  )
}
