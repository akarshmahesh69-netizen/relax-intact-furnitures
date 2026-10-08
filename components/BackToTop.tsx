"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Fixed bottom-left back-to-top button. Ported from the "Scroll motion" IIFE in the Astro source's
 * public/scripts/site.js: appears once the bottom of `#products` has scrolled past the middle of
 * the viewport, scrolls to top on click and refocuses `#heroTitle` (tabindex="-1" on both pages'
 * h1). `#products` exists on both pages (the home page's reel section and the products page's own
 * catalogue section both use that id — see the source CLAUDE.md), so this one scroll listener
 * works unmodified on either route without needing to know which page is currently mounted; it
 * re-reads `document.getElementById('products')` on every scroll tick rather than caching the
 * element once, so it keeps working correctly across client-side navigation between the two pages
 * without a separate re-subscribe effect.
 */
export default function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const toTop = btnRef.current;
    if (!toTop) return;
    // Forced to never match — see HeroOrbit.tsx's comment on this same pattern.
    const reduce = window.matchMedia("not all");
    gsap.set(toTop, { autoAlpha: 0, y: 16, scale: 0.8 });
    let shown = false;

    function update() {
      const products = document.getElementById("products");
      const past = !!products && products.getBoundingClientRect().bottom < window.innerHeight * 0.5;
      if (past !== shown) {
        shown = past;
        gsap.to(
          toTop!,
          past
            ? { autoAlpha: 1, y: 0, scale: 1, duration: reduce.matches ? 0 : 0.45, ease: "back.out(1.8)", overwrite: true }
            : { autoAlpha: 0, y: 16, scale: 0.8, duration: reduce.matches ? 0 : 0.25, ease: "power2.in", overwrite: true }
        );
      }
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      gsap.killTweensOf(toTop);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("heroTitle")?.focus({ preventScroll: true });
  }

  return (
    <button type="button" className="to-top" id="toTop" aria-label="Back to top" ref={btnRef} onClick={handleClick}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
