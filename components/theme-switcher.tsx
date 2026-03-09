"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeSwitcherProps {
    lang: string
    dict: any
}

export function ThemeSwitcher({ lang, dict }: ThemeSwitcherProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Tránh lỗi Hydration: Chỉ render sau khi đã mount ở Client
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const label = lang === "vi" ? "GIAO DIỆN" : "APPEARANCE"

    const themes = [
        { id: "light", icon: Sun },
        { id: "dark", icon: Moon },
        { id: "system", icon: Monitor },
    ]

    return (
        <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-tighter text-muted-foreground px-1 font-black text-center">
                {label}
            </p>
            <div className="flex bg-secondary/30 p-1 rounded-xl gap-1">
                {themes.map((t) => {
                    const Icon = t.icon
                    const isActive = theme === t.id

                    return (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center py-2.5 rounded-lg transition-all duration-300",
                                isActive
                                    ? "bg-[#f97316] text-white shadow-lg shadow-[#f97316]/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                        >
                            <Icon className="size-4" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
