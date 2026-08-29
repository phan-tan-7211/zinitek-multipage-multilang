import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { PortableText } from "@portabletext/react"
import { ArrowRight, Calendar, ChevronRight, Home, Tag, User } from "lucide-react"
import Link from "next/link"
import { SanityImage } from "@/components/sanity-image"
import { Footer } from "@/components/footer"

const sanityClient = createClient({
  projectId: "g4o3uumy",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function layChiTietDuAn(slug: string, lang: string) {
  const source = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id,
      _translationKey
    }`,
    { slug }
  )

  if (!source) return null

  const query = source._translationKey
    ? `coalesce(
        *[_type == "project" && _translationKey == $translationKey && language == $lang && !(_id in path("drafts.**"))][0],
        *[_type == "project" && _translationKey == $translationKey && language == "en" && !(_id in path("drafts.**"))][0],
        *[_type == "project" && _translationKey == $translationKey && language == "vi" && !(_id in path("drafts.**"))][0],
        *[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]
      ) {
        _id,
        _translationKey,
        title,
        client,
        projectYear,
        description,
        content,
        language,
        "slug": slug.current,
        "image": mainImage.asset->{ _id, url },
        "gallery": coalesce(gallery[].asset->{ _id, url }, []),
        "serviceCategory": serviceCategory->{
          _id,
          _translationKey,
          title,
          "slug": slug.current
        },
        "translations": *[_type == "project" && _translationKey == ^._translationKey && defined(slug.current) && !(_id in path("drafts.**"))] {
          language,
          "slug": slug.current
        }
      }`
    : `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        _id,
        title,
        client,
        projectYear,
        description,
        content,
        language,
        "slug": slug.current,
        "image": mainImage.asset->{ _id, url },
        "gallery": coalesce(gallery[].asset->{ _id, url }, []),
        "serviceCategory": serviceCategory->{
          _id,
          _translationKey,
          title,
          "slug": slug.current
        },
        "translations": []
      }`

  const project = await sanityClient.fetch(query, {
    slug,
    lang,
    translationKey: source._translationKey || "",
  })

  if (!project) return null

  if (project.serviceCategory?._translationKey) {
    const localizedCategory = await sanityClient.fetch(
      `coalesce(
        *[_type == "service" && _translationKey == $key && language == $lang && !(_id in path("drafts.**"))][0],
        *[_type == "service" && _translationKey == $key && language == "en" && !(_id in path("drafts.**"))][0],
        *[_type == "service" && _translationKey == $key && language == "vi" && !(_id in path("drafts.**"))][0]
      ) { title, "slug": slug.current }`,
      { key: project.serviceCategory._translationKey, lang }
    )
    if (localizedCategory) project.serviceCategory = localizedCategory
  }

  return {
    ...project,
    title: typeof project.title === "string" ? project.title : "ZINITEK Project",
    description: typeof project.description === "string" ? project.description : "",
    gallery: Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [],
    translations: Array.isArray(project.translations) ? project.translations : [],
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const project = await layChiTietDuAn(slug, lang)
  if (!project) return { title: "Dự án không tồn tại | ZINITEK" }

  const translations = Object.fromEntries(
    project.translations.map((item: any) => [item.language, `/${item.language}/portfolio/${item.slug}`])
  )

  return {
    title: `${project.title} | ZINITEK`,
    description: project.description,
    alternates: {
      canonical: `/${lang}/portfolio/${project.slug || slug}`,
      languages: {
        ...(translations.vi ? { "vi-VN": translations.vi } : {}),
        ...(translations.en ? { "en-US": translations.en } : {}),
        ...(translations.jp ? { "ja-JP": translations.jp } : {}),
        ...(translations.kr ? { "ko-KR": translations.kr } : {}),
        ...(translations.cn ? { "zh-CN": translations.cn } : {}),
      },
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/${lang}/portfolio/${project.slug || slug}`,
      siteName: "ZINITEK",
      images: project.image?.url ? [{ url: project.image.url }] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const [dict, project] = await Promise.all([
    getDictionary(lang),
    layChiTietDuAn(slug, lang),
  ])

  if (!project) notFound()

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-background pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.025] via-transparent to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-35 dark:opacity-55" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="mb-7 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:mb-8"
            aria-label="Breadcrumb"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Home className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Link
                href={`/${lang}`}
                className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {dict.common?.home || "Trang chủ"}
              </Link>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <Link
                href={`/${lang}/portfolio`}
                className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {dict.navigation?.projects || dict.portfolio?.title || "Dự án"}
              </Link>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span
                className="max-w-[70vw] truncate font-medium text-primary"
                aria-current="page"
                title={project.title}
              >
                {project.title}
              </span>
            </div>
          </nav>

          <div className="max-w-4xl">
            {project.serviceCategory?.title && (
              <div className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Tag className="size-4" aria-hidden="true" />
                {project.serviceCategory.title}
              </div>
            )}
            <h1 className="text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-6 max-w-[68ch] border-l-2 border-primary pl-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <div
          className="pointer-events-none absolute left-8 top-32 hidden size-24 border-l border-t border-primary/20 lg:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-8 right-8 hidden size-24 border-b border-r border-border/70 lg:block"
          aria-hidden="true"
        />
      </section>

      <section className="section-space">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <article className="lg:col-span-8">
              <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] border border-border/60 bg-card shadow-card">
                <SanityImage imageData={project.image} alt={project.title} width={1200} height={800} className="h-full w-full object-cover" />
              </div>

              {project.content && (
                <div className="prose prose-slate mt-10 max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-primary prose-strong:text-foreground">
                  <PortableText value={project.content} />
                </div>
              )}

              {project.gallery.length > 0 && (
                <div className="mt-14 border-t border-border/50 pt-10">
                  <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                    {dict.portfolio?.gallery_title || "Hình ảnh thực tế"}
                  </h2>
                  <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {project.gallery.map((image: any, index: number) => (
                      <div key={image._id || index} className="group relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all lg:hover:-translate-y-1 lg:hover:border-primary/35 lg:hover:shadow-card">
                        <SanityImage imageData={image} alt={`${project.title} ${index + 1}`} width={500} height={500} className="h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-110" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 border-t border-border/50 pt-8">
                <Link href={`/${lang}/portfolio`} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-primary/35 px-5 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hover:scale-[1.03]">
                  {dict.featured_projects?.view_all || "Xem tất cả dự án"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-32">
                <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border/60 bg-card p-6 shadow-card sm:p-7">
                  <div className="pointer-events-none absolute right-0 top-0 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
                  <h2 className="relative border-b border-border/50 pb-4 font-serif text-xl font-bold text-foreground">
                    {dict.portfolio?.project_info || "Thông tin dự án"}
                  </h2>

                  <dl className="relative mt-6 space-y-6">
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        <User className="size-4" aria-hidden="true" />
                        {dict.portfolio?.client_label || "Khách hàng"}
                      </dt>
                      <dd className="mt-2 text-lg font-bold text-foreground">{project.client || "ZINITEK Partner"}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        <Calendar className="size-4" aria-hidden="true" />
                        {dict.portfolio?.year_label || "Năm thực hiện"}
                      </dt>
                      <dd className="mt-2 text-lg font-bold text-foreground">{project.projectYear || "—"}</dd>
                    </div>
                    {project.serviceCategory?.title && project.serviceCategory?.slug && (
                      <div>
                        <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          <Tag className="size-4" aria-hidden="true" />
                          {dict.portfolio?.service_label || "Dịch vụ"}
                        </dt>
                        <dd className="mt-2">
                          <Link href={`/${lang}/services/${project.serviceCategory.slug}`} className="inline-flex min-h-11 items-center gap-1 text-lg font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {project.serviceCategory.title}
                            <ChevronRight className="size-4 transition-transform lg:group-hover:translate-x-1" aria-hidden="true" />
                          </Link>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <Link href={`/${lang}/contact`} className="relative mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hover:scale-[1.03]">
                    {dict.common?.contact_btn || "Liên hệ tư vấn"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}
