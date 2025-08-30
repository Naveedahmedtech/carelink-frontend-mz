import * as React from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SectionCard from "./SectionCard";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { RegistrationErrors, RegistrationValues } from "../shared/types";
import { GridLegacy as Grid } from '@mui/material';


type Props = {
  isMinor: boolean;
  setIsMinor: (v: boolean) => void;
  values: RegistrationValues;
  errors: RegistrationErrors;
  onChange: (
    k: keyof RegistrationValues
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function GuardianSection({
  isMinor,
  setIsMinor,
  values,
  errors,
  onChange,
}: Props) {
  return (
    <SectionCard
      title="Guardian / Carer"
      subtitle="Only required if you are under 18 or have a guardian"
      icon={<FavoriteRoundedIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
    >
      {/* Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isMinor}
            onChange={(e) => setIsMinor(e.target.checked)}
            sx={{
              color: "var(--color-primary)",
              "&.Mui-checked": {
                color: "var(--color-primary)",
              },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: "var(--color-text)" }}>
            I am under 18 or have a guardian/carer
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      {isMinor && (
        <>
          {/* Info alert */}
          <Box
            sx={{
              border: "1px solid var(--color-primary)",
              bgcolor: "var(--color-primary)/5",
              color: "var(--color-primary)",
              fontSize: "0.875rem",
              px: 2,
              py: 1,
              borderRadius: 2,
              mb: 3,
            }}
          >
            Please provide guardian/carer contact details.
          </Box>

          {/* Fields */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Field
                label="Guardian/Carer Name"
                value={values.guardianName}
                onChange={onChange("guardianName")}
                error={errors.guardianName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Field
                label="Guardian/Carer Phone"
                value={values.guardianPhone}
                onChange={onChange("guardianPhone")}
                error={errors.guardianPhone}
                inputMode="tel"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Field
                label="Guardian/Carer Email"
                value={values.guardianEmail}
                onChange={onChange("guardianEmail")}
                error={errors.guardianEmail}
                inputMode="email"
              />
            </Grid>
          </Grid>
        </>
      )}
    </SectionCard>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  helper,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helper?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error || helper}
      fullWidth
      size="small"
      inputProps={{ inputMode }}
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
    "&.Mui-error fieldset": {
      borderColor: "var(--color-error)",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    color: "var(--color-text-secondary)",
    "&.Mui-focused": {
      color: "var(--color-primary)",
    },
    "&.Mui-error": {
      color: "var(--color-error)",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    marginLeft: 0,
  },
};
