// Single source of truth for the deployed site's public URL.
//
// ⚠️ UPDATE THIS to the real domain before (or at) deployment. It feeds robots.txt,
// sitemap.xml, canonical URLs, the web manifest and Open Graph tags. Until the real
// domain is known this is a placeholder — a wrong value here only affects SEO metadata
// (search engines and link-preview cards), never whether the site works.
export const SITE_URL = "https://www.relaxintact.in";

export const SITE_NAME = "Relax Intact Furnitures";

// Google Apps Script Web App endpoint that appends enquiry-form submissions to the client's
// Google Sheet. Deployed from the client's own Google account (Execute as: Me, Access: Anyone).
export const ENQUIRY_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzk9lSIFW69w5Kuxl9T9jTpX0l9p52qIXPJi8G6lQk6ZZbckAs59HWxbFYQ3PHAiA/exec";
