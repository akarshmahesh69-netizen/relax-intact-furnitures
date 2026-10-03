import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Relax Intact Furnitures",
  description:
    "How Relax Intact Furnitures collects, uses and protects the information you share through our enquiry form.",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap legal-page">
        <span className="eyebrow">Privacy</span>
        <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}>Privacy Policy</h1>
        <p className="legal-updated">Last updated: 4 October 2026</p>

        <p>
          This policy explains what information Relax Intact Furnitures (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects when you use this website, how we use it, and the choices you
          have. We are an office-furniture manufacturer and service provider based at Lalbagh Fort
          Road, Minerva Circle, Bangalore 560 004.
        </p>

        <h2>What we collect</h2>
        <p>
          We only collect the information you choose to give us through the enquiry form on this
          site:
        </p>
        <ul>
          <li>Your name</li>
          <li>Your phone number</li>
          <li>Your email address (optional)</li>
          <li>Your company name (optional)</li>
          <li>The requirement you select and any message you write</li>
        </ul>
        <p>
          We do not ask for, and you should not send us, any payment-card details, passwords or
          government identification numbers through this form.
        </p>

        <h2>How we use it</h2>
        <p>
          We use the details you provide only to respond to your enquiry — to understand what you
          need, prepare options and pricing, and follow up with you by phone, WhatsApp or email.
          We do not use your details for unrelated marketing without your consent.
        </p>

        <h2>Who we share it with</h2>
        <p>
          We do not sell or rent your information to anyone. We share it only where it is necessary
          to respond to your enquiry — for example with our own delivery or service team — and only
          to the extent needed.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep enquiry details for as long as needed to respond to you and to maintain ordinary
          business records. You can ask us to delete your details at any time.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to show you, correct or delete the information we hold about you. To do
          that, contact us on the phone number or at the address below and we will help.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          This website uses only what is needed to display the pages and remember basic display
          preferences in your own browser. If we add website analytics in future, we will update
          this policy to say what is measured and how you can opt out.
        </p>

        <h2>Contact us</h2>
        <p>
          For anything about this policy or your information, call us on{" "}
          <a href="tel:+919886490295">98864 90295</a>, or write to Relax Intact, Manufacturers of
          Office Furnitures, Lalbagh Fort Road, Minerva Circle, Bangalore 560 004.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The date at the top shows when it was last
          changed.
        </p>
      </div>
    </section>
  );
}
