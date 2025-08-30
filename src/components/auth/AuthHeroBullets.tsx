// src/components/auth/AuthHeroBullets.tsx
import * as React from "react";
import { Box, Stack, Typography, alpha } from "@mui/material";

export function Bullet({
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
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          bgcolor: alpha(t.palette.primary.main, 0.15),
          color: "primary.main",
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

export default function AuthHeroBullets({
  heading = "Welcome back 👋",
  subheading = "Manage care plans, bookings, and secure notes — all in one place.",
  bullets,
}: {
  heading?: string;
  subheading?: string;
  bullets: React.ReactNode; // pass <Bullet /> items inside a Stack
}) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
        {heading}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {subheading}
      </Typography>
      <Stack spacing={2}>{bullets}</Stack>
    </Box>
  );
}
