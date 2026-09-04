"use client"

import React, { createContext, useContext } from "react"
import type { GlobalSiteSettings } from "@/lib/site-settings"

export interface SiteSettings extends GlobalSiteSettings {}

const SiteSettingsContext = createContext<SiteSettings>({})

export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={value || {}}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
