import * as React from 'react';
import {
  Box, Typography, FormHelperText, Chip, Stack, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../../../types/types';


const ROLE_LABEL: Record<Role, string> = {
  participant: 'Participant',
  trainer: 'Trainer',
  admin: 'Admin',
};

const ROLE_CHIP_COLOR: Record<Role, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
  participant: 'primary',
  trainer: 'success',
  admin: 'warning',
};

type Props = {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  /** 0–100; if omitted, progress bar is hidden */
  progress?: number;
  /** Current role (shown as a Chip) */
  role: Role;
  /** Optional right-side slot (e.g., help button) */
  rightSlot?: React.ReactNode;
};

export default function ProgressHeader({
  step,
  totalSteps,
  title,
  subtitle,
  progress,
  role,
  rightSlot,
}: Props) {
  const navigate = useNavigate();
  const showProgress = typeof progress === 'number';

  const goToRolePage = () => {
    // Use replace if you don't want "Back" to return to this step:
    // navigate('/auth/register/role', { replace: true });
    navigate('/auth/register');
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr auto' },
        alignItems: 'end',
        gap: 2,
      }}
    >
      {/* Left: step meta + titles */}
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
          {(step || totalSteps) && (
            <Typography variant="overline" sx={{ letterSpacing: '.08em' }}>
              Step {step}{totalSteps ? ` of ${totalSteps}` : ''}
            </Typography>
          )}

          {role && (
            <Chip
              size="small"
              color={ROLE_CHIP_COLOR[role]}
              label={ROLE_LABEL[role]}
              sx={{ fontWeight: 600 }}
            />
          )}

          {/* Inline action that handles its own navigation */}
          <Button
            size="small"
            variant="text"
            onClick={goToRolePage}
            sx={{ textTransform: 'none', ml: 0.5 }}
          >
            Change role
          </Button>

          {rightSlot}
        </Stack>

        <Typography variant="h6" fontWeight={800} sx={{ mb: 0.25 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right: progress block (optional) */}
      {showProgress && (
        <Box sx={{ minWidth: 240 }}>
          <Box
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Form completion progress"
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: 'action.hover',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: '100%',
                bgcolor:
                  (progress ?? 0) > 66
                    ? 'success.main'
                    : (progress ?? 0) > 33
                    ? 'warning.main'
                    : 'primary.main',
                transition: 'width 240ms ease',
              }}
            />
          </Box>
          <FormHelperText sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            {progress}% complete
          </FormHelperText>
        </Box>
      )}
    </Box>
  );
}
