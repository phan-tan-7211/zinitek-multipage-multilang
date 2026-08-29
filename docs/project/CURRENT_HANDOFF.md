# ZINITEK Current Handoff

Last updated: 2026-08-29

This file is the practical handoff for the next developer or AI agent. Read this together with the root `AGENTS.md` before modifying code.

## Active work

- Repository: `phan-tan-7211/zinitek-multipage-multilang`
- Active branch: `audit/ui-ux-pro-max-homepage`
- Branch head before this handoff document was added: `16d8d5ed3b0084c26c0a5292c8401d1b940bcaa8`
- Original audit base: `9945ca44d86b25e5a5ee3261d3850fd3086c32b8`
- No pull request is currently part of this workflow.

Local project path used by the owner:

```text
C:\Users\T\Documents\Inventor\zinitek\WEB\load ve test
```

Typical local verification:

```powershell
git pull origin audit/ui-ux-pro-max-homepage
npm run build
npm start
```

Do not claim the latest branch builds successfully unless you actually run the build or CI verifies it. Several recent changes were committed without a confirmed local build.

## Owner's non-negotiable UI direction

This website must stay visually expressive. Do not make it static or generic in the name of optimization.

Keep these characteristics unless the owner explicitly asks otherwise:

- particles and decorative technical motion
- multiple intentional infinite animations
- carousel autoplay
- strong/exaggerated desktop hover effects
- industrial / high-tech identity
- strong orange accent near `#f97316`
- rich interaction on desktop while keeping mobile touch behavior usable

`prefers-reduced-motion` support is still required for accessibility, but reduced-motion safety must not be used as an excuse to remove the normal motion design.

## Important current interaction behavior

### Floating contact bar

File: `components/floating-contact-bar.tsx`

The owner explicitly preferred the visual style of the original implementation. Its visible identity must remain:

- HOTLINE = orange
- ZALO = blue
- MAP = red
- TOP = orange
- each item has a large, clearly colored slide-out label
- desktop location is on the right side in the current implementation
- near the Footer on mobile/tablet, the bar docks horizontally at the bottom

Do not replace this with subtle monochrome pills, tiny tooltips or a generic floating-action-button design.

The original source can be recovered from audit base commit `9945ca44d86b25e5a5ee3261d3850fd3086c32b8` if exact visual comparison is needed.

### Mobile service submenu vs contact dock

`FloatingContactBar` publishes the custom event:

```text
zinitek-contact-dock
```

When the contact bar docks near the Footer on mobile, the service submenu/indicator is expected to hide so the two controls do not overlap. When scrolling back up, the service submenu returns.

Do not modify either component independently without checking this coordination.

### Existing swipe/drag patterns

Read `docs/ux/INTERACTION_PATTERNS.md` before changing horizontal filters, Embla carousels or smart swipe navigation.

## Detail-page collection navigation and related content

Service, product and project detail pages intentionally use the same information architecture near the end of the page:

| Detail route | Related-content heading | Collection link |
| --- | --- | --- |
| `/[lang]/services/[slug]` | `Dịch vụ liên quan` | `Xem tất cả dịch vụ kỹ thuật` -> `/[lang]/services` |
| `/[lang]/products/[slug]` | `Sản phẩm liên quan` | `Xem tất cả sản phẩm` -> `/[lang]/products` |
| `/[lang]/portfolio/[slug]` | `Dự án liên quan` | `Xem tất cả dự án` -> `/[lang]/portfolio` |

Current behavior:

- show at most three related entries and exclude the current translated content group
- preserve the dynamic-content fallback order `requested language -> en -> vi`
- product and project recommendations are restricted to the same service category
- service recommendations use the ordered service collection because services are already the top-level technical categories
- when no related entry exists, hide the empty related-card grid and keep only the corresponding collection link
- static headings and collection-link labels come from `dictionaries/*.json`
- do not assume translated entries have the same slug; preserve `_translationKey` / translation metadata grouping

The structure and navigation are shared, but card presentation remains content-appropriate:

- services use icon-led technical cards
- products and projects use image-led cards through `components/detail-related-section.tsx`
- all three collection links use `components/detail-collection-link.tsx`

The service detail page also keeps its consultation CTA after the related-services block. Product and project pages already expose their quote/contact action inside the main detail content or sidebar, so do not add a duplicate CTA merely to make the markup identical.

Relevant files:

- `app/[lang]/services/[slug]/page.tsx`
- `components/service-page-content.tsx`
- `app/[lang]/products/[slug]/page.tsx`
- `components/product-detail-page-content.tsx`
- `app/[lang]/portfolio/[slug]/page.tsx`
- `components/detail-related-section.tsx`
- `components/detail-collection-link.tsx`
- `dictionaries/{vi,en,jp,kr,cn}.json`

