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
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "linear-gradient(160deg, var(--gold-tint), var(--maroon-tint))" }}><img src="https://images.pexels.com/photos/12269763/pexels-photo-12269763.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/12269763/pexels-photo-12269763.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/12269763/pexels-photo-12269763.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={800} alt="Pair of black mesh ergonomic task chairs with teal seat cushions and chrome bases" loading="lazy" decoding="async" /></div>
                <h3>Ergonomic Task Chair</h3>
                <p>Everyday desk seating with lumbar support and smooth-rolling castors.</p>
                <div className="shelf-chips"><span>Lumbar support</span><span>Adjustable height</span><span>Nylon castors</span></div>
                <button className="card-enquire" data-req="Office Chairs">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo no-blend" style={{ ["--tile" as string]: "var(--gold-tint)" }}><img src="https://images.pexels.com/photos/9300767/pexels-photo-9300767.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/9300767/pexels-photo-9300767.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/9300767/pexels-photo-9300767.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={1200} alt="Row of black high-back conference room chairs around boardroom tables" loading="lazy" decoding="async" /></div>
                <h3>Conference Room Chairs</h3>
                <p>Matching high-back seating for boardrooms and training rooms.</p>
                <div className="shelf-chips"><span>High-back</span><span>Chrome frame</span><span>Matching sets</span></div>
                <button className="card-enquire" data-req="Visitor Chairs">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo no-blend" style={{ ["--tile" as string]: "var(--maroon-tint)" }}><img src="https://images.pexels.com/photos/37468394/pexels-photo-37468394.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/37468394/pexels-photo-37468394.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/37468394/pexels-photo-37468394.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={571} alt="Teal high-back manager's office chair with a headrest and padded armrests" loading="lazy" decoding="async" /></div>
                <h3>Manager&apos;s Chair</h3>
                <p>Cushioned high-back seating with a headrest for cabins and managers&apos; desks.</p>
                <div className="shelf-chips"><span>Headrest</span><span>Padded armrests</span><span>Tilt lock</span></div>
                <button className="card-enquire" data-req="Executive Chairs">Enquire →</button>
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
              <article className="shelf-item">
                <div className="shelf-photo no-blend" style={{ ["--tile" as string]: "var(--bg)" }}><img src="https://images.pexels.com/photos/12255816/pexels-photo-12255816.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/12255816/pexels-photo-12255816.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/12255816/pexels-photo-12255816.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={533} alt="Row of grey powder-coated steel storage lockers with individual lockable doors" loading="lazy" decoding="async" /></div>
                <h3>Steel Storage Lockers</h3>
                <p>Multi-compartment steel lockers for staff belongings and shared storage.</p>
                <div className="shelf-chips"><span>Lockable doors</span><span>Multi-compartment</span><span>Powder-coated steel</span></div>
                <button className="card-enquire" data-req="Cupboards">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo no-blend" style={{ ["--tile" as string]: "linear-gradient(160deg, var(--maroon-tint), var(--gold-tint))" }}><img src="https://images.pexels.com/photos/36126272/pexels-photo-36126272.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/36126272/pexels-photo-36126272.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/36126272/pexels-photo-36126272.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={533} alt="Tall modular slotted-angle storage racking with adjustable steel shelves in a warehouse aisle" loading="lazy" decoding="async" /></div>
                <h3>Slotted Angle Rack</h3>
                <p>Modular slotted-angle shelving that bolts together without welding, built to the space.</p>
                <div className="shelf-chips"><span>Modular</span><span>Adjustable shelves</span><span>Bolted assembly</span></div>
                <button className="card-enquire" data-req="Storage Racks">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo no-blend" style={{ ["--tile" as string]: "linear-gradient(160deg, var(--gold-tint), var(--maroon-tint))" }}><img src="https://images.pexels.com/photos/12706241/pexels-photo-12706241.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/12706241/pexels-photo-12706241.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/12706241/pexels-photo-12706241.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={533} alt="Heavy-duty red and black slotted-angle pallet racking in a warehouse aisle" loading="lazy" decoding="async" /></div>
                <h3>Heavy-Duty Slotted Angle Rack</h3>
                <p>Reinforced slotted-angle racking for bulk stock and heavier loads.</p>
                <div className="shelf-chips"><span>Heavy-duty</span><span>Pallet storage</span><span>Powder-coated</span></div>
                <button className="card-enquire" data-req="Storage Racks">Enquire →</button>
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
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "var(--gold-tint)" }}><img src="https://images.pexels.com/photos/10912069/pexels-photo-10912069.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/10912069/pexels-photo-10912069.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/10912069/pexels-photo-10912069.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={1200} alt="White upholstered two-seater lounge sofa on a studio background" loading="lazy" decoding="async" /></div>
                <h3>Two-seater Lounge Sofa</h3>
                <p>Compact upholstered sofa for reception areas and breakout corners.</p>
                <div className="shelf-chips"><span>Two-seater</span><span>Upholstered</span><span>Wooden feet</span></div>
                <button className="card-enquire" data-req="Sofas &amp; Lounge Seating">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "var(--maroon-tint)" }}><img src="https://images.pexels.com/photos/4172381/pexels-photo-4172381.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/4172381/pexels-photo-4172381.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/4172381/pexels-photo-4172381.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={533} alt="Brown L-shaped sectional sofa with striped cushions" loading="lazy" decoding="async" /></div>
                <h3>L-shaped Sectional Sofa</h3>
                <p>Corner sectional seating for larger lounges and waiting areas.</p>
                <div className="shelf-chips"><span>L-shaped</span><span>Sectional</span><span>Striped cushions</span></div>
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
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "var(--gold-tint)" }}><img src="https://images.pexels.com/photos/10936095/pexels-photo-10936095.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/10936095/pexels-photo-10936095.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/10936095/pexels-photo-10936095.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={1000} alt="Black perforated plastic bar stool on a white studio background" loading="lazy" decoding="async" /></div>
                <h3>Perforated Bar Stool</h3>
                <p>Lightweight stackable stool for cafés and breakout counters.</p>
                <div className="shelf-chips"><span>Stackable</span><span>Perforated seat</span><span>Powder-coated legs</span></div>
                <button className="card-enquire" data-req="Café &amp; Bar Seating">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "var(--maroon-tint)" }}><img src="https://images.pexels.com/photos/19663734/pexels-photo-19663734.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/19663734/pexels-photo-19663734.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/19663734/pexels-photo-19663734.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={1199} alt="Black adjustable swivel bar stool with a round wooden seat" loading="lazy" decoding="async" /></div>
                <h3>Adjustable Swivel Stool</h3>
                <p>Height-adjustable stool with a swivel wooden seat for café counters.</p>
                <div className="shelf-chips"><span>Height-adjustable</span><span>Swivel seat</span><span>Metal frame</span></div>
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
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "var(--bg)" }}><img src="https://images.pexels.com/photos/4220436/pexels-photo-4220436.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/4220436/pexels-photo-4220436.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/4220436/pexels-photo-4220436.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={600} alt="Cream textile vertical window blinds with sunlight filtering through" loading="lazy" decoding="async" /></div>
                <h3>Cream Vertical Blinds</h3>
                <p>Soft cream fabric vanes that diffuse daylight without blocking the view.</p>
                <div className="shelf-chips"><span>Textile vanes</span><span>Light-diffusing</span><span>Cabins</span></div>
                <button className="card-enquire" data-req="Vertical Blinds">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo" style={{ ["--tile" as string]: "var(--gold-tint)" }}><img src="https://images.pexels.com/photos/33996299/pexels-photo-33996299.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/33996299/pexels-photo-33996299.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/33996299/pexels-photo-33996299.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={1067} alt="Close-up of grey woven vertical window blinds" loading="lazy" decoding="async" /></div>
                <h3>Grey Woven Vertical Blinds</h3>
                <p>Woven grey vanes with a subtle texture for a neutral, modern look.</p>
                <div className="shelf-chips"><span>Woven texture</span><span>Neutral grey</span><span>Meeting rooms</span></div>
                <button className="card-enquire" data-req="Vertical Blinds">Enquire →</button>
              </article>
              <article className="shelf-item">
                <div className="shelf-photo no-blend" style={{ ["--tile" as string]: "linear-gradient(160deg, var(--maroon-tint), var(--gold-tint))" }}><img src="https://images.pexels.com/photos/18306897/pexels-photo-18306897.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800" srcSet="https://images.pexels.com/photos/18306897/pexels-photo-18306897.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/18306897/pexels-photo-18306897.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w" width={800} height={533} alt="Amber-toned vertical blinds fitted in a boardroom with a flipchart stand" loading="lazy" decoding="async" /></div>
                <h3>Amber Vertical Blinds</h3>
                <p>Warm amber vanes fitted in a boardroom, shown here with natural light through the window.</p>
                <div className="shelf-chips"><span>Warm tone</span><span>Supply &amp; installation</span><span>Boardrooms</span></div>
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
                src="https://images.pexels.com/photos/31236091/pexels-photo-31236091.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                srcSet="https://images.pexels.com/photos/31236091/pexels-photo-31236091.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/31236091/pexels-photo-31236091.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                sizes="(max-width: 900px) 92vw, 50vw"
                width={800}
                height={450}
                alt="Warm, comfortable workspace with an ergonomic chair and desk"
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
