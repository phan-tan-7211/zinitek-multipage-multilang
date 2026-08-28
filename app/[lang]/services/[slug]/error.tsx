"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function ServiceDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Service detail runtime error:", error)
  }, [error])

  return (
    <main className="min-h-dvh bg-background px-4 pt-36 text-foreground">
      <div className="mx-auto max-w-2xl rounded-2xl border border-destructive/30 bg-card p-6 shadow-card md:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="font-serif text-2xl font-bold md:text-3xl">
          Lỗi trang chi tiết dịch vụ
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Trang đã bắt được lỗi runtime. Vui lòng gửi nội dung trong khung bên dưới để xác định chính xác nguyên nhân.
        </p>

        <pre className="mt-5 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-muted/50 p-4 text-xs leading-relaxed text-foreground">
          {error?.message || "Unknown client-side error"}
          {error?.digest ? `\nDigest: ${error.digest}` : ""}
        </pre>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Thử tải lại
          </button>
          <Link
            href="/vi/services"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Về trang Dịch vụ
          </Link>
        </div>
      </div>
    </main>
  )
}
