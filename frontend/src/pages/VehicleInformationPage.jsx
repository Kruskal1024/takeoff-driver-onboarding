import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import { applicationsApi } from "../api/applications";
import { ApiError } from "../api/client";
import { getOnboardingContext } from "../utils/onboardingStorage";

const VEHICLE_TYPES = [
  { value: "SEDAN", label: "Sedan" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "SUV", label: "SUV" },
  { value: "PICKUP", label: "Pickup" },
  { value: "MINIBUS", label: "Minibus" },
  { value: "OTHER", label: "Other" },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function VehicleInformationPage() {
  const navigate = useNavigate();
  const context = getOnboardingContext();
  const applicationId = context?.applicationId;

  const [form, setForm] = useState({
    vehicleType: "",
    make: "",
    model: "",
    year: "",
    registrationNumber: "",
    color: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      navigate("/", { replace: true });
    }
  }, [applicationId, navigate]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: null,
    }));

    setFormError(null);
  }

  function validate() {
    const nextErrors = {};

    if (!form.vehicleType) {
      nextErrors.vehicleType = "Select your vehicle type.";
    }

    if (!form.make.trim()) {
      nextErrors.make = "Enter the vehicle make.";
    }

    if (!form.model.trim()) {
      nextErrors.model = "Enter the vehicle model.";
    }

    if (!form.year) {
      nextErrors.year = "Enter the vehicle year.";
    } else {
      const year = Number(form.year);

      if (
        !Number.isInteger(year) ||
        year < 1990 ||
        year > CURRENT_YEAR + 1
      ) {
        nextErrors.year = `Enter a year between 1990 and ${CURRENT_YEAR + 1}.`;
      }
    }

    if (!form.registrationNumber.trim()) {
      nextErrors.registrationNumber =
        "Enter the registration number.";
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

    if (!applicationId) {
      setFormError(
        "Your onboarding session has expired. Please restart the application."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await applicationsApi.createVehicle(applicationId, {
        vehicleType: form.vehicleType,
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        registrationNumber: form.registrationNumber.trim(),
        color: form.color.trim() || null,
      });

      navigate("/documents");
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "We couldn't save your vehicle details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!applicationId) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <OnboardingProgress currentStep={3} />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] font-semibold tracking-[-0.01em] text-ink-900">
            Vehicle information
          </h1>

          <p className="text-[15px] leading-relaxed text-mist-600">
            Tell us about the vehicle you'll use for your driver
            application.
          </p>
        </div>

        <Card>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vehicleType"
                className="text-[13px] font-medium text-ink-800"
              >
                Vehicle type
                <span className="ml-1 text-danger">*</span>
              </label>

              <select
                id="vehicleType"
                value={form.vehicleType}
                onChange={(event) =>
                  updateField("vehicleType", event.target.value)
                }
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg border border-mist-300 bg-cloud px-3.5 text-[15px] text-ink-800 outline-none transition focus:border-beacon focus:ring-2 focus:ring-beacon/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select vehicle type</option>

                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {errors.vehicleType && (
                <p className="text-[12px] font-medium text-danger">
                  {errors.vehicleType}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Make"
                placeholder="e.g. Toyota"
                value={form.make}
                onChange={(event) =>
                  updateField("make", event.target.value)
                }
                error={errors.make}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Model"
                placeholder="e.g. Corolla"
                value={form.model}
                onChange={(event) =>
                  updateField("model", event.target.value)
                }
                error={errors.model}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Year"
                type="number"
                inputMode="numeric"
                min="1990"
                max={CURRENT_YEAR + 1}
                placeholder="e.g. 2019"
                value={form.year}
                onChange={(event) =>
                  updateField("year", event.target.value)
                }
                error={errors.year}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Color"
                placeholder="e.g. White"
                value={form.color}
                onChange={(event) =>
                  updateField("color", event.target.value)
                }
                error={errors.color}
                disabled={isSubmitting}
              />
            </div>

            <Input
              label="Registration number"
              placeholder="e.g. ADK 1234"
              value={form.registrationNumber}
              onChange={(event) =>
                updateField(
                  "registrationNumber",
                  event.target.value
                )
              }
              error={errors.registrationNumber}
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
                : "Save and continue to documents"}
            </Button>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}