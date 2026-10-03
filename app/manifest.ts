import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

// Served at /manifest.webmanifest — the "favicon set" / installable-web-app basics:
// name, theme colours and icons used when the site is added to a phone home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Relax Intact",
    description:
      "Office furniture manufacture, supply and maintenance in Bangalore — chairs, tables, cupboards and blinds, plus repair, servicing and cleaning.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F4EC",
    theme_color: "#6E1220",
    icons: [
      { src: "/images/favicon.png", sizes: "512x512", type: "image/png" },
      { src: "/images/favicon.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
