import { useEffect, useState } from "react";
import { applicationsApi } from "../api/applications";
import { getOnboardingContext } from "../utils/onboardingStorage";

export default function CompletionPage() {
  const { applicationId } = getOnboardingContext();

  const [status, setStatus] = useState("SUBMITTING");
  const [error, setError] = useState("");

  useEffect(() => {
    async function submit() {
      if (!applicationId) {
        setError("Your onboarding session is missing.");
        return;
      }

      try {
        const response = await applicationsApi.submitApplication(applicationId);
        setStatus(response.status);
      } catch (err) {
        setError(err.message || "Unable to submit application.");
      }
    }

    submit();
  }, [applicationId]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-lg rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-bold">Submission failed</h1>
          <p className="mt-3 text-red-300">{error}</p>
        </div>
      </main>
    );
  }

  if (status === "SUBMITTING") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <p className="text-slate-400">Submitting your application...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20 text-4xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Application submitted
        </p>

        <h1 className="mt-2 text-4xl font-bold">You're all set.</h1>

        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Your driver application has been submitted successfully and is now
          awaiting review.
        </p>

        <div className="mt-8 rounded-2xl bg-black/20 p-5">
          <p className="text-sm text-slate-400">Application ID</p>
          <p className="mt-1 text-2xl font-bold">#{applicationId}</p>

          <p className="mt-4 text-sm text-slate-400">Status</p>
          <p className="mt-1 font-semibold text-amber-300">{status}</p>
        </div>
      </section>
    </main>
  );
}