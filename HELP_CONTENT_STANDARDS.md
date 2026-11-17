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
