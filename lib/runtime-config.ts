function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`[CONFIG] Missing required environment variable: ${name}`)
  }
  return value
}

export const runtimeConfig = {
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
  sanityProjectId: requireEnvironmentVariable("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  sanityDataset: requireEnvironmentVariable("NEXT_PUBLIC_SANITY_DATASET"),
  sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || "",
}

export const neutralBrandFallback = "COMPANY"

export function getPublicSiteUrl() {
  return runtimeConfig.siteUrl
}
