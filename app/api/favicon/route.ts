import { resolveLogoMark } from "@/lib/logo-settings"
import { getSiteSettings } from "@/lib/site-settings"

export const revalidate = 60

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] || character)
}

export async function GET() {
  const settings = await getSiteSettings()
  const logo = resolveLogoMark(settings)
  const scale = logo.scalePercent / 100
  const transform = `translate(32 32) scale(${scale}) translate(-32 -32)`
  const glowDeviation = logo.glowBlur === "strong" ? 5 : logo.glowBlur === "soft" ? 2 : 3.5
  const glow = logo.glowEnabled
    ? `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="${glowDeviation}" flood-color="${logo.glowColor}" flood-opacity="${logo.glowOpacity}"/></filter>`
    : ""
  const shape = logo.template === "zHexagon"
    ? `<polygon points="32 5,55 18,55 46,32 59,9 46,9 18" fill="${logo.fillColor}" fill-opacity="${logo.fillOpacity}" stroke="${logo.primaryColor}" stroke-width="${logo.strokeWidth * 0.64}" stroke-linejoin="round"/>`
    : `<polygon points="32 3,61 32,32 61,3 32" fill="${logo.primaryColor}"/>`
  const isVectorZ = logo.letterStyle === "vectorZ" && logo.letter.toUpperCase() === "Z"
  const fontFamily = logo.letterStyle === "serif"
    ? "Georgia,serif"
    : logo.letterStyle === "mono"
      ? "ui-monospace,monospace"
      : "Arial,sans-serif"
  const letter = isVectorZ
    ? `<path d="M20 19h24v7L29 38h15v7H20v-7l15-12H20Z" fill="${logo.textColor}"/>`
    : `<text x="32" y="33" fill="${logo.textColor}" font-family="${fontFamily}" font-size="${logo.letter.length > 1 ? 22 : 30}" font-weight="900" text-anchor="middle" dominant-baseline="middle">${escapeXml(logo.letter)}</text>`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(logo.letter)}"><defs>${glow}</defs><g transform="${transform}"${logo.glowEnabled ? ' filter="url(#glow)"' : ""}>${shape}${letter}</g></svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
