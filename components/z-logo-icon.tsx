"use client"

import { useState } from "react"
import { motion, useReducedMotion, type Transition } from "framer-motion"
import { cn } from "@/lib/utils"

type LogoSize = "sm" | "md" | "lg"

const SIZE_CLASSES: Record<LogoSize, { wrapper: string; mark: string; letter: string }> = {
  sm: { wrapper: "p-0.5", mark: "size-8", letter: "text-base" },
  md: { wrapper: "p-1", mark: "size-10", letter: "text-lg" },
  lg: { wrapper: "p-2", mark: "size-10 sm:size-12", letter: "text-lg sm:text-xl" },
}

interface ZLogoIconProps {
  isHovered?: boolean
  size?: LogoSize
  letter?: string
  primaryColor?: string
  textColor?: string
  glowEnabled?: boolean
  animationEnabled?: boolean
  className?: string
}

export function ZLogoIcon({
  isHovered: externalHover,
  size = "md",
  letter = "Z",
  primaryColor = "#ea580c",
  textColor = "#ffffff",
  glowEnabled = true,
  animationEnabled = true,
  className,
}: ZLogoIconProps) {
  const [internalHover, setInternalHover] = useState(false)
  const reduceMotion = useReducedMotion()
  const isHovered = externalHover ?? internalHover
  const shouldAnimate = animationEnabled && !reduceMotion
  const classes = SIZE_CLASSES[size]

  const rhombusSpring: Transition = { type: "spring", stiffness: 400, damping: 30 }
  const zLetterSpring: Transition = { type: "spring", stiffness: 500, damping: 25 }

  return (
    <div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={cn("relative inline-flex shrink-0 items-center justify-center", classes.wrapper, className)}
    >
      {glowEnabled && (
        <motion.div
          animate={{
            scale: shouldAnimate && isHovered ? [1, 1.2, 1] : 1,
            opacity: shouldAnimate && isHovered ? 0.6 : 0.2,
          }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 rounded-full blur-md"
          style={{ backgroundColor: primaryColor }}
          aria-hidden="true"
        />
      )}

      <motion.div
        animate={{ rotate: shouldAnimate && isHovered ? 180 : 0 }}
        transition={rhombusSpring}
        className={cn("relative z-20 flex shrink-0 items-center justify-center shadow-lg", classes.mark)}
        style={{
          backgroundColor: primaryColor,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        aria-hidden="true"
      >
        <motion.span
          animate={{ rotate: shouldAnimate && isHovered ? 90 : 0 }}
          transition={zLetterSpring}
          className={cn("select-none font-black", classes.letter)}
          style={{ color: textColor }}
        >
          {letter.trim() || "Z"}
        </motion.span>
      </motion.div>
    </div>
  )
}
