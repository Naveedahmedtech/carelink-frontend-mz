
// -----------------------------------------------
// src/pages/trainers/onboarding/sections/TrainerIdentitySection.tsx
import * as React from "react";
import {  TextField, InputAdornment } from "@mui/material";
import { GridLegacy as Grid } from '@mui/material';
import SectionCard from "../../../components/SectionCard";

import BadgeIcon from "@mui/icons-material/BadgeRounded";
import EmailIcon from "@mui/icons-material/EmailRounded";
import PhoneIcon from "@mui/icons-material/PhoneIphoneRounded";
import HomeIcon from "@mui/icons-material/HomeRounded";
import type { TrainerRegistrationErrors, TrainerRegistrationValues } from "../shared/types";

export default function TrainerIdentitySection({
  values,
  errors,
  setValue,
}: {
  values: TrainerRegistrationValues;
  errors: TrainerRegistrationErrors;
  setValue: <K extends keyof TrainerRegistrationValues>(k: K, v: TrainerRegistrationValues[K]) => void;
}) {
  const fieldProps = {
    fullWidth: true,
    size: "small" as const,
    sx: {
      "& .MuiOutlinedInput-root": {
        bgcolor: "var(--color-background-shade-1)",
        borderRadius: "6px",
        "& fieldset": { borderColor: "var(--color-border)" },
        "&:hover fieldset": { borderColor: "var(--color-primary)" },
        "&.Mui-focused fieldset": { borderColor: "var(--color-primary)", borderWidth: 2 },
      },
    },
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    const hasPlus = raw.startsWith("+");
    const digits = raw.replace(/\D/g, "");
    const trimmedDigits = digits.slice(0, 11);
    const nextValue = hasPlus ? `+${trimmedDigits}` : trimmedDigits;
    setValue("phone", nextValue);
  };

  return (
    <SectionCard
      title="Your Details"
      subtitle="Tell us who you are and how we can reach you"
      icon={<BadgeIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...fieldProps}
            label="Full Name"
            value={values.fullName}
            onChange={(e) => setValue("fullName", e.target.value)}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName}
            autoComplete="name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...fieldProps}
            label="Email"
            value={values.email}
            onChange={(e) => setValue("email", e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "var(--color-text-secondary)" }} /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...fieldProps}
            label="Mobile Number"
            value={values.phone}
            onChange={handlePhoneChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone || "AU format: 04xx xxx xxx or +61 4xx xxx xxx"}
            autoComplete="tel"
            inputProps={{ inputMode: "tel", pattern: "\\+?[0-9]*", maxLength: 12 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "var(--color-text-secondary)" }} /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...fieldProps}
            label="Home Address (optional)"
            value={values.address}
            onChange={(e) => setValue("address", e.target.value)}
            error={Boolean(errors.address)}
            helperText={errors.address || "We’ll add Google autocomplete later."}
            autoComplete="street-address"
            InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: "var(--color-text-secondary)" }} /></InputAdornment> }}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
}
