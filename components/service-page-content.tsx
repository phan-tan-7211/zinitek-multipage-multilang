"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Home,
  Phone,
  Cog,
  Box,
  ScanLine,
  Cpu,
  CircleDot,
  CircuitBoard,
  Monitor
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Service, ServiceIconName } from "@/lib/services-data"

const iconMap: Record<ServiceIconName, typeof Cog> = {
  "cog": Cog,
  "box": Box,
  "scan-line": ScanLine,
  "cpu": Cpu,
  "circle-dot": CircleDot,
  "circuit-board": CircuitBoard,
  "monitor": Monitor,
}

interface ServicePageContentProps {
  service: Service
  relatedServices: Service[]
}

export function ServicePageContent({ service, relatedServices }: ServicePageContentProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const Icon = iconMap[service.icon]

  return (
    <>
      {/* Hero Section */}
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
            <Home className="w-4 h-4 text-muted-foreground" />
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
              Dịch vụ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-[#f97316] font-medium">{service.shortTitle}</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-medium mb-6 uppercase tracking-wider"
              >
                <Icon className="w-4 h-4" />
                Dịch vụ
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground text-balance"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8"
              >
                {service.description}
              </motion.p>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {service.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 text-sm bg-[#1e293b] text-muted-foreground rounded-lg border border-[#334155]"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-semibold shadow-lg shadow-[#f97316]/25">
                  <Link href="/contact">
                    Yêu cầu báo giá
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-[#334155] hover:border-[#f97316]/50 bg-transparent">
                  <a href="tel:+84274123456">
                    <Phone className="mr-2 w-5 h-5" />
                    Gọi ngay
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#334155]/50">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#f97316]/20 rounded-xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#334155]/30 rounded-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features & Specs Section */}
      <section ref={ref} className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Tính năng <span className="text-[#f97316]">nổi bật</span>
              </h2>
              
              <ul className="space-y-4">
                {service.features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#0f172a]/50 border border-[#334155]/50 hover:border-[#f97316]/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#f97316] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Thông số <span className="text-[#f97316]">kỹ thuật</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {service.specs.map((spec, index) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="p-5 rounded-xl bg-[#0f172a] border border-[#334155]/50 hover:border-[#f97316]/30 transition-colors"
                  >
                    <div className="text-2xl font-serif font-bold text-[#f97316] mb-1">
                      {spec.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{spec.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-24 lg:py-32 bg-[#0f172a]/50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quy trình <span className="italic text-[#f97316]">làm việc</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quy trình chuyên nghiệp đảm bảo chất lượng và tiến độ cho mọi dự án.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#f97316] via-[#f97316]/50 to-transparent hidden lg:block" />

            <div className="space-y-8 lg:space-y-0">
              {service.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative lg:flex items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                    <div className="p-6 rounded-xl bg-[#0f172a] border border-[#334155]/50 hover:border-[#f97316]/30 transition-colors">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>

                  {/* Step number */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#020617] border-2 border-[#f97316] items-center justify-center">
                    <span className="font-serif font-bold text-[#f97316]">{step.step}</span>
                  </div>

                  {/* Mobile step number */}
                  <div className="lg:hidden flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
                      <span className="font-serif font-bold text-[#020617]">{step.step}</span>
                    </div>
                    <div className="flex-1 h-px bg-[#334155]" />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block lg:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dịch vụ <span className="italic text-[#f97316]">liên quan</span>
            </h2>
            <p className="text-muted-foreground">
              Khám phá các dịch vụ khác của ZINITEK
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((related, index) => {
              const RelatedIcon = iconMap[related.icon]
              return (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Link
                    href={`/services/${related.slug}`}
                    className="block p-6 rounded-xl bg-[#0f172a] border border-[#334155]/50 hover:border-[#f97316]/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#f97316]/10 flex items-center justify-center mb-4 group-hover:bg-[#f97316]/20 transition-colors">
                      <RelatedIcon className="w-6 h-6 text-[#f97316]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-[#f97316] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {related.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-[#f97316] font-medium">
                      Tìm hiểu thêm
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 lg:px-6">
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
                  Bạn cần tư vấn về {service.shortTitle}?
                </h3>
                <p className="text-muted-foreground">
                  Liên hệ ngay để nhận báo giá và tư vấn kỹ thuật miễn phí từ đội ngũ chuyên gia.
                </p>
              </div>
              <Button asChild size="lg" className="flex-shrink-0 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-semibold shadow-lg shadow-[#f97316]/25 hover:shadow-[#f97316]/40 transition-all duration-300 hover:scale-105">
                <Link href="/contact">
                  Yêu cầu tư vấn
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
