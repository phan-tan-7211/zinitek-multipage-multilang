"use client"

import React, { createContext, useContext } from "react"

export interface SiteSettings {
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

const SiteSettingsContext = createContext<SiteSettings>({})

export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={value || {}}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
