import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import { applicationsApi } from "../api/applications";
import { getOnboardingContext } from "../utils/onboardingStorage";

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { applicationId } = getOnboardingContext();

  const [driverDocumentNumber, setDriverDocumentNumber] = useState("");
  const [driverFile, setDriverFile] = useState(null);
  const [registrationFile, setRegistrationFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!applicationId) {
      setError("Your onboarding session is missing. Please restart.");
      return;
    }

    if (!driverDocumentNumber.trim()) {
      setError("Enter the driver's licence number.");
      return;
    }

    if (!driverFile || !registrationFile || !insuranceFile) {
      setError("Please select all three test documents.");
      return;
    }

    setLoading(true);

    try {
      await applicationsApi.createIdentityDocument(applicationId, {
        documentType: "DRIVERS_LICENSE",
        documentNumber: driverDocumentNumber.trim(),
        documentFileUrl: driverFile.name,
      });

      await applicationsApi.createVehicleDocument(applicationId, {
        documentType: "VEHICLE_REGISTRATION",
        documentFileUrl: registrationFile.name,
      });

      await applicationsApi.createVehicleDocument(applicationId, {
        documentType: "VEHICLE_INSURANCE",
        documentFileUrl: insuranceFile.name,
      });

      navigate("/review");
    } catch (err) {
      setError(err.message || "Unable to save documents.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <OnboardingProgress currentStep={4} />

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Step 4 of 5
            </p>
            <h1 className="mt-2 text-3xl font-bold">Driver & vehicle documents</h1>
            <p className="mt-2 text-slate-400">
              Upload test documents so your application can be reviewed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <section>
              <h2 className="text-xl font-semibold">Driver's licence</h2>

              <div className="mt-4 space-y-4">
                <input
                  value={driverDocumentNumber}
                  onChange={(e) => setDriverDocumentNumber(e.target.value)}
                  placeholder="Driver's licence number"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDriverFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Vehicle registration</h2>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setRegistrationFile(e.target.files?.[0] ?? null)}
                className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm"
              />
            </section>

            <section>
              <h2 className="text-xl font-semibold">Vehicle insurance</h2>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setInsuranceFile(e.target.files?.[0] ?? null)}
                className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm"
              />
            </section>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving documents..." : "Continue to review"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}