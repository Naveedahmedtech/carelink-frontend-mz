import * as React from 'react';
import { Box, Stack, Typography, useTheme, alpha } from '@mui/material';
import StepItem from './StepItem';

export type WizardStep = { title: string; description?: string };

export default function StepsRail({
  steps,
  activeStep
}: {
  steps: WizardStep[];
  activeStep: number; // 1-based
}) {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha('#2b3a8a', 0.35) : '#e8edff', p: { xs: 3, md: 4 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Activate your service
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To start using the service, complete the three steps below.
          </Typography>
        </Box>

        {steps.map((s, i) => (
          <StepItem
            key={s.title}
            index={i + 1}
            title={`Step ${i + 1}. ${s.title}`}
            description={i + 1 === activeStep ? s.description : undefined}
            active={i + 1 === activeStep}
          />
        ))}
      </Stack>
    </Box>
  );
}
