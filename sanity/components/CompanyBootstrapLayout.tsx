"use client"

import { useEffect, useRef } from 'react'
import type { LayoutProps } from 'sanity'
import { useClient, useCurrentUser } from 'sanity'
import {
  buildContactSettingsSeed,
  buildLocationSettingsSeed,
  buildPageContentSeedDocuments,
  COMPANY_BOOTSTRAP_API_VERSION,
  COMPANY_BOOTSTRAP_VERSION,
  legacyDictionaryMatchesBrand,
} from '../bootstrap/legacyDictionaryBootstrap'

const STATE_ID = 'frameworkBootstrap.companyData'
const SUPPLEMENTAL_STATE_ID = 'frameworkBootstrap.companyData.v2'

export function CompanyBootstrapLayout(props: LayoutProps) {
  const client = useClient({ apiVersion: COMPANY_BOOTSTRAP_API_VERSION })
  const currentUser = useCurrentUser()
  const started = useRef(false)

  useEffect(() => {
    if (!currentUser || started.current) return
    started.current = true

    async function bootstrap() {
      try {
        const [state, supplementalState, siteSettings] = await Promise.all([
          client.fetch<{ version?: number } | null>(`*[_id == $id][0]{version}`, { id: STATE_ID }),
          client.fetch<{ completedAt?: string } | null>(`*[_id == $id][0]{completedAt}`, { id: SUPPLEMENTAL_STATE_ID }),
          client.fetch<any>(`*[_type == "siteSettings" && _id == "siteSettings"][0]{logoWordmark{primaryText,accentText},googleMapsUrl,googleRating,googleReviewCount,googleReviews,addressDisplay}`),
        ])

        const siteName = `${siteSettings?.logoWordmark?.primaryText || ''}${siteSettings?.logoWordmark?.accentText || ''}`.trim()
        if (!legacyDictionaryMatchesBrand(siteName)) {
          console.info('[Company bootstrap] skipped: current Sanity brand does not match bundled legacy company data')
          return
        }

        if ((state?.version || 0) < COMPANY_BOOTSTRAP_VERSION) {
          const pageContentDocuments = buildPageContentSeedDocuments()
          const contactSettings = buildContactSettingsSeed()
          const locationsSettings = buildLocationSettingsSeed()

          for (let offset = 0; offset < pageContentDocuments.length; offset += 25) {
            const transaction = client.transaction()
            pageContentDocuments.slice(offset, offset + 25).forEach((document) => {
              transaction.createIfNotExists(document)
              transaction.patch(document._id, (patch) => patch.setIfMissing({ language: document.language, key: document.key, content: document.content }))
            })
            await transaction.commit({ autoGenerateArrayKeys: true })
          }

          await client.transaction()
            .createIfNotExists(contactSettings)
            .patch(contactSettings._id, (patch) => patch.setIfMissing({ enabled: contactSettings.enabled, badge: contactSettings.badge, title: contactSettings.title, titleHighlight: contactSettings.titleHighlight, description: contactSettings.description, workingHoursTitle: contactSettings.workingHoursTitle, workingHours: contactSettings.workingHours, form: contactSettings.form }))
            .createIfNotExists(locationsSettings)
            .patch(locationsSettings._id, (patch) => patch.setIfMissing({ locations: locationsSettings.locations }))
            .createOrReplace({ _id: STATE_ID, _type: 'frameworkBootstrapState', version: COMPANY_BOOTSTRAP_VERSION, completedAt: new Date().toISOString() })
            .commit({ autoGenerateArrayKeys: true })
        }

        if (!supplementalState?.completedAt) {
          const legacyReviewSettings = {
            _id: 'googleReviewsSettings', _type: 'googleReviewsSettings', enabled: true,
            googleMapsUrl: siteSettings?.googleMapsUrl,
            googleRating: siteSettings?.googleRating,
            googleReviewCount: siteSettings?.googleReviewCount,
            googleReviews: Array.isArray(siteSettings?.googleReviews) ? siteSettings.googleReviews : [],
          }
          const organizationSettings = {
            _id: 'organizationSettings', _type: 'organizationSettings',
            legalName: siteName,
            countryCode: 'VN',
            businessType: 'LocalBusiness',
          }
          const transaction = client.transaction()
            .createIfNotExists(legacyReviewSettings)
            .patch('googleReviewsSettings', (patch) => patch.setIfMissing({
              enabled: true,
              googleMapsUrl: legacyReviewSettings.googleMapsUrl,
              googleRating: legacyReviewSettings.googleRating,
              googleReviewCount: legacyReviewSettings.googleReviewCount,
              googleReviews: legacyReviewSettings.googleReviews,
            }))
            .createIfNotExists(organizationSettings)
            .patch('organizationSettings', (patch) => patch.setIfMissing({ legalName: siteName, countryCode: 'VN', businessType: 'LocalBusiness' }))
            .createOrReplace({ _id: SUPPLEMENTAL_STATE_ID, _type: 'frameworkBootstrapState', completedAt: new Date().toISOString() })
          await transaction.commit({ autoGenerateArrayKeys: true })
        }

        console.info('[Company bootstrap] legacy company data is synchronized to dynamic Sanity documents')
      } catch (error) {
        started.current = false
        console.error('[Company bootstrap] automatic migration failed:', error)
      }
    }

    void bootstrap()
  }, [client, currentUser])

  return props.renderDefault(props)
}
