import { cache } from 'react'
import { sanityClient } from '@/lib/sanity-client'

export interface OrganizationSettings {
  legalName?: string
  countryCode?: string
  taxId?: string
  foundingDate?: string
  priceRange?: string
  businessType?: 'Organization' | 'LocalBusiness' | 'ProfessionalService' | 'Store'
}

export interface PrimaryLocation {
  address?: string
  googleMapsUrl?: string
}

export const getOrganizationSettings = cache(async (): Promise<OrganizationSettings> => {
  return await sanityClient.fetch<OrganizationSettings | null>(
    `*[_type=="organizationSettings" && _id=="organizationSettings"][0]{legalName,countryCode,taxId,foundingDate,priceRange,businessType}`,
    {},
    { next: { revalidate: 60, tags: ['organization-settings'] } },
  ) || {}
})

export const getPrimaryLocation = cache(async (): Promise<PrimaryLocation> => {
  return await sanityClient.fetch<PrimaryLocation | null>(
    `*[_type=="locationsSettings" && _id=="locationsSettings"][0]{"address":locations[enabled != false && defined(address)][0].address,"googleMapsUrl":locations[enabled != false && defined(address)][0].googleMapsUrl}`,
    {},
    { next: { revalidate: 60, tags: ['locations-settings'] } },
  ) || {}
})
