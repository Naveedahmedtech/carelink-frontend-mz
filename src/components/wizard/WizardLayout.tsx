import * as React from "react";
import StepsRail from "./StepsRail";
import PremiumLayout from "./PremiumLayout";

type Props = {
  steps: any;
  activeStep: number; // 1-based
  children: React.ReactNode;
};

export default function WizardLayout({ steps, activeStep, children }: Props) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const current =
    steps[Math.max(0, Math.min(steps.length - 1, activeStep - 1))];

  return (
    <PremiumLayout>
      <div className="grid md:grid-cols-[360px_1fr] ">
        {/* Left: Steps rail (desktop) */}
        <div className="hidden md:block border-r border-border">
          <StepsRail steps={steps} activeStep={activeStep} />
        </div>

        {/* Mobile: step header */}
        <div className="md:hidden border-b border-border sticky top-0 z-10 bg-backgroundShade1">
          <div className="p-4 flex justify-between gap-2">
            <div className="min-w-0">
              <p className="uppercase text-xs tracking-wider text-textMuted">
                Step {activeStep} of {steps.length}
              </p>
              <h2 className="font-extrabold text-text leading-tight">
                {current?.title ?? "Step"}
              </h2>
              {current?.description && (
                <p className="text-sm text-textSecondary mt-1">
                  {current.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="px-3 py-1.5 border border-border rounded-lg text-sm"
            >
              View steps
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="p-5">{children}</div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
          <div className="bg-backgroundShade1 rounded-t-2xl max-h-[80vh] p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-extrabold text-text">All steps</h3>
              <button
                className="text-sm text-primary"
                onClick={() => setDrawerOpen(false)}
              >
                Close
              </button>
            </div>
            <hr className="border-border mb-3" />
            <StepsRail steps={steps} activeStep={activeStep} />
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
