import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Relax Intact Furnitures",
  description:
    "The terms on which Relax Intact Furnitures makes this website and its information available.",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="wrap legal-page">
        <span className="eyebrow">Terms</span>
        <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}>Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: 4 October 2026</p>

        <p>
          These terms apply to your use of the Relax Intact Furnitures website. By using the site
          you accept them. If you do not agree, please do not use the site.
        </p>

        <h2>About this website</h2>
        <p>
          This website is for information. It presents the products and services of Relax Intact
          Furnitures and lets you send us an enquiry. It is not an online shop and does not take
          payments or confirm orders.
        </p>

        <h2>Product and pricing information</h2>
        <p>
          Product descriptions, specifications, finishes, photographs and any prices shown are
          indicative and for general guidance. Exact specifications, availability, lead times and
          pricing are confirmed by us directly in response to your enquiry, and may change. Nothing
          on this site is a binding offer to sell.
        </p>

        <h2>Enquiries are not orders</h2>
        <p>
          Sending an enquiry through this site does not create a contract or a confirmed order. An
          order exists only once it has been agreed between you and us separately, in writing or by
          our confirmation.
        </p>

        <h2>Our content</h2>
        <p>
          The text, images, logo and design of this site belong to Relax Intact Furnitures and may
          not be copied or reused without our permission.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Please use this site lawfully. Do not attempt to disrupt it, misuse the enquiry form, or
          submit content that is unlawful or harmful.
        </p>

        <h2>No warranty and liability</h2>
        <p>
          We take care to keep the site accurate and available, but we provide it &ldquo;as is&rdquo;
          and cannot guarantee it will always be error-free or uninterrupted. To the extent allowed
          by law, we are not liable for any loss arising from your reliance on information on this
          site before it is confirmed by us directly.
        </p>

        <h2>Links to other sites</h2>
        <p>
          This site may link to other websites (for example a map or a messaging service). We are
          not responsible for the content or practices of those other sites.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, and any dispute will be subject to the
          courts of Bangalore, Karnataka.
        </p>

        <h2>Contact us</h2>
        <p>
          For any question about these terms, call us on{" "}
          <a href="tel:+919886490295">98864 90295</a>, or write to Relax Intact, Manufacturers of
          Office Furnitures, Lalbagh Fort Road, Minerva Circle, Bangalore 560 004.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The date at the top shows when they were last
          changed.
        </p>
      </div>
    </section>
  );
}
