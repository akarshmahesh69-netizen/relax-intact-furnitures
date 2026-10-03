"use client";

import { useEffect } from "react";

/**
 * Global, delegated click handler for every `[data-req]` enquire button/link on either page (hero
 * "Free Furniture Guide" CTA, reel/shelf cards, services custom/repair cards). Ported from the
 * top of public/scripts/site.js's IIFE in the Astro source.
 *
 * Mounted once in the root layout (components persist there across client-side navigation between
 * / and /products), using a single `document` click listener instead of binding one listener per
 * button. That's a deliberate difference from the source's `querySelectorAll('[data-req]').forEach`
 * (which bound a fixed set of listeners once, fine for a static multi-page site): event delegation
 * means this keeps working for whichever buttons exist on whichever page is currently mounted,
 * without needing to re-query the DOM (and re-bind listeners) on every route change.
 *
 * Talks to the enquiry form itself via a `window` CustomEvent — see the listener in
 * components/EnquiryForm.tsx — rather than writing to the form's `<select>` DOM node directly,
 * since that node's value is owned by React state there.
 */
export default function EnquireDelegate() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLElement>("[data-req]");
      if (!btn) return;
      const requirement = btn.getAttribute("data-req") ?? "";
      window.dispatchEvent(new CustomEvent("enquire:prefill", { detail: { requirement } }));
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
