"use client";

import { useEffect, useRef } from "react";

/**
 * Products reel — one highlight per category on a pinned horizontal scroll. Ported from the
 * "Products reel" IIFE in the Astro source's public/scripts/site.js: the section's height is set
 * to the sticky panel's height plus the track's horizontal overflow, so vertical scroll maps 1:1
 * onto sideways travel while the panel is pinned; `prefers-reduced-motion` falls back to a plain
 * swipeable strip (handled by CSS alone — see `.reel-track` in app/home.css).
 *
 * No GSAP here (the source didn't use it for this effect either, just plain scroll math + CSS
 * transforms), so this is a plain useEffect with window scroll/resize listeners, cleaned up on
 * unmount. Scoped to this component's own refs instead of `document.getElementById`.
 */
export default function ProductsReel() {
  const reelRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reel = reelRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!reel || !pin || !track) return;

    try {
      // Forced to never match — see HeroOrbit.tsx's comment on this same pattern.
      const mq = window.matchMedia("not all");
      const header = document.querySelector<HTMLElement>(".site-header");
      let maxX = 0,
        stickTop = 90,
        ticking = false;

      function measure() {
        if (mq.matches) {
          reel!.style.height = "";
          track!.style.transform = "";
          pin!.style.top = "";
          return;
        }
        stickTop = header ? Math.round(header.getBoundingClientRect().height) : 90;
        pin!.style.top = stickTop + "px";
        maxX = Math.max(0, track!.scrollWidth - window.innerWidth);
        reel!.style.height = pin!.offsetHeight + maxX + "px";
      }
      function update() {
        ticking = false;
        if (mq.matches) return;
        const p = maxX > 0 ? Math.min(1, Math.max(0, (stickTop - reel!.getBoundingClientRect().top) / maxX)) : 0;
        track!.style.transform = "translate3d(" + (-p * maxX).toFixed(1) + "px,0,0)";
      }
      function onScroll() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      }
      function onResize() {
        measure();
        update();
      }
      function onMqChange() {
        measure();
        update();
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      mq.addEventListener("change", onMqChange);
      window.addEventListener("load", onResize);
      measure();
      update();

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        mq.removeEventListener("change", onMqChange);
        window.removeEventListener("load", onResize);
        reel!.style.height = "";
        track!.style.transform = "";
        pin!.style.top = "";
      };
    } catch (e) {
      if (window.console && console.error) console.error("Products reel error:", e);
    }
  }, []);

  return (
    <section className="products-reel reel" id="products" aria-label="Products" ref={reelRef}>
      <div className="reel-pin" ref={pinRef}>
        <div className="reel-head">
          <div className="reel-head-text">
            <span className="eyebrow eyebrow-highlight">Products</span>
            <h2>Furniture for every workspace</h2>
            <p>One highlight from each range.</p>
          </div>
          <div className="reel-actions">
            <a className="btn btn-primary reel-btn" href="/products">
              <span>Explore range</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn-outline reel-btn reel-call" href="tel:+919886490295" aria-label="Call us on 98864 90295">
              <svg className="call-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              <span>Call us</span>
            </a>
          </div>
        </div>
        <div className="reel-track" id="reelTrack" ref={trackRef}>
          <a className="reel-card" href="/products#seating">
            <span className="reel-photo"><img src="/images/cutouts/executive-chair.webp" width={537} height={851} alt="Tan leather high-back executive chair" loading="lazy" decoding="async" /></span>
            <h3>Office &amp; Executive Seating <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Office chairs, executive chairs, computer chairs.</p>
          </a>
          <a className="reel-card reel-card--wide" href="/products#office-furniture">
            <span className="reel-photo"><img src="/images/cutouts/desk.webp" width={970} height={498} alt="Walnut and charcoal office desk with a drawer unit" loading="lazy" decoding="async" /></span>
            <h3>Office Furniture <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Desks, workstations, office solutions.</p>
          </a>
          <a className="reel-card" href="/products#storage">
            <span className="reel-photo"><img src="/images/cutouts/cupboard.webp" width={599} height={788} alt="Walnut and charcoal storage cupboard" loading="lazy" decoding="async" /></span>
            <h3>Storage <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Cupboards and filing cabinets.</p>
          </a>
          <a className="reel-card reel-card--wide" href="/products#sofas">
            <span className="reel-photo"><img src="/images/cutouts/sofa.webp" width={781} height={383} alt="Three-seater fabric sofa" loading="lazy" decoding="async" /></span>
            <h3>Sofas &amp; Lounge Seating <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Sofas, lounge chairs, multi-seater chairs.</p>
          </a>
          <a className="reel-card" href="/products#cafe">
            <span className="reel-photo"><img src="/images/cutouts/bar-stool.webp" width={594} height={826} alt="Bar stool with a gold frame and white seat" loading="lazy" decoding="async" /></span>
            <h3>Café &amp; Bar Seating <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Café chairs and bar stools.</p>
          </a>
          <a className="reel-card" href="/products#blinds">
            <span className="reel-photo"><img src="/images/cutouts/blinds.webp" width={718} height={701} alt="Vertical window blinds" loading="lazy" decoding="async" /></span>
            <h3>Vertical Blinds <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Supply and installation.</p>
          </a>
          <a className="reel-card reel-card--service" href="#contact" data-req="Custom order">
            <span className="reel-photo"><img src="/images/category-custom.webp" width={720} height={600} alt="Craftsman fitting a wooden chair frame beside fabric swatches" loading="lazy" decoding="async" /></span>
            <h3>Custom / Made-to-Order <span className="arrow" aria-hidden="true">→</span></h3>
            <p>Built to your size, fabric and finish.</p>
          </a>
          <a className="reel-card reel-card--service" href="#contact" data-req="Repair">
            <span className="reel-photo"><img src="/images/category-repair.webp" width={720} height={540} alt="Hands re-upholstering a chair seat with a staple gun" loading="lazy" decoding="async" /></span>
            <h3>Repairs, Servicing &amp; Cleaning <span className="arrow" aria-hidden="true">→</span></h3>
            <p>All types of chairs and furniture.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