This behavior was aligned in commit `5501b72` (`feat: align related detail navigation`).

## Mobile product and blog listing grids

The main product and blog listing pages use denser responsive grids so mobile users can scan more entries without excessive vertical scrolling.

Current column behavior:

| Viewport | Products | Blog posts |
| --- | --- | --- |
| Mobile portrait | 2 columns | 2 columns |
| Mobile landscape | 3 columns | 3 columns |
| Tablet | 3 columns | 3 columns |
| Desktop | 4 columns | 3 columns |

Implementation rules:

- use Tailwind responsive/orientation variants; do not add JavaScript resize or orientation listeners
- keep compact mobile typography, spacing, badges and metadata while restoring larger type and spacing at desktop breakpoints
- keep titles and descriptions line-clamped so cards remain visually balanced across five languages
- keep the whole product card link and the existing blog image/title/read-more links keyboard accessible
- keep the product search, category drag-scroll, `data-swipe-zone="horizontal"`, filtering and animations unchanged
- keep `next/image` `sizes` synchronized with the mobile portrait and landscape column counts to avoid downloading unnecessarily large images

Relevant files:

- `components/product-list-content.tsx`
- `components/blog-list-content.tsx`

## Site settings: never hard-code business contact data

Sanity `siteSettings` is the source of truth for global contact/business settings.

Current managed fields include:

- `phoneDisplay`
- `phoneTel`
- `zaloNumber`
- `email`
- `addressDisplay`
- `googleMapsUrl`
- `wechatId`
- `wechatUrl`
- `lineUrl`
- `facebookUrl`
- `youtubeUrl`
- `tiktokUrl`
- `twitterUrl`
- manual Google review display fields described below

Before adding a phone, address, email or social URL to JSX/JSON-LD, inspect whether that value is already available from `siteSettings`.

### Home JSON-LD hard-code cleanup completed

Home-page Organization/LocalBusiness JSON-LD now reads the available address, telephone, email and real social links from the singleton `siteSettings` document. Optional properties are omitted when Sanity has no value. The former hard-coded address, telephone, fake Facebook/Zalo URLs, unsupported price range and missing `/logo.png` reference were removed.

## Google reviews decision: NO Google Places API

The owner explicitly decided not to use Google Places API because Google Cloud requested billing/tax information.

Do not reintroduce Google Places API, `GOOGLE_PLACES_API_KEY`, automatic Google review fetching, scraping Google Maps or a paid third-party review service unless the owner explicitly changes this decision.

The former route:

```text
app/api/google-reviews/route.ts
```

was intentionally deleted.

Current approach:

- real Google reviews are entered manually in Sanity
- review language stays exactly as the original review; no translation is required
- website shows the review cards directly
- `Xem trên Google` opens `googleMapsUrl`
- optional per-review `reviewUrl` can link to a specific Google review
- when there are no manually entered reviews, the testimonial/review section hides instead of inventing fake reviews

Sanity fields:

```text
googleRating
googleReviewCount
googleReviews[]
  author
  rating
  content
  meta
  reviewUrl
```

Relevant files:

- `sanity/schemaTypes/siteSettings.ts`
- `components/testimonials-section.tsx`

Never restore the previously hard-coded fake testimonials for Toyota Boshoku, Samsung Electronics or VinFast. Do not invent customer names or reviews.

## Dynamic address/social work already done

Global address and social settings were moved toward Sanity-managed values. Preserve this direction.

The global `siteSettings` query in `app/[lang]/layout.tsx` targets the singleton document ID `siteSettings` and uses a 60-second Next.js revalidation window with the `site-settings` cache tag. This prevents a production build from keeping old social/contact values indefinitely while avoiding an uncached Sanity request on every page view.

After publishing changes in Studio, allow up to 60 seconds and request/refresh a website route. A code rebuild should not be required for later `siteSettings` content edits once a deployment containing this revalidation behavior is running.

The Footer should not render fake `#` social links. Only configured social URLs should be shown.

The map/contact controls should use `googleMapsUrl`, with address-search fallback only where already implemented.

## Sanity-managed global logo

The shared header and Footer logo are managed from the singleton Sanity `siteSettings` document while preserving the existing orange industrial styling.

Studio exposes exactly two branding groups:

- `logoMark`: safe React logo templates and their appearance/motion settings
- `logoWordmark`: `primaryText`, orange `accentText`, and localized `tagline` values for `vi`, `en`, `jp`, `kr`, `cn`

`logoMark.template` currently supports two approved designs derived from the owner-provided references:

- `zRhombus`: solid diamond with the center character
- `zHexagon`: outlined technical hexagon with an optional translucent fill

