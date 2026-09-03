import { createClient } from "next-sanity"
import { runtimeConfig } from "@/lib/runtime-config"

export type PageIdentifier = 'home' | 'about' | 'contact' | 'servicesHub' | 'productsHub' | string

const client = createClient({
  projectId: runtimeConfig.sanityProjectId,
  dataset: runtimeConfig.sanityDataset,
  apiVersion: runtimeConfig.sanityApiVersion,
  useCdn: false,
})

export async function fetchSeoData(language: string, identifier: PageIdentifier) {
  const query = `
    *[_type == "seoPageConfig" && pageIdentifier == $identifier && language == $language][0] {
      metaTitle,
      metaDescription,
      openGraphImage {
        asset->{url, originalFilename}
      },
      heroHeading,
      mainContent
    }
  `

  let data = await client.fetch(query, { language, identifier })
  if (!data) data = await client.fetch(query, { language: 'en', identifier })
  if (!data) data = await client.fetch(query, { language: 'vi', identifier })
  return data
}
