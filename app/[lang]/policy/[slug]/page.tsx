import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { PortableText } from "@portabletext/react"
import { Clock, ShieldCheck } from "lucide-react"
import { NutQuayLai } from "@/components/nut-quay-lai"
import { Footer } from "@/components/footer"

const sanityClient = createClient({ projectId: "g4o3uumy", dataset: "production", apiVersion: "2024-01-01", useCdn: false })

async function getLegalDoc(slug: string, lang: string) {
  return sanityClient.fetch(`*[_type == "legalDoc" && (slug.current == $slug || slug.current == ($lang + "/" + $slug)) && language == $lang && !(_id in path("drafts.**"))][0]{_id,title,content,lastUpdated,language,"slug":slug.current}`, { slug, lang })
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const doc = await getLegalDoc(slug, lang)
  if (!doc) return { title: "Policy | ZINITEK" }
  const cleanSlug = String(doc.slug || slug).split("/").pop()
  return {
    title: `${doc.title} | ZINITEK`,
    alternates: { canonical: `/${lang}/policy/${cleanSlug}` },
    openGraph: { title: doc.title, url: `/${lang}/policy/${cleanSlug}`, siteName: "ZINITEK", type: "article" },
  }
}

export default async function PolicyPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const [dict, doc] = await Promise.all([getDictionary(lang), getLegalDoc(slug, lang)])
  if (!doc) notFound()

  const locale = lang === "vi" ? "vi-VN" : lang === "jp" ? "ja-JP" : lang === "kr" ? "ko-KR" : lang === "cn" ? "zh-CN" : "en-US"
  const updated = doc.lastUpdated ? new Date(doc.lastUpdated).toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" }) : null

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="container mx-auto px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <NutQuayLai nhanHienThi={dict.common?.back || (lang === "vi" ? "Quay lại" : "Back")} ngonNgu={lang} />

        <article className="mx-auto mt-10 max-w-4xl">
          <header className="mb-8 sm:mb-10">
            <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {dict.footer?.legal_document || "Legal document"}
            </div>
            <h1 className="mt-5 text-balance font-serif text-4xl font-bold leading-tight sm:text-5xl">{doc.title}</h1>
            {updated && <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4 text-primary" aria-hidden="true" />{dict.footer?.last_updated || "Last updated"}: {updated}</div>}
          </header>

          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-8 lg:p-10">
            <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-primary prose-p:leading-8">
              <PortableText value={Array.isArray(doc.content) ? doc.content : []} />
            </div>
          </div>
        </article>
      </div>
      <Footer lang={lang} dict={dict} />
    </main>
  )
}
