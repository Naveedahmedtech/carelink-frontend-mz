// -----------------------------------------------
// src/pages/trainers/onboarding/sections/SpecialisationsSection.tsx
import * as React from "react";
import { Box, Chip } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/PsychologyAltRounded";
import SectionCard from "../../../components/SectionCard";

import type { TrainerRegistrationErrors, TrainerRegistrationValues } from "../shared/types";
import { SPECIALISATIONS } from "../shared/constants";

type Props = {
  values: TrainerRegistrationValues;
  errors: TrainerRegistrationErrors;
  setValue: <K extends keyof TrainerRegistrationValues>(k: K, v: TrainerRegistrationValues[K]) => void;
};

export default function SpecialisationsSection({ values, errors, setValue }: Props) {
  const selected = values.specialisations;

  const isSelected = (s: string) => selected.includes(s);
  const toggle = (s: string) =>
    setValue(
      "specialisations",
      isSelected(s) ? selected.filter((x) => x !== s) : [...selected, s]
    );

  // Show selected first (no duplication; just one list)
  const ordered = React.useMemo(() => {
    return [...SPECIALISATIONS].sort((a, b) => {
      const A = isSelected(a), B = isSelected(b);
      if (A !== B) return A ? -1 : 1; // selected first
      return a.localeCompare(b);
    });
  }, [selected]);

  return (
    <SectionCard
      title="Areas of Specialisation"
      subtitle="Select all that apply"
      icon={<PsychologyIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
    >
      <Box className="flex flex-wrap gap-1.5">
        {ordered.map((s) => {
          const active = isSelected(s);
          return (
            <Chip
              key={s}
              clickable
              onClick={() => toggle(s)}
              label={s}
              variant={active ? "filled" : "outlined"}
              sx={{
                borderRadius: "999px",
                px: 1.25,
                ...(active
                  ? {
                      bgcolor: "var(--color-primary)",
                      color: "#fff",
                      borderColor: "transparent",
                      "&:hover": { bgcolor: "var(--color-hover)", color: "var(--color-text-hover)" },
                    }
                  : {
                      borderColor: "var(--color-border)",
                      bgcolor: "var(--color-background)",
                      "&:hover": { borderColor: "var(--color-primary)", color: "var(--color-primary)" },
                    }),
              }}
            />
          );
        })}
      </Box>

      {errors.specialisations && (
        <p className="text-[12px] text-error mt-2">{errors.specialisations}</p>
      )}
    </SectionCard>
  );
}
