import * as React from 'react';
import {
  AppBar, Toolbar, Box, Container, Paper, Typography, Stack, IconButton, Button,
  TextField, InputAdornment, Divider, useTheme, alpha, Link as MuiLink, Menu, MenuItem
} from '@mui/material';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate, Link } from 'react-router-dom';

type FormState = {
  company: string;
  username: string;
  password: string;
};

export default function AccountActivationStep2() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [values, setValues] = React.useState<FormState>({
    company: '',
    username: '',
    password: '',
  });
  const [showPw, setShowPw] = React.useState(false);
  const [langEl, setLangEl] = React.useState<null | HTMLElement>(null);

  const canContinue =
    values.company.trim().length >= 2 &&
    values.username.trim().length >= 2 &&
    values.password.length >= 6;

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    // TODO: dispatch to your RTK/RTKQ flow here
    navigate('/register/setup'); // next step
  };

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: theme.palette.mode === 'dark' ? '#0b0b0b' : '#f2f4f7' }}>
      {/* Top bar (logo + minimal nav + language) */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Logo */}
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.3} color="primary">
            .compani
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Mini nav (optional) */}
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MuiLink component={Link} to="#" underline="hover" color="text.primary">
              Home
            </MuiLink>
            <MuiLink component={Link} to="#" underline="hover" color="text.primary">
              How it works
            </MuiLink>
            <MuiLink component={Link} to="#" underline="hover" color="text.primary">
              Support
            </MuiLink>
          </Stack>

          {/* Language menu (flag icon to keep it simple) */}
          <IconButton
            color="inherit"
            onClick={(e) => setLangEl(e.currentTarget)}
            sx={{ ml: 1, color: 'text.secondary' }}
          >
            <FlagRoundedIcon />
          </IconButton>
          <Menu anchorEl={langEl} open={Boolean(langEl)} onClose={() => setLangEl(null)}>
            <MenuItem onClick={() => setLangEl(null)}>English (US)</MenuItem>
            <MenuItem onClick={() => setLangEl(null)}>English (UK)</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
            minHeight: { md: 560 },
          }}
        >
          {/* Left rail: Steps */}
          <Box
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? alpha('#2b3a8a', 0.35) : '#e8edff',
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Activate your service
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  To start using the service, please create and set up the account following three easy steps
                </Typography>
              </Box>

              <StepItem index={1} title="Step 1. Enter Activation Number" active={false} />
              <StepItem
                index={2}
                title="Step 2. Create your Account"
                active
                description="Fill in the 3-field form to create your account."
              />
              <StepItem index={3} title="Step 3. Set up your Account" active={false} />
            </Stack>
          </Box>

          {/* Right: Form */}
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Step 2. Create your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All the fields are obligatory for filling in
                </Typography>
              </Box>

              <Stack spacing={2}>
                <TextField
                  label="Company Name"
                  fullWidth
                  value={values.company}
                  onChange={onChange('company')}
                  autoComplete="organization"
                />
                <TextField
                  label="Admin Username"
                  fullWidth
                  value={values.username}
                  onChange={onChange('username')}
                  autoComplete="username"
                />
                <TextField
                  label="Password"
                  fullWidth
                  type={showPw ? 'text' : 'password'}
                  value={values.password}
                  onChange={onChange('password')}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPw ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPw((s) => !s)}
                          edge="end"
                        >
                          {showPw ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Use at least 6 characters."
                />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosNewRoundedIcon fontSize="small" />}
                  onClick={() => navigate(-1)}
                  sx={{ borderRadius: 2 }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canContinue}
                  sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
                >
                  Next Step
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary" textAlign="center">
                By continuing, you agree to the Terms and Privacy Policy.
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

/** Small helper to render the step tiles on the left rail */
function StepItem({
  index,
  title,
  description,
  active,
}: {
  index: number;
  title: string;
  description?: string;
  active: boolean;
}) {
  const theme = useTheme();
  const activeColor = theme.palette.primary.main;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        borderColor: active ? activeColor : 'divider',
        boxShadow: active ? theme.shadows[1] : 'none',
        bgcolor: active ? alpha(activeColor, 0.06) : 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 4,
            borderRadius: 2,
            bgcolor: active ? activeColor : 'divider',
            alignSelf: 'stretch',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {active ? (
              <CheckCircleRoundedIcon fontSize="small" color="primary" />
            ) : (
              <RadioButtonUncheckedRoundedIcon sx={{ color: 'text.disabled' }} fontSize="small" />
            )}
            <Typography fontWeight={700}>{title}</Typography>
          </Stack>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Step {index}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
