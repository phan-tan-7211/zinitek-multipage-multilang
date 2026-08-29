"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    // Trạng thái kiểm tra Client Hydration
    const [daTrangBiKetNoiKichBan, datTrangThaiTrangBi] = useState(false);

    useEffect(() => {
        datTrangThaiTrangBi(true);
    }, []);

    if (!daTrangBiKetNoiKichBan) {
        // Trả về UI rỗng cùng kích thước khi chưa Hydration để tránh layout shift
        return <div className="w-8 h-8 md:w-9 md:h-5" />;
    }

    const hienTaiLaToi = theme === "dark" || theme === "system";

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75",
                theme === "dark" ? "bg-slate-700" : "bg-[#f97316]/20"
            )}
            aria-label="Chuyển đổi giao diện Sáng/Tối"
        >
            <span className="sr-only">Chuyển đổi giao diện Sáng/Tối</span>
            <span
                className={cn(
                    "pointer-events-none absolute left-0.5 top-0.5 inline-flex h-3 w-3 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out",
                    theme === "dark" ? "translate-x-4 bg-[#f97316]" : "translate-x-0"
                )}
            >
                {theme === "dark" ? (
                    <Moon className="h-2 w-2 text-white" />
                ) : (
                    <Sun className="h-2 w-2 text-[#f97316]" />
                )}
            </span>
        </button>
    );
}
