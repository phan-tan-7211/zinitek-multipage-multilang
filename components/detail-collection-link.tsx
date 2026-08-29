import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DetailCollectionLinkProps {
  href: string
  label: string
  className?: string
}

export function DetailCollectionLink({ href, label, className }: DetailCollectionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-12 w-fit items-center gap-2 rounded-xl border border-primary/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hover:scale-[1.02]",
        className,
      )}
    >
      {label}
      <ArrowRight
        className="size-4 transition-transform lg:group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  )
}
