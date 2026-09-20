/**
 * Shared shell for the sign-up / OTP family of screens.
 *
 * Split into a dark "brand" panel (trust messaging, wordmark, an
 * abstract flight-path graphic) and a light "content" panel that
 * holds the actual form. On narrow viewports the brand panel
 * collapses to a condensed top band so the form stays the focus.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <BrandPanel />

      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[440px]">{children}</div>
      </main>
    </div>
  );
}

function BrandPanel() {
  return (
    <aside className="relative flex w-full flex-col justify-between overflow-hidden bg-ink-800 px-8 py-10 text-white sm:px-12 sm:py-12 lg:w-[46%] lg:px-14 lg:py-16">
      <FlightPathGraphic />

      <div className="relative z-10 animate-fade-up">
        <Wordmark />
      </div>

      <div className="relative z-10 flex max-w-md animate-fade-up flex-col gap-6 py-10 lg:py-0">
       <h1 className="font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:text-[34px] lg:text-[38px]">
         Onboarding built for drivers who move fast.
          </h1>
        <p className="text-[15px] leading-relaxed text-mist-300">
          Verify your identity, add your vehicle, and get cleared to drive —
          in one guided flow, with every step tracked from application to
          approval.
        </p>
      </div>

       <dl className="relative z-10 grid animate-fade-up grid-cols-1 gap-5 border-t border-white/10 pt-8 sm:grid-cols-3 lg:pt-10">
         <TrustStat value="Phone verification" label="Sign up and verify with just your mobile number" />
         <TrustStat value="Guided flow" label="One step-by-step path from personal details to vehicle documents" />
         <TrustStat value="Application tracking" label="See exactly where your application stands, end to end" />
      </dl>
    </aside>
  );
}

function TrustStat({ value, label }) {
  return (
    <div>
      <p className="font-display text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-[13px] leading-snug text-mist-400">{label}</p>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#E2A63B" />
        <path
          d="M6 21L14 13L19 18L26 9"
          stroke="#101B2E"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 9H26V15"
          stroke="#101B2E"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-[17px] font-semibold tracking-[-0.01em]">
        TakeOFF
      </span>
    </div>
  );
}

/**
 * A single restrained decorative element — an ascending flight-path
 * line, echoing the wordmark's mark at much larger scale. This is the
 * one place the design spends its "boldness"; everything else on the
 * panel stays quiet.
 */
function FlightPathGraphic() {
  return (
    <svg
      className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[420px] opacity-[0.14] sm:-right-16 sm:top-[-4rem]"
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 320L140 200L210 260L380 60"
        stroke="#E2A63B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M300 60H380V140"
        stroke="#E2A63B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="320" r="5" fill="#E2A63B" />
    </svg>
  );
}
