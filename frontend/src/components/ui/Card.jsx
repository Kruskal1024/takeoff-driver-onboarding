/**
 * Base surface for grouped content — the sign-up form, and later the
 * review-screen sections, step panels, and status summaries all sit on
 * this same primitive so surfaces stay visually consistent.
 *
 * Padding and radius are deliberately restrained (not the generic
 * "rounded-2xl + soft grey shadow on everything" pattern) — `padded`
 * and `bordered` let a caller opt out when a flush or borderless
 * surface reads better in context.
 */
export default function Card({
  children,
  padded = true,
  bordered = true,
  className = "",
  ...rest
}) {
  return (
    <div
      className={[
        "rounded-xl bg-cloud shadow-card",
        bordered ? "border border-mist-200" : "",
        padded ? "p-7 sm:p-9" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
