# Repository AI Skills

This directory contains repository-scoped AI skills used when working on ZINITEK.

## Installed skills

```text
.agents/skills/
├─ README.md
├─ zinitek-project/
│  └─ SKILL.md
├─ seo-nextjs/
│  ├─ SKILL.md
│  └─ REFERENCES.md
├─ ui-ux-pro-max/
│  └─ SKILL.md
├─ last30days/
│  └─ SKILL.md
├─ superpowers/
│  └─ SKILL.md
└─ anthropic/
   ├─ frontend-design/
   │  └─ SKILL.md
   └─ webapp-testing/
      └─ SKILL.md
```

## Purpose

### `zinitek-project`

Primary repository skill. Contains ZINITEK architecture, i18n, Sanity, routing, SEO and content-ownership constraints.

### `seo-nextjs`

Technical SEO rules for the current Next.js 16 App Router architecture. Native Next.js Metadata API, `app/sitemap.ts` and `app/robots.ts` remain preferred over unnecessary SEO dependencies.

### `ui-ux-pro-max`

UI/UX review and design discipline adapted from:

- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Use for accessibility, responsive layout, interaction, typography, visual hierarchy, motion and UI quality.

### `last30days`

Recent-research decision rules adapted from:

- https://github.com/mvanhorn/last30days-skill

Use only when fresh external information materially affects the task. The upstream research engine/scripts are not website runtime dependencies and are not vendored here.

### `superpowers`

Engineering workflow discipline adapted from:

- https://github.com/obra/superpowers

Covers planning, systematic debugging, verification, testing discipline and code-review reasoning appropriate to this repo.

### `anthropic/frontend-design`

Distinctive frontend design principles adapted from:

- https://github.com/anthropics/skills/tree/main/skills/frontend-design

Use for new pages and substantial visual redesigns together with `ui-ux-pro-max`.

### `anthropic/webapp-testing`

Browser-verification workflow adapted from:

- https://github.com/anthropics/skills/tree/main/skills/webapp-testing

Use after meaningful UI, navigation, form or interaction changes when browser tooling is available.

## Installation strategy

These are repository-local adapters, not blind copies of entire third-party repositories.

Why:

- keep production source small
- avoid importing external dependencies/scripts into runtime unnecessarily
- avoid outdated framework assumptions overriding Next.js 16
- keep ZINITEK architecture authoritative
- preserve clear upstream attribution

If a future task genuinely requires an upstream script, dataset or reference file, add only that required support file after checking compatibility and licensing.

## Routing

The root `AGENTS.md` defines when each skill is used and which rules have priority.

```text
User request
   ↓
AGENTS.md
   ↓
zinitek-project
   ↓
relevant specialist skill(s)
   ↓
implementation
   ↓
verification
```

The root `SKILL.md` is intentionally retained as project documentation for existing ZINITEK interaction patterns such as horizontal drag-scroll, swipe zones and filter bars. It is not replaced by third-party skills.
