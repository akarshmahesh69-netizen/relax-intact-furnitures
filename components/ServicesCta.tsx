"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The Services section's "Call us" CTA — extra layer on top of the shared `.reel-btn`
 * magnetic/ring/press behaviour in ReelButtons.tsx (both are mounted together on the home page and
 * both bind to this same `<a>`, exactly like the source's two separate script IIFEs did). Ported
 * from the "Services 'Call us' CTA" IIFE in the Astro source's public/scripts/site.js: a spinning
 * conic-gradient glow ring (a real sibling span, inserted here via a ref instead of
 * `document.createElement` + `insertBefore`, since React owns this subtree), a synced idle cycle
 * (box-shadow pulse + breathing scale + icon wobble), a pointer-driven 3D tilt, a bespoke pop-in
 * once scrolled into view, and an expanding-ripple click flourish. All gated behind
 * prefers-reduced-motion.
 */
export default function ServicesCta() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const g = gsap;
    const cta = ctaRef.current;
    const glow = glowRef.current;
    if (!cta || !glow) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!g || reduce) {
      if (cta) g.set(cta, { opacity: 1, scale: 1 });
      return;
    }

    const ico = cta.querySelector<HTMLElement>(".call-ico");

    function syncGlow() {
      g.set(glow!, {
        left: cta!.offsetLeft - 8,
        top: cta!.offsetTop - 8,
        width: cta!.offsetWidth + 16,
        height: cta!.offsetHeight + 16,
      });
    }
    syncGlow();
    window.addEventListener("resize", syncGlow);
    const glowSpin = g.to(glow, { "--glow-angle": "+=360deg", duration: 4, ease: "none", repeat: -1 });

    const iconWobble = ico
      ? g
          .timeline({ paused: true })
          .to(ico, { rotation: -16, duration: 0.07 })
          .to(ico, { rotation: 14, duration: 0.09 })
          .to(ico, { rotation: -10, duration: 0.09 })
          .to(ico, { rotation: 8, duration: 0.08 })
          .to(ico, { rotation: 0, duration: 0.12, ease: "power2.out" })
      : null;

    g.set(cta, { "--pulse-spread": "0px", "--pulse-alpha": 0.55 });
    const idle = g
      .timeline({ repeat: -1, paused: true })
      .to(cta, { "--pulse-spread": "14px", "--pulse-alpha": 0, scale: 1.02, duration: 1.7, ease: "power1.out" }, 0)
      .call(() => iconWobble?.restart(), undefined, 0.1)
      .to(cta, { scale: 1, duration: 0.5, ease: "power1.inOut" }, 1.7)
      .set(cta, { "--pulse-spread": "0px", "--pulse-alpha": 0.55 }, 1.7)
      .to({}, { duration: 1.1 });

    let shown = false;
    function popIn() {
      if (shown) return;
      shown = true;
      g.to(cta!, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.8)" });
      g.to(glow!, { opacity: 0.8, duration: 0.9, delay: 0.2, onComplete: () => idle.play() });
    }
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((en) => en.isIntersecting && popIn()),
        { threshold: 0.4 }
      );
      io.observe(cta);
    } else {
      popIn();
    }

    const qrx = g.quickTo(cta, "rotationX", { duration: 0.4, ease: "power3.out" });
    const qry = g.quickTo(cta, "rotationY", { duration: 0.4, ease: "power3.out" });
    g.set(cta, { transformPerspective: 600 });

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = cta!.getBoundingClientRect();
      qry(((e.clientX - r.left) / r.width - 0.5) * 16);
      qrx(-((e.clientY - r.top) / r.height - 0.5) * 12);
    }
    function onEnter(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      idle.pause();
      g.set(cta!, { "--pulse-alpha": 0 });
      g.to(cta!, { scale: 1.08, duration: 0.3, ease: "power2.out" });
      g.to(glow!, { opacity: 1, scale: 1.15, duration: 0.35, ease: "power2.out" });
      iconWobble?.restart();
    }
    function onLeave(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      g.to(cta!, { scale: 1, rotationX: 0, rotationY: 0, duration: 0.5, ease: "power2.out" });
      g.to(glow!, { opacity: 0.8, scale: 1, duration: 0.5, ease: "power2.out" });
      idle.restart().play();
    }
    function onDown() {
      g.to(cta!, { scale: 0.93, duration: 0.1, ease: "power2.out" });
    }
    function onRelease() {
      g.to(cta!, { scale: 1.08, duration: 0.45, ease: "elastic.out(1, 0.4)" });
    }
    function onClick(e: MouseEvent) {
      if (ico) g.fromTo(ico, { rotation: -28, scale: 1.3 }, { rotation: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      const r = cta!.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "services-ripple";
      dot.style.left = e.clientX - r.left + "px";
      dot.style.top = e.clientY - r.top + "px";
      cta!.appendChild(dot);
      g.fromTo(dot, { scale: 0, autoAlpha: 0.6 }, { scale: 22, autoAlpha: 0, duration: 0.6, ease: "power2.out", onComplete: () => dot.remove() });
    }

    cta.addEventListener("pointermove", onMove);
    cta.addEventListener("pointerenter", onEnter);
    cta.addEventListener("pointerleave", onLeave);
    cta.addEventListener("pointerdown", onDown);
    cta.addEventListener("pointerup", onRelease);
    cta.addEventListener("pointercancel", onRelease);
    cta.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", syncGlow);
      cta.removeEventListener("pointermove", onMove);
      cta.removeEventListener("pointerenter", onEnter);
      cta.removeEventListener("pointerleave", onLeave);
      cta.removeEventListener("pointerdown", onDown);
      cta.removeEventListener("pointerup", onRelease);
      cta.removeEventListener("pointercancel", onRelease);
      cta.removeEventListener("click", onClick);
      io?.disconnect();
      glowSpin.kill();
      idle.kill();
      iconWobble?.kill();
      gsap.killTweensOf(cta);
      gsap.killTweensOf(glow);
      if (ico) gsap.killTweensOf(ico);
      cta.querySelectorAll(".services-ripple").forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="services-cta">
      <span className="services-call-glow" aria-hidden="true" ref={glowRef} />
      <a
        className="btn btn-outline reel-btn services-call"
        href="tel:+919886490295"
        aria-label="Call us on 98864 90295"
        ref={ctaRef}
      >
        <svg className="call-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span>Prefer to talk? Call us: 98864 90295</span>
      </a>
    </div>
  );
}
