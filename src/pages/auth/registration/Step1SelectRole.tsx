import * as React from 'react';
import { Box, Button, Divider, GridLegacy as Grid, Stack, Typography, Link as MuiLink } from '@mui/material';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { nextStep, setRole } from '../../../redux/features/auth/registrationSlice';
import WizardLayout from '../../../components/wizard/WizardLayout';
import RoleOptionCard from '../../../components/wizard/RoleOptionCard';
import StickyActions from './components/StickyActions';
import { STEPS } from './shared/constants';

type RoleOption = {
  value: Role;
  label: string;
  description: string;
  icon: React.ElementType;
};

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'participant', label: 'Participant', description: 'Manage care plan, request shifts, view notes.', icon: AccessibleForwardIcon },
  { value: 'trainer', label: 'Trainer', description: 'Deliver trainings, manage availability, file reports.', icon: AssignmentIndIcon },
];


// Where to go after selecting a role
const ROLE_ROUTES: Record<Role, string> = {
  participant: '/auth/register/participant',
  trainer: '/auth/register/trainer',
  admin: '/auth/admin/signin'
  // if you add more roles later, map them here
};

export default function Step1SelectRole() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedRole = useAppSelector((s) => s.registration.role) as Role | null;

  const handleSelect = (role: Role) => dispatch(setRole(role));

  // ✅ define the missing function
  const handleContinue = () => {
    if (!selectedRole) return;
    dispatch(nextStep());
    const to = ROLE_ROUTES[selectedRole];
    // if a role doesn’t have a route mapped yet, stay put
    if (to) navigate(to);
  };

  return (
    <WizardLayout steps={STEPS} activeStep={1}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" fontWeight={800}>Step 1. Select your Role</Typography>
          <Typography variant="body2" color="text.secondary">
            Pick the role that best matches your use.
          </Typography>
        </Box>

        <Grid container spacing={1.5} role="radiogroup" aria-label="Select your role">
          {ROLE_OPTIONS.map((opt) => (
            <Grid key={opt.value} item xs={12} sm={6}>
              <RoleOptionCard
                checked={selectedRole === opt.value}
                icon={opt.icon}
                label={opt.label}
                description={opt.description}
                onSelect={() => handleSelect(opt.value)}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Use StickyActions with custom onContinue */}
      <StickyActions
        disabled={!selectedRole}
        onContinue={handleContinue}
        note="By continuing, you agree to the Terms and Privacy Policy."
      />
    </WizardLayout>

  );
}
