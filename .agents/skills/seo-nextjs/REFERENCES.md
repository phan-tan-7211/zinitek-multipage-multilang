# SEO Reference Repositories

These repositories/folders may be used as reference material by AI agents. They are not automatically installed dependencies.

| Source | Use in ZINITEK | Decision |
|---|---|---|
| `next-seo-main` | Structured data patterns, SEO API ideas, App Router examples | Reference only |
| `next-sitemap-master` | Sitemap/indexing edge cases | Reference only; keep native `app/sitemap.ts` |
| `seo-checklist-master` | Technical/on-page SEO audit checklist | Adopt as checklist concepts |
| `search-engine-optimization-main` | General SEO audit/reference | Adopt selectively |
| `SEO-Checklist-for-Web-Designers-master` | Designer-facing SEO/accessibility/content checklist | Adopt selectively |
| duplicate `seo-checklist-master` | Duplicate source | Do not duplicate |
| `precedent-main` | `next/font`, OG images, performance/UI conventions | Reference selectively |
| `next-enterprise-main` | Production project structure and engineering conventions | Reference selectively |
| `next.js-canary` | Current/upstream Next.js implementation and examples | Framework reference only; never vendor into project |
| `gpt-crawler-main` | Crawling external sites/docs into AI knowledge | Optional separate tool; not runtime SEO |
| `chatbot-main` | AI/chat features | Not baseline SEO; ignore unless chatbot feature is requested |

## Core principle

ZINITEK runs Next.js 16 App Router. Prefer native framework capabilities first:

- Metadata API
- `generateMetadata`
- `app/sitemap.ts`
- `app/robots.ts`
- file-based metadata where appropriate
- Server Components

External repositories are used to improve reasoning, audits and implementation quality, not to force unnecessary dependencies or older architecture into this repository.
