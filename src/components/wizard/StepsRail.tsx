import * as React from "react";
import StepItem from "./StepItem";
import { useNavigate } from "react-router-dom";

// export type WizardStep = { title: string; description?: string, path: string, subtitle?: string };

export default function StepsRail({
  steps,
  activeStep,
}: {
  steps: any;
  activeStep: number; // 1-based
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-backgroundShade2 p-6 md:p-8 border-r border-border h-full">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold  mb-2">
            Activate your service
          </h2>
          <p className="text-sm text-textSecondary">
            To start using the service, complete the three steps below.
          </p>
        </div>

        <div className="relative space-y-4">
          <div className="absolute left-[14px] top-0 bottom-0 w-px bg-border" />
          {steps.map((s:any, i:any) => (
            <StepItem
              key={s.title}
              index={i + 1}
              title={`Step ${i + 1}. ${s.title}`}
              description={i + 1 === activeStep ? s.description : undefined}
              active={i + 1 === activeStep}
              onClick={() => navigate(s.path)} // 👈 use react-router
            />
          ))}
        </div>
      </div>
    </div>
  );
}
