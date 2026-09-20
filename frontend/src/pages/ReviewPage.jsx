import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import { applicationsApi } from "../api/applications";
import { getOnboardingContext } from "../utils/onboardingStorage";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 py-3 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = getOnboardingContext();

  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReview() {
      if (!applicationId) {
        setError("Your onboarding session is missing.");
        return;
      }

      try {
        const data = await applicationsApi.getReview(applicationId);
        setReview(data);
      } catch (err) {
        setError(err.message || "Unable to load your review.");
      }
    }

    loadReview();
  }, [applicationId]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/5 p-8">
          <p className="text-red-300">{error}</p>
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-400">Loading application review...</p>
        </div>
      </main>
    );
  }

  const identityDocuments = review.identityDocuments ?? [];
  const vehicleDocuments = review.vehicleDocuments ?? [];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <OnboardingProgress currentStep={5} />

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Final review
          </p>

          <h1 className="mt-2 text-3xl font-bold">Review your application</h1>

          <p className="mt-2 text-slate-400">
            Check everything below before submitting your driver application.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Personal information</h2>

            <div className="mt-4">
              <Row label="First name" value={review.personal?.firstName} />
              <Row label="Last name" value={review.personal?.lastName} />
              <Row label="Date of birth" value={review.personal?.dateOfBirth} />
              <Row label="Email" value={review.personal?.email} />
              <Row label="Address" value={review.personal?.address} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Vehicle</h2>

            <div className="mt-4">
              <Row label="Type" value={review.vehicle?.vehicleType} />
              <Row label="Make" value={review.vehicle?.make} />
              <Row label="Model" value={review.vehicle?.model} />
              <Row label="Year" value={review.vehicle?.year} />
              <Row
                label="Registration"
                value={review.vehicle?.registrationNumber}
              />
              <Row label="Color" value={review.vehicle?.color} />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Documents</h2>

          <div className="mt-4 space-y-4">
            {identityDocuments.map((document) => (
              <div
                key={`identity-${document.id}`}
                className="rounded-xl bg-black/20 p-4"
              >
                <p className="font-semibold">{document.documentType}</p>
                <p className="mt-1 text-sm text-slate-400">
                  Number: {document.documentNumber}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  File: {document.documentFileUrl}
                </p>
              </div>
            ))}

            {vehicleDocuments.map((document) => (
              <div
                key={`vehicle-${document.id}`}
                className="rounded-xl bg-black/20 p-4"
              >
                <p className="font-semibold">{document.documentType}</p>
                <p className="mt-1 text-sm text-slate-400">
                  File: {document.documentFileUrl}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate("/submit")}
            className="w-full rounded-xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 hover:bg-cyan-300"
          >
            Submit application
          </button>
        </div>
      </div>
    </main>
  );
}