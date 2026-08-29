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

export function SiteLogoMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const { logoMark } = useSiteSettings()

  return (
    <ZLogoIcon
      size={size}
      letter={logoMark?.letter?.trim() || "Z"}
      primaryColor={cleanHexColor(logoMark?.primaryColor, "#ea580c")}
      textColor={cleanHexColor(logoMark?.textColor, "#ffffff")}
      glowEnabled={logoMark?.glowEnabled !== false}
      animationEnabled={logoMark?.animationEnabled !== false}
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
