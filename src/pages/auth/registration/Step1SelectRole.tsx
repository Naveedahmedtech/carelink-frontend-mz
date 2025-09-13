import * as React from 'react';
import {
  Box,
  GridLegacy as Grid,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  nextStep,
  setRole,
} from '../../../redux/features/auth/registrationSlice';
import RoleOptionCard from '../../../components/wizard/RoleOptionCard';
import StickyActions from './components/StickyActions';
import CareLinkAppBar from '../../../components/wizard/AppBar';

type RoleOption = {
  value: Role;
  label: string;
  description: string;
  icon: React.ElementType;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'participant',
    label: 'Participant',
    description: 'Manage care plan, request shifts, view notes.',
    icon: AccessibleForwardIcon,
  },
  {
    value: 'trainer',
    label: 'Trainer',
    description: 'Deliver trainings, manage availability, file reports.',
    icon: AssignmentIndIcon,
  },
];

const ROLE_ROUTES: Record<Role, string> = {
  participant: '/auth/register/participant',
  trainer: '/auth/register/trainer',
  admin: '/auth/admin/signin',
};

export default function Step1SelectRole() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedRole = useAppSelector(
    (s) => s.registration.role
  ) as Role | null;

  const handleSelect = (role: Role) => dispatch(setRole(role));

  const handleContinue = () => {
    if (!selectedRole) return;
    dispatch(nextStep());
    const to = ROLE_ROUTES[selectedRole];
    if (to) navigate(to);
  };

  return (
    <>
    <CareLinkAppBar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: { xs: 4, sm: 6 },
          px: 2,
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 800,
            borderRadius: 2,
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Step header */}
          <Box>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Step 1. Select your Role
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pick the role that best matches your use.
            </Typography>
          </Box>

          {/* Role options */}
          <Grid
            container
            spacing={2}
            role="radiogroup"
            aria-label="Select your role"
          >
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

          {/* Sticky-like actions inside card footer */}
          <Box sx={{ mt: 2 }}>
            <StickyActions
              disabled={!selectedRole}
              onContinue={handleContinue}
              note="By continuing, you agree to the Terms and Privacy Policy."
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
