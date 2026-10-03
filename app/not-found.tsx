import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Relax Intact Furnitures",
  description: "The page you were looking for could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "640px", textAlign: "center" }}>
        <span className="eyebrow" style={{ justifyContent: "center" }}>Error 404</span>
        <h1 style={{ marginTop: "var(--space-2)" }}>This page has moved, or never existed.</h1>
        <p style={{ marginTop: "var(--space-3)", fontSize: "1.05rem" }}>
          The link may be out of date. You will find everything from the home page, or
          head straight to the full furniture range.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "var(--space-5)",
          }}
        >
          <Link className="btn btn-primary" href="/">Back to home</Link>
          <Link className="btn btn-outline" href="/products">Browse products</Link>
        </div>
      </div>
    </section>
  );
}
