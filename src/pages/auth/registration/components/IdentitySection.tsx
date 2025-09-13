import * as React from "react";
import {
  TextField,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";

import {
  EmailRounded as EmailIcon,
  PhoneIphoneRounded as PhoneIcon,
  BadgeRounded as BadgeIcon,
  HomeRounded as HomeIcon,
  ShieldRounded as ShieldIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SectionCard from "./SectionCard";
import { RegistrationErrors, RegistrationValues } from "../shared/types";

type Props = {
  values: RegistrationValues;
  errors: RegistrationErrors;
  onChange: (
    k: keyof RegistrationValues
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue?: (k: keyof RegistrationValues, v: any) => void; // for DatePicker
};

export default function IdentitySection({
  values,
  errors,
  onChange,
  setValue,
}: Props) {
  return (
    <SectionCard
      title="Your Details"
      subtitle="Who you are and how we can reach you"
      icon={<BadgeIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Field
            label="Full Name"
            value={values.fullName}
            onChange={onChange("fullName")}
            error={errors.fullName}
            autoComplete="name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field
            label="NDIS Number"
            value={values.ndisNumber}
            onChange={onChange("ndisNumber")}
            error={errors.ndisNumber}
            helper="If applicable. Format: 9 digits."
            autoComplete="off"
            inputMode="numeric"
            icon={
              <ShieldIcon
                fontSize="small"
                sx={{ color: "var(--color-text-secondary)" }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              disableFuture
              value={values.dob ? new Date(values.dob) : null}
              onChange={(newVal) => {
                // Always check type
                if (newVal instanceof Date && !isNaN(newVal.getTime())) {
                  // store as ISO string YYYY-MM-DD
                  setValue?.("dob", newVal.toISOString().split("T")[0]);
                } else {
                  setValue?.("dob", "");
                }
              }}
              slotProps={{
                popper: { sx: { zIndex: 1500 } }, // ensures calendar is not hidden
                textField: {
                  label: "Date of Birth",
                  fullWidth: true,
                  size: "small",
                  error: Boolean(errors.dob),
                  helperText: errors.dob || undefined,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ color: "var(--color-text-secondary)" }}>📅</Box>
                      </InputAdornment>
                    ),
                  },
                  sx: fieldSx,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>


        <Grid item xs={12} sm={6}>
          <Field
            label="Residential Address"
            value={values.address}
            onChange={onChange("address")}
            error={errors.address}
            helper="We’ll add address autocomplete later."
            autoComplete="street-address"
            icon={
              <HomeIcon
                fontSize="small"
                sx={{ color: "var(--color-text-secondary)" }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field
            label="Email"
            value={values.email}
            onChange={onChange("email")}
            error={errors.email}
            autoComplete="email"
            inputMode="email"
            icon={
              <EmailIcon
                fontSize="small"
                sx={{ color: "var(--color-text-secondary)" }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field
            label="Mobile Number"
            value={values.phone}
            onChange={onChange("phone")}
            error={errors.phone}
            helper="Australian format (e.g., 04xx xxx xxx)"
            autoComplete="tel"
            inputMode="tel"
            icon={
              <PhoneIcon
                fontSize="small"
                sx={{ color: "var(--color-text-secondary)" }}
              />
            }
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
}

function Field({
  label,
  error,
  helper,
  icon,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}) {
  return (
    <TextField
      {...props}
      label={label}
      fullWidth
      size="small"
      error={Boolean(error)}
      helperText={error || helper}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : undefined,
      }}
      sx={fieldSx}
    />
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "var(--color-background-shade-1)",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "var(--color-border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--color-primary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-primary)",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--color-text-secondary)",
    "&.Mui-focused": {
      color: "var(--color-primary)",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    marginLeft: 0,
  },
};
