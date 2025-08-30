import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

type Props = { name: string };

export default function DashboardGreeting({ name }: Props) {
  return (
    <Box
      sx={{
        mb: 4,
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: "var(--color-background)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      {/* Left: Avatar + Text */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "var(--color-primary)",
          }}
        >
          <AccountCircleRoundedIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Welcome back, {name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Here’s what’s happening with your shifts this week.
          </Typography>
        </Box>
      </Stack>

      {/* Right: Quick Action */}
      {/* <Button
        variant="contained"
        startIcon={<CalendarMonthIcon />}
        sx={{
          bgcolor: "#fff",
          color: "var(--color-primary)",
          borderRadius: 999,
          fontWeight: 600,
          textTransform: "none",
          "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
        }}
      >
        View Schedule
      </Button> */}
    </Box>
  );
}
