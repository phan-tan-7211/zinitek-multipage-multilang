---
name: webapp-testing
description: Repository-local browser verification skill adapted for ZINITEK from anthropics/skills.
source: https://github.com/anthropics/skills
upstream-path: skills/webapp-testing/SKILL.md
installed: 2026-08-28
---

# Webapp Testing — ZINITEK Adapter

Use this skill after meaningful frontend, navigation, form, interaction, responsive or routing changes when browser verification tooling is available.

## Purpose

Do not rely only on source inspection for UI behavior. Verify the rendered application when the change depends on browser behavior.

## Reconnaissance first

For a dynamic Next.js app:

1. Ensure the local app is running.
2. Navigate to the target route.
3. Wait for the rendered page to stabilize.
4. Inspect screenshot/DOM/console before choosing selectors or declaring a bug fixed.
5. Perform the actual interaction.
6. Verify visible result and browser console/network errors when relevant.

Do not guess selectors from source when the rendered structure can be inspected.

## ZINITEK minimum coverage

Choose relevant checks based on the change:

### UI/responsive

- narrow mobile viewport around 375px
- large desktop around 1440px
- no unintended page-level horizontal overflow
- sticky/filter/navigation behavior remains usable
- touch targets and focus states remain usable

### i18n/routing

When language or navigation changed, verify representative routes such as:

- `/vi/...`
- `/en/...`
- at least one CJK locale (`/jp`, `/kr` or `/cn`) when layout/text behavior is affected

Confirm language switching preserves the correct translated route/slug where applicable.

### Swipe/carousel/filter interaction

When touching existing horizontal interactions:

- horizontal scrollers still receive horizontal gestures
- page-level swipe does not steal gestures from `data-swipe-zone="horizontal"`
- drag-scroll does not trigger accidental clicks
- carousel controls and swipe both remain functional

Read the root `SKILL.md` before changing these behaviors.

### Forms

Verify:

- labels and required/error states
- submit loading/disabled state
- success/error feedback
- keyboard operation
- no obvious console exception

Do not submit destructive or real external actions unless the test environment and user request make that appropriate.

### SEO-visible rendering

When metadata/SEO changes, browser verification may confirm visible page structure, canonical/link tags or structured data, but source/build inspection is still required. Do not treat a screenshot as complete SEO verification.

## Browser evidence

Useful evidence includes:

- screenshot of the relevant state
- rendered DOM
- console logs/errors
- interaction result
- route/URL after navigation

If verification could not be run, say so rather than claiming the rendered behavior passed.

## Completion rule

UI work is not considered browser-verified unless the actual rendered behavior was exercised in a browser environment.

## Upstream note

The upstream Anthropic skill uses Playwright and helper scripts for local webapp testing. Those helper scripts are intentionally not vendored into this repository. Use available browser/Playwright tooling in the current agent environment while following the reconnaissance-then-action workflow above.
