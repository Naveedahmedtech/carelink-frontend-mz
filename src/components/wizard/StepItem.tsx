import * as React from 'react';
import { Paper, Stack, Typography, Box, useTheme, alpha } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

export default function StepItem({
  index, title, description, active,
}: {
  index: number; title: string; description?: string; active: boolean;
}) {
  const theme = useTheme();
  const activeColor = theme.palette.primary.main;
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2, borderRadius: 2,
        borderColor: active ? activeColor : 'divider',
        boxShadow: active ? theme.shadows[1] : 'none',
        bgcolor: active ? alpha(activeColor, 0.06) : 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box sx={{ width: 4, borderRadius: 2, bgcolor: active ? activeColor : 'divider', alignSelf: 'stretch' }} />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {active ? <CheckCircleRoundedIcon fontSize="small" color="primary" /> :
              <RadioButtonUncheckedRoundedIcon sx={{ color: 'text.disabled' }} fontSize="small" />}
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
