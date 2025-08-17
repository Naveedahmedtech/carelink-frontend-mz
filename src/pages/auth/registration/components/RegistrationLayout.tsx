// src/pages/auth/registration/RegistrationLayout.tsx
import * as React from 'react';
import { Box, Container, Typography, useTheme, alpha, Divider, Chip } from '@mui/material';

type Props = {
  stepLabel?: string;        // e.g., "Step 1"
  stepSubtitle?: string;     // e.g., "Choose your role"
  title: string;             // e.g., "Create your CareLink account"
  subtitle?: string;         // supporting copy
  footer?: React.ReactNode;  // actions/CTA area
  children: React.ReactNode; // form content
};

export default function RegistrationLayout({
  stepLabel = 'Step 1',
  stepSubtitle = 'Choose your role',
  title,
  subtitle,
  footer,
  children,
}: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      {/* Left brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          background: `
            radial-gradient(1000px 600px at 0% 0%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 60%),
            radial-gradient(1000px 600px at 100% 0%, ${alpha(theme.palette.secondary?.main || theme.palette.primary.light, 0.12)} 0%, transparent 60%),
            linear-gradient(180deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)
          `,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        }}
      >
        {/* Logo / Brand */}
        <Box>
          <Typography variant="h5" fontWeight={800}>CareLink</Typography>
          <Typography variant="body2" color="text.secondary">Participant & Trainer Platform</Typography>
        </Box>

        {/* Hero copy */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Welcome to better care coordination
          </Typography>
          <Typography color="text.secondary">
            Set up your account in a few quick steps. You can switch roles later in settings.
          </Typography>
        </Box>

        {/* Tiny footnote */}
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} CareLink — All rights reserved.
        </Typography>
      </Box>

      {/* Right form panel */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%', bgcolor: 'background.paper' }}>
        <Container maxWidth="sm" sx={{ flex: 1, py: 6 }}>
          {/* Step chip */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Chip
              size="small"
              variant="outlined"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={700}>{stepLabel}</Typography>
                  <Divider flexItem orientation="vertical" />
                  <Typography variant="body2" color="text.secondary">{stepSubtitle}</Typography>
                </Box>
              }
              sx={{ borderRadius: 999 }}
            />
          </Box>

          {/* Heading */}
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="h4" fontWeight={800} letterSpacing={-0.2}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Form/content */}
          <Box>{children}</Box>
        </Container>

        {/* Sticky footer actions (CTA) */}
        <Box
          sx={{
            position: { xs: 'sticky', md: 'sticky' },
            bottom: 0,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            backdropFilter: 'saturate(180%) blur(8px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <Container maxWidth="sm" sx={{ py: 2 }}>
            {footer}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
