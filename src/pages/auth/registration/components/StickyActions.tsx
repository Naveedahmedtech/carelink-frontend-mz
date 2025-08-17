import * as React from 'react';
import { Box, Button, Divider, Stack, Typography, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function StickyActions({ disabled }: { disabled: boolean }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: { md: 'sticky' }, bottom: { md: 0 }, zIndex: 2, pt: 0.5,
        background: (t) => `linear-gradient(to top, ${alpha(t.palette.background.default, 1)} 70%, ${alpha(t.palette.background.default, 0)})`,
      }}
    >
      <Divider sx={{ mb: 2 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.25} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          By continuing, you confirm details are accurate and up to date.
        </Typography>
        <Stack direction="row" gap={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="text" sx={{ borderRadius: 8, px: 2.5, flex: { xs: 1, sm: 'unset' } }} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit" variant="contained" disabled={disabled}
                  sx={{ textTransform: 'none', borderRadius: 8, px: 3, flex: { xs: 1, sm: 'unset' } }}>
            Continue to Agreement
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
