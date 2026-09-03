import "server-only"
import type { Locale } from './i18n-config'
import { sanityClient } from '@/lib/sanity-client'

const dictionaries = {
  vi: () => import('@/dictionaries/vi.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  jp: () => import('@/dictionaries/jp.json').then((module) => module.default),
  kr: () => import('@/dictionaries/kr.json').then((module) => module.default),
  cn: () => import('@/dictionaries/cn.json').then((module) => module.default),
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function deepMerge<T>(base: T, override: any): T {
  if (!isPlainObject(base) || !isPlainObject(override)) return (override ?? base) as T
  const output: Record<string, any> = { ...(base as Record<string, any>) }
  for (const [key, value] of Object.entries(override)) {
    output[key] = isPlainObject(output[key]) && isPlainObject(value)
      ? deepMerge(output[key], value)
      : value
  }
  return output as T
}

async function getDynamicPageContent(locale: string) {
  try {
    const rows = await sanityClient.fetch<Array<{ key?: string; content?: string }>>(
      `*[
        _type == "pageContent" &&
        language == $locale &&
        defined(key) &&
        defined(content) &&
        !(_id in path("drafts.**"))
      ]{key,content}`,
      { locale },
      { next: { revalidate: 60, tags: [`page-content-${locale}`] } },
    )

    return rows.reduce((output: Record<string, any>, row) => {
      if (!row?.key || !row?.content) return output
      try {
        const parsed = JSON.parse(row.content)
        output[row.key] = isPlainObject(parsed?.[row.key]) ? parsed[row.key] : parsed
      } catch {
        console.warn(`⚠️ pageContent/${row.key} [${locale}] không phải JSON hợp lệ, bỏ qua document này.`)
      }
      return output
    }, {})
  } catch (error) {
    console.warn(`⚠️ Không thể tải pageContent từ Sanity cho [${locale}], dùng dictionary fallback.`)
    return {}
  }
}

export const getDictionary = async (locale: string) => {
  if (locale.includes('.') || locale === 'favicon.ico' || locale === 'studio') {
    return await dictionaries.vi()
  }

  try {
    const loadDictionary = dictionaries[locale as keyof typeof dictionaries]

    if (!loadDictionary) {
      if (locale.length <= 5) console.warn(`⚠️ Ngôn ngữ [${locale}] không hỗ trợ, dùng mặc định [vi]`)
      return await dictionaries.vi()
    }

    const [dictionary, dynamicSections] = await Promise.all([
      loadDictionary(),
      getDynamicPageContent(locale),
    ])

    return deepMerge(dictionary, dynamicSections)
  } catch {
    return await dictionaries.vi()
  }
}
