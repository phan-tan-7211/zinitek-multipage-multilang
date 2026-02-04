import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./lib/i18n-config"

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Cho qua các file tĩnh (ảnh, icon, font, hoặc file có dấu chấm)
  const isPublicFile = pathname.includes('.')
  if (isPublicFile) return NextResponse.next()

  // 2. Kiểm tra xem URL đã có mã ngôn ngữ chưa
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 3. Chuyển hướng nếu thiếu mã ngôn ngữ (mặc định về /vi)
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    )
  }
}

// KHỐI CONFIG DUY NHẤT - KHÔNG ĐƯỢC LẶP LẠI
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}