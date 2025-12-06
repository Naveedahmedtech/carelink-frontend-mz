// src/pages/trainers/onboarding/TrainerOnboardingWizard.tsx
import * as React from "react";
import {
  Container,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,
} from "@mui/material";
import TrainerIdentitySection from "./sections/TrainerIdentitySection";
import AvailabilityTravelSection from "./sections/AvailabilityTravelSection";
import SpecialisationsSection from "./sections/SpecialisationsSection";
import DocumentsSection from "./sections/DocumentsSection";
import { TRAINER_STEPS, COMPULSORY_DOCS } from "./shared/constants";
import {
  TrainerRegistrationErrors,
  TrainerRegistrationValues,
} from "./shared/types";
import WizardLayout from "../../../../../components/wizard/WizardLayout";
import ProgressHeader from "../../components/ProgressHeader";
import StickyActions from "../../components/StickyActions";
import { useNavigate } from "react-router-dom";
import TrainingModulesSection from "./sections/TrainingModulesSection";
import { useUpsertTrainerMutation } from "../../../../../redux/features/trainerApi";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import { setTrainerProfile } from "../../../../../redux/features/trainerSlice";
import TrainerEmploymentAgreement from "./sections/TrainerEmploymentAgreement";

export default function TrainerOnboardingWizard() {
  const dispatch = useAppDispatch();
  const trainerProfile = useAppSelector((state) => state.trainer);

  const [activeStep, setActiveStep] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false); // avoid infinite loop
  const [values, setValues] = React.useState<TrainerRegistrationValues>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    availability: {},
    travelAreas: [],
    specialisations: [],
    documents: {},
    agreement: {  // 🔹 ensure initialized
      tos: false,
      privacy: false,
      consent: false,
      signature: { dataUrl: null, date: "" },
    },
  });
  const [errors, setErrors] = React.useState<TrainerRegistrationErrors>({});
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  const navigate = useNavigate();
  const [upsertTrainer, { isLoading: saving }] = useUpsertTrainerMutation();

  // hydrate once from Redux/localStorage
  React.useEffect(() => {
    console.log("trainerProfile", trainerProfile)
    if (!hydrated && trainerProfile?.onboardingStep !== undefined) {
      setActiveStep(trainerProfile.onboardingStep || 0);
      setValues((prev) => ({
        ...prev,
        fullName: trainerProfile.fullName || "",
        email: trainerProfile.email || "",
        phone: trainerProfile.phone || "",
        address: trainerProfile.address || "",
        availability: trainerProfile.availability || {},
        travelAreas: trainerProfile.travelAreas || [],
        specialisations: trainerProfile.specialisations || [],
        documents: trainerProfile.documents || {},
      }));
      setHydrated(true);
    }
  }, [trainerProfile, hydrated]);

  const NEXT_URL = "/auth/participant/book-interview";

  const setValue = <K extends keyof TrainerRegistrationValues>(
    k: K,
    v: TrainerRegistrationValues[K]
  ) => setValues((s) => ({ ...s, [k]: v }));

  // validation
  React.useEffect(() => {
    const e: TrainerRegistrationErrors = {};
    if (activeStep === 0) {
      if (!values.fullName) e.fullName = "Required";
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        e.email = "Valid email required";
      if (!values.phone || !/^0\d{9}$/.test(values.phone.replace(/\s/g, "")))
        e.phone = "Valid AU mobile required";
    }
    if (activeStep === 1) {
      if (!Object.values(values.availability).some((slots) => slots.length))
        e.availability = "Add at least one slot";
      if (!values.travelAreas.length)
        e.travelAreas = "Select at least one area";
    }
    if (activeStep === 2) {
      if (!values.specialisations.length)
        e.specialisations = "Pick at least one";
    }
    if (activeStep === 3) {
      const missing = COMPULSORY_DOCS.filter(
        (d) => !values.documents[d]?.file
      );
      if (missing.length) e.documents = `Missing: ${missing.join(", ")}`;
    }
    if (activeStep === 5) { // 🔹 validate agreement step
      if (
        !values.agreement?.tos ||
        !values.agreement?.privacy ||
        !values.agreement?.consent
      ) {
        e.agreement = "You must agree to all conditions.";
      }
      if (!values.agreement?.signature?.dataUrl) {
        e.agreement = "Signature is required.";
      }
    }
    setErrors(e);
  }, [activeStep, values]);

  const canContinue = Object.keys(errors).length === 0;

  // const onNext = async () => {
  //   setTriedSubmit(true);
  //   if (activeStep === 4) {
  //     setActiveStep(5);
  //     return;
  //   }
  //   if (!canContinue) return;

  //   if (activeStep < TRAINER_STEPS.length - 1) {
  //     const nextStep = activeStep + 1;
  //     console.log("Submitting step", trainerProfile, values);
  //     const result = await upsertTrainer({
  //       trainerId: trainerProfile?.trainerId || null,
  //       userId: trainerProfile?.userId || null,
  //       step: nextStep,
  //       ...values,
  //     }).unwrap();


  //     if (result?.data) {
  //       dispatch(
  //         setTrainerProfile({
  //           userId: result.data.user._id,
  //           trainerId: result.data.trainer._id,
  //           email: result.data.user.email,
  //           fullName: result.data.trainer.fullName,
  //           onboardingStep: result.data.trainer.onboardingStep,
  //         })
  //       );
  //     }

  //     setActiveStep(nextStep);
  //   } else {
  //     navigate(NEXT_URL, { replace: true, state: { from: "onboarding" } });
  //   }
  // };



  const onNext = async () => {
  setTriedSubmit(true);

  // 🔹 Step 4 (Training): just advance, no API
  if (activeStep === 4) {
    setActiveStep(5);
    return;
  }

  // 🔹 Step 5 (Agreement): validate + save to API + go to interview
  if (activeStep === 5) {
    if (!canContinue) return;

    const result = await upsertTrainer({
      trainerId: trainerProfile?.trainerId || null,
      userId: trainerProfile?.userId || null,
      step: 5,
      ...values, // includes agreement
    }).unwrap();

    if (result?.data) {
      dispatch(
        setTrainerProfile({
          userId: result.data.user._id,
          trainerId: result.data.trainer._id,
          email: result.data.user.email,
          fullName: result.data.trainer.fullName,
          onboardingStep: result.data.trainer.onboardingStep,
          agreement: result.data.trainer.agreement,
        })
      );
    }

    // ✅ now go to interview booking
    navigate(NEXT_URL, {
      replace: true,
      state: { from: "onboarding" },
    });
    return;
  }

  // 🔹 Steps 0–3: normal flow (validate + API + advance)
  if (!canContinue) return;

  if (activeStep < TRAINER_STEPS.length - 1) {
    const nextStep = activeStep + 1;
    const result = await upsertTrainer({
      trainerId: trainerProfile?.trainerId || null,
      userId: trainerProfile?.userId || null,
      step: nextStep,
      ...values,
    }).unwrap();

    if (result?.data) {
      dispatch(
        setTrainerProfile({
          userId: result.data.user._id,
          trainerId: result.data.trainer._id,
          email: result.data.user.email,
          fullName: result.data.trainer.fullName,
          onboardingStep: result.data.trainer.onboardingStep,
        })
      );
    }

    setActiveStep(nextStep);
  }
};



  const onBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const progress =
    ((activeStep + (canContinue ? 1 : 0)) / TRAINER_STEPS.length) * 100;

  return (
    <WizardLayout steps={TRAINER_STEPS} activeStep={activeStep + 1}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <ProgressHeader
            step={activeStep + 1}
            totalSteps={TRAINER_STEPS.length}
            title={TRAINER_STEPS[activeStep].title}
            progress={progress}
            role="trainer"
          />

          {triedSubmit && !canContinue && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Please fix the highlighted fields to continue.
            </Alert>
          )}

          {activeStep === 0 && (
            <TrainerIdentitySection
              values={values}
              errors={errors}
              setValue={setValue}
            />
          )}
          {activeStep === 1 && (
            <AvailabilityTravelSection
              values={values}
              errors={errors}
              setValue={setValue}
            />
          )}
          {activeStep === 2 && (
            <SpecialisationsSection
              values={values}
              errors={errors}
              setValue={setValue}
            />
          )}
          {activeStep === 3 && (
            <DocumentsSection
              values={values}
              errors={errors}
              setValue={setValue}
            />
          )}
          {activeStep === 4 && <TrainingModulesSection onComplete={onNext} />}
          {activeStep === 5 && ( // 🔹 new step
            <TrainerEmploymentAgreement
              values={values}
              errors={errors}
              setValue={setValue}
            />
          )}

          <Box>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ mb: 2, display: "none" }}
            >
              {TRAINER_STEPS.map((s, i) => (
                <Step key={s.key} completed={i < activeStep}>
                  <StepLabel>{s.short}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <StickyActions
              onBack={activeStep > 0 ? onBack : undefined}
              onContinue={onNext}
              disabled={saving}
            />
          </Box>
        </Stack>
      </Container>
    </WizardLayout>
  );
}
