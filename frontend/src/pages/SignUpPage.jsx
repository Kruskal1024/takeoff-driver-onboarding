import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { authApi } from "../api/auth";
import { ApiError } from "../api/client";

const PHONE_PATTERN = /^0(71|73|77|78)\d{7}$/;
const OTP_EXPIRY_SECONDS = 300;

function normalizePhone(value) {
  return value.replace(/[\s-]/g, "");
}

function validatePhone(value) {
  const normalized = normalizePhone(value);
  if (!normalized) return "Enter your phone number to continue.";
  if (!PHONE_PATTERN.test(normalized)) {
    return "Enter a valid mobile number, e.g. 077 123 4567.";
  }
  return null;
}

export default function SignUpPage() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [fieldError, setFieldError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    const validationError = validatePhone(phone);
    if (validationError) {
      setFieldError(validationError);
      return;
    }
    setFieldError(null);

    const normalized = normalizePhone(phone);
    setIsSubmitting(true);
   try {
  const registerResponse = await authApi.register(normalized);

  const userId = registerResponse?.id;

  if (!userId) {
    throw new Error("The account was created but no user ID was returned.");
  }

  const otpResponse = await authApi.generateOtp(normalized);

  sessionStorage.setItem(
    "takeoff_onboarding",
    JSON.stringify({
      userId,
      phone: normalized,
      applicationId: null,
    })
  );

  navigate("/verify-otp", {
    state: {
      phone: normalized,
      userId,
      devOtp: otpResponse?.otp ?? null,
      expiresInSeconds: OTP_EXPIRY_SECONDS,
    },
  });
}
     catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-[26px] font-semibold tracking-[-0.01em] text-ink-900">
            Create your driver account
          </h2>
          <p className="text-[15px] leading-relaxed text-mist-600">
            Enter your mobile number and we'll send a code to verify it's
            you. No password needed.
          </p>
        </div>

        <Card>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Phone number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="077 123 4567"
              leadingSlot="+263"
              required
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                if (fieldError) setFieldError(null);
              }}
              error={fieldError}
              helperText={
                fieldError ? undefined : "Standard SMS rates may apply."
              }
              disabled={isSubmitting}
            />

            {formError && (
              <div
                role="alert"
                className="rounded-lg border border-danger/30 bg-danger-100 px-4 py-3 text-[13px] font-medium text-danger"
              >
                {formError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Sending code…" : "Continue"}
            </Button>

            <p className="text-center text-[13px] leading-relaxed text-mist-500">
              By continuing, you agree to TakeOFF's driver Terms and
              Privacy Policy.
            </p>
          </form>
        </Card>

        <SecurityNote />
      </div>
    </AuthLayout>
  );
}

function SecurityNote() {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-mist-500">
      <LockIcon />
      <span>Your information is encrypted and never shared without consent.</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="4.5"
        y="9"
        width="11"
        height="8"
        rx="2"
        stroke="#7A8194"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9"
        stroke="#7A8194"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}