import { sanityClient } from "@/lib/sanity-client"

export type PageIdentifier = 'home' | 'about' | 'contact' | 'servicesHub' | 'productsHub' | string

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

  let data = await sanityClient.fetch(query, { language, identifier })
  if (!data) data = await sanityClient.fetch(query, { language: 'en', identifier })
  if (!data) data = await sanityClient.fetch(query, { language: 'vi', identifier })
  return data
}
