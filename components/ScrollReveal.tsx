"use client";

import { useEffect } from "react";

// Same union selector the Astro source's public/scripts/site.js used so one script could run
// safely on both pages (home-only classes like .service-card/.why-list li/.usecase-card, and
// products-only classes like .shelf-item/.unsure-row, each simply match nothing on the other
// page). Kept as a single shared list here for the same reason, even though in Next each page now
// mounts its own instance of this component — see the component doc comment below.
const REVEAL_SELECTOR =
  ".section-head, .service-card, .why-copy, .why-list li, .usecase-card, .shelf-item, .unsure-row, .contact-copy, form.enquiry";

/**
 * Nav scroll-spy (highlights the current section's nav link) + staggered reveal-on-scroll for
 * `.reveal`-eligible elements. Ported from the final IIFE block in the Astro source's
 * public/scripts/site.js.
 *
 * Mounted once per page (inside both app/page.tsx and app/products/page.tsx) rather than once in
 * the root layout: both behaviours depend on which sections/elements actually exist on the
 * *current* page, and a page component's own mount/unmount lifecycle is the simplest correct way
 * to re-run this setup (and fully dispose of the old IntersectionObservers) on every client-side
 * navigation between `/` and `/products` — no stale element references, no leaked observers.
 *
 * One deliberate simplification from the source: the source's nav-spy had to special-case non-hash
 * `href`s (like the old `products.html`) in a try/catch, because that script was shared verbatim
 * across two static HTML files whose nav links pointed at different things depending on which page
 * they were *not* currently on. Here, Header.tsx already renders the correct `href` for whichever
 * page is current (an in-page `#id` on that page, a `/`-prefixed cross-page link otherwise), so
 * `document.querySelector(href)` is only ever attempted on an actual `#id`; the try/catch is kept
 * anyway as a harmless second safety net, matching the source's own belt-and-braces approach.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");
    if (!navLinks) return;

    const navAnchors = Array.prototype.slice.call(
      navLinks.querySelectorAll<HTMLAnchorElement>("a:not(.btn)")
    ) as HTMLAnchorElement[];
    const spyTargets = navAnchors.map((a) => {
      const href = a.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return null;
      try {
        return document.querySelector(href);
      } catch {
        return null;
      }
    });

    // Clear any aria-current the previous page's scroll-spy left behind. Header/nav persist
    // across client-side navigation (they live in the root layout, not this page), so without
    // this a nav link highlighted as "current" on the page you left stays highlighted until its
    // target section happens to intersect again — which may never happen on the new page. The
    // static source never had this problem since every navigation there was a full page load.
    // Only clears links this spy actually controls (real in-page `#id` targets) — the "Products"
    // link's aria-current is set directly by Header.tsx from the route itself and must be left
    // alone here, or this would immediately erase it from underneath React.
    navAnchors.forEach((a, i) => {
      if (spyTargets[i]) a.removeAttribute("aria-current");
    });

    let spy: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            navAnchors.forEach((a, i) => {
              if (spyTargets[i] === en.target) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      spyTargets.forEach((t) => {
        if (t) spy!.observe(t);
      });
    }

    let reveal: IntersectionObserver | null = null;
    const revealTimers: ReturnType<typeof setTimeout>[] = [];
    const elements = Array.prototype.slice.call(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
    ) as HTMLElement[];
    if ("IntersectionObserver" in window) {
      reveal = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const t = en.target as HTMLElement;
            t.classList.add("in");
            reveal!.unobserve(t);
            const timer = setTimeout(() => {
              t.classList.remove("reveal", "in");
              t.style.removeProperty("--i");
            }, 1300);
            revealTimers.push(timer);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      elements.forEach((el) => {
        const sib = Array.prototype.indexOf.call(el.parentNode ? el.parentNode.children : [], el);
        el.style.setProperty("--i", String(Math.min(sib, 6)));
        el.classList.add("reveal");
        reveal!.observe(el);
      });
    }

    return () => {
      spy?.disconnect();
      reveal?.disconnect();
      revealTimers.forEach((t) => clearTimeout(t));
      // leave any already-revealed elements visible (matches the source: once "in" and the
      // reveal/in classes are stripped after the 1.3s delay, elements never re-hide)
    };
  }, []);

  return null;
}
