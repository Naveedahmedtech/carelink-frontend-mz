import React from "react";
import { Stack, Avatar, Typography, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { safeFormat, money } from "../utils/tsUtils";

export default function TrainerHeader(props: {
  name: string;
  email: string;
  phone: string;
  createdAt?: string | Date | number | null;
  updatedAt?: string | Date | number | null;
  initialsText: string;
  totals: { hours: number; km: number; totalCents: number };
}) {
  const { name, email, phone, createdAt, updatedAt, initialsText, totals } = props;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
      <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>{initialsText}</Avatar>
      <Stack spacing={0}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PersonIcon fontSize="small" />
          <Typography variant="h6" fontWeight={700}>
            {name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {email} · {phone}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created: {safeFormat(createdAt, "dd MMM yyyy, hh:mm a")} · Updated: {safeFormat(updatedAt, "dd MMM yyyy, hh:mm a")}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ ml: { sm: "auto" } }} flexWrap="wrap" useFlexGap>
        <Chip icon={<AssignmentTurnedInIcon />} label={`Hours: ${totals.hours.toFixed(2)}`} variant="outlined" size="small" />
        <Chip icon={<LocalShippingIcon />} label={`KM: ${totals.km}`} variant="outlined" size="small" />
        {/* <Chip icon={<MonetizationOnIcon />} label={`Total: ${money(totals.totalCents)}`} variant="outlined" size="small" /> */}
      </Stack>
    </Stack>
  );
}
