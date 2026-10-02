# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Relax Intact Furnitures marketing site — office furniture (chairs, tables, cupboards, blinds) manufacture/supply and repair/servicing/cleaning, Bangalore. This is the Astro migration of the original two-page static HTML site (kept untouched as a reference at `../relax-intact-website/`, see its own `CLAUDE.md` for full content/behaviour history and `PRODUCT.md` for business context, copied unchanged into this project's `PRODUCT.md`). The migration's one goal was **zero visual or behavioural regression** while de-duplicating the header/footer/tokens/shared JS that the original kept as two independent, manually-synced copies.

## Commands

```
npm run dev      # dev server (astro dev)
npm run build    # production build to dist/ — verified clean, no errors
npm run preview  # serve the production build
```

No test suite; verification was manual (dev-mode render + build + browser check of both pages, both orbit/reel/services/why/shelf interactions, and mobile widths).

## Architecture

```
src/
  layouts/
    Layout.astro        — <html>/<head>, header, <main><slot /></main>, footer,
                           wa-float + to-top buttons, GSAP + site script tags
  components/
    EnquiryForm.astro   — the enquiry form, byte-identical on both pages in the
                           original, now written once
  pages/
    index.astro         — home: hero/orbit, products reel, services, why/about,
                           use cases, contact. Scoped <style> for everything that
                           is unique to this page (hero, orbit, reel, services,
                           why/about, use-cases — see below).
    products.astro       — full catalogue: intro, category/shelf listing, contact.
                           Scoped <style> for products-page-intro/category/shelf/
                           unsure-row.
  styles/
    global.css           — tokens (:root) + base element resets + header/nav/
                           footer/button/eyebrow/section/media-frame/card-enquire/
                           contact-form/colour-band CSS shared verbatim by both
                           pages in the original (loaded once, applies to both).
public/
  images/, images/cutouts/  — copied as-is from the source project
  vendor/gsap.min.js        — GSAP 3.12.5, copied as-is, loaded via a plain
                              <script src="/vendor/gsap.min.js" is:inline> tag —
                              NOT an npm package, per the hard constraint in the
                              migration brief (GSAP core only, no bundler
                              transform, no ScrollTrigger or other plugins)
  scripts/site.js           — the shared inline <script> from the original pages
                              (nav toggle, data-req enquire prefill, hero orbit +
                              products-reel buttons + services CTA — all home-page
                              elements but harmless no-ops where absent, slats
                              equalizer, enquiry form validation, nav scroll-spy +
                              generic .reveal-on-scroll, and the header
                              chair-rail/seal-spin/back-to-top scroll-motion
                              block), loaded via
                              <script src="/scripts/site.js" is:inline> straight
                              after the GSAP tag — same "plain global script, no
                              bundler" approach as gsap.min.js, for the same
                              reason: this is jQuery-era `var`/IIFE code that
                              assumes `window.gsap` is already a global, and
                              bundling it as an ES module is unnecessary risk for
                              zero benefit.
```

### Why one shared script instead of two

The original kept one big inline `<script>` block duplicated verbatim in both
`index.html` and `products.html`, differing only in one line (the CSS selector
list the scroll-reveal `IntersectionObserver` watches — different because the
two pages have different sections). Every other piece of that script already
guards itself against its target elements not existing (`if(!stage) return;`
for the orbit, empty `querySelectorAll('.reel-btn').forEach` no-ops, etc.) —
which is exactly how the original safely ran the home-page-only orbit/reel/
services-CTA code on `products.html` too, where it already silently did
nothing. Given that, `public/scripts/site.js` here is the original script with
that one differing line replaced by the **union** of both pages' selectors, so
the exact same file runs on both pages and still only touches what's actually
on the page it's running on. Nothing about this changes behaviour on either
page — it only removes the need to hand-sync two copies.

### Why one global.css instead of two

The two original stylesheets were ~90% identical (tokens, header/nav, buttons,
section/media-frame/eyebrow, the full contact form, the footer, colour bands).
The genuinely page-specific CSS (hero/orbit/products-reel/services/why-about/
use-cases on the home page; products-page-intro/category/shelf/unsure-row on
the products page) lives in each page's own scoped `<style>` block instead, so
it only applies to the markup that page actually renders — matching Astro's
natural per-page scoping rather than re-introducing a second global stylesheet.

