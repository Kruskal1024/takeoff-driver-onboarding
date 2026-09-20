import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import { applicationsApi } from "../api/applications";
import { ApiError } from "../api/client";
import { getOnboardingContext } from "../utils/onboardingStorage";

export default function PersonalInformationPage() {
  const navigate = useNavigate();
  const context = getOnboardingContext();

  const applicationId = context?.applicationId;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!applicationId) {
    navigate("/", { replace: true });
    return null;
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: null,
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "Enter your first name.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = "Enter your last name.";
    }

    if (!form.dateOfBirth) {
      nextErrors.dateOfBirth = "Enter your date of birth.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Enter your residential address.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await applicationsApi.updatePersonalInfo(applicationId, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth,
        email: form.email.trim(),
        address: form.address.trim(),
      });

      navigate("/identity-document");
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "We couldn't save your information. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <OnboardingProgress currentStep={1} />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] font-semibold tracking-[-0.01em] text-ink-900">
            Personal information
          </h1>

          <p className="text-[15px] leading-relaxed text-mist-600">
            Tell us a little about yourself so we can set up your driver
            application.
          </p>
        </div>

        <Card>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="First name"
                placeholder="e.g. Tendai"
                value={form.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                error={errors.firstName}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Last name"
                placeholder="e.g. Moyo"
                value={form.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                error={errors.lastName}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Date of birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField("dateOfBirth", event.target.value)
                }
                error={errors.dateOfBirth}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                error={errors.email}
                required
                disabled={isSubmitting}
              />
            </div>

            <Input
              label="Residential address"
              placeholder="e.g. 12 Samora Machel Avenue, Harare"
              value={form.address}
              onChange={(event) =>
                updateField("address", event.target.value)
              }
              error={errors.address}
              required
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
              {isSubmitting
                ? "Saving..."
                : "Save and continue"}
            </Button>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}