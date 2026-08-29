"use client"

import { useSiteSettings } from "@/components/site-settings-context"
import { ZLogoIcon } from "@/components/z-logo-icon"

type SiteLocale = "vi" | "en" | "jp" | "kr" | "cn"

const DEFAULT_TAGLINES: Record<SiteLocale, string> = {
  vi: "Kỹ Thuật Cơ Khí",
  en: "Mechanical Engineering",
  jp: "機械技術",
  kr: "기계 공학 솔루션",
  cn: "机械工程",
}

function cleanText(value: string | undefined, fallback: string) {
  return value?.trim() || fallback
}

function cleanHexColor(value: string | undefined, fallback: string) {
  const color = value?.trim()
  return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback
}

const LOGO_COLOR_PRESETS = {
  zinitekOrange: { primary: "#ea580c", text: "#ffffff", fill: "#1e0f0a", glow: "#f97316" },
  cyberCyan: { primary: "#06b6d4", text: "#22d3ee", fill: "#0f172a", glow: "#22d3ee" },
  neonPurple: { primary: "#9333ea", text: "#c084fc", fill: "#190a23", glow: "#c084fc" },
  emerald: { primary: "#059669", text: "#10b981", fill: "#061e14", glow: "#10b981" },
  titaniumGold: { primary: "#ca8a04", text: "#facc15", fill: "#1e190a", glow: "#facc15" },
  crimson: { primary: "#dc2626", text: "#ffffff", fill: "#240909", glow: "#ef4444" },
} as const

export function SiteLogoMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const { logoMark } = useSiteSettings()
  const preset = logoMark?.colorPreset && logoMark.colorPreset !== "custom"
    ? LOGO_COLOR_PRESETS[logoMark.colorPreset]
    : undefined
  const primaryColor = preset?.primary || cleanHexColor(logoMark?.primaryColor, "#ea580c")

  return (
    <ZLogoIcon
      size={size}
      template={logoMark?.template === "zHexagon" ? "zHexagon" : "zRhombus"}
      letter={logoMark?.letter?.trim() || "Z"}
      letterStyle={logoMark?.letterStyle || "system"}
      primaryColor={primaryColor}
      textColor={preset?.text || cleanHexColor(logoMark?.textColor, "#ffffff")}
      fillColor={preset?.fill || cleanHexColor(logoMark?.fillColor, "#0f172a")}
      fillOpacity={logoMark?.fillOpacity}
      strokeWidth={logoMark?.strokeWidth}
      scalePercent={logoMark?.scalePercent}
      glowEnabled={logoMark?.glowEnabled !== false}
      glowColor={preset?.glow || cleanHexColor(logoMark?.glowColor, primaryColor)}
      glowOpacity={logoMark?.glowOpacity}
      glowBlur={logoMark?.glowBlur || "medium"}
      shineEnabled={logoMark?.shineEnabled === true}
      animationEnabled={logoMark?.animationEnabled !== false}
      shapeHoverRotate={logoMark?.shapeHoverRotate}
      letterHoverRotate={logoMark?.letterHoverRotate}
      springStiffness={logoMark?.springStiffness}
      springDamping={logoMark?.springDamping}
      className={className}
    />
  )
}

interface SiteLogoWordmarkProps {
  lang: string
  fallbackTagline?: string
  className?: string
  titleClassName?: string
  taglineClassName?: string
  hideTagline?: boolean
}

export function SiteLogoWordmark({
  lang,
  fallbackTagline,
  className,
  titleClassName,
  taglineClassName,
  hideTagline = false,
}: SiteLogoWordmarkProps) {
  const { logoWordmark } = useSiteSettings()
  const locale: SiteLocale = ["vi", "en", "jp", "kr", "cn"].includes(lang) ? lang as SiteLocale : "vi"
  const primaryText = cleanText(logoWordmark?.primaryText, "ZINI")
  const accentText = cleanText(logoWordmark?.accentText, "TEK")
  const tagline = cleanText(
    logoWordmark?.tagline?.[locale] || logoWordmark?.tagline?.en || logoWordmark?.tagline?.vi,
    fallbackTagline || DEFAULT_TAGLINES[locale],
  )

  return (
    <div className={className}>
      <span className={titleClassName}>
        {primaryText}<span className="text-primary">{accentText}</span>
      </span>
      {!hideTagline && <p className={taglineClassName}>{tagline}</p>}
    </div>
  )
}
