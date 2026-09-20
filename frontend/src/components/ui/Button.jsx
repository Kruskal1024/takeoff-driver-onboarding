import { forwardRef } from "react";

const VARIANT_STYLES = {
  primary:
    "bg-beacon text-white hover:bg-beacon-600 active:bg-beacon-600 disabled:bg-mist-300 disabled:text-mist-500",
  secondary:
    "bg-transparent text-ink-800 border border-mist-300 hover:border-ink-600 hover:bg-mist-100 disabled:text-mist-400 disabled:border-mist-200 disabled:bg-transparent",
  ghost:
    "bg-transparent text-beacon hover:bg-beacon-100 disabled:text-mist-400 disabled:bg-transparent",
};

const SIZE_STYLES = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-base",
};

/**
 * Primary interactive control used across every form and CTA in the app.
 *
 * `isLoading` disables the button and swaps the label for a small spinner
 * plus the original label, so the button never collapses or reflows width
 * mid-submit. `variant` controls visual weight — `primary` is reserved for
 * the single main action on a screen.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    type = "button",
    className = "",
    ...rest
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-150 ease-out",
        "disabled:cursor-not-allowed",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M22 12a10 10 0 0 0-10-10v3.5A6.5 6.5 0 0 1 18.5 12H22Z"
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
});

export default Button;
