import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";
import { Role } from "../../../../types/types";

const ROLE_LABEL: Record<Role, string> = {
  participant: "Participant",
  trainer: "Trainer",
  admin: "Admin",
};

type Props = {
  step: number;
  totalSteps?: number;
  title: string;
  /** 0–100; if omitted, progress bar is hidden */
  progress?: number;
  role: Role;
  rightSlot?: React.ReactNode;
};

export default function ProgressHeader({
  step,
  totalSteps,
  title,
  progress,
  role,
  rightSlot,
}: Props) {
  const navigate = useNavigate();
  const showProgress = typeof progress === "number";

  const goToRolePage = () => navigate("/auth/register");

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        bgcolor: "var(--color-background-shade-1)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Top row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ px: 2, py: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          {(step || totalSteps) && (
            <Typography
              variant="caption"
              sx={{ color: "var(--color-text-secondary)", fontWeight: 500 }}
            >
              Step {step}
              {totalSteps ? ` of ${totalSteps}` : ""}
            </Typography>
          )}

          <Chip
            label={ROLE_LABEL[role]}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: "var(--color-primary)",
              color: "var(--color-text-hover)",
              height: 20,
            }}
          />

          <Button
            onClick={goToRolePage}
            variant="text"
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "0.7rem",
              color: "var(--color-primary)",
              "&:hover": { textDecoration: "underline" },
              p: 0,
              minWidth: "auto",
            }}
          >
            Change role
          </Button>

          {rightSlot}
        </Stack>

        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "var(--color-text)" }}
        >
          {title}
        </Typography>
      </Stack>

      {/* Slim progress line under header */}
      {showProgress && (
        <LinearProgress
          variant="determinate"
          value={Math.max(progress ?? 0, 2)}
          sx={{
            height: 3,
            bgcolor: "var(--color-border)",
            "& .MuiLinearProgress-bar": {
              bgcolor:
                (progress ?? 0) > 66
                  ? "var(--color-success)"
                  : (progress ?? 0) > 33
                  ? "var(--color-pending)"
                  : "var(--color-primary)",
            },
          }}
        />
      )}
    </Box>
  );
}
