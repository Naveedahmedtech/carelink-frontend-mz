// src/pages/trainers/onboarding/TrainerOnboardingWizard.tsx
import * as React from "react";
import { Container, Stack, Stepper, Step, StepLabel, Button, Box, Alert } from "@mui/material";
import TrainerIdentitySection from "./sections/TrainerIdentitySection";
import AvailabilityTravelSection from "./sections/AvailabilityTravelSection";
import SpecialisationsSection from "./sections/SpecialisationsSection";
import DocumentsSection from "./sections/DocumentsSection";
import { TRAINER_STEPS, COMPULSORY_DOCS } from "./shared/constants";
import { TrainerRegistrationErrors, TrainerRegistrationValues } from "./shared/types";
import WizardLayout from "../../../../../components/wizard/WizardLayout";
import ProgressHeader from "../../components/ProgressHeader";
import StickyActions from "../../components/StickyActions";
import { useNavigate } from "react-router-dom";

export default function TrainerOnboardingWizard() {
  // You can wire these to Redux (registrationSlice) if preferred
  const [activeStep, setActiveStep] = React.useState(0);
  const [values, setValues] = React.useState<TrainerRegistrationValues>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    availability: {},
    travelAreas: [],
    specialisations: [],
    documents: {},
  });
  const [errors, setErrors] = React.useState<TrainerRegistrationErrors>({});
  const [triedSubmit, setTriedSubmit] = React.useState(false);
    const navigate = useNavigate();
  const NEXT_URL = "/auth/participant/book-interview";

  const setValue = <K extends keyof TrainerRegistrationValues>(k: K, v: TrainerRegistrationValues[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  // basic validation per step (extend as needed)
  React.useEffect(() => {
    const e: TrainerRegistrationErrors = {};
    if (activeStep === 0) {
      if (!values.fullName) e.fullName = "Required";
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Valid email required";
      if (!values.phone || !/^0\d{9}$/.test(values.phone.replace(/\s/g, ""))) e.phone = "Valid AU mobile required";
    }
    if (activeStep === 1) {
      if (!Object.values(values.availability).some((slots) => slots.length)) e.availability = "Add at least one slot";
      if (!values.travelAreas.length) e.travelAreas = "Select at least one area";
    }
    if (activeStep === 2) {
      if (!values.specialisations.length) e.specialisations = "Pick at least one";
    }
    if (activeStep === 3) {
      const missing = COMPULSORY_DOCS.filter((d) => !values.documents[d]?.file);
      if (missing.length) e.documents = `Missing: ${missing.join(", ")}`;
    }
    setErrors(e);
  }, [activeStep, values]);

  const canContinue = Object.keys(errors).length === 0;

  const onNext = () => {
    setTriedSubmit(true);
    // if (!canContinue) return;

    if (activeStep < TRAINER_STEPS.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      // Last step -> go to training page
      navigate(NEXT_URL, { replace: true, state: { from: "onboarding" } });
    }
  };

  const onBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const progress = ((activeStep + (canContinue ? 1 : 0)) / TRAINER_STEPS.length) * 100;

  return (
    <WizardLayout steps={TRAINER_STEPS} activeStep={activeStep + 1}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <ProgressHeader
            step={activeStep + 1}
            totalSteps={TRAINER_STEPS.length}
            title={TRAINER_STEPS[activeStep].title}
            // subtitle={TRAINER_STEPS[activeStep].subtitle}
            progress={progress}
            role="trainer"
          />

          {triedSubmit && !canContinue && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Please fix the highlighted fields to continue.
            </Alert>
          )}

          {activeStep === 0 && (
            <TrainerIdentitySection values={values} errors={errors} setValue={setValue} />
          )}
          {activeStep === 1 && (
            <AvailabilityTravelSection values={values} errors={errors} setValue={setValue} />
          )}
          {activeStep === 2 && (
            <SpecialisationsSection values={values} errors={errors} setValue={setValue} />
          )}
          {activeStep === 3 && (
            <DocumentsSection values={values} errors={errors} setValue={setValue} />
          )}

          <Box>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2, display: 'none' }}>
              {TRAINER_STEPS.map((s, i) => (
                <Step key={s.key} completed={i < activeStep}>
                  <StepLabel>{s.short}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <StickyActions
              onBack={activeStep > 0 ? onBack : undefined}
              onContinue={onNext}
            //   disabled={!canContinue}
            />
          </Box>
        </Stack>
      </Container>
    </WizardLayout>
  );
}
