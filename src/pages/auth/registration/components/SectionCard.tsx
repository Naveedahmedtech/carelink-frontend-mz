import * as React from 'react';
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';

type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  subtitle?: string;
};

export default function SectionCard({ title, icon, children, subtitle }: Props) {
  const theme = useTheme();
  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', borderColor: alpha(theme.palette.primary.main, 0.15) }}>
      <Box
        sx={{
          px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.18) : alpha(theme.palette.primary.main, 0.08),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`
        }}
      >
        <Box
          sx={{
            width: 30, height: 30, minWidth: 30, borderRadius: '50%',
            display: 'grid', placeItems: 'center',
            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.18),
            color: theme.palette.primary.main
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>{title}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
      </Box>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
    </Paper>
  );
}
