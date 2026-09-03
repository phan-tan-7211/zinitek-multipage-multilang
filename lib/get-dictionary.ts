import "server-only"
import { createClient } from "next-sanity"
import type { Locale } from './i18n-config'

const dictionaries = {
  vi: () => import('@/dictionaries/vi.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  jp: () => import('@/dictionaries/jp.json').then((module) => module.default),
  kr: () => import('@/dictionaries/kr.json').then((module) => module.default),
  cn: () => import('@/dictionaries/cn.json').then((module) => module.default),
}

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function getDynamicCommonContent(locale: string) {
  try {
    const result = await sanityClient.fetch<{ content?: string } | null>(
      `*[
        _type == "pageContent" &&
        language == $locale &&
        key == "common" &&
        !(_id in path("drafts.**"))
      ][0]{content}`,
      { locale },
      { next: { revalidate: 60, tags: [`page-content-common-${locale}`] } },
    )

    if (!result?.content) return null

    const parsed = JSON.parse(result.content)
    const common = parsed?.common && typeof parsed.common === "object" ? parsed.common : parsed

    return common && typeof common === "object" ? common : null
  } catch (error) {
    console.warn(`⚠️ Không thể tải pageContent/common từ Sanity cho [${locale}], dùng dictionary fallback.`)
    return null
  }
}

export const getDictionary = async (locale: string) => {
  // 1. CHẶN SPAM: Nếu là file hệ thống thì trả về dữ liệu mặc định ngay, không báo lỗi
  if (locale.includes('.') || locale === 'favicon.ico' || locale === 'studio') {
    return await dictionaries.vi();
  }

  try {
    const loadDictionary = dictionaries[locale as keyof typeof dictionaries]
    
    // 2. Nếu không tìm thấy ngôn ngữ phù hợp
    if (!loadDictionary) {
      // Chỉ hiện cảnh báo nếu nó thực sự là một mã ngôn ngữ lạ (không phải file)
      if (locale.length <= 5) {
        console.warn(`⚠️ Ngôn ngữ [${locale}] không hỗ trợ, dùng mặc định [vi]`);
      }
      return await dictionaries.vi();
    }

    const dictionary = await loadDictionary()
    const dynamicCommon = await getDynamicCommonContent(locale)
    const dynamicSlogan = typeof dynamicCommon?.slogan_top === "string"
      ? dynamicCommon.slogan_top.trim()
      : ""

    return {
      ...dictionary,
      common: {
        ...dictionary.common,
        ...(dynamicSlogan ? { slogan_top: dynamicSlogan } : {}),
      },
    }
  } catch (error) {
    return await dictionaries.vi();
  }
}