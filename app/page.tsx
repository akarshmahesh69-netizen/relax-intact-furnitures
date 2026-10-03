import EnquiryForm from "@/components/EnquiryForm";
import HeroOrbit from "@/components/HeroOrbit";
import ProductsReel from "@/components/ProductsReel";
import ReelButtons from "@/components/ReelButtons";
import ServicesCta from "@/components/ServicesCta";
import Slats from "@/components/Slats";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <ScrollReveal />
      <ReelButtons />

      {/* ================= HERO ================= */}
      <section className="hero" id="home" aria-labelledby="heroTitle">
        <div className="wrap hero-grid">
          <div className="hero-left">
            <div className="hero-copy">
              <div className="hero-photo-mobile" aria-hidden="true" />
              <div className="hero-head">
                <p className="eyebrow hero-eyebrow">FURNITURE MANUFACTURING · SUPPLY · SERVICE</p>
                <h1 id="heroTitle" className="hero-title" tabIndex={-1}>
                  <span>A Complete Partner</span>
                  <span>for <em>Better Spaces</em>.</span>
                </h1>
              </div>
              <p className="hero-lede">
                <span className="lede-full">From crafted furniture and custom requirements to reliable supply and ongoing care, we bring the entire furniture journey all together under one roof.</span>
                <span className="lede-short">From crafted furniture to reliable supply and ongoing care, the whole furniture journey under one roof.</span>
              </p>
              <div className="hero-cta-stack">
                <button type="button" className="btn btn-guide" data-req="Free furniture guide">
                  <svg className="guide-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Free Furniture Guide</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </button>
                <div className="hero-ctas">
                  <a href="#products" className="btn btn-primary btn-lg">Explore products</a>
                  <a href="#contact" className="btn btn-outline btn-lg">Talk to us <span className="arrow" aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </div>

          <HeroOrbit />
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <ProductsReel />

      {/* ================= SERVICES ================= */}
      <section className="section section-alt band-maroon" id="services">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-highlight">Services</span>
            <h2>Beyond supply: upkeep included</h2>
            <p>We manufacture it, deliver it, and keep it working. One vendor for the furniture and everything it needs afterward.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="media-frame">
                <img src="/images/service-manufacturing.webp" width={900} height={900} alt="Carpenter sanding a wooden chair frame by hand in the workshop" loading="lazy" decoding="async" />
              </div>
              <div className="service-body">
                <span className="service-label">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 6.5 18 3l3 3-3.5 3.5M3 21l7-7M8.5 12.5 15 6l3 3-6.5 6.5-3-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="service-num">Manufacturing</span>
                </span>
                <h3>Built at Our Own Facility</h3>
                <p className="svc-desc-full">Every chair, table and cupboard is manufactured at our own facility in Bangalore. We oversee production from the raw material to the finished piece.</p>
                <p className="svc-desc-short">Manufactured in-house at our own Bangalore facility.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="media-frame">
                <img src="/images/service-sales.webp" width={900} height={900} alt="Handing over a newly delivered office chair, still wrapped, to a customer" loading="lazy" decoding="async" />
              </div>
              <div className="service-body">
                <span className="service-label">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="7.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.7" /></svg>
                  <span className="service-num">Sales</span>
                </span>
                <h3>Direct Supply, No Middleman</h3>
                <p className="svc-desc-full">We supply chairs, tables, cupboards and blinds directly from our own stock. There is no dealer in between, so pricing and delivery stay straightforward.</p>
                <p className="svc-desc-short">Supplied directly from our own stock, no dealer markup.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="media-frame">
                <img src="/images/service-repair.webp" width={900} height={900} alt="Hand-stitching the leather seat of a chair on a workshop bench" loading="lazy" decoding="async" />
              </div>
              <div className="service-body">
                <span className="service-label">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6 2.4 2.4 6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2-2 2.6-2.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                  <span className="service-num">Repair</span>
                </span>
                <h3>Frame, Fabric &amp; Mechanism Repair</h3>
                <p className="svc-desc-full">Frames, mechanisms and upholstery are repaired by our own technicians. A damaged chair or sofa can usually be restored rather than replaced.</p>
                <p className="svc-desc-short">Frames, mechanisms and upholstery restored by our technicians.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="media-frame">
                <img src="/images/service-cleaning.webp" width={900} height={900} alt="Deep-cleaning an office chair seat with a fabric shampoo extractor" loading="lazy" decoding="async" />
              </div>
              <div className="service-body">
                <span className="service-label">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                  <span className="service-num">Cleaning</span>
                </span>
                <h3>Fabric &amp; Leather Shampoo Wash</h3>
                <p className="svc-desc-full">Our team deep cleans fabric and leather seating on site or at our workshop. Stains, dust and daily wear are removed without new upholstery.</p>
                <p className="svc-desc-short">Fabric and leather deep-cleaned on site or at our workshop.</p>
              </div>
            </div>
          </div>
          <ServicesCta />
        </div>
      </section>

      {/* ================= WHY / ABOUT ================= */}
      <section className="section" id="about">
        <div className="wrap why-grid">
          <div className="why-copy">
            <span className="eyebrow eyebrow-highlight">Why Relax Intact</span>
            <h2><span className="why-h2-full">One vendor for furniture and its upkeep</span><span className="why-h2-short">One vendor, furniture and upkeep</span></h2>
            <p className="why-desc-full">Most offices manage furniture purchase and furniture maintenance as two separate problems, with two separate vendors. <span className="brand-highlight">Relax Intact</span> handles both, for businesses furnishing a full office and for individuals furnishing a home workspace.</p>
            <p className="why-desc-short">One vendor manages both furniture and its upkeep, for offices and home workspaces alike.</p>
            <Slats />
            <div className="why-image">
              <img
                src="https://images.pexels.com/photos/5444195/pexels-photo-5444195.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                srcSet="https://images.pexels.com/photos/5444195/pexels-photo-5444195.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/5444195/pexels-photo-5444195.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                sizes="(max-width: 900px) 92vw, 38vw"
                width={800}
                height={640}
                alt="Modern conference room furnished with a wooden table and ergonomic chairs"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <ul className="why-list">
            <li>
              <span className="n" aria-hidden="true" />
              <span>Products and services from a single vendor, no separate contractor for repairs.</span>
            </li>
            <li>
              <span className="n" aria-hidden="true" />
              <span>Manufacturing and supply under one roof, from cabin furniture to reception seating.</span>
            </li>
            <li>
              <span className="n" aria-hidden="true" />
              <span>Repair, servicing and cleaning for furniture already in use, not only new purchases.</span>
            </li>
            <li>
              <span className="n" aria-hidden="true" />
              <span>Direct enquiry process, with no dealer layers between you and the manufacturer.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="section section-alt band-gold" id="use-cases">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-highlight">Use cases</span>
            <h2>Built for how offices and home workspaces actually change</h2>
          </div>

          <div className="usecase-grid">
            <div className="usecase-card">
              <div className="media-frame">
                <img
                  src="https://images.pexels.com/photos/273671/pexels-photo-273671.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                  srcSet="https://images.pexels.com/photos/273671/pexels-photo-273671.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/273671/pexels-photo-273671.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                  sizes="(max-width: 560px) 92vw, (max-width: 900px) 46vw, 30vw"
                  width={800}
                  height={533}
                  alt="Newly fitted-out office pod with desks and rolling chairs"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="usecase-body">
                <h3>New Office Setup</h3>
                <p>Furnishing a new office from scratch: chairs, tables, cupboards and blinds specified and supplied together.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="media-frame">
                <img
                  src="https://images.pexels.com/photos/28160884/pexels-photo-28160884.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                  srcSet="https://images.pexels.com/photos/28160884/pexels-photo-28160884.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/28160884/pexels-photo-28160884.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                  sizes="(max-width: 560px) 92vw, (max-width: 900px) 46vw, 30vw"
                  width={800}
                  height={533}
                  alt="Renovated meeting room with new chairs and vertical blinds"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="usecase-body">
                <h3>Office Renovation</h3>
                <p>Replacing or upgrading furniture during a renovation or move, without disrupting daily work.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="media-frame">
                <img
                  src="https://images.pexels.com/photos/31567147/pexels-photo-31567147.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                  srcSet="https://images.pexels.com/photos/31567147/pexels-photo-31567147.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/31567147/pexels-photo-31567147.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                  sizes="(max-width: 560px) 92vw, (max-width: 900px) 46vw, 30vw"
                  width={800}
                  height={533}
                  alt="Craftsman restoring a wooden chair frame in a workshop"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="usecase-body">
                <h3>Furniture Maintenance</h3>
                <p>Keeping existing chairs and sofas in working condition through repair and cleaning.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="media-frame">
                <img
                  src="https://images.pexels.com/photos/19199263/pexels-photo-19199263.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                  srcSet="https://images.pexels.com/photos/19199263/pexels-photo-19199263.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/19199263/pexels-photo-19199263.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                  sizes="(max-width: 560px) 92vw, (max-width: 900px) 46vw, 30vw"
                  width={800}
                  height={533}
                  alt="Rows of desks and chairs in a classroom"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="usecase-body">
                <h3>Schools &amp; Institutions</h3>
                <p>Classroom furniture, staff seating and bulk institutional orders, supplied and maintained together.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="media-frame">
                <img
                  src="https://images.pexels.com/photos/3958959/pexels-photo-3958959.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800"
                  srcSet="https://images.pexels.com/photos/3958959/pexels-photo-3958959.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400 400w, https://images.pexels.com/photos/3958959/pexels-photo-3958959.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=800 800w"
                  sizes="(max-width: 560px) 92vw, (max-width: 900px) 46vw, 30vw"
                  width={800}
                  height={533}
                  alt="Home office with desk, leather chair and natural light"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="usecase-body">
                <h3>Home &amp; Individual Workspaces</h3>
                <p>Single chairs, desks and blinds for home offices and individual buyers, not only bulk office orders.</p>
              </div>
            </div>
            <div className="usecase-card usecase-cta">
              <div className="media-frame usecase-cta-panel">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3C7 3 3 6.6 3 11c0 2.4 1.2 4.6 3.2 6.1-.1 1-.5 2-1.2 2.9-.2.2 0 .6.3.5 1.6-.3 3-1 4-1.8.9.2 1.8.3 2.7.3 5 0 9-3.6 9-8s-4-8-9-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8.5 10.5h7M8.5 13.5h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </div>
              <div className="usecase-body">
                <h3>Not Sure What You Need?</h3>
                <p>Tell us a little about your space, and we&apos;ll help you work out the right furniture for it.</p>
                <a className="card-enquire" href="#contact">Talk to us →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="section section-alt band-rose" id="contact">
        <div className="wrap contact-grid">
          <div className="contact-copy">
            <span className="eyebrow eyebrow-highlight">Contact</span>
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
