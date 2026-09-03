"use client"

import { useSiteSettings } from "@/components/site-settings-context"
import { ZLogoIcon } from "@/components/z-logo-icon"
import { resolveLogoMark } from "@/lib/logo-settings"
import { neutralBrandFallback } from "@/lib/runtime-config"

type SiteLocale = "vi" | "en" | "jp" | "kr" | "cn"

const DEFAULT_TAGLINES: Record<SiteLocale, string> = {
  vi: "Giải pháp kỹ thuật",
  en: "Engineering Solutions",
  jp: "エンジニアリングソリューション",
  kr: "엔지니어링 솔루션",
  cn: "工程解决方案",
}

function cleanText(value: string | undefined, fallback: string) {
  return value?.trim() || fallback
}

export function SiteLogoMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const settings = useSiteSettings()
  const logoMark = resolveLogoMark(settings)

  return <ZLogoIcon size={size} {...logoMark} className={className} />
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
  const primaryText = cleanText(logoWordmark?.primaryText, neutralBrandFallback)
  const accentText = logoWordmark?.accentText?.trim() || ""
  const tagline = cleanText(
    logoWordmark?.tagline?.[locale] || logoWordmark?.tagline?.en || logoWordmark?.tagline?.vi,
    fallbackTagline || DEFAULT_TAGLINES[locale],
  )

  return (
    <div className={className}>
      <span className={titleClassName}>
        {primaryText}{accentText && <span className="text-primary">{accentText}</span>}
      </span>
      {!hideTagline && <p className={taglineClassName}>{tagline}</p>}
    </div>
  )
}
