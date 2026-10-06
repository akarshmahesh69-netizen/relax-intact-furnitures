"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The Services section's "Call us" CTA — extra layer on top of the shared `.reel-btn`
 * magnetic/ring/press behaviour in ReelButtons.tsx (both are mounted together on the home page and
 * both bind to this same `<a>`, exactly like the source's two separate script IIFEs did). Replaces
 * the earlier spinning conic-gradient glow ring with a solid bright gold pill background (the CTA
 * sits on the dark maroon services section, so it needed to read as the obvious "bright" action)
 * and a small circular call-icon badge with its own idle pulse ring — a self-contained "vector
 * button" rather than a glow wrapping the whole CTA. Keeps the synced idle cycle (ring pulse +
 * breathing scale + icon wobble), a pointer-driven 3D tilt, a bespoke pop-in once scrolled into
 * view, and an expanding-ripple click flourish. All gated behind prefers-reduced-motion.
 */
export default function ServicesCta() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const g = gsap;
    const cta = ctaRef.current;
    const ring = ringRef.current;
    if (!cta || !ring) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!g || reduce) {
      if (cta) g.set(cta, { opacity: 1, scale: 1 });
      return;
    }

    const ico = cta.querySelector<HTMLElement>(".call-ico");

    const iconWobble = ico
      ? g
          .timeline({ paused: true })
          .to(ico, { rotation: -16, duration: 0.07 })
          .to(ico, { rotation: 14, duration: 0.09 })
          .to(ico, { rotation: -10, duration: 0.09 })
          .to(ico, { rotation: 8, duration: 0.08 })
          .to(ico, { rotation: 0, duration: 0.12, ease: "power2.out" })
      : null;

    g.set(ring, { scale: 1, opacity: 0.6 });
    const idle = g
      .timeline({ repeat: -1, paused: true })
      .to(ring, { scale: 1.9, opacity: 0, duration: 1.4, ease: "power1.out" }, 0)
      .call(() => iconWobble?.restart(), undefined, 0.1)
      .to(cta, { scale: 1.015, duration: 0.3, ease: "power1.out" }, 0.1)
      .to(cta, { scale: 1, duration: 0.4, ease: "power1.inOut" }, 0.4)
      .set(ring, { scale: 1, opacity: 0.6 }, 1.4)
      .to({}, { duration: 1 });

    let shown = false;
    function popIn() {
      if (shown) return;
      shown = true;
      g.to(cta!, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.8)", onComplete: () => idle.play() });
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
      g.to(cta!, { scale: 1.06, duration: 0.3, ease: "power2.out" });
      g.to(ring!, { scale: 1.3, opacity: 0.9, duration: 0.3, ease: "power2.out" });
      iconWobble?.restart();
    }
    function onLeave(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      g.to(cta!, { scale: 1, rotationX: 0, rotationY: 0, duration: 0.5, ease: "power2.out" });
      g.to(ring!, { scale: 1, opacity: 0.6, duration: 0.3, ease: "power2.out" });
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
      cta.removeEventListener("pointermove", onMove);
      cta.removeEventListener("pointerenter", onEnter);
      cta.removeEventListener("pointerleave", onLeave);
      cta.removeEventListener("pointerdown", onDown);
      cta.removeEventListener("pointerup", onRelease);
      cta.removeEventListener("pointercancel", onRelease);
      cta.removeEventListener("click", onClick);
      io?.disconnect();
      idle.kill();
      iconWobble?.kill();
      gsap.killTweensOf(cta);
      gsap.killTweensOf(ring);
      if (ico) gsap.killTweensOf(ico);
      cta.querySelectorAll(".services-ripple").forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="services-cta">
      <a
        className="reel-btn services-call"
        href="tel:+919886490295"
        aria-label="Call us on 98864 90295"
        ref={ctaRef}
      >
        <span className="call-icon-badge">
          <span className="call-icon-ring" aria-hidden="true" ref={ringRef} />
          <svg className="call-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </span>
        <span>Prefer to talk? Call us: 98864 90295</span>
      </a>
    </div>
  );
}
