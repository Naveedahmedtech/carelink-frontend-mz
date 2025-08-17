import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';

export interface RegistrationStep {
  label: string;
  component: React.ReactElement;
}

interface Props {
  steps: RegistrationStep[];
}

const RegistrationStepper: React.FC<Props> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box className="w-full max-w-2xl mx-auto">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className="my-6">{steps[activeStep].component}</Box>
      <Box className="flex justify-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationStepper;
