import { forwardRef, useId } from "react";

/**
 * Text input used across every form in the onboarding flow.
 *
 * Wires up label/help/error association via `aria-describedby` and
 * `aria-invalid` automatically, so individual pages just pass copy —
 * accessibility isn't something each form has to remember to redo.
 *
 * `leadingSlot` accepts a small node (e.g. a "+263" country prefix)
 * rendered inside the field's left edge.
 */
const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    required = false,
    leadingSlot,
    id,
    className = "",
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const describedBy = [helperText && !error ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-signal-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leadingSlot && (
          <span className="pointer-events-none absolute left-0 top-1/2 flex w-14 -translate-y-1/2 items-center justify-center text-[15px] font-medium text-mist-600 after:absolute after:right-0 after:top-1/2 after:h-5 after:w-px after:-translate-y-1/2 after:bg-mist-300">
            {leadingSlot}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy || undefined}
          className={[
            "h-11 w-full rounded-lg border bg-cloud text-[15px] text-ink-800",
            "placeholder:text-mist-500",
            "transition-shadow duration-150 ease-out",
            "focus:outline-none focus-visible:shadow-focus focus-visible:border-signal-500",
            error
              ? "border-danger focus-visible:border-danger"
              : "border-mist-300 hover:border-mist-400",
            leadingSlot ? "pl-16 pr-3.5" : "px-3.5",
            className,
          ].join(" ")}
          {...rest}
        />
      </div>

      {helperText && !error && (
        <p id={helperId} className="text-[13px] text-mist-600">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;