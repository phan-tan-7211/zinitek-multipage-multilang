"use client"

import { useState } from "react"
import { motion, useReducedMotion, type Transition } from "framer-motion"
import { cn } from "@/lib/utils"

type LogoSize = "sm" | "md" | "lg"
export type LogoTemplate = "zRhombus" | "zHexagon"
export type LogoLetterStyle = "system" | "vectorZ" | "serif" | "mono"
export type LogoGlowBlur = "soft" | "medium" | "strong"

const SIZE_CLASSES: Record<LogoSize, { wrapper: string; mark: string; letter: string }> = {
  sm: { wrapper: "p-0.5", mark: "size-8", letter: "text-base" },
  md: { wrapper: "p-1", mark: "size-10", letter: "text-lg" },
  lg: { wrapper: "p-2", mark: "size-10 sm:size-12", letter: "text-lg sm:text-xl" },
}

interface ZLogoIconProps {
  isHovered?: boolean
  size?: LogoSize
  template?: LogoTemplate
  letter?: string
  letterStyle?: LogoLetterStyle
  primaryColor?: string
  textColor?: string
  fillColor?: string
  fillOpacity?: number
  strokeWidth?: number
  scalePercent?: number
  glowEnabled?: boolean
  glowColor?: string
  glowOpacity?: number
  glowBlur?: LogoGlowBlur
  shineEnabled?: boolean
  animationEnabled?: boolean
  shapeHoverRotate?: number
  letterHoverRotate?: number
  springStiffness?: number
  springDamping?: number
  className?: string
}

const GLOW_BLUR_CLASSES: Record<LogoGlowBlur, string> = {
  soft: "blur-sm",
  medium: "blur-md",
  strong: "blur-xl",
}

function clamp(value: number | undefined, minimum: number, maximum: number, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback
  return Math.min(maximum, Math.max(minimum, value))
}

export function ZLogoIcon({
  isHovered: externalHover,
  size = "md",
  template = "zRhombus",
  letter = "Z",
  letterStyle = "system",
  primaryColor = "#ea580c",
  textColor = "#ffffff",
  fillColor = "#0f172a",
  fillOpacity = 0.6,
  strokeWidth = 5,
  scalePercent = 100,
  glowEnabled = true,
  glowColor = primaryColor,
  glowOpacity = 0.2,
  glowBlur = "medium",
  shineEnabled = false,
  animationEnabled = true,
  shapeHoverRotate = 180,
  letterHoverRotate = 90,
  springStiffness = 400,
  springDamping = 30,
  className,
}: ZLogoIconProps) {
  const [internalHover, setInternalHover] = useState(false)
  const reduceMotion = useReducedMotion()
  const isHovered = externalHover ?? internalHover
  const shouldAnimate = animationEnabled && !reduceMotion
  const classes = SIZE_CLASSES[size]
  const displayLetter = letter.trim() || "Z"
  const safeScale = clamp(scalePercent, 80, 115, 100) / 100
  const safeFillOpacity = clamp(fillOpacity, 0, 1, 0.6)
  const safeStrokeWidth = clamp(strokeWidth, 1, 10, 5)
  const safeGlowOpacity = clamp(glowOpacity, 0, 0.8, 0.2)
  const safeShapeRotate = clamp(shapeHoverRotate, -360, 360, 180)
  const safeLetterRotate = clamp(letterHoverRotate, -180, 180, 90)
  const safeStiffness = clamp(springStiffness, 100, 800, 400)
  const safeDamping = clamp(springDamping, 10, 80, 30)

  const shapeSpring: Transition = { type: "spring", stiffness: safeStiffness, damping: safeDamping }
  const letterSpring: Transition = {
    type: "spring",
    stiffness: Math.min(900, safeStiffness + 100),
    damping: Math.max(15, safeDamping - 5),
  }

  const letterContent = letterStyle === "vectorZ" && displayLetter.toUpperCase() === "Z" ? (
    <svg viewBox="0 0 100 100" className="size-[52%]" fill={textColor} aria-hidden="true">
      <path d="M18 18h64v16L42 66h40v16H18V66l40-32H18Z" />
    </svg>
  ) : (
    <span
      className={cn(
        "select-none font-black leading-none",
        classes.letter,
        letterStyle === "serif" && "font-serif",
        letterStyle === "mono" && "font-mono",
      )}
      style={{ color: textColor }}
    >
      {displayLetter}
    </span>
  )

  const shapeClipPath = template === "zHexagon"
    ? "polygon(50% 3%, 92% 26%, 92% 74%, 50% 97%, 8% 74%, 8% 26%)"
    : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"

  return (
    <div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={cn("relative inline-flex shrink-0 items-center justify-center", classes.wrapper, className)}
      style={{ transform: `scale(${safeScale})` }}
    >
      {glowEnabled && (
        <motion.div
          animate={{
            scale: shouldAnimate && isHovered ? [1, 1.2, 1] : 1,
            opacity: shouldAnimate && isHovered ? Math.min(0.8, safeGlowOpacity + 0.4) : safeGlowOpacity,
          }}
          transition={{ duration: 0.4 }}
          className={cn("pointer-events-none absolute inset-0 rounded-full", GLOW_BLUR_CLASSES[glowBlur])}
          style={{ backgroundColor: glowColor }}
          aria-hidden="true"
        />
      )}

      <motion.div
        animate={{ rotate: shouldAnimate && isHovered ? safeShapeRotate : 0 }}
        transition={shapeSpring}
        className={cn("relative z-20 flex shrink-0 items-center justify-center", classes.mark)}
        style={template === "zRhombus" ? { backgroundColor: primaryColor, clipPath: shapeClipPath } : undefined}
        aria-hidden="true"
      >
        {template === "zHexagon" && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
            <polygon
              points="50 5, 92 27, 92 73, 50 95, 8 73, 8 27"
              fill={fillColor}
              fillOpacity={safeFillOpacity}
              stroke={primaryColor}
              strokeWidth={safeStrokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        )}

        {shineEnabled && (
          <span className="pointer-events-none absolute inset-0 z-30 overflow-hidden" style={{ clipPath: shapeClipPath }}>
            <motion.span
              animate={shouldAnimate && isHovered
                ? { left: ["-80%", "130%"], opacity: [0, 0.8, 0] }
                : { left: "-80%", opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-y-[-20%] w-1/2 -skew-x-[24deg] bg-gradient-to-r from-transparent via-white/55 to-transparent blur-sm"
            />
          </span>
        )}

        <motion.span
          animate={{ rotate: shouldAnimate && isHovered ? safeLetterRotate : 0 }}
          transition={letterSpring}
          className="relative z-20 flex size-full items-center justify-center"
        >
          {letterContent}
        </motion.span>
      </motion.div>
    </div>
  )
}
