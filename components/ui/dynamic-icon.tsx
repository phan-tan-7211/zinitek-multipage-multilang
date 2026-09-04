"use client"

import { Icon } from "@iconify/react"
import { Cog } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function DynamicIcon({ iconData, className }: { iconData: any; className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const iconName =
    typeof iconData === "string"
      ? iconData
      : typeof iconData?.icon === "string"
        ? iconData.icon
        : typeof iconData?.name === "string"
          ? iconData.name
          : null

  if (!mounted || !iconName) {
    return <Cog aria-hidden="true" className={cn("h-6 w-6", className)} />
  }

  return (
    <Icon
      aria-hidden="true"
      icon={iconName}
      className={cn("h-6 w-6", className)}
    />
  )
}
