
import React from 'react'
import type { Metadata } from 'next'
import { getSiteName } from '@/lib/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()
  return {
    title: { absolute: `${siteName} Sanity Studio` },
    description: `Backend quản trị nội dung cho website ${siteName}`,
  }
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
