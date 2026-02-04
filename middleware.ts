import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./lib/i18n-config"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// Hàm lấy ngôn ngữ phù hợp nhất từ trình duyệt
function getLocale(request: NextRequest): string {
  // 1. Ưu tiên lấy từ Cookie nếu người dùng đã từng chọn ngôn ngữ thủ công
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale
  }

  // 2. Đọc ngôn ngữ từ Header "accept-language" của trình duyệt
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  // PHẦN CẬP NHẬT: Chuyển đổi mã trình duyệt sang mã file của bạn
  const mapLanguages = languages.map(lang => {
    const base = lang.split('-')[0].toLowerCase()
    if (base === 'ja') return 'jp'
    if (base === 'ko') return 'kr'
    if (base === 'zh') return 'cn'
    return base
  })

  // CHỈNH SỬA QUAN TRỌNG: 
  // Nếu ngôn ngữ trình duyệt không khớp với [vi, en, jp, kr, cn], 
  // hệ thống sẽ lấy 'en' làm ngôn ngữ ưu tiên thay vì mặc định 'vi'.
  const fallbackLocale = "en" 

  try {
    const matchedLocale = match(mapLanguages, locales, fallbackLocale)
    return matchedLocale
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình khớp, vẫn trả về 'en'
    return fallbackLocale
  }
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Cho qua các file tĩnh
  const isPublicFile = pathname.includes('.')
  if (isPublicFile) return NextResponse.next()

  // 2. Kiểm tra xem URL đã có mã ngôn ngữ chưa
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 3. Nếu thiếu ngôn ngữ trên URL, thực hiện tự động điều hướng
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
      request.url
    )

    // Giữ nguyên các tham số tìm kiếm (query strings)
    redirectUrl.search = request.nextUrl.search

    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}