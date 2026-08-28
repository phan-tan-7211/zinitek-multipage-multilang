# SEO Next.js Skill — ZINITEK

## Purpose

Use this skill for SEO architecture, metadata, canonical/hreflang, structured data, sitemap, robots, semantic HTML, crawl/index behavior, Core Web Vitals and SEO audits in the ZINITEK repository.

This skill is guidance for AI coding agents. It is NOT permission to install external SEO libraries automatically.

## Authority Order

For this repository, prefer sources in this order:

1. Current ZINITEK source code and `AGENTS.md`
2. Current Next.js 16 App Router APIs and official Next.js documentation
3. Google Search documentation / Schema.org requirements where applicable
4. External reference repositories listed in `REFERENCES.md`
5. Generic SEO checklists

If an external repository conflicts with current Next.js 16 App Router behavior, follow current Next.js.

## ZINITEK SEO Architecture

ZINITEK already uses native Next.js App Router SEO primitives:

- `generateMetadata()` / `metadata`
- `app/sitemap.ts`
- `app/robots.ts`
- JSON-LD scripts on relevant pages
- localized routes under `/[lang]/...`

Do not add `next-seo` or `next-sitemap` as dependencies merely because those repositories contain useful SEO patterns.

## Mandatory Rules

### Metadata

- Prefer Next.js Metadata API.
- Do not introduce legacy `next/head` patterns in App Router pages.
- Every indexable public page should have a meaningful title and description.
- Use `metadataBase` consistently for absolute URL generation.
- Add Open Graph and Twitter metadata when the page is intended for public sharing.

### Canonical and hreflang

- Every indexable localized page should have a canonical URL.
- Use language alternates for localized equivalents.
- ZINITEK locales are `vi`, `en`, `jp`, `kr`, `cn`.
- Never assume translated dynamic documents share the same slug.
- Resolve localized slugs from Sanity translation relationships / `_translationKey` before producing hreflang URLs.
- Do not fabricate a translated URL if that translation does not exist.

### Structured data

Use JSON-LD only when the page content actually supports the schema.

Typical mappings:

- Home/company: `Organization` / `WebSite`
- Service detail: `Service`
- Product detail: `Product` only when actual product fields support it
- Blog post: `Article` / `BlogPosting`
- Breadcrumb navigation: `BreadcrumbList`
- Lists: `ItemList` when appropriate

Never invent ratings, prices, reviews, certifications, availability, addresses or other fields solely to obtain rich results.

### Sitemap

ZINITEK uses native `app/sitemap.ts`.

- Include public static routes.
- Include published Sanity dynamic routes.
- Exclude drafts and private/admin/API routes.
- Use each document's real locale and real slug.
- Prefer real `_updatedAt` for dynamic content.
- For alternate languages, resolve translation groups instead of reusing one slug for all locales.
- Do not replace the native sitemap with `next-sitemap` unless there is a concrete requirement that the native MetadataRoute cannot satisfy.

### Robots

ZINITEK uses native `app/robots.ts`.

- Keep `/studio/`, `/api/` and internal framework paths out of crawl scope where appropriate.
- Do not use robots.txt as a substitute for `noindex` when removal from search results is required.
- Ensure sitemap URL matches `NEXT_PUBLIC_SITE_URL` / production canonical host.

### Images

- Prefer `next/image` for normal content images where compatible with Sanity/image configuration.
- Require meaningful `alt` text for informative images.
- Decorative images should use empty alt rather than keyword stuffing.
- Do not write fake SEO-heavy alt text unrelated to the image.

### Semantic HTML and accessibility

- One clear page-level `h1` in normal content pages unless there is a justified semantic exception.
- Maintain logical heading order.
- Prefer `main`, `nav`, `section`, `article`, `header`, `footer` where semantically correct.
- Links must remain links; buttons must remain actions.
- SEO changes must not reduce accessibility.

### Performance / Core Web Vitals

- Avoid adding client JavaScript for SEO-only behavior.
- Prefer Server Components for static/public content.
- Avoid layout shifts from images, fonts and dynamic components.
- Preserve optimized font/image loading patterns.
- Do not add large SEO dependencies when native APIs already solve the task.

## SEO Audit Workflow

When asked to audit a route/page:

1. Inspect the actual page/layout and data source.
2. Check title and description.
3. Check canonical.
4. Check localized alternates and translated slug mapping.
5. Check Open Graph/Twitter metadata.
6. Check indexability and robots behavior.
7. Check sitemap inclusion.
8. Check JSON-LD correctness against visible/source content.
9. Check semantic HTML and image alt behavior.
10. Check obvious performance/Core Web Vitals risks.
11. Report confirmed issues separately from optional improvements.

Do not promise `100/100 Lighthouse` or ranking outcomes. SEO and Lighthouse scores depend on runtime content, deployment, network and external factors.

## External Repository Use Policy

External SEO repositories are references, not automatic dependencies.

Use them as follows:

- `next-seo`: reference for structured-data coverage and SEO API ideas; current Next.js Metadata API remains primary.
- `next-sitemap`: reference for sitemap/indexing edge cases; native `app/sitemap.ts` remains primary.
- SEO checklist repositories: audit/checklist references only.
- `precedent`: reference for performance, `next/font`, OG image and App Router patterns; do not copy obsolete package/config versions.
- `next-enterprise`: reference for scalable Next.js project organization and production conventions where compatible.
- `next.js-canary`: upstream framework source/reference only; never vendor or merge it into ZINITEK.
- `gpt-crawler`: optional external research/crawling tool; never bundle into ZINITEK runtime unless explicitly requested.
- `chatbot-main`: unrelated to baseline SEO; use only if ZINITEK later adds a chatbot/AI search feature.

## Completion Criteria

Before declaring an SEO change complete:

- verify generated URLs are valid for all affected locales;
- confirm no translated slug assumptions were introduced;
- run `npm run lint` and `npm run build` when possible;
- verify rendered metadata/JSON-LD when browser tooling is available.
