import { defineConfig } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { IconManager } from 'sanity-plugin-icon-manager'
import { schemaTypes } from './sanity/schemaTypes'
import { ImportExportTool } from './sanity/tools/ImportExportTool'
import { CompanyBootstrapLayout } from './sanity/components/CompanyBootstrapLayout'
import { structure } from './sanity/structure'
import { runtimeConfig } from './lib/runtime-config'

export default defineConfig({
  name: 'default',
  title: 'Website Admin',
  projectId: runtimeConfig.sanityProjectId,
  dataset: runtimeConfig.sanityDataset,
  basePath: '/studio',

  studio: {
    components: {
      layout: CompanyBootstrapLayout,
    },
  },

  tools: (previousTools) => [
    ...previousTools,
    {
      name: 'import-export',
      title: 'Nhập/Xuất Dữ Liệu',
      component: ImportExportTool,
    },
  ],

  plugins: [
    structureTool({ structure }),
    visionTool(),
    IconManager(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'vi', title: 'Tiếng Việt' },
        { id: 'en', title: 'English' },
        { id: 'cn', title: 'Chinese' },
        { id: 'jp', title: 'Japanese' },
        { id: 'kr', title: 'Korean' },
      ],
      schemaTypes: [
        'service',
        'product',
        'project',
        'blogPost',
        'pageContent',
        'seoPageConfig',
        'blogCategory',
        'legalDoc'
      ],
    })
  ],

  schema: {
    types: (previousTypes) => {
      const normalizedTypes = previousTypes.map((schemaType) => {
        if (schemaType.name === 'translation.metadata') {
          return {
            ...schemaType,
            preview: {
              select: {
                originalTitle: 'translations.0.value.title',
                translations: 'translations',
                schemaTypes: 'schemaTypes',
              },
              prepare(selection: any) {
                const { originalTitle, translations, schemaTypes, id } = selection
                const title = originalTitle || (id ? `Nhóm ID: ${id.slice(0, 8)}...` : 'Đang cập nhật...')
                const languageCodes = Array.isArray(translations)
                  ? translations.map((translation: any) => translation._key ? translation._key.toUpperCase() : '').join(', ')
                  : ''
                const schemaName = schemaTypes?.[0] || 'document'

                return {
                  title,
                  subtitle: `(${languageCodes}) ${schemaName}`,
                  media: EarthGlobeIcon,
                }
              }
            }
          }
        }
        return schemaType
      })

      return [...schemaTypes, ...normalizedTypes]
    },
  },
})