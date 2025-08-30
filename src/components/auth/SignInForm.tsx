// src/components/auth/SignInForm.tsx
import * as React from 'react';
import {
  Alert, Box, Button, Checkbox, CircularProgress, Divider,
  FormControlLabel, IconButton, InputAdornment, Link as MuiLink,
  Stack, TextField, Typography, alpha, useMediaQuery, useTheme,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

export type SignInValues = {
  email: string;
  password: string;
  remember: boolean;
};

export type SignInFormProps = {
  /** Called when user submits valid form */
  onSubmit: (values: SignInValues) => Promise<void> | void;
  /** Optional error message to display (e.g., from server) */
  errorMessage?: string | null;
  /** Loading state controlled by parent (e.g., during API call) */
  loading?: boolean;
  /** Prefill values (e.g., remembered email) */
  defaultValues?: Partial<SignInValues>;
  /** Show/Hide the left hero panel (defaults to true for mdUp) */
  showHero?: boolean;
  /** Forgot password & Create account links (optional) */
  forgotLinkHref?: string;
  createLinkHref?: string;
  /** Custom titles */
  title?: string;
  subtitle?: string;
};

export default function SignInForm({
  onSubmit,
  errorMessage = null,
  loading = false,
  defaultValues,
  showHero = true,
  forgotLinkHref = '/auth/forgot-password',
  createLinkHref = '/auth/register/role',
  title = 'Sign in',
  subtitle = 'Use your email and password to continue.',
}: SignInFormProps) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [email, setEmail] = React.useState(defaultValues?.email ?? '');
  const [password, setPassword] = React.useState(defaultValues?.password ?? '');
  const [remember, setRemember] = React.useState<boolean>(defaultValues?.remember ?? false);
  const [showPw, setShowPw] = React.useState(false);
  const [capsOn, setCapsOn] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const pwOk = password.length >= 6;
  const formOk = emailOk && pwOk;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    setInternalError(null);
    if (!formOk || loading) return;

    try {
      await onSubmit({ email, password, remember });
    } catch (err) {
      setInternalError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', width: '100%' }}>
      {/* Left hero (hidden on mobile, toggleable via showHero) */}
      {showHero && mdUp && (
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: (t) =>
              t.palette.mode === 'dark'
                ? alpha(t.palette.primary.main, 0.12)
                : alpha(t.palette.primary.light, 0.16),
          }}
        >
          <Typography variant="h4" fontWeight={900}>
            CareLink
          </Typography>
          <Typography variant="h5" fontWeight={800} sx={{ mt: 3 }}>
            Welcome back 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage care plans, bookings, and secure notes — all in one place.
          </Typography>

          <Stack spacing={2}>
            <Feature icon={<VerifiedRoundedIcon />} title="NDIS-aligned" desc="Built around NDIS standards." />
            <Feature icon={<CalendarMonthRoundedIcon />} title="Scheduling" desc="View and manage shifts easily." />
            <Feature icon={<ShieldRoundedIcon />} title="Privacy first" desc="Your data is safeguarded." />
          </Stack>
        </Box>
      )}

      {/* Right form */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>

          {(internalError || errorMessage) && (
            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
              {internalError ?? errorMessage}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                type="email"
                autoComplete="email"
                error={touched && !emailOk}
                helperText={touched && !emailOk ? 'Enter a valid email address' : ' '}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  setCapsOn(e.getModifierState('CapsLock'))
                }
                fullWidth
                size="small"
                autoComplete="current-password"
                error={touched && !pwOk}
                helperText={
                  touched && !pwOk
                    ? 'Minimum 6 characters'
                    : capsOn
                    ? 'Caps Lock is ON'
                    : ' '
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((s) => !s)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPw ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Remember me"
                />
                {forgotLinkHref ? (
                  <MuiLink href={forgotLinkHref} underline="hover">
                    Forgot password?
                  </MuiLink>
                ) : null}
              </Stack>

              <Button
                type="submit"
                variant="contained"
                disabled={!formOk || loading}
                sx={{ borderRadius: 2, py: 1.2, textTransform: 'none' }}
                startIcon={
                  loading ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : null
                }
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {createLinkHref ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Don’t have an account?{' '}
              <MuiLink href={createLinkHref} underline="hover">
                Create one
              </MuiLink>
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={(t) => ({
          width: 40,
          height: 40,
          borderRadius: '12px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: alpha(t.palette.primary.main, 0.15),
          color: 'primary.main',
        })}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontWeight={700} variant="body2">
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {desc}
        </Typography>
      </Box>
    </Stack>
  );
}