### Routing

Astro's default clean routing is used: `/` (index.astro) and `/products`
(products.astro), not `index.html`/`products.html`. All internal links were
updated accordingly (`products.html` → `/products`, `index.html#services` →
`/#services`, etc.). `Layout.astro` takes a `page: 'home' | 'products'` prop
and derives the small set of header/footer link differences between the two
pages from it (e.g. the logo and "Home" link point to `#home` on the home page
itself but to `/` from the products page) — this mirrors exactly what the
original's two hand-maintained copies of the header/footer markup did.

## Deviations from a literal line-for-line port (and why)

1. **Dropped dead CSS.** Both original stylesheets carried `.product-grid` /
   `.product-card` / `.product-icon` / `.product-body` and (products.html only)
   `.featured-grid` / `.featured-card` rules that don't match any element in
   either page's actual markup (verified by grep — zero usages). This is
   leftover cruft from an earlier design iteration that was never deleted when
   the markup using it was removed. Dropped entirely rather than carried
   forward as more dead weight; this cannot be a visual regression since it
   never rendered anything on either page.
2. **Dropped stale duplicate CSS on the products page.** `products.html`'s own
   stylesheet also still carried a second, older copy of `.service-card`,
   `.why-grid`, `.usecase-grid` and `.featured-*` rules — stale leftovers from
   when `products.html` was first copied from an earlier version of
   `index.html` and then had those sections' *markup* stripped out, but not
   all of their CSS. None of it matches anything in `products.html`'s markup
   (that page has no `#services`/`#about`/use-cases sections at all). The
   *live*, current versions of that CSS (the v3 services layout, the sticky
   why/about list, the 3-column use-cases grid) are what actually render on
   `index.html`, and those are what's in `index.astro`'s scoped styles.
   `products.astro` only carries the CSS its own markup needs
   (products-page-intro/category/shelf/unsure-row). Confirmed zero visual
   difference since the dropped rules never matched anything on that page.
3. **One shared script, union reveal-selector** — see above. Behaviourally
   identical on both pages.
4. **Fixed a real regression the URL-scheme change would otherwise have
   caused:** the original's nav scroll-spy did
   `document.querySelector(a.getAttribute('href'))` for every nav link,
   including non-hash links like `products.html` — which happens to parse as
   a harmless (non-matching) compound CSS selector, so it silently did
   nothing. A clean route like `/products` is **not** valid selector syntax at
   all (leading `/`) and throws a `SyntaxError`, which would have silently
   killed the rest of that script block (nav scroll-spy *and* the generic
   scroll-reveal-on-scroll that's set up right after it) on first load of
   either page. Fixed in `public/scripts/site.js` by only treating `href`
   values starting with `#` as in-page anchors (try/catch kept as a second
   safety net). This is a fix made necessary by the routing change itself, not
   an unrelated cleanup — flagging it here per the "note bugs, don't silently
   fix pre-existing ones" instruction, since this one isn't pre-existing, it's
   newly-introduced-and-fixed by this migration.

## Known pre-existing bug carried over unchanged (not fixed, per migration brief)

`products.astro`'s "Need something built to size, or a chair repaired?" link
under the catalogue (`.unsure-link`) points at `/#contact` — i.e. the **home**
page's contact section — even though `products.astro` has its own `#contact`
section with its own copy of the enquiry form lower on the *same* page. This
is exactly what the original `products.html` did (`href="index.html#contact"`
instead of a same-page `href="#contact"`), so it's preserved as-is. It looks
like a copy-paste leftover from whichever page this markup was first drafted
on, not an intentional "go to the home page instead" choice — worth asking the
client/confirming before changing, but out of scope for a fidelity migration.

## Hard constraints carried over from the source project

- GSAP core only — no ScrollTrigger or other plugin, no npm `gsap` package.
- `prefers-reduced-motion` gating is preserved everywhere it existed in the
  source (global transition/animation-duration override in `global.css`, plus
  the per-feature gates inside `scripts/site.js` and the `.slats`/`.reveal`/
  `.services-call` CSS).
- All anchor IDs (`#home`, `#products`, `#services`, `#about`, `#use-cases`,
  `#contact`, `#enquiryForm`, etc.) preserved exactly.
- No view-transitions / client router — Astro's default (off) is left alone,
  matching the source site's plain multi-page-navigation behaviour.
