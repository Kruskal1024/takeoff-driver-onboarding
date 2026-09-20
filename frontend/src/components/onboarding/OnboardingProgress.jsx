const steps = [
  { number: 1, label: "Personal" },
  { number: 2, label: "Identity" },
  { number: 3, label: "Vehicle" },
  { number: 4, label: "Documents" },
  { number: 5, label: "Review" },
];

export default function OnboardingProgress({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = step.number < currentStep;
          const active = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                    completed || active
                      ? "border-beacon bg-beacon text-white"
                      : "border-mist-300 bg-cloud text-mist-500",
                  ].join(" ")}
                >
                  {completed ? "✓" : step.number}
                </div>

                <span
                  className={[
                    "mt-2 whitespace-nowrap text-[11px] font-medium",
                    active
                      ? "text-ink-900"
                      : completed
                        ? "text-beacon"
                        : "text-mist-500",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mx-2 mt-[-18px] h-px flex-1",
                    step.number < currentStep
                      ? "bg-beacon"
                      : "bg-mist-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}