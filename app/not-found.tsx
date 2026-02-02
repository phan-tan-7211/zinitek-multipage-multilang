"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"

function BrokenGear({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear", delay }}
    >
      <defs>
        <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Outer teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect
          key={angle}
          x="46"
          y="5"
          width="8"
          height="15"
          fill={i === 2 || i === 5 ? "#334155" : "url(#gearGradient)"}
          transform={`rotate(${angle} 50 50)`}
          opacity={i === 2 || i === 5 ? 0.3 : 1}
        />
      ))}
      {/* Main body */}
      <circle cx="50" cy="50" r="30" fill="url(#gearGradient)" />
      {/* Center hole */}
      <circle cx="50" cy="50" r="12" fill="#020617" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="8" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5" />
      {/* Broken piece indication */}
      <motion.path
        d="M 50 20 L 55 35 L 45 35 Z"
        fill="#f97316"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: [0, 80, 80], opacity: [1, 1, 0], rotate: [0, 45, 90] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  )
}

function FloatingPart({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-4 h-4 bg-[#f97316]/20 rounded"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0.5],
        y: [0, -50, -100],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 2
      }}
    />
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#f97316 1px, transparent 1px),
            linear-gradient(90deg, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating broken parts */}
      <FloatingPart delay={0} x={20} y={30} />
      <FloatingPart delay={0.5} x={70} y={40} />
      <FloatingPart delay={1} x={30} y={60} />
      <FloatingPart delay={1.5} x={80} y={70} />
      <FloatingPart delay={2} x={15} y={50} />

      {/* Decorative gears */}
      <BrokenGear 
        className="absolute top-20 left-10 w-24 h-24 opacity-10" 
        delay={0}
      />
      <BrokenGear 
        className="absolute bottom-20 right-10 w-32 h-32 opacity-10" 
        delay={2}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Animated broken gear */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <BrokenGear className="w-full h-full" />
          
          {/* Spark effects */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#f97316] rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#fb923c] rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5, delay: 0.2 }}
          />
        </div>

        {/* Error code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="inline-block px-4 py-1.5 bg-[#f97316]/10 border border-[#f97316]/30 rounded-full text-[#f97316] text-sm font-medium">
            Lỗi 404
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
        >
          Trang không <span className="text-[#f97316] italic">tìm thấy</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
        >
          Có vẻ như đường dẫn này đã bị hỏng giống như bánh răng kia. 
          Hãy quay lại trang chủ để tiếp tục.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-[#020617] font-semibold px-6"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-[#334155] hover:border-[#f97316]/50 text-foreground bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </motion.div>

        {/* Tech specs decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex justify-center gap-8 text-xs text-muted-foreground/50 font-mono"
        >
          <span>ERR_CODE: 404</span>
          <span>STATUS: NOT_FOUND</span>
          <span>GEAR: BROKEN</span>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#334155]/30" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#334155]/30" />
    </div>
  )
}
