import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Products | Relax Intact Furnitures",
  description:
    "The full Relax Intact range: executive, computer and visitor chairs, office tables, cupboards and vertical blinds. Manufactured and supplied directly in Bangalore.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: "Products | Relax Intact Furnitures",
    description:
      "The full range of office chairs, tables, cupboards and blinds, manufactured and supplied directly in Bangalore.",
  },
};

export default function ProductsPage() {
  return (
    <>
      <ScrollReveal />

      {/* ================= PRODUCTS ================= */}
      <section className="section products-page-intro">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Products</span>
            <h1 id="heroTitle" tabIndex={-1}>The full range</h1>
            <p>Manufactured and supplied directly, then kept in working order. We&apos;re adding more varieties here as they&apos;re photographed. Call or use the form below for anything not yet listed.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="products">
        <div className="wrap">

          <div className="category" id="seating">
            <div className="cat-head"><h2>Office &amp; Executive Seating</h2></div>
            <div className="shelf">
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/cutouts/executive-chair.webp" width={537} height={851} alt="Tan leather high-back executive chair with a polished aluminium base" loading="lazy" decoding="async" /></div>
                <h3>Executive Chairs</h3>
                <p>High-back seating for cabins and leadership spaces, in leather or premium fabric.</p>
                <div className="shelf-chips"><span>High-back</span><span>Leather or fabric</span><span>Padded headrest</span></div>
                <button className="card-enquire" data-req="Executive Chairs">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/product-computer-chair.webp" width={1256} height={1256} alt="Black mesh computer chair with a headrest and adjustable armrests" loading="lazy" decoding="async" /></div>
                <h3>Computer Chairs</h3>
                <p>Adjustable seating for computer workstations and shared desks.</p>
                <div className="shelf-chips"><span>Mesh back</span><span>Headrest</span><span>Adjustable armrests</span></div>
                <button className="card-enquire" data-req="Computer Chairs">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/product-visitor-chair.webp" width={1300} height={1211} alt="Black leather visitor chair on a chrome cantilever frame" loading="lazy" decoding="async" /></div>
                <h3>Visitor Chairs</h3>
                <p>Bench and standalone seating for receptions, waiting areas and meeting rooms.</p>
                <div className="shelf-chips"><span>Cantilever frame</span><span>Reception</span><span>Meeting rooms</span></div>
                <button className="card-enquire" data-req="Visitor Chairs">Enquire →</button>
              </article>
            </div>
          </div>

          <div className="category" id="office-furniture">
            <div className="cat-head"><h2>Office Furniture</h2></div>
            <div className="shelf">
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/cutouts/desk.webp" width={970} height={498} alt="Executive office desk in walnut and charcoal with a lockable side drawer unit" loading="lazy" decoding="async" /></div>
                <h3>Office Tables</h3>
                <p>Desks, workstations and office solutions for offices of any size.</p>
                <div className="shelf-chips"><span>Cabin desk</span><span>Side drawer unit</span><span>Cable management</span></div>
                <button className="card-enquire" data-req="Office Tables">Enquire →</button>
              </article>
            </div>
          </div>

          <div className="category" id="storage">
            <div className="cat-head"><h2>Storage</h2></div>
            <div className="shelf">
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/cutouts/cupboard.webp" width={599} height={788} alt="Walnut and charcoal storage cupboard with lockable doors and glass-front shelves" loading="lazy" decoding="async" /></div>
                <h3>Cupboards</h3>
                <p>Storage units and filing cabinets for documents, stationery and supplies.</p>
                <div className="shelf-chips"><span>Lockable</span><span>Glass-door shelves</span><span>Filing</span></div>
                <button className="card-enquire" data-req="Cupboards">Enquire →</button>
              </article>
            </div>
          </div>

          <div className="category" id="sofas">
            <div className="cat-head"><h2>Sofas &amp; Lounge Seating</h2></div>
            <div className="shelf">
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/cutouts/sofa.webp" width={781} height={383} alt="Three-seater fabric sofa with wooden feet" loading="lazy" decoding="async" /></div>
                <h3>Sofas &amp; Lounge Seating</h3>
                <p>Sofas, lounge chairs and multi-seater chairs.</p>
                <div className="shelf-chips"><span>Sofas</span><span>Lounge chairs</span><span>Multi-seater chairs</span></div>
                <button className="card-enquire" data-req="Sofas &amp; Lounge Seating">Enquire →</button>
              </article>
            </div>
          </div>

          <div className="category" id="cafe">
            <div className="cat-head"><h2>Café &amp; Bar Seating</h2></div>
            <div className="shelf">
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/cutouts/bar-stool.webp" width={594} height={826} alt="Bar stool with a gold frame and white seat" loading="lazy" decoding="async" /></div>
                <h3>Café Chairs &amp; Bar Stools</h3>
                <p>Seating for cafés and bars.</p>
                <div className="shelf-chips"><span>Café chairs</span><span>Bar stools</span></div>
                <button className="card-enquire" data-req="Café &amp; Bar Seating">Enquire →</button>
              </article>
            </div>
          </div>

          <div className="category" id="blinds">
            <div className="cat-head"><h2>Vertical Blinds</h2></div>
            <div className="shelf">
              <article className="shelf-item">
                <div className="shelf-photo"><img src="/images/cutouts/blinds.webp" width={718} height={701} alt="Vertical window blinds in a warm grey woven fabric" loading="lazy" decoding="async" /></div>
                <h3>Vertical Blinds</h3>
                <p>Window blinds fitted for cabins, meeting rooms and open-plan offices.</p>
                <div className="shelf-chips"><span>Fabric vanes</span><span>Cabins</span><span>Meeting rooms</span><span>Supply &amp; installation</span></div>
                <button className="card-enquire" data-req="Vertical Blinds">Enquire →</button>
              </article>
            </div>
          </div>

          <div className="unsure-row">
            <p>Need something built to size, or a chair repaired? <a className="unsure-link" href="#contact">Tell us what you need →</a></p>
          </div>

        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="section section-alt band-rose" id="contact">
        <div className="wrap contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">Contact</span>
            <h2>Let&apos;s set up your workspace.</h2>
            <p>Tell us what you need. We&apos;ll get back with options, pricing and lead times.</p>

            <div className="contact-info">
              <div className="contact-info-row">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                <span>Call us at <a href="tel:+919886490295">98864 90295</a></span>
              </div>
              <div className="contact-info-row">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>
                <span>Relax Intact, Manufacturers of Office Furnitures, Lalbagh Fort Road, Minerva Circle, Bangalore 560 004</span>
              </div>
              <div className="contact-info-row">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.6" /><path d="M4 6l8 7 8-7" stroke="currentColor" strokeWidth="1.6" /></svg>
                <span>Prefer email? <a href="#contact">Use the enquiry form →</a></span>
              </div>
            </div>

            <div className="contact-image">
              <img
                src="/images/contact-office.webp"
                width={1152}
                height={769}
                alt="Relax Intact office workspace with staff at ergonomic mesh-back chairs and desks"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
