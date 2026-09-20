import { useId, useRef } from "react";

/**
 * Six-box one-time-code input used on the OTP verification screen.
 *
 * Mirrors Input's label/helperText/error API so the two feel like part
 * of the same design system, but manages its own per-digit boxes:
 * typing a digit advances focus to the next box, Backspace on an empty
 * box steps back to the previous one, and pasting a full code fills
 * every box at once from a single paste event on any box.
 */
export default function OtpCodeInput({
  length = 6,
  value,
  onChange,
  label,
  helperText,
  error,
  disabled = false,
  id,
}) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelId = `${groupId}-label`;
  const helperId = `${groupId}-helper`;
  const errorId = `${groupId}-error`;

  const describedBy = [helperText && !error ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const inputRefs = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  function setDigitAt(index, digit) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  }

  function handleChange(index, event) {
    const cleaned = event.target.value.replace(/\D/g, "");
    if (!cleaned) {
      setDigitAt(index, "");
      return;
    }
    // If the box already held a digit and the browser appended a new
    // one, keep only the most recently typed character.
    setDigitAt(index, cleaned[cleaned.length - 1]);
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        setDigitAt(index, "");
      } else if (index > 0) {
        setDigitAt(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event) {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span id={labelId} className="text-sm font-medium text-ink-700">
          {label}
        </span>
      )}

      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy || undefined}
        className="flex justify-between gap-2 sm:gap-3"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            autoFocus={index === 0}
            value={digit}
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={[
              "h-14 w-full max-w-[52px] rounded-lg border bg-cloud text-center text-xl font-semibold text-ink-800",
              "transition-shadow duration-150 ease-out",
              "focus:outline-none focus-visible:shadow-focus focus-visible:border-signal-500",
              "disabled:cursor-not-allowed disabled:bg-mist-100 disabled:text-mist-400",
              error
                ? "border-danger focus-visible:border-danger"
                : "border-mist-300 hover:border-mist-400",
            ].join(" ")}
          />
        ))}
      </div>

      {helperText && !error && (
        <p id={helperId} className="text-[13px] text-mist-600">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}