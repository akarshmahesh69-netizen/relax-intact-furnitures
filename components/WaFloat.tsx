const WA_LINK =
  "https://wa.me/919886490295?text=Hi%20Relax%20Intact%2C%20I%27d%20like%20a%20quote.";

/** Fixed bottom-right WhatsApp button. Static markup, no client behaviour needed. */
export default function WaFloat() {
  return (
    <a className="wa-float" href={WA_LINK} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      <svg className="wa-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M8.5 8.5h7M8.5 11.5h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </a>
  );
}
