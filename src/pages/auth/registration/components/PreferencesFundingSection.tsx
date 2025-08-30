import * as React from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SectionCard from "./SectionCard";
import {
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { GridLegacy as Grid } from '@mui/material';

import { DAYS, INTERESTS } from "../shared/constants";
import {
  FundingType,
  RegistrationErrors,
  RegistrationValues,
} from "../shared/types";
import AvailabilitySelector from "./AvailabilitySelector";

type Props = {
  values: RegistrationValues;
  errors: RegistrationErrors;
  fundingType: FundingType;
  setFundingType: (f: FundingType) => void;
  onChange: (
    k: keyof RegistrationValues
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDayAvailability: (day: string, val: string) => void;
  setInterests: (tags: string[]) => void;
};

export default function PreferencesFundingSection({
  values,
  errors,
  fundingType,
  setFundingType,
  onChange,
  setDayAvailability,
  setInterests,
}: Props) {
  return (
    <SectionCard
      title="Preferences & Funding"
      subtitle="Your interests, preferred times and funding details"
      icon={<FavoriteRoundedIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
    >
      {/* Interests */}
      <div style={{ marginBottom: "2rem" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Interests
        </Typography>

        <Autocomplete
          multiple
          options={INTERESTS}
          value={values.interests}
          onChange={(_, newVal) => setInterests(newVal)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                sx={{ bgcolor: "var(--color-primary)", color: "var(--color-text-hover)" }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Type to filter..."
              size="small"
              sx={fieldSx}
            />
          )}
        />

        <Typography variant="caption" sx={{ color: "var(--color-text-secondary)" }}>
          Select all that apply. You can type to filter.
        </Typography>
      </div>

      {/* Availability */}
      <div style={{ marginBottom: "2rem" }}>
        <AvailabilitySelector
          availability={values.availability}
          setDayAvailability={setDayAvailability}
        />
      </div>

      {/* Funding */}
      <Grid container spacing={3}>
        {fundingType !== "ndia" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Plan Manager Name"
                value={values.planManagerName}
                onChange={onChange("planManagerName")}
                error={Boolean(errors.planManagerName)}
                helperText={errors.planManagerName}
                autoComplete="organization"
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Plan Manager Invoice Email"
                value={values.planManagerEmail}
                onChange={onChange("planManagerEmail")}
                error={Boolean(errors.planManagerEmail)}
                helperText={errors.planManagerEmail}
                autoComplete="email"
                inputMode="email"
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" sx={fieldSx}>
            <InputLabel>Funding Type</InputLabel>
            <Select
              value={fundingType}
              onChange={(e) => setFundingType(e.target.value as FundingType)}
              label="Funding Type"
            >
              <MenuItem value="plan">Plan Managed</MenuItem>
              <MenuItem value="self">Self-Managed</MenuItem>
              <MenuItem value="ndia">NDIA Managed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </SectionCard>
  );
}

// Shared field styling (same as Guardian/Identity sections)
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "var(--color-background-shade-1)",
    borderRadius: "10px",
    "& fieldset": {
      borderColor: "var(--color-border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--color-primary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-primary)",
    },
    "&.Mui-error fieldset": {
      borderColor: "var(--color-error)",
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
