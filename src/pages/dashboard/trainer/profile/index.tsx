import * as React from "react";
import {
    Container,
    Stack,
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Alert,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TrainerRegistrationErrors, TrainerRegistrationValues } from "../../../auth/registration/trainers/onboarding/shared/types";
import { COMPULSORY_DOCS, TRAINER_STEPS } from "../../../auth/registration/trainers/onboarding/shared/constants";
import TrainerIdentitySection from "../../../auth/registration/trainers/onboarding/sections/TrainerIdentitySection";
import AvailabilityTravelSection from "../../../auth/registration/trainers/onboarding/sections/AvailabilityTravelSection";
import SpecialisationsSection from "../../../auth/registration/trainers/onboarding/sections/SpecialisationsSection";
import DocumentsSection from "../../../auth/registration/trainers/onboarding/sections/DocumentsSection";
import StickyActions from "../../../auth/registration/components/StickyActions";

export default function TrainerProfile() {
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

    const setValue = <K extends keyof TrainerRegistrationValues>(
        k: K,
        v: TrainerRegistrationValues[K]
    ) => setValues((s) => ({ ...s, [k]: v }));

    // validation logic
    React.useEffect(() => {
        const e: TrainerRegistrationErrors = {};
        if (activeStep === 0) {
            if (!values.fullName) e.fullName = "Required";
            if (
                !values.email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
            )
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
        setErrors(e);
    }, [activeStep, values]);

    const canContinue = Object.keys(errors).length === 0;

    const onNext = () => {
        setTriedSubmit(true);
        if (activeStep < TRAINER_STEPS.length - 1) {
            setActiveStep((s) => s + 1);
        } else {
            // Last step -> could trigger API save or redirect
            navigate(NEXT_URL, {
                replace: true,
                state: { from: "onboarding" },
            });
        }
    };

    const onBack = () => setActiveStep((s) => Math.max(0, s - 1));

    return (
        <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 }, py: 4 }}>
            <Stack spacing={4}>
                {/* Stepper header */}
                <Stepper activeStep={activeStep} alternativeLabel>
                    {TRAINER_STEPS.map((s, i) => (
                        <Step key={s.key} completed={i < activeStep}>
                            <StepLabel>{s.title}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {triedSubmit && !canContinue && (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        Please fix the highlighted fields to continue.
                    </Alert>
                )}

                {/* Step Content */}
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

                {/* Actions */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 3,
                        flexDirection: { xs: "column", sm: "row" },
                    }}
                >
                    {activeStep > 0 && (
                        <Button
                            variant="outlined"
                            onClick={onBack}
                            fullWidth={false}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={onNext}
                        fullWidth={false}
                    >
                        {activeStep < TRAINER_STEPS.length - 1
                            ? "Save & Continue"
                            : "Finish"}
                    </Button>
                </Box>

            </Stack>
        </Container>
    );
}
