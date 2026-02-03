import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./lib/i18n-config"

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. CHẶN TUYỆT ĐỐI: Nếu là file tĩnh trong thư mục public thì cho qua ngay
  // Kiểm tra nếu pathname có đuôi file (có dấu chấm)
  const isPublicFile = pathname.includes('.')
  if (isPublicFile) return NextResponse.next()

  // 2. Kiểm tra ngôn ngữ
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 3. Chuyển hướng nếu thiếu locale
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

export const config = {
  // Loại trừ các thư mục hệ thống của Next.js
  matcher: ["/((?!api|_next/static|_next/image|icon-light.svg|icon-dark.svg|grid.svg|.*\\..*).*)"],
}