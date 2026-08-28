"use client"

import React, { createContext, useContext } from "react"

export interface SiteSettings {
  phoneDisplay?: string
  phoneTel?: string
  zaloNumber?: string
  email?: string
}

const SiteSettingsContext = createContext<SiteSettings>({})

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings
  children: React.ReactNode
}) {
  return <SiteSettingsContext.Provider value={value || {}}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
