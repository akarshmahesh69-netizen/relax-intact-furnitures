"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Ported from the Astro source's Layout.astro footer markup. Needs `usePathname` to derive the
 * same home/services/about href differences Header does (see that component's comment), so unlike
 * the source's Astro component this has to be a client component — the hrefs are the only dynamic
 * part, everything else is static markup.
 */
export default function Footer() {
  const pathname = usePathname();
  const page: "home" | "products" = pathname === "/products" ? "products" : "home";
  const homeHref = page === "home" ? "#home" : "/";
  const servicesHref = page === "home" ? "#services" : "/#services";
  const aboutHref = page === "home" ? "#about" : "/#about";

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo-plate">
              <img className="fl-mark" src="/images/logo-mark.png" width={640} height={283} alt="" loading="lazy" />
              <img className="fl-word" src="/images/logo-wordmark.png" width={800} height={128} alt="Relax Intact Furnitures" loading="lazy" />
              <img className="tagline-hl fl-tag" src="/images/logo-tagline.png" width={520} height={28} alt="Elevate your comfort" loading="lazy" />
            </span>
            <p>Office furniture manufacturing, sales, and chair &amp; sofa repair and cleaning, based in Bangalore.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>{page === "home" ? <a href={homeHref}>Home</a> : <Link href={homeHref}>Home</Link>}</li>
              <li><Link href="/products">Products</Link></li>
              <li>{page === "home" ? <a href={servicesHref}>Services</a> : <Link href={servicesHref}>Services</Link>}</li>
              <li>{page === "home" ? <a href={aboutHref}>About</a> : <Link href={aboutHref}>About</Link>}</li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+919886490295">98864 90295</a></li>
              <li><a href="#contact">Lalbagh Fort Road, Minerva Circle, Bangalore 560 004</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Relax Intact Furnitures.</span>
          <span className="footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
}
