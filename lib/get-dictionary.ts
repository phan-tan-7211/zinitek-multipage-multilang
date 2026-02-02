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
  try {
    // 1. Kiểm tra xem locale có hợp lệ không, nếu không mặc định về 'vi'
    const loadDictionary = dictionaries[locale as keyof typeof dictionaries]
    
    if (!loadDictionary) {
      console.warn(`⚠️ Cảnh báo: Ngôn ngữ [${locale}] không hỗ trợ, đang dùng mặc định [vi]`);
      return await dictionaries.vi();
    }

    // 2. Chạy hàm import
    const data = await loadDictionary();
    
    if (!data) {
      throw new Error("Dữ liệu từ điển bị trống");
    }

    return data;
  } catch (error) {
    // 3. Log lỗi cực kỳ quan trọng để bạn "bắt bệnh" trong Terminal
    console.error(`❌ LỖI NGHIÊM TRỌNG tại getDictionary (${locale}):`, error);
    
    // Trả về tiếng Việt làm phương án cuối cùng để không bị trắng trang
    return await dictionaries.vi();
  }
}