---
name: zinitek-project
description: Project-specific rules for working safely on the ZINITEK Next.js 16 multilingual Sanity website. Use for architecture, i18n, Sanity, routing, SEO, content ownership, translated slugs, project UX conventions, or any code change in this repository.
---

# ZINITEK Project Skill

Use this skill whenever a task modifies or analyzes the ZINITEK repository.

## Purpose

This skill protects project-specific architecture from generic AI refactors and provides a compact checklist for safe changes.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Sanity.io
- `next-sanity`
- 5 languages: `vi`, `en`, `jp`, `kr`, `cn`

## Sources of Truth

Choose the source of truth before editing:

| Content / behavior | Source of truth |
|---|---|
| Static labels, buttons, navigation text | `dictionaries/*.json` where applicable |
| Services | Sanity `service` documents/schema |
| Products | Sanity `product` documents/schema |
| Portfolio/projects | Sanity `project` documents/schema |
| Blog | Sanity `post` documents/schema |
| Legal content | Sanity `legalDoc` documents/schema |
| Translation relationships | `_translationKey` / translation metadata |
| Routes | `app/[lang]/...` |
| Existing advanced swipe/filter UX | root `SKILL.md` + implementation files |
| Historical development notes | NOT authoritative: `DEVELOPMENT_NOTES_ARCHIVE.md` |

## i18n Rules

Supported locales:

```ts
["vi", "en", "jp", "kr", "cn"]
```

Preserve locale-prefixed URLs:

```text
/{lang}/...
```

### Static dictionary fallback

`getDictionary()` may fall back to Vietnamese for unsupported/missing dictionary loading.

Do not confuse dictionary fallback with dynamic Sanity content fallback.

### Dynamic Sanity fallback

For translated dynamic content, intended priority is:

```text
requested locale
  -> English (`en`)
  -> Vietnamese (`vi`)
```

When touching list/detail queries, inspect whether fallback behavior is duplicated in several files before changing it.

## Translation and Slug Rules

Translated Sanity documents are related through `_translationKey` / translation metadata.

Never assume:

```text
vi slug == en slug == jp slug == kr slug == cn slug
```

When implementing language switching, metadata alternates, hreflang, sitemap entries or related links:

1. Resolve the translation group.
2. Find the document for the target language.
3. Use that document's actual slug.
4. Only use fallback content intentionally.

Do not construct alternate-language URLs by simply replacing the language segment while keeping the original slug unless source data proves slugs are shared.

## Sanity Rules

Before modifying CMS-driven frontend behavior:

1. Read the corresponding Sanity schema.
2. Read the GROQ query that fetches the data.
3. Check the Import/Export tool if the field participates in bulk data workflows.
4. Check translation metadata relationships if documents are multilingual.

Do not introduce a frontend-only dynamic content field when admins need to maintain it in Sanity.

Preserve existing document internationalization compatibility and strong references.

## Server vs Client Components

Prefer Server Components for data fetching and static rendering.

Use Client Components only for actual browser-side interaction such as:

- filters
- drag/swipe
- forms
- interactive menus
- theme controls
- carousel interaction

Avoid promoting an entire page to a Client Component just to support a small interactive child.

## SEO Checklist

For route/content changes check:

- `generateMetadata`
- canonical URL
- language alternates / hreflang
- translated slug correctness
- Open Graph
- Twitter metadata
- JSON-LD
- sitemap
- robots

For dynamic content, metadata should reflect the actual content document returned for that locale/fallback.

## UI/UX Checklist

For visual changes, also use `ui-ux-pro-max` and/or Anthropic `frontend-design` when installed.

Preserve project identity unless user asks otherwise:

- industrial / precision engineering tone
- dark technical surfaces
- orange highlight around `#f97316`
- clear information hierarchy
- strong mobile usability

Before changing these patterns, read the root `SKILL.md`:

- mouse drag horizontal scroll
- zone-aware swipe handling
- `data-swipe-zone="horizontal"`
- horizontal filter bars
- carousel/swipe conflict prevention

Do not break nested horizontal interactions by adding a global swipe handler without zone detection.

## Responsive Requirements

At minimum, reason about:

- narrow mobile (~375 px)
- tablet/intermediate width
- desktop (~1440 px)

Check:

- horizontal overflow
- fixed/sticky header collisions
- long Vietnamese/English/Korean/Japanese/Chinese labels
- touch targets
- carousel/filter interaction
- text wrapping

## Content Integrity

Do not invent or embellish:

- machine models
- tolerances
- certifications
- customer relationships
- manufacturing capacity
- technical specifications
- project results

If a requested claim is not in the code/CMS/source provided by the user, flag it instead of fabricating it.

## Safe Change Workflow

For a non-trivial task:

1. Identify affected route(s).
2. Inspect page + shared components.
3. Inspect dictionaries and/or Sanity schema/query.
4. Check translation/slug implications.
5. Check SEO implications.
6. Check mobile interaction implications.
7. Implement the smallest coherent change.
8. Run lint/build when possible.
9. Verify rendered interaction when possible.

## External Skills Cooperation

This project skill defines project constraints. External skills provide specialist methods.

Recommended routing:

- engineering workflow/debugging -> `superpowers`
- UI/UX -> `ui-ux-pro-max`
- visual page creation -> Anthropic `frontend-design`
- browser verification -> Anthropic `webapp-testing`
- recent external research -> `last30days`

If an external skill conflicts with this project's architecture, preserve the project constraints unless the user explicitly requests an architectural change.
