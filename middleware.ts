import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./lib/i18n-config"

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Kiểm tra xem đường dẫn có thiếu ngôn ngữ không
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Nếu thiếu ngôn ngữ, tự động chuyển hướng sang ngôn ngữ mặc định (vi)
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
  // Loại trừ các file hệ thống và tài nguyên tĩnh
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|.*\\.png|.*\\.jpg|.*\\.woff2).*)"],
}