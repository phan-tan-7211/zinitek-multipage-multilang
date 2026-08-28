# AGENTS.md — ZINITEK AI Working Rules

This file is the repository-level instruction router for AI coding agents.

> Scope: the entire repository unless a deeper `AGENTS.md` overrides a rule for a subdirectory.

## 1. Repository Context

ZINITEK is a multi-page, multilingual industrial website built with:

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Sanity.io Headless CMS
- 5 locales: `vi`, `en`, `jp`, `kr`, `cn`
- Dynamic content for services, products, portfolio/projects, blog and legal content

Primary route structure:

```text
/[lang]
/[lang]/about
/[lang]/services
/[lang]/services/[slug]
/[lang]/products
/[lang]/products/[slug]
/[lang]/portfolio
/[lang]/portfolio/[slug]
/[lang]/blog
/[lang]/blog/[slug]
/[lang]/contact
/[lang]/policy/[slug]
/studio
/api/*
```

## 2. Instruction Priority

When instructions conflict, use this order:

1. User's explicit request
2. Repository-level `AGENTS.md`
3. Relevant project/local skill under `.agents/skills/`
4. Existing root `SKILL.md` for already-implemented ZINITEK UX interaction patterns
5. General external skill guidance
6. Agent defaults

Do not silently override project architecture with generic advice from an external skill.

## 3. Skill Routing Policy

Before changing code, determine whether one or more skills apply.

### `zinitek-project`

Use `.agents/skills/zinitek-project/SKILL.md` for any task that touches this repository's architecture, i18n, Sanity, SEO, routing, content ownership or project conventions.

This is the default project skill and should normally be considered first.

### `seo-nextjs`

Use `.agents/skills/seo-nextjs/SKILL.md` whenever a task touches:

- metadata / `generateMetadata`
- canonical URLs
- hreflang / localized alternates
- JSON-LD / structured data
- sitemap / robots
- crawlability / indexability
- semantic HTML for SEO
- image alt behavior
- Core Web Vitals / SEO performance
- SEO audits

For ZINITEK, current Next.js 16 App Router native APIs are authoritative. External repositories such as `next-seo`, `next-sitemap`, SEO checklist collections, Precedent and Next Enterprise are references only unless the user explicitly asks to add a dependency.

Do not vendor `next.js-canary`, `gpt-crawler` or `chatbot-main` into the production website merely because they are available as reference folders.

### `superpowers`

Use for disciplined engineering workflow such as:

- planning non-trivial changes
- debugging
- root-cause analysis
- implementation sequencing
- verification before completion
- refactoring with safeguards

Project rules in this file and `zinitek-project` remain authoritative when generic workflow guidance conflicts with ZINITEK architecture.

### `ui-ux-pro-max`

Use for:

- new UI design
- redesigns
- responsive layout
- typography
- spacing
- colors
- accessibility
- navigation behavior
- animation and interaction
- visual hierarchy
- mobile/desktop UX review

Do not redesign a page from intuition alone when this skill is available.

Also inspect the existing root `SKILL.md` before changing interaction patterns already implemented in ZINITEK, especially horizontal drag-scroll, swipe zones and filter bars.

### Anthropic `frontend-design`

Use together with `ui-ux-pro-max` for substantial page/component creation or visual redesign.

It may propose visual direction, but must preserve ZINITEK's established industrial identity and project constraints unless the user explicitly requests a new direction.

### Anthropic `webapp-testing`

Use after meaningful UI, navigation, form or interaction changes when browser verification is possible.

Verify behavior instead of relying only on code inspection.

### `last30days`

Use only when current external information is materially needed, for example:

- recent UI/UX patterns
- current ecosystem changes
- recent Next.js/Sanity discussions
- recently changed tooling or best practices
- fresh competitive/research context

Do not use it for stable facts already present in this repository.

## 4. ZINITEK Architecture Rules

### Next.js

- Preserve App Router architecture.
- Preserve async Next.js 16 params patterns such as `await params` where required.
- Prefer Server Components unless client interactivity is actually needed.
- Do not add `"use client"` to large page trees without a concrete reason.

### i18n

Supported locales are exactly:

```text
vi, en, jp, kr, cn
```

