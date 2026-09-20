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

const DOCUMENT_TYPES = [
  { value: "NATIONAL_ID", label: "National ID" },
  { value: "DRIVERS_LICENSE", label: "Driver's Licence" },
  { value: "PASSPORT", label: "Passport" },
];

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IdentityDocumentPage() {
  const navigate = useNavigate();
  const context = getOnboardingContext();

  const applicationId = context?.applicationId;

  const [form, setForm] = useState({
    documentType: "",
    documentNumber: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!applicationId) {
    navigate("/", { replace: true });
    return null;
  }

  function validate() {
    const nextErrors = {};

    if (!form.documentType) {
      nextErrors.documentType = "Select a document type.";
    }

    if (!form.documentNumber.trim()) {
      nextErrors.documentNumber = "Enter your document number.";
    }

    if (!file) {
      nextErrors.file = "Select a document file.";
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
      await applicationsApi.createIdentityDocument(applicationId, {
        documentType: form.documentType,
        documentNumber: form.documentNumber.trim(),
        documentFileUrl: file.name,
      });

      navigate("/vehicle-information");
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "We couldn't save your document details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);

    setErrors((current) => ({
      ...current,
      file: null,
    }));
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <OnboardingProgress currentStep={2} />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] font-semibold tracking-[-0.01em] text-ink-900">
            Identity document
          </h1>

          <p className="text-[15px] leading-relaxed text-mist-600">
            Provide one valid identity document for your driver application.
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
                htmlFor="documentType"
                className="text-[13px] font-medium text-ink-800"
              >
                Document type
                <span className="ml-1 text-danger">*</span>
              </label>

              <select
                id="documentType"
                value={form.documentType}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    documentType: event.target.value,
                  }));

                  setErrors((current) => ({
                    ...current,
                    documentType: null,
                  }));
                }}
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg border border-mist-300 bg-cloud px-3.5 text-[15px] text-ink-800 outline-none transition focus:border-beacon focus:ring-2 focus:ring-beacon/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select a document</option>

                {DOCUMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {errors.documentType && (
                <p className="text-[12px] font-medium text-danger">
                  {errors.documentType}
                </p>
              )}
            </div>

            <Input
              label="Document number"
              placeholder="Enter the document number"
              value={form.documentNumber}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  documentNumber: event.target.value,
                }));

                setErrors((current) => ({
                  ...current,
                  documentNumber: null,
                }));
              }}
              error={errors.documentNumber}
              required
              disabled={isSubmitting}
            />

            <div className="flex flex-col gap-2">
              <label
                htmlFor="identity-file"
                className="text-[13px] font-medium text-ink-800"
              >
                Document file
                <span className="ml-1 text-danger">*</span>
              </label>

              <input
                id="identity-file"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="block w-full rounded-lg border border-dashed border-mist-300 bg-cloud px-3 py-3 text-[13px] text-mist-600 file:mr-3 file:rounded-md file:border-0 file:bg-beacon file:px-3 file:py-2 file:text-[12px] file:font-medium file:text-white"
              />

              {file && (
                <div className="rounded-lg border border-success/20 bg-success-100 px-4 py-3">
                  <p className="text-[13px] font-medium text-success">
                    {file.name}
                  </p>

                  <p className="mt-1 text-[12px] text-mist-600">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              )}

              {errors.file && (
                <p className="text-[12px] font-medium text-danger">
                  {errors.file}
                </p>
              )}

              <p className="text-[12px] leading-relaxed text-mist-500">
                Accepted formats: JPG, PNG or PDF.
              </p>
            </div>

            <div className="rounded-lg border border-signal/30 bg-signal-100 px-4 py-3">
              <p className="text-[12px] leading-relaxed text-ink-700">
                For this assessment, the selected file is recorded by its
                filename. Actual file storage will be connected in the
                document-upload stage.
              </p>
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