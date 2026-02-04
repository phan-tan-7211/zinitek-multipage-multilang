import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Giả định i18n config của bạn: { locales: ['vi', 'en', 'jp', 'kr', 'cn'], defaultLocale: 'vi' }
import { i18n } from "./lib/i18n-config"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// Hàm lấy ngôn ngữ phù hợp nhất
function getLocale(request: NextRequest): string {
  // 1. Ưu tiên Cookie (do người dùng chọn)
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale
  }

  // 2. Đọc từ Header trình duyệt
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  // Chuyển đổi mã trình duyệt sang mã file dự án
  const mapLanguages = languages.map(lang => {
    const base = lang.split('-')[0].toLowerCase()
    if (base === 'ja') return 'jp'
    if (base === 'ko') return 'kr'
    if (base === 'zh') return 'cn'
    return base
  })

  // Fallback về 'en' nếu không khớp
  const fallbackLocale = "en" 

  try {
    return match(mapLanguages, locales, fallbackLocale)
  } catch (error) {
    return fallbackLocale
  }
}

// SỬA QUAN TRỌNG: Đổi 'export default' thành 'export function middleware' 
// để đúng chuẩn Next.js mới và tránh lỗi Turbopack
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Loại bỏ các tệp tĩnh và hệ thống nhanh chóng
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    [
      '/favicon.ico', '/icon-light.svg', '/icon-dark.svg', 
      '/manifest.json', '/og-image.jpg', '/robot.txt'
    ].includes(pathname)
  ) {
    return NextResponse.next()
  }

  // 2. Kiểm tra mã ngôn ngữ trên URL
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 3. Điều hướng nếu thiếu locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // Xử lý chuẩn URL tránh bị double slash (//)
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
      request.url
    )

    // Giữ nguyên query strings (?search=...)
    redirectUrl.search = request.nextUrl.search

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// SỬA QUAN TRỌNG: Matcher tối ưu để dập cảnh báo "middleware deprecated"
export const config = {
  // Matcher loại trừ tất cả các file tĩnh có đuôi mở rộng và thư mục nội bộ
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)",
  ],
}