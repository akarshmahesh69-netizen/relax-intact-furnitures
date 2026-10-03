# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Also read `AGENTS.md` in this directory (auto-generated/refreshed by `next dev`) before making
> framework-level changes — this project is on Next.js 16, which has real breaking changes from
> older Next.js versions a model's training data may assume.

## Overview

Relax Intact Furnitures marketing site — office furniture (chairs, tables, cupboards, blinds)
manufacture/supply and repair/servicing/cleaning, Bangalore. This is the **Next.js rewrite** of the
Astro version kept untouched as a reference at `../relax-intact-astro/` (see its own `CLAUDE.md` for
the full content/behaviour history and the original two-page static-HTML project's history before
that). This rewrite's goals were (1) **zero visual or behavioural regression** from the Astro
version, and (2) **eliminate the hero-orbit "black blob" rendering risk at the root** by replacing
the `mix-blend-mode` transparency trick with real alpha-transparent product photos — see "THE ORBIT
IMAGE FIX" below, the main reason this rewrite exists.

## Commands

```
npm run dev      # dev server (next dev, Turbopack)
npm run build    # production build — verified clean, no errors or unexplained warnings
npm run start    # serve the production build
```

No test suite; verification was manual: dev-mode render + build + `next start` + browser checks of
both pages (orbit/reel/services-CTA/why-about/shelf interactions, nav, enquiry-prefill, back-to-top),
at both a real desktop width (1366px) and a real mobile width (390px).

## Architecture

```
app/
  layout.tsx        — root layout: <html>/<head> (fonts, meta, viewport, the inline
                       `classList.add('js')` script), Header, <main>{children}</main>,
                       Footer, WaFloat, BackToTop, EnquireDelegate. Imports globals.css,
                       home.css and products.css (see "Why all three CSS files are
                       imported globally" below).
  page.tsx           — home page: hero/orbit, products reel, services, why/about, use
                        cases, contact.
  products/page.tsx  — full catalogue: intro, category/shelf listing, contact.
  globals.css        — tokens (:root) + base resets + header/nav/footer/button/eyebrow/
                        section/media-frame/card-enquire/contact-form/colour-band CSS,
                        ported verbatim from the Astro source's global.css.
  home.css           — hero/orbit/products-reel/services/why-about/use-cases CSS, ported
                        from index.astro's scoped <style>. The one deliberate content
                        change from the source: .orbit-item no longer carries
                        `mix-blend-mode: multiply` / `isolation: isolate` — see the image
                        fix section.
  products.css       — products-page-intro/category/shelf/unsure-row CSS, ported from
                        products.astro's scoped <style>, unchanged (still uses
                        mix-blend-mode for the two non-cutout shelf photos — out of this
                        rewrite's image-fix scope, see below).
components/
  Header.tsx          — nav, mobile menu, WhatsApp CTA, scroll-rail chair (GSAP).
  Footer.tsx           — footer markup + the page-dependent home/services/about hrefs.
  WaFloat.tsx          — fixed WhatsApp button (static).
  BackToTop.tsx         — fixed back-to-top button (GSAP show/hide on scroll).
  EnquiryForm.tsx       — the enquiry form (byte-identical on both pages), React-controlled
                          validation, still does not transmit anywhere (see below).
  EnquireDelegate.tsx    — document-level delegated click handler for every [data-req]
                          button, dispatches a window CustomEvent the form listens for.
  HeroOrbit.tsx          — the hero product orbit (home page only). The big one — see
                          "THE ORBIT COMPONENT" below.
  ProductsReel.tsx       — the pinned horizontal products reel (home page only).
  ReelButtons.tsx        — shared magnetic/ring/press interactivity for every .reel-btn.
  ServicesCta.tsx         — the Services section's extra-powered "Call us" CTA.
  Slats.tsx               — Why/About section's equalizer-bar divider.
  ScrollReveal.tsx        — nav scroll-spy + reveal-on-scroll, mounted once per page.
public/
  images/, images/cutouts/  — copied from the Astro source's public/images/, PLUS two
                              new real cutouts (computer-chair.webp, visitor-chair.webp)
                              that didn't exist in the source — see the image fix section.
  (no vendor/gsap.min.js)    — gsap is an npm dependency here instead (see "GSAP" below).
```

### Why all three CSS files are imported globally

