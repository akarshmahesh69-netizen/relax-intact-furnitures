# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Existing codebase: two static pages, `index.html` (home) and `products.html` (full product catalogue), each self-contained (inline CSS and JS) plus `images/` and a locally vendored `vendor/gsap.min.js`. No build step — shared chrome between the two pages is duplicated, not included from one source (see CLAUDE.md).

## Users
Primary: offices and businesses in Bangalore that are furnishing a new office, renovating, or keeping existing furniture in working order. They compare vendors by phone and enquiry, and want one accountable supplier.
Secondary: individual and home-office buyers (single chairs, desks, blinds).

## Product Purpose
Marketing and enquiry site for Relax Intact Furnitures (Lalbagh Fort Road, Minerva Circle, Bangalore 560 004; phone 98864 90295). It shows the product range and services and turns visitors into enquiries. Success is a qualified enquiry (phone call or form), not a checkout.

## Positioning
One vendor that manufactures office furniture in its own Bangalore facility and also repairs, services and cleans it, sold direct with no dealer layers. A dealer that only resells cannot truthfully claim both.

## Operating Context
Products: executive, computer, office and visitor chairs; office tables; cupboards; vertical blinds. Services: manufacturing, sales, chair and sofa repair/servicing, chair and sofa shampoo/washing. Enquiries arrive through the on-page form and the phone number. The enquiry form currently does not transmit anywhere (front-end only); delivery method is an open decision.

## Capabilities and Constraints
- Six featured products in the hero orbit and on `products.html`: Executive chairs, Computer chairs, Office tables, Cupboards, Visitor chairs, Vertical blinds. The client has said more varieties exist and will be photographed later (2026-09-22) — `products.html`'s category structure (Seating / Workspaces & Storage / Finishing Touches) is meant to absorb those without a redesign; do not invent products or specs to fill it in the meantime.
- The home page (`index.html`) deliberately shows only a 3-item product teaser (one per category) plus a link to `products.html`, not the full range — user decision 2026-09-22, to keep the home page from turning into a mini-catalogue now that a dedicated Products page exists.
- Serves phones and desktops; the logo's dark maroon needs a light background.
- Enquiry delivery (decided 2026-09-26): WhatsApp (form opens a chat with name, phone and requirement pre-filled) plus email. The client will supply the WhatsApp link and the email address; until then the form still does not transmit and its "Enquiry received" message is misleading — do not ship it to real customers as is.
- Motion is intentional (decided 2026-09-26, in response to a critique): the hero orbit, the pinned product reel and the header chair exist so a visitor understands the business and its products in one look. Do not remove them; refinements such as a pause control are welcome, deletions are not.
- Placeholder imagery (decided 2026-09-26): the AI-generated photos (sofa, bar stool, custom/made-to-order and repair workshop shots) stay for now. Phase 2 replaces every photo with the client's real ones.
- "Free Furniture Guide" (decided 2026-09-26): a real buying guide is coming from the client — what a customer should consider and look for when buying furniture. Keep the button; it currently only prefills the enquiry form.

## Brand Commitments
- Name: Relax Intact Furnitures. Tagline: "Elevate your comfort".
- Logo supplied by the client (`relax_intact_logo.svg`, which is a raster picture in an SVG wrapper): RI monogram with gold swoosh and executive chair, serif wordmark, gold "FURNITURES", tagline. Use it as supplied, do not redraw or recolour it.
- "Made in India" is a stated claim on the site.
- Hero messaging (user-confirmed 2026-09-22, description updated 2026-09-22): "A Complete Partner for Better Spaces", eyebrow "FURNITURE MANUFACTURING · SUPPLY · SERVICE", and the line "From crafted furniture and custom requirements to reliable supply and ongoing care, we bring the entire furniture journey all together under one roof." On phones (≤900px) the description is shortened to "From crafted furniture to reliable supply and ongoing care, the whole furniture journey under one roof." (user-approved 2026-09-26; desktop keeps the full sentence). Tone: established, capable, modern, quality-focused, professional. Public copy must not explicitly list customer types (offices, schools and the like).

## Evidence on Hand
- Real product photographs (six studio shots in `images/`), the client logo, address and phone number.
- Absent and confidential: years in business, client names, counts of offices or chairs supplied, testimonials. The client asked for invented figures; that was declined. Future work must not fabricate proof, and may add a proof strip only when the client supplies real, permitted facts.

## Product Principles
1. Say only what is true: make it, repair it, sell direct.
2. One accountable vendor is the reason to enquire; lead with that.
3. Serve the business buyer first, and keep the home buyer reachable.
4. Every screen ends in a low-effort way to enquire.
5. Show the real products and the client's own logo, never stand-ins.

## Accessibility & Inclusion
Readable contrast and touch targets on phones; respect reduced-motion. No product-specific standard beyond that has been stated.
