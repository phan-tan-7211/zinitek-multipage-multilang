import "server-only"
import type { Locale } from './i18n-config'

const dictionaries = {
  vi: () => import('@/dictionaries/vi.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  jp: () => import('@/dictionaries/jp.json').then((module) => module.default),
  kr: () => import('@/dictionaries/kr.json').then((module) => module.default),
  cn: () => import('@/dictionaries/cn.json').then((module) => module.default),
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

    return await loadDictionary();
  } catch (error) {
    return await dictionaries.vi();
  }
}