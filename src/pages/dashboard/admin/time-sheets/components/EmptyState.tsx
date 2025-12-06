import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function EmptyState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        bgcolor: "grey.50",
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Stack spacing={0.75} alignItems="center">
        <EventBusyIcon color="disabled" />
        <Typography variant="subtitle1" fontWeight={700}>
          No entries this week
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adjust filters or pick another week to see timesheet activity.
        </Typography>
      </Stack>
    </Box>
  );
}
