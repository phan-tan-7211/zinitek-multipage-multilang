
import React from 'react'

export const metadata = {
  title: 'Zinitek Sanity Studio',
  description: 'Backend quản trị nội dung cho website Zinitek',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}