"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const WA_LINK =
  "https://wa.me/919886490295?text=Hi%20Relax%20Intact%2C%20I%27d%20like%20a%20quote.";

function WaIcon() {
  return (
    <svg className="wa-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.5 8.5h7M8.5 11.5h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Header chrome shared by both pages — ported from the Astro source's Layout.astro header markup
 * plus two behaviours from public/scripts/site.js:
 *  - nav-toggle (mobile menu open/close): React state instead of classList toggling, same effect.
 *  - the scroll-rail chair + gold fill line: GSAP quickTo-driven, tied to window scroll position
 *    (see the "Scroll motion" IIFE in the source script). This piece doesn't depend on which page
 *    is mounted below it (it only reads window.scrollY and the header's own width), so it's set up
 *    once here with an empty dependency array and cleaned up on unmount via useGSAP-style manual
 *    cleanup (removeEventListener + gsap.killTweensOf) — this component itself never unmounts in
 *    normal use since it lives in the root layout, but the cleanup is still correct/idiomatic for
 *    hot-reload and the rare case of the whole app remounting.
 */
export default function Header() {
  const pathname = usePathname();
  const page: "home" | "products" = pathname === "/products" ? "products" : "home";
  const [open, setOpen] = useState(false);
  const navLinksRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const chairRef = useRef<HTMLImageElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const homeHref = page === "home" ? "#home" : "/";
  const servicesHref = page === "home" ? "#services" : "/#services";
  const aboutHref = page === "home" ? "#about" : "/#about";

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    const links = navLinksRef.current;
    const header = headerRef.current;
    if (links && header) {
      links.style.top = Math.round(header.getBoundingClientRect().bottom) + "px";
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    const header = headerRef.current;
    const chair = chairRef.current;
    const fill = fillRef.current;
    if (!header || !chair || !fill) return;
    // Forced to never match — see HeroOrbit.tsx's comment on this same pattern.
    const reduce = window.matchMedia("not all");

    let chairW = 26;
    let maxX = 0;
    function measure() {
      maxX = Math.max(0, header!.clientWidth - chairW - 12);
    }
    measure();
    gsap.set(chair, { x: 6, transformOrigin: "50% 100%" });
    const setX = gsap.quickTo(chair, "x", { duration: reduce.matches ? 0 : 0.7, ease: "power3.out" });
    const setRot = gsap.quickTo(chair, "rotation", { duration: 0.35, ease: "power2.out" });

    let lastY = window.scrollY;
    let calmTimer: ReturnType<typeof setTimeout> | undefined;

    function progress() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    function update() {
      const p = progress();
      setX(6 + p * maxX);
      if (!reduce.matches) {
        const dy = window.scrollY - lastY;
        setRot(Math.max(-9, Math.min(9, dy * 0.25)));
        clearTimeout(calmTimer);
        calmTimer = setTimeout(() => setRot(0), 140);
      }
      gsap.set(fill!, { scaleX: p });
      lastY = window.scrollY;
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    function onResize() {
      measure();
      update();
    }
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      clearTimeout(calmTimer);
      gsap.killTweensOf(chair);
      gsap.killTweensOf(fill);
    };
  }, []);

  // close the mobile menu whenever the route changes (e.g. a nav link to /products)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="wrap nav">
        {page === "home" ? (
          <a href={homeHref} className="logo" aria-label="Relax Intact Furnitures, home">
            <img className="logo-mark" src="/images/logo-mark.png" width={640} height={283} alt="" />
            <span className="logo-text">
              <span className="lt-name">Relax Intact</span>
              <span className="lt-sub">Furnitures</span>
              <img className="tagline-hl fl-tag" src="/images/logo-tagline.png" width={520} height={28} alt="Elevate your comfort" />
            </span>
          </a>
        ) : (
          <Link href={homeHref} className="logo" aria-label="Relax Intact Furnitures, home">
            <img className="logo-mark" src="/images/logo-mark.png" width={640} height={283} alt="" />
            <span className="logo-text">
              <span className="lt-name">Relax Intact</span>
              <span className="lt-sub">Furnitures</span>
              <img className="tagline-hl fl-tag" src="/images/logo-tagline.png" width={520} height={28} alt="Elevate your comfort" />
            </span>
          </Link>
        )}

        <nav aria-label="Primary">
          <ul className={`nav-links${open ? " open" : ""}`} id="navLinks" ref={navLinksRef}>
            <li>
              {page === "home" ? (
                <a href={homeHref} onClick={closeMenu}>Home</a>
              ) : (
                <Link href={homeHref} onClick={closeMenu}>Home</Link>
              )}
            </li>
            <li>
              <Link href="/products" aria-current={page === "products" ? "true" : undefined} onClick={closeMenu}>
                Products
              </Link>
            </li>
            <li>
              {page === "home" ? (
                <a href={servicesHref} onClick={closeMenu}>Services</a>
              ) : (
                <Link href={servicesHref} onClick={closeMenu}>Services</Link>
              )}
            </li>
            <li>
              {page === "home" ? (
                <a href={aboutHref} onClick={closeMenu}>About</a>
              ) : (
                <Link href={aboutHref} onClick={closeMenu}>About</Link>
              )}
            </li>
            <li>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </li>
            <li className="nav-quote">
              <a
                href={WA_LINK}
                className="btn btn-primary"
                target="_blank"
                rel="noopener"
                aria-label="Chat with us on WhatsApp"
                onClick={closeMenu}
              >
                <WaIcon />
                <span>WhatsApp</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="nav-cta">
          <a href={WA_LINK} className="btn btn-primary" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
            <WaIcon />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            className="nav-toggle"
            id="navToggle"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={toggleMenu}
          >
            <span />
          </button>
        </div>
      </div>
      <div className="scroll-rail" aria-hidden="true">
        <span className="rail-fill" ref={fillRef} />
        <img className="rail-chair" ref={chairRef} src="/images/chair-cutout.webp" width={240} height={252} alt="" />
      </div>
    </header>
  );
}