`home.css` and `products.css` are imported in `app/layout.tsx` (not per-page), even though
Next.js's own docs suggest per-route CSS. This mirrors the Astro source's own reasoning for keeping
page-specific CSS loaded everywhere (see that project's CLAUDE.md, "Why one global.css instead of
two"): every selector in `home.css` only matches markup that exists on the home page, and every
selector in `products.css` only matches markup on the products page, so loading both on both pages
costs nothing and avoids juggling per-route CSS module boundaries for a two-page site. Verified no
visual difference either way, same reasoning the source project used.

### GSAP — npm package, not a vendored script

The Astro/static-HTML source deliberately loaded GSAP via a plain `<script src="/vendor/gsap.min.js"
is:inline>` tag rather than an npm package, because there was no bundler step there worth paying for
(see the source CLAUDE.md's reasoning). A Next.js app already has a bundler, so the idiomatic choice
flips: `gsap` and `@gsap/react` are real npm dependencies here (`package.json`), imported as
`import gsap from "gsap"` wherever needed. **Hard constraint carried over unchanged: GSAP core only.**
No `gsap/ScrollTrigger` or other plugin import exists anywhere in this codebase — confirmed by
`grep -ri "scrolltrigger\|registerplugin" components/ app/` returning nothing. Every scroll-linked
effect here (chair rail, back-to-top, products reel, stamp spin) is hand-rolled with plain
`window.addEventListener('scroll', ...)` + `gsap.quickTo`/`gsap.to`, exactly like the source script
was — ScrollTrigger was never needed for any of it.

### React/Next.js lifecycle and GSAP cleanup

This is the one real difference in *risk* between a static multi-page site and a Next.js app with
client-side routing, called out explicitly in the migration brief: a static page only ever loads
once per visit, so the original script never had to worry about tearing itself down. A Next.js
client component can mount, unmount and remount (client-side navigation between `/` and `/products`,
Fast Refresh in dev, a future route added later). Every component here that creates GSAP
tweens/timelines, `ResizeObserver`/`IntersectionObserver` instances, `matchMedia` listeners, or
`setTimeout`s returns a cleanup function from its `useEffect` that kills/disconnects/clears all of
them — see in particular `HeroOrbit.tsx`'s cleanup (kills the swap timeline, the stamp-ring spin
tween, every per-item tween, disconnects both observers, clears every timer) and `ServicesCta.tsx`'s
(kills the glow spin, the idle timeline, the icon-wobble timeline, removes the dynamically-created
glow span's tweens, removes any still-animating ripple elements).

Two different patterns are used depending on whether a behaviour is page-specific or truly global:
- **Page-specific effects** (the orbit, the products reel, the reel-button magnetics, the services
  CTA, the slats divider, nav-scroll-spy/reveal-on-scroll) are components rendered *inside*
  `app/page.tsx` or `app/products/page.tsx`. Next's normal routing unmounts the previous page's
  component tree on navigation, which runs all of the above cleanup automatically — no extra
  plumbing needed, and no stale DOM references can leak across a route change.
- **Chrome that's genuinely shared** (`Header`, `Footer`, `WaFloat`, `BackToTop`, `EnquireDelegate`)
  lives in `app/layout.tsx`, which does **not** remount on navigation between `/` and `/products`.
  Their effects are written to tolerate that: `BackToTop` re-reads `document.getElementById('products')`
  fresh on every scroll tick instead of caching it (works because that id exists, as a different
  element, on both pages); `ScrollReveal` explicitly clears stale `aria-current` the *previous*
  page's scroll-spy left on nav links before setting up its own observers for the *new* page (a real
  bug found and fixed during verification — see below).

### THE ORBIT COMPONENT (`components/HeroOrbit.tsx`)

This is a close, deliberate 1:1 port of the orbit IIFE from the Astro source's
`public/scripts/site.js` — same geometry math (`layout()`, `slots`, the orbit/swipe mode branch),
same swap/timeline logic (`run()`, `place()`, `drawLines()`), same autoplay/resize/intro sequencing,
same bad-geometry safety-net `setTimeout(relayout, 2200)` with the exact reasoning from the source's
own comment preserved. The *only* structural changes are: (1) scoped to this component's own
`stageRef` instead of `document.getElementById('orbit')`, (2) the `enquire()` call now dispatches a
`window` CustomEvent instead of writing to a `<select>` DOM node directly (see `EnquiryForm.tsx`'s
listener — needed because the form's select value is React state here, not a bare DOM node), (3) the
"Made in India" stamp-ring spin — originally a separate IIFE further down the source script — was
moved into this component since `.stamp-ring` only ever exists here, and (4) full teardown on
unmount (see above). Chose *not* to decompose this further into smaller "more React-idiomatic"
pieces (e.g. one hook per sub-behaviour): the algorithm's pieces share a lot of mutable closure state
(`slots`, `feat`, `busy`, `tl`) that would need to move into refs anyway, and splitting it up was
judged a bigger fidelity risk than keeping it as one well-commented, carefully-cleaned-up effect —
this is a "port exactly, verify exhaustively" situation, not a "modernize the architecture" one.

## THE ORBIT IMAGE FIX (the main reason for this rewrite)

**The problem, inherited from the source:** the hero orbit faked transparency on all six product
photos by layering `mix-blend-mode: multiply` on a white-studio-background photo against the page's
cream background (`.orbit-item{ mix-blend-mode: multiply; isolation: isolate; }` in the old
`home.css`/`index.astro`). This caused an intermittent, hard-to-reproduce "black blob" rendering bug,
root-caused in the Astro source (its CLAUDE.md has the full history) as a GPU/driver compositor class
of bug: a GPU-composited layer (`matrix3d(...)`, which GSAP's default `force3D:"auto"` produces) that
also carries `mix-blend-mode` can render solid black instead of its actual content on some
GPU/driver combinations. The source's fix was `gsap.config({ force3D: false })` — a mitigation, not a
root-cause fix, and the user explicitly asked this rewrite to eliminate the *technique* instead of
continuing to manage around it.

**The fix:** all six orbit photos are now real alpha-transparent cutouts
(`public/images/cutouts/*.webp`), rendered as plain `<img>` elements with **no** `mix-blend-mode` and
**no** `isolation` anywhere on `.orbit-item` (see `app/home.css`'s comment on that rule — the
properties are removed entirely, not merely disabled). `gsap.config({ force3D: false })` was *not*
carried forward into this project — it existed only to avoid triggering the GPU-layer-plus-blend-mode
bug, and with the blend mode gone there's nothing left for it to mitigate. (GSAP's default
`force3D:"auto"` is otherwise desirable — it's what makes transforms GPU-accelerated for smooth
60fps motion.)

### What was done for each of the six images

| Orbit slot | Source | Method | Result |
|---|---|---|---|
| Executive chairs | `images/cutouts/executive-chair.webp` (already existed in the Astro source) | Copied as-is | Real cutout, no caveat |
| Office tables | `images/cutouts/desk.webp` (already existed) | Copied as-is | Real cutout, no caveat |
| Cupboards | `images/cutouts/cupboard.webp` (already existed) | Copied as-is | Real cutout, no caveat |
| Vertical blinds | `images/cutouts/blinds.webp` (already existed) | Copied as-is | Real cutout, no caveat |
| **Computer chairs** | `images/product-computer-chair.webp` (white-studio original — **no existing cutout**) | **Newly generated** (see method below) | Real cutout, no caveat |
| **Visitor chairs** | `images/product-visitor-chair.webp` (white-studio original — **no existing cutout**) | **Newly generated** (see method below) | Real cutout, no caveat |

**All six ship with real alpha transparency. Neither of the two newly-generated images needed to
fall back to the non-cutout original** — there is no caveat to flag here; this was not a forced
fallback.

### Method used for the two newly-generated cutouts (computer-chair, visitor-chair)

No Python interpreter was available in this environment (only an unconfigured Microsoft Store stub),
so `rembg` (which needs Python) wasn't an option. Node.js was available, so the cutouts were produced
with a custom flood-fill script using the `sharp` image library, written to match the *method*
described in the Astro source's CLAUDE.md for how the existing cutouts were made ("flood-filling its
white background"):

1. **Border-seeded flood fill.** BFS from every edge pixel of the image. A pixel is "passable" (the
   fill flows through it, and it's treated as background) if it's near-neutral (max channel − min
   channel < 30, i.e. white/gray, not a saturated product colour) and bright enough (max channel ≥
   150). Any pixel that fails that test — i.e. actual product material/colour — blocks the fill
   entirely, which is what keeps the fill from eating into the product itself.
2. **Smooth alpha, not a hard cutout.** Passable pixels get alpha ramped smoothly from fully
   transparent (0) at/above brightness 246 down to fully opaque (255) at/below brightness 150,
   instead of a binary threshold. This removes both the pure-white studio backdrop and fades out the
   soft gray floor-shadow gradient under the product (matching what the *existing* cutouts already
   looked like on inspection — sampled `executive-chair.webp`'s own alpha channel and confirmed the
   floor shadow there is also gone, with only a ~0.5% sliver of feathered edge pixels).
3. **A second pass for enclosed "holes."** The visitor chair's source photo has a gap between the
   armrest and the seat where the white backdrop is visible but **not connected to the image border**
   (surrounded on all sides by the dark leather/chrome). A border-only flood fill can't reach an
   enclosed region like that. A second pass labels connected components of still-unresolved
   background-like pixels and removes any component that does **not** touch the image border too —
   this was verified necessary and working: before this pass, a visible magenta-background patch
   showed through that gap when test-composited; after it, the gap is correctly transparent, and
   the chrome frame (which is also bright, but part of a component that *does* legitimately connect
   outward through real chrome, not an enclosed hole) was confirmed untouched.

### Verification performed on all six images

Every one of the six final `public/images/cutouts/*.webp` files was checked programmatically
(equivalent to the brief's `Image.open(path).mode == 'RGBA'` check, done here with `sharp` since no
Python/Pillow was available): confirmed `hasAlpha: true` on every file, and confirmed real,
non-trivial alpha variation (not just an RGBA-mode file that happens to be 100% opaque) —

```
executive-chair.webp   transparent: 50.7%  opaque: 48.8%  feathered edge: 0.5%
desk.webp              transparent: 41.6%  opaque: 58.0%  feathered edge: 0.3%
cupboard.webp          transparent:  6.0%  opaque: 93.9%  feathered edge: 0.1%
computer-chair.webp    transparent: 72.0%  opaque: 23.6%  feathered edge: 4.4%
visitor-chair.webp     transparent: 61.9%  opaque: 28.2%  feathered edge: 10.0%
blinds.webp            transparent: 16.8%  opaque: 82.7%  feathered edge: 0.6%
```

Also composited each of the two newly-generated images onto a solid magenta background and visually
inspected them (not just measured) to confirm: no white box/edge artifact around the chair, no dark
halo, the enclosed-hole fix on the visitor chair actually closed the gap, and the chrome legs/frame
on both chairs render intact (not eaten by the flood fill).

**Not reprocessed:** the 4 photos that already had correct existing cutouts
(`executive-chair.webp`, `desk.webp`, `cupboard.webp`, `blinds.webp`) were copied directly from the
Astro source's `public/images/cutouts/`, per the brief's explicit instruction not to reprocess
already-correct cutouts.

**Out of scope, left as-is:** `products/page.tsx`'s own catalogue shelf still shows the *original*
white-studio-background `product-computer-chair.webp` / `product-visitor-chair.webp` photos with the
`mix-blend-mode: multiply` trick on that page (`app/products.css`'s `.shelf-photo img` rule), exactly
as the Astro source did. The migration brief scoped the real-transparency fix to the hero orbit
specifically; the products page's own instance of the same technique was a known but explicitly
out-of-scope carry-over, not an oversight. (The two new cutout files *would* drop in cleanly there
too if a future task wants to extend the fix to that page — same `public/images/cutouts/` paths,
just swap the `<img src>` and drop `.no-blend`'s CSS pattern onto those two `.shelf-photo` elements.)

## Known issues found and fixed during this rewrite (not pre-existing in the Astro source)

These are new risks introduced specifically by Next.js's client-side routing, not present in the
static-HTML/Astro versions (which never had in-app navigation to begin with) — found and fixed during
the verification pass, documented here per "note bugs, don't silently fix pre-existing ones":

1. **Hydration warning on `<html className="js">`.** The inline script that mirrors the source's
   `document.documentElement.classList.add('js')` (see `app/layout.tsx`) runs before React hydrates,
   so the server-rendered markup (no class) and the live DOM (`class="js"`) briefly disagree. Fixed
   with `suppressHydrationWarning` on the `<html>` element — this only silences the warning for that
   element's own attributes, not its children, and the mismatch is the intended behaviour of the
   technique itself (see the inline script's own comment in `layout.tsx`).
2. **Stale nav `aria-current` surviving client-side navigation.** Reproduced directly: scroll to
   `#contact` on the products page (highlighting the "Contact" nav link via scroll-spy), then click
   "Home" — the "Contact" link stayed highlighted maroon on the home page because `Header`/nav lives
   in the root layout and never remounts on navigation, so the old page's scroll-spy state (an
   `aria-current="true"` attribute written directly to the DOM) just sat there until something new
   happened to intersect that exact element again. Fixed in `components/ScrollReveal.tsx`: on mount
   (i.e. on every page/navigation), it clears `aria-current` from every nav link it actually
   controls (real in-page `#id` targets) before setting up its own observers — but deliberately
   leaves the "Products" link's `aria-current` alone, since that one is set directly by `Header.tsx`
   from the current route and isn't scroll-spy-controlled.
3. **Missing `data-scroll-behavior="smooth"` on `<html>`.** Next 16 warns if `scroll-behavior:
   smooth` is set in CSS without this attribute, since it changes how Next manages scroll position
   during route transitions. Added to `app/layout.tsx`; confirmed the warning is gone and in-page
   hash scrolling (`#services`, `#contact`, cross-page `/#services` links) still works correctly via
   manual testing on both pages.

## Deviations from the Astro source (and why)

1. **GSAP as an npm package instead of a vendored `<script>` tag** — see "GSAP" above. Explicitly
   authorized by the migration brief as the React-idiomatic choice.
2. **No `vendor/gsap.min.js` in `public/`** — not needed once GSAP is an npm dependency; not copied
   over, unlike the brief's literal file list, since copying it would've been dead weight nobody
   loads. Flagging this explicitly as a deviation from "public/images/, public/vendor/gsap.min.js —
   copied over" in the brief.
3. **Nav scroll-spy no longer needs the source's "union of both pages' selectors" hack.** The Astro
   source had to special-case non-`#` `href`s in a try/catch because one shared script ran verbatim
   on two different static HTML files whose nav links pointed at different things depending on which
   page they were *not* currently on (see that project's CLAUDE.md, deviation #4). Here, `Header.tsx`
   already renders the *correct* `href` for whichever page is actually current (an in-page `#id` on
   that page, a `/`-prefixed cross-page link otherwise), so `ScrollReveal.tsx`'s
   `document.querySelector(href)` is only ever attempted on a real `#id` in practice. The try/catch
   is kept anyway as a harmless second safety net, matching the source's own belt-and-braces
   approach, but the Next.js version of the problem it originally guarded against doesn't exist here.
4. **Plain `<img>` instead of `next/image`** for all product/content photos. `next/image` needs
   either local static imports (awkward for the many remote `images.pexels.com` URLs used throughout
   both pages) or a `remotePatterns` allowlist in `next.config.ts`, and its automatic layout
   behaviour (intrinsic sizing, blur placeholders, format negotiation) wasn't needed for fidelity to
   the source, which also just used plain `<img>`. Lower-risk choice for an exact-fidelity port; the
   brief explicitly permits either.
5. **Known pre-existing bug carried over unchanged, per the migration brief's "fidelity port"
   instruction:** `products/page.tsx`'s "Need something built to size, or a chair repaired?" link
   still points at `/#contact` (the home page's contact section) instead of this page's own
   same-page `#contact` — exactly as documented (and left alone) in the Astro source's CLAUDE.md.

## Hard constraints carried over from the source project

- GSAP core only — no ScrollTrigger or other plugin (verified: `grep -ri scrolltrigger` across
  `app/` and `components/` returns nothing).
- `prefers-reduced-motion` gating preserved everywhere it existed in the source — the global
  transition/animation-duration override in `app/globals.css`, plus the per-feature gates inside
  every component that runs a GSAP tween (checked via `window.matchMedia('(prefers-reduced-motion:
  reduce)')`, same as the source script did).
- All anchor IDs (`#home`, `#products`, `#services`, `#about`, `#use-cases`, `#contact`,
  `#enquiryForm`, etc.) preserved exactly.
- The enquiry form still does not transmit anywhere — same as the source's current state (see its
  PRODUCT.md: delivery method is an open decision). Not wired up here either; a separate future task.
