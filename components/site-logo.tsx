"use client"

import { DynamicIcon } from "@/components/ui/dynamic-icon"
import { useSiteSettings } from "@/components/site-settings-context"
import { cn } from "@/lib/utils"

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

export function SiteLogoMark({ className }: { className?: string }) {
  const { logoMark } = useSiteSettings()

  return <DynamicIcon iconData={logoMark} className={className} />
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
