# Help Center layout, instructional images, and update standards

**Effective:** 2026-11-17. Applies to the GitHub Pages site at `help.3damazing.com`.

## Purpose

Help should teach users **what to do next**, not force them to decode a large feature description. The November 17 design keeps every existing Help topic, groups articles by task, and provides a sample five-step illustrated Catalog guide at `catalog-add-item.html`.

## Authoritative application requirements

Read `3d-amazing-sales-manager-web/docs/PROJECT_INVARIANTS.md` in the app repository before changing claims about Catalog, pricing, types, categories, Practice, access, billing, Save, or navigation. Verify current labels from the actual app before creating illustrations or captions.

## Screenshot provenance and privacy — required before an image is described as a screenshot

1. Capture **real** app UI from a controlled Practice session at the current accepted app build and record the app commit SHA, browser/device, date, selected theme, and relevant screen/task.
2. Never publish real Business customers, receipts, names, contact information, paid transactions, processor IDs, email addresses, tokens, passwords, or an individual's account dashboard.
3. If a screenshot shows Practice sample names or amounts, verify they are synthetic and current. Prefer fresh fictional test data; do not rely on stale screenshots or earlier video captures after an interface redesign.
4. Crop to the minimum relevant control and include enough surrounding UI to make its location clear. Create separate iPhone examples only when actual positioning or workflow differs. Do not imply that a desktop crop represents a mobile screen.
5. Use `media/` and filenames such as `catalog-add-step-02-desktop-<commit>.webp` and `catalog-add-step-02-iphone-<commit>.webp`. Reference screenshots from the related step only, with accurate alt text and a plain-language caption; ensure the full-size link works.
6. Replace or remove the original **illustration/not screenshot** disclosure only when the image in that step is an actual reviewed capture. A schematic built from verified code may be useful but must be labeled **illustration**, never screenshot.
7. Keep compression and responsive widths sensible so images are legible at 320px and 390px; set width/height to minimize jumps and allow zoom. SVG diagrams are appropriate as temporary schematics but must remain original (do not copy Vellum artwork).
8. For any changed app screen: review the related Help article, screenshots, alt text, What’s New, Help search keywords, and desktop/iPhone acceptance. Do not claim the image was visually accepted merely because GitHub Actions passed.

## Current image inventory (2026-11-17)

The Catalog guide contains four **original, code-informed SVG diagrams**:
- `media/catalog-chooser.svg` — Add Item starting choices.
- `media/catalog-basic.svg` — required-first example for a self-made 3D print with Manual price.
- `media/catalog-costing.svg` — manual versus calculated pricing.
- `media/catalog-save.svg` — optional Category/SKU and distinct Save/Inventory actions.

**They are not captured screenshots.** The guide states this both before and with the images. Actual safe desktop and iPhone Catalog captures have not been verified or published as of this release.

## Navigation and compatibility

- The home page remains `index.html` and retains the existing top navigation and app-return behavior, including installed-app handling.
- `#help-search`, `#help-cards .card` and `data-search` remain part of the Help search contract; filtered topic groups hide when no link matches.
- Avoid invalid links and non-functioning decorative controls. Ensure all original topic links remain searchable and accessible.
- Maintain strong focus indicators, sensible link text, headings in order, mobile scrolling and reduced-motion preferences.
- Run `node --check script.js` and `node --test tests/*.test.mjs`, then verify GitHub Pages deployment. Manual browser/device visual review remains a separate milestone.

Vellum's public Help site provided structural inspiration: browse topics by task, concise steps, adjacent screenshots and links to related help. No Vellum assets or layouts are copied verbatim.

## Editorial structure for every Help article (November 17 revision)

The Help overview is a compact text-first directory. Individual articles use a readable, restrained long-form layout modeled on the useful principles of Vellum documentation (not its protected artwork):

1. Title and a short statement of what the task achieves.
2. A navigable **On this page** index (right side on desktop; collapsible on small screens).
3. Task instructions first, in the order the user will perform them. Move implementation history and troubleshooting after the primary task, rather than stacking release notes ahead of instructions.
4. Real screenshots **immediately after** the relevant action, cropped closely and captioned. Do not use a decorative screenshot at the top of an unrelated article.
5. Short accessibility-safe tips or cautions only when needed; avoid large banners and giant cards.
6. Related Help links at the end. Keep all previously published direct URLs, headings/anchors where externally linked, and Help return/Practice context behavior.

The shared `script.js` enhances the existing plain articles with navigable h2 anchors and related articles. The author-written `catalog-add-item.html` retains its five-step navigation. Do not treat automatic navigation as an editorial review of outdated content. Recheck instructions against the current application for every feature release.

## Screenshot capture backlog and acceptance

A real screenshot of the **public, unsigned-in** login screen was captured November 17, 2026. Authenticated Practice screenshots have not yet been captured. **Do not manufacture, recreate or relabel diagrams as actual screenshots.** Capture approved Practice UI before attempting the replacements below:

