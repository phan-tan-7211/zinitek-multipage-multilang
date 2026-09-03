import "server-only"
import { sanityClient } from '@/lib/sanity-client'
import { getSiteName } from '@/lib/site-settings'
import { legacyDictionaryMatchesBrand } from '@/sanity/bootstrap/legacyDictionaryBootstrap'

const dictionaries = {
  vi: () => import('@/dictionaries/vi.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  jp: () => import('@/dictionaries/jp.json').then((module) => module.default),
  kr: () => import('@/dictionaries/kr.json').then((module) => module.default),
  cn: () => import('@/dictionaries/cn.json').then((module) => module.default),
}

const neutralLabels: Record<string, Record<string, any>> = {
  vi: { navigation: { home: 'Trang chủ', about: 'Giới thiệu', services: 'Dịch vụ', products: 'Sản phẩm', projects: 'Dự án', blog: 'Blog', contact: 'Liên hệ' }, common: { home: 'Trang chủ', logo_subtitle: 'Giải pháp kỹ thuật' }, hero: { title_line1: 'Giải pháp', title_highlight: 'kỹ thuật', description: 'Website doanh nghiệp.' } },
  en: { navigation: { home: 'Home', about: 'About', services: 'Services', products: 'Products', projects: 'Projects', blog: 'Blog', contact: 'Contact' }, common: { home: 'Home', logo_subtitle: 'Engineering Solutions' }, hero: { title_line1: 'Engineering', title_highlight: 'Solutions', description: 'Corporate website.' } },
  jp: { navigation: { home: 'ホーム', about: '会社情報', services: 'サービス', products: '製品', projects: 'プロジェクト', blog: 'ブログ', contact: 'お問い合わせ' }, common: { home: 'ホーム', logo_subtitle: 'エンジニアリングソリューション' }, hero: { title_line1: 'エンジニアリング', title_highlight: 'ソリューション', description: '企業ウェブサイト。' } },
  kr: { navigation: { home: '홈', about: '회사소개', services: '서비스', products: '제품', projects: '프로젝트', blog: '블로그', contact: '문의' }, common: { home: '홈', logo_subtitle: '엔지니어링 솔루션' }, hero: { title_line1: '엔지니어링', title_highlight: '솔루션', description: '기업 웹사이트입니다.' } },
  cn: { navigation: { home: '首页', about: '关于我们', services: '服务', products: '产品', projects: '项目', blog: '博客', contact: '联系我们' }, common: { home: '首页', logo_subtitle: '工程解决方案' }, hero: { title_line1: '工程', title_highlight: '解决方案', description: '企业网站。' } },
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function deepMerge<T>(base: T, override: any): T {
  if (!isPlainObject(base) || !isPlainObject(override)) return (override ?? base) as T
  const output: Record<string, any> = { ...(base as Record<string, any>) }
  for (const [key, value] of Object.entries(override)) {
    output[key] = isPlainObject(output[key]) && isPlainObject(value) ? deepMerge(output[key], value) : value
  }
  return output as T
}

function neutralize(value: any): any {
  if (typeof value === 'string') return ''
  if (Array.isArray(value)) return []
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, neutralize(item)]))
  return value
}

async function getDynamicPageContent(locale: string) {
  try {
    const rows = await sanityClient.fetch<Array<{ key?: string; content?: string }>>(
      `*[_type == "pageContent" && language == $locale && defined(key) && defined(content) && !(_id in path("drafts.**"))]{key,content}`,
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
  } catch {
    console.warn(`⚠️ Không thể tải pageContent từ Sanity cho [${locale}].`)
    return {}
  }
}

async function useLegacyFallback() {
  try {
    return legacyDictionaryMatchesBrand(await getSiteName())
  } catch {
    return false
  }
}

export const getDictionary = async (locale: string) => {
  const safeLocale = locale in dictionaries ? locale : 'vi'
  if (!(locale in dictionaries) && !locale.includes('.') && locale !== 'favicon.ico' && locale !== 'studio' && locale.length <= 5) {
    console.warn(`⚠️ Ngôn ngữ [${locale}] không hỗ trợ, dùng mặc định [vi]`)
  }

  const loadDictionary = dictionaries[safeLocale as keyof typeof dictionaries]
  const [bundledDictionary, dynamicSections, legacyAllowed] = await Promise.all([
    loadDictionary(),
    getDynamicPageContent(safeLocale),
    useLegacyFallback(),
  ])

  const baseDictionary = legacyAllowed
    ? bundledDictionary
    : deepMerge(neutralize(bundledDictionary), neutralLabels[safeLocale] || neutralLabels.vi)

  return deepMerge(baseDictionary, dynamicSections)
}
