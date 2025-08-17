// src/pages/auth/SignIn.tsx
import * as React from 'react';
import {
  Alert, Box, Button, Checkbox, CircularProgress, Container, Divider, FormControlLabel,
  IconButton, InputAdornment, Link as MuiLink, Paper, Stack, TextField, Typography, alpha, GridLegacy as Grid
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

const DEFAULT_AFTER_SIGNIN = '/app'; // change to your dashboard

export default function SignIn() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.from ?? DEFAULT_AFTER_SIGNIN;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);
  const [capsOn, setCapsOn] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Restore remembered email
  React.useEffect(() => {
    const saved = localStorage.getItem('cl_signin_email');
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const pwOk = password.length >= 6;
  const formOk = emailOk && pwOk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFormError(null);
    if (!formOk || isSubmitting) return;

    if (remember) localStorage.setItem('cl_signin_email', email);
    else localStorage.removeItem('cl_signin_email');

    setIsSubmitting(true);
    try {
      // no API yet — simulate quick flow
      await new Promise((r) => setTimeout(r, 350));
      navigate(redirectTo, { replace: true });
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        // soft gradient that adapts to theme
        background: (t) =>
          t.palette.mode === 'dark'
            ? `radial-gradient(1200px 600px at 10% -10%, ${alpha(t.palette.primary.main, .25)} 0%, transparent 60%),
               radial-gradient(800px 400px at 100% 100%, ${alpha(t.palette.secondary.main, .2)} 0%, transparent 55%),
               #0b0b0b`
            : `radial-gradient(1200px 600px at 10% -10%, ${alpha(t.palette.primary.light, .25)} 0%, transparent 60%),
               radial-gradient(800px 400px at 100% 100%, ${alpha(t.palette.secondary.light, .18)} 0%, transparent 55%),
               #f2f4f7`,
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: (t) => `1px solid ${alpha(t.palette.common.black, 0.08)}`,
          }}
        >
          <Grid container>
            {/* Brand / Value panel (hidden on mobile) */}
            {mdUp && (
              <Grid item md={5}
                sx={{
                  p: 4,
                  background: (t) =>
                    t.palette.mode === 'dark'
                      ? alpha(t.palette.primary.main, 0.12)
                      : alpha(t.palette.primary.light, 0.16),
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h6" fontWeight={900} color="primary">
                  CareLink
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                  Welcome back 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to manage care plans, bookings, and secure messages — all in one place.
                </Typography>

                <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                  <Feature icon={<VerifiedRoundedIcon />} title="NDIS-aligned" desc="Built around NDIS standards and best practices." />
                  <Feature icon={<CalendarMonthRoundedIcon />} title="Scheduling" desc="View and manage shifts effortlessly." />
                  <Feature icon={<ShieldRoundedIcon />} title="Privacy first" desc="Your data is protected with strong safeguards." />
                </Stack>

                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Need help? <MuiLink component={Link} to="/support" underline="hover">Visit Support</MuiLink>
                </Typography>
              </Grid>
            )}

            {/* Form panel */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ mb: 0.25 }}>
                      Sign in
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use your email and password to continue.
                    </Typography>
                  </Box>

                  {/* Error region (SR-friendly) */}
                  {formError && (
                    <Alert severity="error" variant="outlined" role="status" aria-live="polite">
                      {formError}
                    </Alert>
                  )}

                  {/* Optional SSO (placeholder) */}
                  {/* <Button variant="outlined" startIcon={<LoginRoundedIcon />} sx={{ borderRadius: 2 }}>
                    Continue with SSO
                  </Button>
                  <Divider>or</Divider> */}

                  <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={1.5}>
                      <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        size="small"
                        autoFocus
                        type="email"
                        autoComplete="email"
                        error={touched && !emailOk}
                        helperText={touched && !emailOk ? 'Enter a valid email address' : ' '}
                        inputProps={{
                          inputMode: 'email',
                          autoCorrect: 'off',
                          autoCapitalize: 'none',
                          spellCheck: 'false',
                        }}
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
                        onKeyUp={(e) => setCapsOn((e as any).getModifierState?.('CapsLock'))}
                        onKeyDown={(e) => setCapsOn((e as any).getModifierState?.('CapsLock'))}
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
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPw((s) => !s)}
                                edge="end"
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
                        <MuiLink component={Link} to="/auth/forgot-password" underline="hover">
                          Forgot password?
                        </MuiLink>
                      </Stack>

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!formOk || isSubmitting}
                        sx={{ textTransform: 'none', borderRadius: 2, py: 1.1 }}
                        startIcon={
                          isSubmitting ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : null
                        }
                      >
                        {isSubmitting ? 'Signing in…' : 'Sign in'}
                      </Button>
                    </Stack>
                  </Box>

                  <Divider />

                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Don’t have an account?{' '}
                    <MuiLink component={Link} to="/auth/register/role" underline="hover">
                      Create one
                    </MuiLink>
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

/** Tiny presentational component for the left panel */
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
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: t.palette.mode === 'dark'
            ? alpha(t.palette.primary.main, 0.2)
            : alpha(t.palette.primary.main, 0.12),
          color: t.palette.primary.main,
          flexShrink: 0,
        })}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={700} variant="body2" sx={{ lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {desc}
        </Typography>
      </Box>
    </Stack>
  );
}
