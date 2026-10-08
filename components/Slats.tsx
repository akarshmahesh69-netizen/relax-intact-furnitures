"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Why/About section's vertical-rhythm divider — an equalizer-style bounce, each bar on its own
 * independent random loop so they never move in lockstep. Ported from the "Why/About slats
 * divider" IIFE in the Astro source's public/scripts/site.js. Starts once scrolled into view,
 * skipped for prefers-reduced-motion (bars stay at their static CSS heights either way).
 */
export default function Slats() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const g = gsap;
    if (!g) return;

    const bars = Array.from(wrap.querySelectorAll<HTMLElement>("span"));
    if (!bars.length) return;

    let cancelled = false;
    function pulse(bar: HTMLElement) {
      if (cancelled) return;
      g.to(bar, {
        scaleY: 0.35 + Math.random() * 0.85,
        duration: 0.3 + Math.random() * 0.35,
        ease: "sine.inOut",
        onComplete: () => pulse(bar),
      });
    }
    let started = false;
    function start() {
      if (started) return;
      started = true;
      bars.forEach((bar) => pulse(bar));
    }
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => entries.forEach((en) => en.isIntersecting && start()), { threshold: 0.3 });
      io.observe(wrap);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      bars.forEach((bar) => gsap.killTweensOf(bar));
    };
  }, []);

  return (
    <div className="slats" aria-hidden="true" style={{ marginTop: "var(--space-5)" }} ref={wrapRef}>
      <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
    </div>
  );
}
