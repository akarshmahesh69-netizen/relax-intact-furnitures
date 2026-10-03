import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./home.css";
import "./products.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import BackToTop from "@/components/BackToTop";
import EnquireDelegate from "@/components/EnquireDelegate";

// home.css and products.css are imported here (not per-page) deliberately, mirroring the source
// Astro project's own reasoning for keeping some CSS "global" even though it's page-specific:
// their selectors only ever match the markup on the page that actually uses them, so loading both
// everywhere costs nothing and avoids juggling per-route CSS imports. See this project's CLAUDE.md.

export const metadata: Metadata = {
  title: "Relax Intact Furnitures | Office Furniture & Workplace Maintenance, Bangalore",
  description:
    "Relax Intact manufactures and supplies office chairs, tables, cupboards and blinds, and services them with repair, servicing and cleaning. Bangalore.",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "Relax Intact Furnitures | Office Furniture & Workplace Maintenance, Bangalore",
    description:
      "Office chairs, tables, cupboards and blinds, made in Bangalore, plus repair, servicing and cleaning from the same vendor.",
    images: [
      "https://images.pexels.com/photos/36733323/pexels-photo-36733323.jpeg?auto=compress&cs=tinysrgb&fm=jpg&w=1200",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6E1220",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // suppressHydrationWarning on <html> below: the inline script further down intentionally adds
  // class="js" to this element before React hydrates, so the server-rendered markup (no class)
  // and the live DOM (class="js") briefly disagree on this one attribute — exactly the point of
  // the technique (see the script's own comment). Without this flag React logs a
  // hydration-mismatch warning for an intentional, harmless difference; the flag only silences
  // the warning for this element's own attributes, not for its children.
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Mirrors the source's `<script is:inline>document.documentElement.classList.add('js')</script>`:
            runs synchronously before paint so `.reveal`/`.shelf-item.reveal` elements (scoped under
            `.js .reveal` in globals.css) start hidden only when JS is actually available — a true
            no-JS browser never gets the class and those elements simply render visible, with no
            fade-in, matching the source project's no-JS fallback exactly. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WaFloat />
        <BackToTop />
        <EnquireDelegate />
      </body>
    </html>
  );
}
