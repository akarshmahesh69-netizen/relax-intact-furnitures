"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * Shared base interactivity layer for every `.reel-btn` on the home page (the products-reel's
 * "Explore range" + "Call us" pair, and the Services "Call us" CTA, which also carries this class
 * — see the source CLAUDE.md / ServicesCta.tsx for the extra layer on top of that one). Ported
 * from the "Interactive buttons (GSAP core)" IIFE in the Astro source's public/scripts/site.js:
 * mouse-only magnetic pull via quickTo, arrow slide, press squash, phone-icon ring on hover/focus.
 * Skipped entirely for prefers-reduced-motion, same as the source.
 *
 * Mounted once on the home page (alongside ProductsReel and the Services section in the same
 * component tree), so by the time this effect runs every `.reel-btn` element on the page has
 * already mounted. Unmounts with the page on navigation, which is what disposes these listeners —
 * there's nothing else to leak since this effect creates per-element GSAP quickTo functions and
 * plain event listeners, no observers/timers that outlive a single interaction.
 */
export default function ReelButtons() {
  useEffect(() => {
    const g = gsap;
    if (!g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>(".reel-btn").forEach((btn) => {
      const arrow = btn.querySelector<HTMLElement>(".arrow");
      const ico = btn.querySelector<HTMLElement>(".call-ico");
      const qx = g.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const qy = g.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      const ring = ico
        ? g
            .timeline({ paused: true })
            .to(ico, { rotation: -16, duration: 0.07 })
            .to(ico, { rotation: 14, duration: 0.09 })
            .to(ico, { rotation: -10, duration: 0.09 })
            .to(ico, { rotation: 8, duration: 0.08 })
            .to(ico, { rotation: 0, duration: 0.12, ease: "power2.out" })
        : null;

      function onMove(e: PointerEvent) {
        if (e.pointerType !== "mouse") return;
        const r = btn.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.22);
        qy((e.clientY - (r.top + r.height / 2)) * 0.32);
      }
      function onEnter() {
        if (arrow) g.to(arrow, { x: 6, duration: 0.25, ease: "power2.out", overwrite: true });
        if (ring) ring.restart();
      }
      function onLeave() {
        g.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true });
        if (arrow) g.to(arrow, { x: 0, duration: 0.25, ease: "power2.out", overwrite: true });
      }
      function onFocus() {
        if (ring) ring.restart();
      }
      function onDown() {
        g.to(btn, { scale: 0.95, duration: 0.12, ease: "power2.out" });
      }
      function onRelease() {
        g.to(btn, { scale: 1, duration: 0.4, ease: "back.out(2.2)" });
      }

      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerenter", onEnter);
      btn.addEventListener("pointerleave", onLeave);
      btn.addEventListener("focus", onFocus);
      btn.addEventListener("pointerdown", onDown);
      btn.addEventListener("pointerup", onRelease);
      btn.addEventListener("pointercancel", onRelease);
      btn.addEventListener("pointerleave", onRelease);

      cleanups.push(() => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerenter", onEnter);
        btn.removeEventListener("pointerleave", onLeave);
        btn.removeEventListener("focus", onFocus);
        btn.removeEventListener("pointerdown", onDown);
        btn.removeEventListener("pointerup", onRelease);
        btn.removeEventListener("pointercancel", onRelease);
        btn.removeEventListener("pointerleave", onRelease);
        ring?.kill();
        gsap.killTweensOf(btn);
        if (arrow) gsap.killTweensOf(arrow);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
