"use client"

import { Icon } from '@iconify/react'
import { Cog } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from "@/lib/utils"

export function DynamicIcon({ iconData, className }: { iconData: any, className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Nếu chưa mount (tránh lỗi Hydration Next.js) hoặc dữ liệu rỗng
  if (!mounted || !iconData || !iconData.icon) {
    // Trả về icon Bánh răng mặc định (Dạng tĩnh) để web không bị trống
    return <Cog className={cn("w-6 h-6", className)} />
  }

  // 2. Render Icon từ Plugin Sanity (Ví dụ: "lucide:cpu")
  return (
    <Icon 
      icon={iconData.icon} 
      className={cn("w-6 h-6", className)} 
    />
  )
}