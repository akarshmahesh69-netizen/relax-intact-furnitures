"use client";

import { FormEvent, useEffect, useState } from "react";

/**
 * Ported from the Astro source's src/components/EnquiryForm.astro (byte-identical markup on both
 * pages there) plus the form-handling block from public/scripts/site.js. The form still does not
 * transmit anywhere — same as the source project's current state (see PRODUCT.md: "The enquiry
 * form currently does not transmit anywhere... delivery method is an open decision"). Not wired up
 * here either; that stays a separate future task.
 *
 * Validation state is plain React state instead of the source's classList/aria-invalid DOM
 * manipulation, but the same three checks, the same "validate on blur, re-validate on input only
 * once already invalid" behaviour, and the same focus-first-invalid-field-on-submit behaviour are
 * preserved.
 */
type FieldKey = "fName" | "fPhone" | "fEmail";

const REQUIREMENT_OPTIONS = [
  "",
  "Office Chairs",
  "Executive Chairs",
  "Computer Chairs",
  "Visitor Chairs",
  "Office Tables",
  "Cupboards",
  "Storage Racks",
  "Sofas & Lounge Seating",
  "Café & Bar Seating",
  "Custom order",
  "Vertical Blinds",
  "Repair",
  "Cleaning",
  "Free furniture guide",
  "Other",
];

function validators(): Record<FieldKey, (v: string) => boolean> {
  return {
    fName: (v) => v.trim().length > 0,
    fPhone: (v) => v.replace(/\D/g, "").length >= 10,
    fEmail: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  };
}

export default function EnquiryForm() {
  const [values, setValues] = useState({ fName: "", fPhone: "", fEmail: "" });
  const [invalid, setInvalid] = useState<Record<FieldKey, boolean>>({
    fName: false,
    fPhone: false,
    fEmail: false,
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    fName: false,
    fPhone: false,
    fEmail: false,
  });
  const [requirement, setRequirement] = useState("");
  const [success, setSuccess] = useState(false);

  const checks = validators();

  // Enquire-button prefill: any [data-req] button/link anywhere on the page (hero CTA, orbit
  // featured item, reel/shelf cards, services CTA) dispatches this event instead of reaching into
  // the DOM directly — see components/EnquireDelegate.tsx, mounted once in the root layout. That
  // keeps the delegated, document-level click listener (which has to survive client-side
  // navigation between / and /products) decoupled from this form's own React state, which a raw
  // `select.value = ...` DOM write would otherwise fight with on the next render.
  useEffect(() => {
    function onPrefill(e: Event) {
      const detail = (e as CustomEvent<{ requirement: string }>).detail;
      const val = detail?.requirement ?? "";
      setRequirement(REQUIREMENT_OPTIONS.includes(val) ? val : "");
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        document.getElementById("fName")?.focus();
      }, 500);
    }
    window.addEventListener("enquire:prefill", onPrefill);
    return () => window.removeEventListener("enquire:prefill", onPrefill);
  }, []);

  function validate(key: FieldKey, value: string) {
    const good = checks[key](value);
    setInvalid((prev) => ({ ...prev, [key]: !good }));
    return good;
  }

  function handleBlur(key: FieldKey) {
    const value = values[key];
    if (value !== "") {
      setTouched((prev) => ({ ...prev, [key]: true }));
      validate(key, value);
    }
  }

  function handleChange(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (touched[key] || invalid[key]) validate(key, value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);
    let firstBadKey: FieldKey | null = null;
    const nextInvalid = { ...invalid };
    (Object.keys(checks) as FieldKey[]).forEach((key) => {
      const good = checks[key](values[key]);
      nextInvalid[key] = !good;
      if (!good && !firstBadKey) firstBadKey = key;
    });
    setInvalid(nextInvalid);
    setTouched({ fName: true, fPhone: true, fEmail: true });
    if (firstBadKey) {
      document.getElementById(firstBadKey)?.focus();
      return;
    }
    setSuccess(true);
    setValues({ fName: "", fPhone: "", fEmail: "" });
    setRequirement("");
    (e.target as HTMLFormElement).reset();
    requestAnimationFrame(() => {
      document.getElementById("formSuccess")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <form className="enquiry" id="enquiryForm" noValidate onSubmit={handleSubmit}>
      <div className="field-row">
        <div className={`field${invalid.fName ? " invalid" : ""}`}>
          <label htmlFor="fName">Name</label>
          <input
            type="text"
            id="fName"
            name="name"
            required
            autoComplete="name"
            aria-describedby="eName"
            aria-invalid={invalid.fName}
            value={values.fName}
            onChange={(e) => handleChange("fName", e.target.value)}
            onBlur={() => handleBlur("fName")}
          />
          <span className="field-error" id="eName">Enter your name so we know who to ask for.</span>
        </div>
        <div className="field">
          <label htmlFor="fCompany">Company <span className="opt">(optional)</span></label>
          <input type="text" id="fCompany" name="company" autoComplete="organization" />
        </div>
      </div>
      <div className="field-row">
        <div className={`field${invalid.fPhone ? " invalid" : ""}`}>
          <label htmlFor="fPhone">Phone</label>
          <input
            type="tel"
            id="fPhone"
            name="phone"
            required
            autoComplete="tel"
            inputMode="tel"
            aria-describedby="ePhone"
            aria-invalid={invalid.fPhone}
            value={values.fPhone}
            onChange={(e) => handleChange("fPhone", e.target.value)}
            onBlur={() => handleBlur("fPhone")}
          />
          <span className="field-error" id="ePhone">Enter a phone number with at least 10 digits.</span>
        </div>
        <div className={`field${invalid.fEmail ? " invalid" : ""}`}>
          <label htmlFor="fEmail">Email <span className="opt">(optional)</span></label>
          <input
            type="email"
            id="fEmail"
            name="email"
            autoComplete="email"
            aria-describedby="eEmail"
            aria-invalid={invalid.fEmail}
            value={values.fEmail}
            onChange={(e) => handleChange("fEmail", e.target.value)}
            onBlur={() => handleBlur("fEmail")}
          />
          <span className="field-error" id="eEmail">That email address looks incomplete.</span>
        </div>
      </div>
      <div className="field">
        <label htmlFor="fRequirement">Requirement</label>
        <select
          id="fRequirement"
          name="requirement"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        >
          <option value="">Select requirement</option>
          {REQUIREMENT_OPTIONS.filter(Boolean).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="fMessage">Message <span className="opt">(optional)</span></label>
        <textarea id="fMessage" name="message" placeholder="Number of pieces, office location, timeline..." />
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
        Send enquiry
      </button>
      <p className="form-note">We reply to enquiries directly. No account or checkout required.</p>
      <div className={`form-success${success ? " visible" : ""}`} id="formSuccess" role="status">
        Enquiry received. We&apos;ll get back to you shortly on the phone number provided.
      </div>
    </form>
  );
}
