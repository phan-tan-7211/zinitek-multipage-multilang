function requireEnvironmentVariable(name: string, value: string | undefined) {
  const normalized = value?.trim()
  if (!normalized) {
    throw new Error(`[CONFIG] Missing required environment variable: ${name}`)
  }
  return normalized
}

const sanityProjectId = requireEnvironmentVariable(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
)

const sanityDataset = requireEnvironmentVariable(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
)

export const runtimeConfig = {
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, ""),
  sanityProjectId,
  sanityDataset,
  sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || "",
}

export const neutralBrandFallback = "COMPANY"

export function getPublicSiteUrl() {
  return runtimeConfig.siteUrl
}