| Priority | Guide / location | Required visual | Review requirement |
|---|---|---|---|
| 1 | Add a Catalog Item / choice step | Actual Add Item chooser | Desktop + iPhone Safari, no personal data |
| 1 | Add a Catalog Item / Basic information | Required fields with Manual price | Desktop + iPhone Safari, verified current labels |
| 1 | Catalog & Pricing / costing | Actual self-made vs purchased product costing | Correct profile and purchase-cost basis |
| 1 | Add a Catalog Item / Save | Actual Save Item + distinct inventory operation | Do not imply saving receives stock |
| 2 | Quick Sale / transaction and receipt | Controlled Practice Quick Sale and synthetic receipt | No real sale or processor IDs |
| 2 | Create Invoice / draft and finalize | Practice Invoice flow | Draft/finalized states shown correctly |
| 2 | Payments / partial payment | Practice sample payment history | No real payment/customer data |
| 3 | Practice / workspace switching | Workspace selector and reset controls | Verify Practice isolation; no live reset |
| 3 | Settings / Appearance | Eight available themes in eligible test account | Do not expose account identifiers |
| 3 | Search / Settings & Features | Navigation and record results | Role and workspace restrictions visible |

Before publishing each image: record commit SHA, browser/version, device, capture date, theme, exact guide step, source Practice workspace, reviewer and acceptance result. Test links and mobile zoom. The four Catalog diagrams remain labeled **illustrations, not screenshots** until replaced by verified captures. If authenticated capture isn't available, publish accurate text with no image rather than fictional UI.

## Verified sign-in screenshot (2026-11-17)

- File: `media/sign-in-20261117-live-chromium.webp` (520 × 600, cropped from 1280 × 900 browser capture)
- Source: `https://app.3damazing.com/login` — public sign-in page, no account credentials or real customer data used
- Captured: 2026-11-17, ~18:51 UTC, Chromium 159 headless on Linux (desktop viewport)
- Verified live Vercel production deployment: `dpl_5AkNdEyqEXnPGV1EHaKDARMkqW6r`, app Git commit `d34d75b6b985e2299d1260d225062354467d5f1e`
- UI labels checked against `src/app/login/page.tsx`: **Email**, **Password**, **Sign in**, **Forgot password?**
- No signed-in or private data is visible. The screenshot is a real browser capture, not a generated illustration.
- iPhone Safari rendering is not yet accepted. Use this desktop screenshot only as a desktop example.


## November 17 follow-up: screenshots and workflow visuals

The Help Center provides **two real, public, unsigned-in app screenshots**:
- `media/sign-in-20261117-live-chromium.webp` — Sign in screen.
- `media/forgot-password-20261117-chromium.webp` — Password recovery screen (420×574 cropped from a Chromium desktop capture), captured from `https://app.3damazing.com/forgot-password` on 2026-11-17.

Both were checked against the live production deployment `dpl_5AkNdEyqEXnPGV1EHaKDARMkqW6r` at app commit `d34d75b6b985e2299d1260d225062354467d5f1e`. No sign-in or recovery request was submitted; no emails, credentials or business records were entered.

**All other added graphics are clearly labeled workflow diagrams, not app screenshots.** They describe the verified navigation and action sequence without pretending to reproduce authenticated screens:

- Customers: `guide-customer-workflow.svg`
- New Sale and Dashboard: `guide-sale-chooser.svg`
- Quick Sale: `guide-quick-sale-workflow.svg`
- Create Invoice: `guide-invoice-workflow.svg`
- Quotes: `guide-quote-workflow.svg`
- Payments: `guide-payment-workflow.svg`
- Reports: `guide-report-workflow.svg`
- Events: `guide-event-workflow.svg`
- Practice: `guide-practice-workflow.svg`
- Search: `guide-search-workflow.svg`
- Business Settings: `guide-settings-workflow.svg`
- Data Tools: `guide-backup-workflow.svg`
- Catalog stock: `guide-inventory-workflow.svg`

Appearance also includes eight HTML palette previews using the literal colors from `src/lib/appTheme.ts`, not a screenshot of the theme picker.

### Remaining authenticated screenshot coverage

Current, authentic screenshots of real app interfaces **must** be captured from a controlled Practice account before they replace any diagrams: Catalog chooser and required fields, Catalog inventory entry, Customers add/edit, New Sale chooser, Invoice draft, Quick Sale checkout, Quote conversion, Payments, Reports, Events, Search, Business Settings, Appearance, and Practice switching. Never use real Business data or create test sales in Business to obtain these captures. Verify each screenshot against the app build SHA and relevant device, crop appropriately, and keep clear alt text, captions and full-size links. iPhone Safari visual acceptance remains unverified until tested on an actual phone.

Support, FAQ, and Troubleshooting are reference pages; they should remain concise text-and-links unless a specific authentic screenshot makes a particular instruction clearer. Avoid adding decorative visuals.
