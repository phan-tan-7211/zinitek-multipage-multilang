import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./lib/i18n-config"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// --- KHÔNG ĐỔI HÀM getLocale ---
function getLocale(request: NextRequest): string {
  // ... (giữ nguyên code cũ của bạn bên trong hàm này)
  return "vi" // ví dụ trả về
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. CHẶN ĐỨNG FILE TĨNH & STUDIO NGAY LẬP TỨC
  // Nếu thấy dấu chấm (file) hoặc bắt đầu bằng /studio, thoát ngay không chạy bất kỳ logic nào bên dưới
  if (
    pathname.includes('.') || 
    pathname.startsWith('/studio') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // 2. CHỈ KHI QUA ĐƯỢC BƯỚC 1 MỚI CHẠY LOGIC ĐA NGÔN NGỮ
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    const redirectUrl = new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    redirectUrl.search = request.nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|studio|.*\\..*).*)"],
}