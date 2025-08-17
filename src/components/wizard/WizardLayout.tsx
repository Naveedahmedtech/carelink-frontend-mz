import * as React from 'react';
import {
  AppBar, Toolbar, Box, Container, Paper, Typography, Stack, IconButton,
  useTheme, useMediaQuery, alpha, Link as MuiLink, Button, Drawer, Divider
} from '@mui/material';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { Link } from 'react-router-dom';
import StepsRail, { WizardStep } from './StepsRail';

type Props = {
  steps: WizardStep[];
  activeStep: number; // 1-based
  children: React.ReactNode;
};

export default function WizardLayout({ steps, activeStep, children }: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [langEl, setLangEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const current = steps[Math.max(0, Math.min(steps.length - 1, activeStep - 1))];

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: theme.palette.mode === 'dark' ? '#0b0b0b' : '#f2f4f7' }}>
      {/* Top app bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.3} color="primary">
            CareLink
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MuiLink component={Link} to="/" underline="hover" color="text.primary">Home</MuiLink>
            <MuiLink component={Link} to="/how-it-works" underline="hover" color="text.primary">How it works</MuiLink>
            <MuiLink component={Link} to="/support" underline="hover" color="text.primary">Support</MuiLink>
          </Stack>
          <IconButton sx={{ ml: 1, color: 'text.secondary' }} onClick={(e) => setLangEl(e.currentTarget)}>
            <FlagRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
            display: 'grid',
            gridTemplateColumns: mdUp ? '360px 1fr' : '1fr',
            minHeight: { md: 560 },
          }}
        >
          {/* Desktop: fixed left steps rail */}
          {mdUp ? (
            <StepsRail steps={steps} activeStep={activeStep} />
          ) : (
            /* Mobile: compact header with “View steps” */
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="overline" sx={{ letterSpacing: '.08em' }}>
                    Step {activeStep} of {steps.length}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                    {current?.title ?? 'Step'}
                  </Typography>
                  {current?.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {current.description}
                    </Typography>
                  )}
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
                >
                  View steps
                </Button>
              </Stack>
            </Box>
          )}

          {/* Main content */}
          <Box sx={{ p: { xs: 2.5, md: 5 } }}>{children}</Box>
        </Paper>
      </Container>

      {/* Mobile bottom drawer with full steps */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80dvh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={800}>All steps</Typography>
            <Button size="small" onClick={() => setDrawerOpen(false)}>Close</Button>
          </Stack>
          <Divider sx={{ mb: 1.5 }} />
          {/* Reuse the same StepsRail inside the drawer */}
          <StepsRail steps={steps} activeStep={activeStep} />
        </Box>
      </Drawer>
    </Box>
  );
}
