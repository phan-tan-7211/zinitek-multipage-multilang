import type { GlobalSiteSettings } from "@/lib/site-settings"

export const LOGO_COLOR_PRESETS = {
  brandOrange: { primary: "#ea580c", text: "#ffffff", fill: "#1e0f0a", glow: "#f97316" },
  cyberCyan: { primary: "#06b6d4", text: "#22d3ee", fill: "#0f172a", glow: "#22d3ee" },
  neonPurple: { primary: "#9333ea", text: "#c084fc", fill: "#190a23", glow: "#c084fc" },
  emerald: { primary: "#059669", text: "#10b981", fill: "#061e14", glow: "#10b981" },
  titaniumGold: { primary: "#ca8a04", text: "#facc15", fill: "#1e190a", glow: "#facc15" },
  crimson: { primary: "#dc2626", text: "#ffffff", fill: "#240909", glow: "#ef4444" },
} as const

function cleanHexColor(value: string | undefined, fallback: string) {
  const color = value?.trim()
  return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback
}

function clamp(value: number | undefined, minimum: number, maximum: number, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback
  return Math.min(maximum, Math.max(minimum, value))
}

export function resolveLogoMark(settings: Pick<GlobalSiteSettings, "logoMark">) {
  const logoMark = settings.logoMark
  const letter = Array.from(logoMark?.letter?.trim() || "C").slice(0, 2).join("") || "C"
  const presetKey = logoMark?.colorPreset === "zinitekOrange" ? "brandOrange" : logoMark?.colorPreset
  const preset = presetKey && presetKey !== "custom" && presetKey in LOGO_COLOR_PRESETS
    ? LOGO_COLOR_PRESETS[presetKey as keyof typeof LOGO_COLOR_PRESETS]
    : undefined
  const primaryColor = preset?.primary || cleanHexColor(logoMark?.primaryColor, "#ea580c")

  return {
    template: logoMark?.template === "zHexagon" ? "zHexagon" as const : "zRhombus" as const,
    letter,
    letterStyle: logoMark?.letterStyle || "system",
    primaryColor,
    textColor: preset?.text || cleanHexColor(logoMark?.textColor, "#ffffff"),
    fillColor: preset?.fill || cleanHexColor(logoMark?.fillColor, "#0f172a"),
    fillOpacity: clamp(logoMark?.fillOpacity, 0, 1, 0.6),
    strokeWidth: clamp(logoMark?.strokeWidth, 1, 10, 5),
    scalePercent: clamp(logoMark?.scalePercent, 80, 115, 100),
    glowEnabled: logoMark?.glowEnabled !== false,
    glowColor: preset?.glow || cleanHexColor(logoMark?.glowColor, primaryColor),
    glowOpacity: clamp(logoMark?.glowOpacity, 0, 0.8, 0.2),
    glowBlur: logoMark?.glowBlur || "medium",
    shineEnabled: logoMark?.shineEnabled === true,
    animationEnabled: logoMark?.animationEnabled !== false,
    shapeHoverRotate: clamp(logoMark?.shapeHoverRotate, -360, 360, 180),
    letterHoverRotate: clamp(logoMark?.letterHoverRotate, -180, 180, 0),
    springStiffness: clamp(logoMark?.springStiffness, 100, 800, 400),
    springDamping: clamp(logoMark?.springDamping, 10, 80, 30),
  }
}
