import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import OtpCodeInput from "../components/ui/OtpCodeInput";
import { authApi } from "../api/auth";
import { applicationsApi } from "../api/applications";
import { ApiError } from "../api/client";
import { updateOnboardingContext, getOnboardingContext } from "../utils/onboardingStorage";

const CODE_LENGTH = 6;
const DEFAULT_EXPIRY_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 30;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedContext = getOnboardingContext();

  const phone = location.state?.phone ?? storedContext?.phone;
  const userId = location.state?.userId ?? storedContext?.userId;
  const initialDevOtp = location.state?.devOtp ?? null;
  const expiresInSeconds =
    location.state?.expiresInSeconds ?? DEFAULT_EXPIRY_SECONDS;

  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(expiresInSeconds);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState(initialDevOtp);

  useEffect(() => {
    if (!phone || !userId) {
      navigate("/", { replace: true });
    }
  }, [phone, userId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 0));

      setResendCooldown((seconds) =>
        seconds > 0 ? seconds - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!phone || !userId) {
    return null;
  }

  const isExpired = secondsLeft <= 0;

  async function handleVerify(event) {
    event.preventDefault();

    setFormError(null);

    if (code.length < CODE_LENGTH) {
      setFieldError(`Enter all ${CODE_LENGTH} digits.`);
      return;
    }

    setFieldError(null);
    setIsVerifying(true);

    try {
      await authApi.verifyOtp(phone, code);

      const applicationResponse =
        await applicationsApi.createApplication(userId);

      const applicationId = applicationResponse?.id;

      if (!applicationId) {
        throw new Error(
          "Application creation succeeded but no application ID was returned."
        );
      }

      updateOnboardingContext({
        userId,
        phone,
        applicationId,
      });

      navigate("/personal-information", {
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";

      setFormError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setFormError(null);
    setFieldError(null);
    setIsResending(true);

    try {
      const response = await authApi.generateOtp(phone);

      setCode("");
      setSecondsLeft(DEFAULT_EXPIRY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setDevOtp(response?.otp ?? null);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Couldn't resend the code. Please try again.";

      setFormError(message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-[26px] font-semibold tracking-[-0.01em] text-ink-900">
            Enter verification code
          </h2>

          <p className="text-[15px] leading-relaxed text-mist-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-ink-800">{phone}</span>.
          </p>
        </div>

        <Card>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleVerify}
            noValidate
          >
            <OtpCodeInput
              label="Verification code"
              length={CODE_LENGTH}
              value={code}
              onChange={(next) => {
                setCode(next);

                if (fieldError) {
                  setFieldError(null);
                }
              }}
              error={fieldError}
              disabled={isVerifying || isExpired}
            />

            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span
                className={
                  isExpired
                    ? "font-medium text-danger"
                    : "text-mist-500"
                }
              >
                {isExpired
                  ? "Code expired"
                  : `Expires in ${formatTime(secondsLeft)}`}
              </span>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="font-medium text-beacon underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-mist-400 disabled:no-underline"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend code (${resendCooldown}s)`
                    : "Resend code"}
              </button>
            </div>

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
              isLoading={isVerifying}
              disabled={isExpired}
            >
              {isVerifying
                ? "Setting up your application..."
                : "Verify code"}
            </Button>
          </form>
        </Card>

        {devOtp && (
          <div className="rounded-lg border border-signal/30 bg-signal-100 px-4 py-3.5">
            <p className="text-[13px] font-medium text-signal-600">
              Development mode
            </p>

            <p className="mt-1 text-[13px] leading-relaxed text-ink-700">
              SMS delivery isn't connected yet, so the backend returns
              the code directly:{" "}
              <span className="font-display text-base font-semibold tracking-[0.04em] text-ink-900">
                {devOtp}
              </span>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}