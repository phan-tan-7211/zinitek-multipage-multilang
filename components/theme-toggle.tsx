"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-9 w-9" aria-hidden="true" />;
    }

    const currentTheme = theme === "dark" || theme === "system" ? theme : "light";
    const nextTheme = currentTheme === "light" ? "dark" : currentTheme === "dark" ? "system" : "light";

    const label =
        currentTheme === "light"
            ? "Light mode. Switch to dark mode"
            : currentTheme === "dark"
                ? "Dark mode. Switch to auto mode"
                : "Auto mode. Switch to light mode";

    const Icon = currentTheme === "dark" ? Moon : currentTheme === "system" ? Monitor : Sun;

    return (
        <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            aria-label={label}
            title={currentTheme === "system" ? "Auto" : currentTheme === "dark" ? "Dark" : "Light"}
            className={cn(
                "group inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-muted-foreground shadow-soft transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/10 hover:text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                currentTheme === "dark" && "bg-secondary text-foreground",
                currentTheme === "system" && "border-primary/30 bg-primary/10 text-primary"
            )}
        >
            <Icon className="size-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            <span className="sr-only">{label}</span>
        </button>
    );
}
