---
name: frontend-design
description: Repository-local frontend design skill adapted for ZINITEK from anthropics/skills.
source: https://github.com/anthropics/skills
upstream-path: skills/frontend-design/SKILL.md
installed: 2026-08-28
---

# Frontend Design — ZINITEK Adapter

Use this skill for substantial page creation or redesign where the task needs a deliberate visual point of view rather than generic component assembly.

## Design intent

The interface should feel specific to ZINITEK and its industrial/precision subject matter. Avoid default AI/SaaS visual recipes when they do not serve the content.

## Ground design in the subject

Before designing, identify:

- what the page is about
- who it serves
- the single primary job of the page
- which real industrial/technical materials, processes, machines, drawings, measurements or content structures can inform the visual language

Do not invent technical capabilities, certifications, machines, customers or claims just to make the design more interesting.

## Make deliberate choices

For major design work, define:

- palette roles
- typography roles
- layout principle
- spacing/density
- one memorable signature element or interaction

Spend visual boldness in a controlled place instead of decorating every section.

## Typography

Typography should carry hierarchy and brand character, but must remain readable across Vietnamese, English, Japanese, Korean and Chinese content.

Do not select a type treatment that only works for Latin text while degrading CJK locale readability.

## Structure

Use structural devices because they communicate information, not as decoration. Numbering is appropriate for actual sequences, processes, steps or ranked items, not as a generic design motif.

## Motion

Use motion deliberately:

- reveal hierarchy or state
- support navigation/interaction
- keep complex choreography rare
- respect reduced-motion preferences
- avoid animation that makes an industrial site feel gimmicky

## Interface writing

UI copy should be clear, active and consistent:

- action labels describe the actual result
- labels remain stable through a flow
- errors explain what happened and what to do next
- empty states guide the next action
- business/technical claims must come from real source content

Static interface text belongs in dictionaries. Dynamic business content belongs in Sanity.

## Two-pass workflow

### Pass 1: Direction

Create a compact internal design plan covering:

- color
- type
- layout
- signature element

Check it against the actual ZINITEK brief. If it could be pasted into an unrelated SaaS or portfolio without change, revise it.

### Pass 2: Build and critique

Implement using the existing project stack and components. Then critique:

- visual hierarchy
- responsive behavior
- CJK/Latin text resilience
- focus states
- touch interaction
- motion restraint
- content authenticity

Use `ui-ux-pro-max` for detailed UX/accessibility checks and `webapp-testing` for rendered verification when available.

## ZINITEK precedence

This skill does not override:

- `AGENTS.md`
- `zinitek-project`
- existing i18n/Sanity ownership
- root UX interaction `SKILL.md`
- explicit user direction

## Upstream note

This adapter preserves the upstream skill's core principle: create intentional, distinctive frontend design grounded in the actual subject, then critique it before completion. The upstream Anthropic skill remains the detailed reference; this file adapts it to ZINITEK's architecture and multilingual industrial context.
