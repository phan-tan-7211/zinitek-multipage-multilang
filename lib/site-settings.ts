import { cache } from "react"
import { createClient } from "next-sanity"

export interface GlobalSiteSettings {
  logoMark?: string | { icon?: string; name?: string }
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

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

export const getSiteSettings = cache(async (): Promise<GlobalSiteSettings> => {
  const settings = await sanityClient.fetch<GlobalSiteSettings | null>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      logoMark,
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
  const primaryText = settings.logoWordmark?.primaryText?.trim() || "ZINI"
  const accentText = settings.logoWordmark?.accentText?.trim() || "TEK"
  return `${primaryText}${accentText}`
}

export const getSiteName = cache(async () => resolveSiteName(await getSiteSettings()))

export function replaceLegacySiteName(value: string, siteName: string) {
  return value.replace(/ZINITEK/gi, () => siteName)
}

export function withSiteName(value: string, siteName: string) {
  const updatedValue = replaceLegacySiteName(value, siteName).trim()
  return updatedValue.toLocaleLowerCase().includes(siteName.toLocaleLowerCase())
    ? updatedValue
    : `${updatedValue} | ${siteName}`
}
