---
name: last30days
description: Repository-local recent-research skill adapted for ZINITEK from mvanhorn/last30days-skill.
source: https://github.com/mvanhorn/last30days-skill
upstream-path: skills/last30days/SKILL.md
upstream-version-seen: 3.21.1
installed: 2026-08-28
---

# Last30Days — ZINITEK Adapter

Use this skill only when a ZINITEK task materially depends on recent external information, community discussion, changed tooling, trends, competitor activity or newly emerged practices.

## Appropriate uses

- recent Next.js, React, Sanity or Vercel changes
- recent SEO ecosystem changes
- current UX/UI patterns that may affect a requested redesign
- recent browser/platform behavior
- competitor or market research
- current discussions about libraries being considered for adoption

## Do not use for

- facts already available in the repository
- stable project architecture
- code behavior that can be determined by reading source
- historical notes in `DEVELOPMENT_NOTES_ARCHIVE.md`
- replacing official documentation for an API that can be verified directly

## Research discipline

1. Define the concrete question first.
2. Prefer evidence from roughly the last 30 days when recency is the point.
3. Use multiple independent sources when making a recommendation that may affect architecture.
4. Separate:
   - verified current facts
   - community opinion
   - inference/recommendation
5. Prefer primary sources for releases, framework behavior and security information.
6. Treat social/community sources as sentiment or experience, not guaranteed fact.
7. Record exact dates when a changing fact matters.
8. Do not import code or dependencies just because they are currently popular.

## ZINITEK adoption gate

Before applying a recent recommendation to this repo, check:

- compatible with Next.js 16 App Router
- compatible with React 19
- does not break `/[lang]/...` routing
- does not bypass Sanity content ownership
- preserves translated-slug and `_translationKey` behavior
- does not duplicate a native Next.js feature already in use
- has a measurable benefit for the requested task

If a recent trend conflicts with repository rules, repository rules win unless the user explicitly requests the architectural change.

## Output expectations

When recent research influences a code change, summarize the decision in practical terms:

- what changed recently
- why it matters to ZINITEK
- whether to adopt, defer or reject
- what source-of-truth code will be affected

Do not turn every coding task into external research.

## Upstream note

The upstream Last30Days skill is a large research system with scripts, multi-source integrations and a strict output contract. Those runtime scripts and optional API integrations are not vendored into ZINITEK because they are not website runtime dependencies. This repository-local adapter installs the decision rules that matter for coding work; use the upstream project separately when its full research engine is actually available and needed.