- Preserve `/[lang]/...` routing.
- Static UI text belongs in `dictionaries/*.json` unless there is a documented reason otherwise.
- Dynamic business content should come from Sanity.
- Do not create duplicated hard-coded translations inside components when a dictionary/CMS field already owns that content.

### Smart fallback

For translated Sanity content, preserve the intended priority:

```text
requested language -> en -> vi
```

If fallback behavior must change, inspect all affected list/detail/navigation queries before editing.

### Translation relationships

- Preserve `_translationKey` relationships.
- Do not break Sanity translation metadata or strong references.
- Do not assume translated documents have identical slugs.
- Language switching, canonical URLs and hreflang must use the corresponding translated slug where available.

### Sanity

- Treat Sanity as the source of truth for dynamic content.
- Inspect relevant schema before changing frontend assumptions.
- Avoid adding frontend fields that cannot be managed from Studio when the content is intended for admins.
- Preserve import/export compatibility unless the user explicitly accepts a breaking migration.

## 5. SEO Rules

For SEO work, read `.agents/skills/seo-nextjs/SKILL.md` before editing.

When modifying routes or content pages, consider:

- page metadata
- canonical URL
- hreflang / language alternates
- Open Graph
- Twitter metadata
- JSON-LD where applicable
- sitemap coverage
- robots behavior
- semantic HTML
- crawl/index intent
- Core Web Vitals impact

Never generate hreflang links by reusing one locale's slug when translated slugs differ.

Do not install or migrate to `next-seo` / `next-sitemap` by default: ZINITEK already uses Next.js native Metadata API, `app/sitemap.ts` and `app/robots.ts`.

## 6. UI/UX Rules

Preserve the established ZINITEK industrial high-tech identity unless the user asks for a redesign.

Current visual direction includes:

- technical / industrial visual language
- dark-mode-first presentation
- strong orange accent around `#f97316`
- precise spacing and dense technical information where appropriate
- responsive mobile-first behavior

Requirements for UI changes:

- no unintended horizontal page overflow
- usable keyboard focus states
- sufficient contrast
- touch targets appropriate for mobile
- respect `prefers-reduced-motion` for non-essential motion
- avoid excessive animation that harms clarity or performance
- test narrow mobile layouts and large desktop layouts

Before changing existing swipe, carousel or horizontal filter behavior, read the root `SKILL.md`.

## 7. Content Rules

- Do not invent manufacturing capabilities, certifications, machine specifications, customer names or technical claims.
- Do not present old notes as current implementation facts.
- `DEVELOPMENT_NOTES_ARCHIVE.md` is historical/archive material and is not a source of truth for current behavior.
- Verify current behavior from source code and Sanity schemas/queries.

## 8. Change Discipline

For non-trivial changes:

1. Inspect the relevant files first.
2. Identify source of truth: code, dictionary or Sanity.
3. Check related routes/components before editing shared behavior.
4. Make the smallest coherent change that solves the request.
5. Avoid unrelated cleanup in the same change unless necessary.
6. Verify changed behavior.

Do not rewrite working subsystems merely because a generic skill proposes a different architecture.

## 9. Verification

After code changes, run the applicable checks when the environment allows:

```bash
npm run lint
npm run build
```

For interaction/UI changes, also verify the actual rendered behavior when browser tooling is available.

For SEO changes, verify generated metadata, canonical/hreflang URLs, JSON-LD and sitemap output when tooling allows.

A task is not complete merely because TypeScript code looks plausible.

## 10. External Skills Location

Repository-scoped external skills should live under:

```text
.agents/skills/<skill-name>/SKILL.md
```

Examples:

```text
.agents/skills/zinitek-project/SKILL.md
.agents/skills/seo-nextjs/SKILL.md
.agents/skills/ui-ux-pro-max/SKILL.md
.agents/skills/last30days/SKILL.md
.agents/skills/superpowers/...
.agents/skills/anthropic/frontend-design/SKILL.md
.agents/skills/anthropic/webapp-testing/SKILL.md
```

Do not paste entire external skill specifications into `AGENTS.md`. This file should route and prioritize them, while each skill keeps its own detailed instructions.