Studio also exposes a safe set of controls for letter style, six color presets or custom HEX colors, scale, hexagon fill/stroke, glow strength/blur, shine sweep, hover rotation and spring stiffness/damping. Scale and motion values are bounded in both Sanity validation and the frontend component so a bad CMS value cannot break the shared navigation layout. The two reference files named `(1)` and `(2)` supplied on 2026-08-29 were byte-identical; they map to the same `zHexagon` template rather than duplicate options.

The actual animated designs live in `components/z-logo-icon.tsx`; Sanity values and color presets are applied through `components/site-logo.tsx`. The shared result is used by the desktop header, compact mobile header, mobile navigation drawer and Footer. Do not reintroduce separate hard-coded logo markup in those components.

Do not store, compile or execute arbitrary React/HTML/SVG from Sanity for this logo. The CMS owns the safe template configuration; React/Tailwind/Framer Motion own the approved implementations. Do not dynamically inject Google Fonts from a logo setting; the selectable styles use the fonts already loaded by the application plus the bundled geometric Z vector. Empty fields intentionally fall back to the orange diamond, white `Z`, enabled glow/animation, current `ZINI` + `TEK` and dictionary/localized tagline so an incomplete Studio edit cannot remove the site identity. `prefers-reduced-motion` disables the hover rotation only as an accessibility fallback.

Browser-tab titles, the Next.js title template, Open Graph `siteName` and organization/publisher names in current JSON-LD resolve the same `logoWordmark.primaryText + logoWordmark.accentText` value through `lib/site-settings.ts`. Existing dictionary/SEO titles containing the legacy `ZINITEK` token are replaced safely, and titles without the token receive the current site name once. These settings share the 60-second `site-settings` revalidation behavior.

## Multilingual rules

Supported route locales are exactly:

```text
vi, en, jp, kr, cn
```

Sanity translated content fallback is intended to be:

```text
requested language -> en -> vi
```

Do not confuse the site's `jp` route code with standard language code `ja` when working with external services.

Do not assume translated documents share the same slug. Preserve `_translationKey` relationships.

## Layout details to treat carefully

The language layout currently boxes the main desktop content using a width calculation and max width. Before changing shell overflow/width classes, inspect the current rendered page because floating elements, carousels and decorative effects can be clipped by overly aggressive `overflow-hidden`.

Do not casually replace global overflow behavior across the site as a cleanup.

## Mistakes already made in this audit — do not repeat

1. **Generic redesign replacing a preferred original component style.** The floating contact bar was initially made too subtle. When the owner asks to preserve an original style, compare against the original source instead of interpreting it loosely.
2. **Hard-coded dynamic information.** Phone/address/social/business data must be managed via Sanity when intended to be editable globally.
3. **Fake social or customer data.** Do not render placeholder `#` social links, invented customers, fake testimonials or unsupported business claims.
4. **Rewriting too much while adding one schema field.** A previous small schema change caused an unexpectedly large diff. Always fetch and preserve the full current schema before editing it; review the diff after the write.
5. **Assuming a route or deployment works without verification.** Do not state that `/studio`, Vercel, build, or a deployment works unless confirmed in the current environment.
6. **Breaking server/client boundaries.** A previous service-icon implementation caused a service-detail crash. Be conservative when passing non-serializable/component values between Server and Client Components.
7. **Ignoring coordinated mobile widgets.** Contact docking and mobile service controls interact. Test them together.
8. **Over-optimizing motion away.** Accessibility is required, but the normal experience is intentionally animated and expressive.
9. **Google reviews via API after owner rejects billing/tax.** Current decision is manual Sanity reviews. Do not silently bring API billing back.

## Verification expectations

### ESLint status

`localhost:3000` is the running Next.js application; ESLint is a source-code checker and does not run "inside" that URL or change the rendered interface.

The repository currently declares `"lint": "eslint ."` in `package.json`, but ESLint is not yet listed as an installed dependency and there is no active ESLint configuration file. Therefore, do not report `npm run lint` as working until the dependency and project-compatible configuration are deliberately added and the command is actually run successfully.

After meaningful code changes, run when possible:

```bash
npm run lint
npm run build
```

For UI work also verify:

- narrow mobile
- tablet/mobile near Footer
- large desktop
- light/dark theme when affected
- hover/focus behavior
- no horizontal page overflow
- carousel/swipe zones

For Sanity changes, verify that every frontend field the admin needs can actually be edited from Studio and that previously existing fields were not accidentally deleted.

## Recommended first action for the next session

1. Read root `AGENTS.md`.
2. Read this file.
3. Fetch the exact current files involved in the user's next request.
4. Compare branch state before editing.
5. Make the smallest coherent change.
6. Verify before declaring success.
