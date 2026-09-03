import { cache } from "react"
import { neutralBrandFallback } from "@/lib/runtime-config"
import { sanityClient } from "@/lib/sanity-client"

export interface GlobalSiteSettings {
  _updatedAt?: string
  logoMark?: {
    template?: "zRhombus" | "zHexagon"
    letter?: string
    letterStyle?: "system" | "vectorZ" | "serif" | "mono"
    colorPreset?: "brandOrange" | "zinitekOrange" | "cyberCyan" | "neonPurple" | "emerald" | "titaniumGold" | "crimson" | "custom"
    primaryColor?: string
    textColor?: string
    fillColor?: string
    fillOpacity?: number
    strokeWidth?: number
    scalePercent?: number
    glowEnabled?: boolean
    glowColor?: string
    glowOpacity?: number
    glowBlur?: "soft" | "medium" | "strong"
    shineEnabled?: boolean
    animationEnabled?: boolean
    shapeHoverRotate?: number
    letterHoverRotate?: number
    springStiffness?: number
    springDamping?: number
  }
  logoWordmark?: {
    primaryText?: string
    accentText?: string
    tagline?: Partial<Record<"vi" | "en" | "jp" | "kr" | "cn", string>>
  }
  phoneDisplay?: string
  phoneTel?: string
  email?: string
  zaloNumber?: string
  wechatId?: string
  wechatUrl?: string
  lineUrl?: string
  facebookUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
  twitterUrl?: string
  addressDisplay?: string
  googleMapsUrl?: string
}

export const getSiteSettings = cache(async (): Promise<GlobalSiteSettings> => {
  const settings = await sanityClient.fetch<GlobalSiteSettings | null>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      _updatedAt,
      logoMark{
        template, letter, letterStyle, colorPreset,
        primaryColor, textColor, fillColor, fillOpacity, strokeWidth, scalePercent,
        glowEnabled, glowColor, glowOpacity, glowBlur, shineEnabled,
        animationEnabled, shapeHoverRotate, letterHoverRotate, springStiffness, springDamping
      },
      logoWordmark{primaryText, accentText, tagline{vi, en, jp, kr, cn}},
      phoneDisplay, phoneTel, email, zaloNumber,
      wechatId, wechatUrl, lineUrl,
      facebookUrl, youtubeUrl, tiktokUrl, twitterUrl,
      addressDisplay, googleMapsUrl
    }`,
    {},
    { next: { revalidate: 60, tags: ["site-settings"] } },
  )

  return settings || {}
})

export function resolveSiteName(settings: GlobalSiteSettings) {
  const primaryText = settings.logoWordmark?.primaryText?.trim() || neutralBrandFallback
  const accentText = settings.logoWordmark?.accentText?.trim() || ""
  return `${primaryText}${accentText}`.trim()
}

export const getSiteName = cache(async () => resolveSiteName(await getSiteSettings()))

// Temporary migration compatibility for legacy bundled content.
// Remove after dictionaries/data no longer contain the previous brand token.
export function replaceLegacySiteName(value: string, siteName: string) {
  return value.replace(/ZINITEK/gi, () => siteName)
}

export function withSiteName(value: string, siteName: string) {
  const updatedValue = replaceLegacySiteName(value, siteName).trim()
  return updatedValue.toLocaleLowerCase().includes(siteName.toLocaleLowerCase())
    ? updatedValue
    : `${updatedValue} | ${siteName}`
}
