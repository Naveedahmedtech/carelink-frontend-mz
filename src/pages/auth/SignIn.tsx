import * as React from 'react';
import {
  Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel,
  IconButton, InputAdornment, Link as MuiLink, Stack, TextField, Typography,
  SvgIcon
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from "../../hooks";
import { setUser } from '../../redux/features/auth/authSlice';
import CareLinkAppBar from '../../components/wizard/AppBar';
import { loginSuccess } from '../../redux/features/authSlice';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const emailInputId = React.useId();
  const passwordInputId = React.useId();

  const [email, setEmail] = React.useState('trainer@carelink.com');
  const [password, setPassword] = React.useState('example');
  const [remember, setRemember] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);
  const [capsOn, setCapsOn] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

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

  const handleCapsCheck = (e: any) => {
    const state = e?.getModifierState?.('CapsLock');
    if (typeof state === 'boolean') setCapsOn(state);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFormError(null);
    if (!formOk || isSubmitting) return;

    if (remember) localStorage.setItem('cl_signin_email', email);
    else localStorage.removeItem('cl_signin_email');

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      dispatch(
        loginSuccess({
          id: "mock1",
          name: "CareLink User",
          email,
          role: email === "trainer@carelink.com" ? "trainer" : "participant", // change to "admin" or "trainer" or "participant" to test
          token: "fake-jwt",
          isLoggedIn: true,
        })
      );
      navigate('/dashboard');

    } catch {
      setFormError("Sign-in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CareLinkAppBar />
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--color-background-shade-1)',
          px: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 520, // 🔥 wider form
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0,0,0,.08)',
          }}
        >
          {/* Header */}
          <Stack spacing={1} textAlign="center" mb={4}>
            <LogoGlyph sx={{ fontSize: 48, color: 'var(--color-primary)' }} />
            <Typography variant="h4" fontWeight={800}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to your CareLink dashboard
            </Typography>
          </Stack>

          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
            <TextField
              id={emailInputId}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={handleCapsCheck}
              type="email"
              fullWidth
              size="medium"
              placeholder="you@company.com"
              error={touched && !emailOk}
              helperText={touched && !emailOk ? 'Enter a valid email address' : ' '}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />

            <TextField
              id={passwordInputId}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleCapsCheck}
              fullWidth
              size="medium"
              placeholder="Password"
              error={touched && !pwOk}
              helperText={
                touched && !pwOk ? 'Minimum 6 characters' : capsOn ? 'Caps Lock is ON' : ' '
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end">
                      {showPw ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
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
                label={<Typography variant="body2">Remember Me</Typography>}
              />
              <MuiLink
                component={Link}
                to="/auth/forgot-password"
                underline="hover"
                sx={{ fontSize: 13 }}
              >
                Forgot password?
              </MuiLink>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              disabled={!formOk || isSubmitting}
              fullWidth
              sx={{
                py: 1.4,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.05rem',
                bgcolor: 'var(--color-primary)',
                '&:hover': { bgcolor: 'var(--color-hover)' },
              }}
              startIcon={isSubmitting ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : null}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </Stack>

          <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
            Don’t have an account?{' '}
            <MuiLink component={Link} to="/auth/register" underline="hover">
              Register now
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </>
  );
}

/* ---------- Logo glyph ---------- */
function LogoGlyph(props: any) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2a3 3 0 0 1 3 3v1a3 3 0 1 1-6 0V5a3 3 0 0 1 3-3Zm0 9a3 3 0 0 1 3 3v1a3 3 0 1 1-6 0v-1a3 3 0 0 1 3-3ZM5 9a3 3 0 0 1 3-3h1a3 3 0 1 1 0 6H8a3 3 0 0 1-3-3Zm10 0a3 3 0 0 1 3-3h1a3 3 0 1 1 0 6h-1a3 3 0 0 1-3-3Z"
      />
    </SvgIcon>
  );
}
