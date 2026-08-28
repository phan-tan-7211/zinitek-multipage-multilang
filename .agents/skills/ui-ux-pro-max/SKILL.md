---
name: ui-ux-pro-max
description: Repository-local UI/UX design and review skill adapted for ZINITEK from nextlevelbuilder/ui-ux-pro-max-skill.
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
upstream-path: .claude/skills/ui-ux-pro-max/SKILL.md
installed: 2026-08-28
---

# UI/UX Pro Max — ZINITEK Adapter

Use this skill whenever a task changes how the ZINITEK site looks, feels, moves, responds, or is interacted with.

## Authority

1. User request
2. Root `AGENTS.md`
3. `.agents/skills/zinitek-project/SKILL.md`
4. This skill
5. Root `SKILL.md` for existing ZINITEK swipe/drag/filter patterns
6. Generic design advice

Never override ZINITEK architecture, content ownership, i18n, Sanity, or existing interaction contracts just because an upstream design pattern differs.

## Apply to

- page/component design and redesign
- responsive behavior
- typography, spacing, visual hierarchy and color
- accessibility and keyboard interaction
- touch targets and mobile interaction
- navigation and information architecture
- animation and transitions
- form feedback and error states
- UI performance and perceived quality

Skip for pure backend, data, deployment or API work unless the change affects the interface.

## Priority checks

Review in this order:

1. Accessibility
   - keyboard usable
   - visible focus state
   - meaningful alt text
   - labels for icon-only controls
   - adequate contrast
2. Touch and interaction
   - target size roughly 44x44px where practical
   - no hover-only critical action
   - clear loading/disabled/pressed feedback
3. Performance
   - avoid layout shift
   - reserve image/media space
   - avoid unnecessary client-side work and heavy animation
4. Responsive layout
   - mobile-first
   - no unintended horizontal page overflow
   - content remains readable at narrow widths
5. Typography and color
   - readable body size and line height
   - semantic tokens preferred over arbitrary one-off values
   - retain ZINITEK industrial high-tech identity unless redesign requested
6. Motion
   - motion must communicate state or hierarchy
   - respect `prefers-reduced-motion`
   - avoid animating layout-heavy properties unnecessarily
7. Forms and feedback
   - visible labels
   - errors near the relevant field
   - actionable error copy
8. Navigation
   - predictable back/forward behavior
   - preserve locale and translated slugs

## ZINITEK visual context

Default direction unless the user asks otherwise:

- industrial / precision / high-tech
- dark-first visual language
- strong orange accent around `#f97316`
- technical information may be dense, but hierarchy must remain clear
- motion should feel engineered rather than decorative
- reuse current component primitives before introducing a new visual system

## Workflow

For a new page or major redesign:

1. Inspect the existing page, shared components and relevant dictionaries/Sanity schema.
2. Define the page's single primary job and target audience.
3. Establish a compact design direction: hierarchy, typography, spacing, color, signature interaction.
4. Check that the direction fits ZINITEK rather than a generic SaaS template.
5. Implement with the existing Next.js/Tailwind/component stack.
6. Verify mobile and desktop behavior.
7. Run applicable lint/build checks.
8. For interaction changes, use the webapp-testing skill when browser tooling is available.

For a targeted UI bug, do not redesign the entire page. Fix the smallest coherent interaction/layout issue.

## Existing interaction warning

Before modifying horizontal filter bars, swipe navigation, carousels or mouse drag-scroll, read the root `SKILL.md`. Those patterns already have project-specific collision handling such as `data-swipe-zone="horizontal"` and drag-vs-click protection.

## Upstream note

The upstream skill includes searchable datasets, scripts and reference tables. They are intentionally not vendored into this production repository. This adapter preserves the operational design rules relevant to ZINITEK while keeping runtime source clean. Consult the upstream repository only when deeper design-database research is explicitly useful.
