import { Cog } from "lucide-react"
import { getSiteName } from "@/lib/site-settings"

export default async function Loading() {
  const siteName = await getSiteName()

  return (
    <div className="fixed inset-0 z-[1000000] flex min-h-dvh flex-col items-center justify-center bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 h-[3px] overflow-hidden bg-primary/10" aria-hidden="true">
        <div className="h-full bg-primary shadow-brand animate-progress-fast" />
      </div>

      <div className="relative" aria-hidden="true">
        <div className="size-24 rounded-full border-4 border-transparent border-t-primary border-b-primary/15 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cog className="size-10 text-primary animate-spin-slow" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2" role="status" aria-live="polite">
        <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">{siteName}</span>
        <span className="sr-only">Loading</span>
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden="true" />
      </div>
    </div>
  )
}
