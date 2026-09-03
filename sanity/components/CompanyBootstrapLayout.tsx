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
} from '../bootstrap/legacyDictionaryBootstrap'

const STATE_ID = 'frameworkBootstrap.companyData'

export function CompanyBootstrapLayout(props: LayoutProps) {
  const client = useClient({ apiVersion: COMPANY_BOOTSTRAP_API_VERSION })
  const currentUser = useCurrentUser()
  const started = useRef(false)

  useEffect(() => {
    if (!currentUser || started.current) return
    started.current = true

    async function bootstrap() {
      try {
        const state = await client.fetch<{ version?: number } | null>(
          `*[_id == $id][0]{version}`,
          { id: STATE_ID },
        )
        if ((state?.version || 0) >= COMPANY_BOOTSTRAP_VERSION) return

        const pageContentDocuments = buildPageContentSeedDocuments()
        const contactSettings = buildContactSettingsSeed()
        const locationsSettings = buildLocationSettingsSeed()

        for (let offset = 0; offset < pageContentDocuments.length; offset += 25) {
          const transaction = client.transaction()
          pageContentDocuments.slice(offset, offset + 25).forEach((document) => {
            transaction.createIfNotExists(document)
            transaction.patch(document._id, (patch) =>
              patch.setIfMissing({
                language: document.language,
                key: document.key,
                content: document.content,
              }),
            )
          })
          await transaction.commit({ autoGenerateArrayKeys: true })
        }

        await client
          .transaction()
          .createIfNotExists(contactSettings)
          .patch(contactSettings._id, (patch) =>
            patch.setIfMissing({
              enabled: contactSettings.enabled,
              badge: contactSettings.badge,
              title: contactSettings.title,
              titleHighlight: contactSettings.titleHighlight,
              description: contactSettings.description,
              workingHoursTitle: contactSettings.workingHoursTitle,
              workingHours: contactSettings.workingHours,
              form: contactSettings.form,
            }),
          )
          .createIfNotExists(locationsSettings)
          .patch(locationsSettings._id, (patch) =>
            patch.setIfMissing({ locations: locationsSettings.locations }),
          )
          .createOrReplace({
            _id: STATE_ID,
            _type: 'frameworkBootstrapState',
            version: COMPANY_BOOTSTRAP_VERSION,
            completedAt: new Date().toISOString(),
          })
          .commit({ autoGenerateArrayKeys: true })

        console.info(`[Company bootstrap] migrated legacy company data to Sanity v${COMPANY_BOOTSTRAP_VERSION}`)
      } catch (error) {
        started.current = false
        console.error('[Company bootstrap] automatic migration failed:', error)
      }
    }

    void bootstrap()
  }, [client, currentUser])

  return props.renderDefault(props)
}
