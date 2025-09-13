import React, { useState } from "react";
import StepWizard from "./StepWizard";
import { STEPS } from "../../../auth/registration/shared/constants";


export default function ParticipantProfile() {
  const [activeStep, setActiveStep] = useState(0);

  const onNext = () => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1));
  const onBack = () => setActiveStep((s) => Math.max(0, s - 1));

  return (
    <StepWizard steps={STEPS} activeStep={activeStep} onNext={onNext} onBack={onBack}>

    </StepWizard>
  );
}
