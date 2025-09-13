import React from "react";
import { Container, Stack, Stepper, Step, StepLabel, Button, Box } from "@mui/material";

type StepItem = { key: string; title: string };

interface Props {
  steps: StepItem[];
  activeStep: number;
  onNext: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function StepWizard({ steps, activeStep, onNext, onBack, children }: Props) {
  return (
    <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 }, py: 4 }}>
      <Stack spacing={4}>
        {/* Stepper header */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((s, i) => (
            <Step key={s.key} completed={i < activeStep}>
              <StepLabel>{s.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        <Box>{children}</Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {onBack && activeStep > 0 && (
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          )}
          <Button variant="contained" onClick={onNext}>
            {activeStep < steps.length - 1 ? "Continue" : "Finish"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
