// src/components/shifts/PastShiftDetailsModal.tsx
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import NotesIcon from "@mui/icons-material/Notes";
import { getStatusStyle } from "../../utils";
import type { UiShift } from "../common/Calendar";

/** ===== Types that this modal accepts ===== */
type SimplePastShift = {
  id: string;
  title?: string;
  date?: string;           // ISO date string
  time?: string;           // "HH:mm – HH:mm"
  duration?: string;       // "1h 30m"
  status?: string;         // "Completed" etc.
  participant?: string;    // plain text name
  trainer?: string;        // optional plain text name
  notes?: string;
  report?: {
    activities?: string;
    progress?: string;
    incidents?: string;
    km?: number;
  };
};

// Union: either UiShift (old shape) OR SimplePastShift (new shape)
type ShiftLike = UiShift | SimplePastShift | (UiShift & SimplePastShift);

type Props = {
  open: boolean;
  shift: ShiftLike | null;
  onClose: () => void;
};

/** ===== Helpers (read-only) ===== */
const norm = (s?: string) => (s || "").toLowerCase().replace(/\s+/g, "_");

// getStatusStyle can return a color string or { bg }
const statusBg = (status: string) => {
  const style = getStatusStyle(norm(status));
  return typeof style === "string" ? style : style?.bg || "#666";
};

const fmtDateTimeRange = (startISO?: string, endISO?: string) => {
  if (!startISO || !endISO) return "";
  const start = new Date(startISO);
  const end = new Date(endISO);

  const dateFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(start);

  const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateFmt} — ${timeFmt.format(start)} to ${timeFmt.format(end)}`;
};

const fmtDatePlusTimeString = (dateISO?: string, timeText?: string) => {
  if (!dateISO) return timeText || "";
  const d = new Date(dateISO);
  const dateFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
  return timeText ? `${dateFmt} — ${timeText}` : dateFmt;
};

const fmtDuration = (startISO?: string, endISO?: string) => {
  if (!startISO || !endISO) return "";
  const ms = Math.max(0, new Date(endISO).getTime() - new Date(startISO).getTime());
  const mins = Math.round(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

const pretty = (s?: string) =>
  (s || "unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** ===== Field-safe getters to support both shapes ===== */
const getTitle = (shift?: ShiftLike | null) =>
  (shift as any)?.title || (shift as any)?.raw?.shift?.service || "Shift Details";

const getStatus = (shift?: ShiftLike | null) =>
  (shift as any)?.status || (shift as any)?.raw?.shift?.status || "unknown";

const getParticipantName = (shift?: ShiftLike | null) =>
  (shift as any)?.participant?.fullName ||
  (shift as any)?.participantName ||
  (shift as any)?.participant ||
  undefined;

const getTrainerName = (shift?: ShiftLike | null) =>
  (shift as any)?.trainer?.fullName ||
  (shift as any)?.trainerName ||
  (shift as any)?.trainer ||
  undefined;

const getReport = (shift?: ShiftLike | null) =>
  // Prefer explicit report field; then raw.shift.report; then raw.report
  (shift as any)?.report ||
  (shift as any)?.raw?.shift?.report ||
  (shift as any)?.raw?.report ||
  {};

const hasReportFields = (report: any) =>
  !!report?.activities ||
  !!report?.progress ||
  !!report?.incidents ||
  typeof report?.km === "number";

/** ===== Component ===== */
export default function PastShiftDetailsModal({ open, shift, onClose }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Derive date/time/duration labels.
  // Priority:
  // 1) If UiShift: compute from start/end
  // 2) Else: format from {date, time, duration} strings
  const isUiShift = !!(shift as UiShift | undefined)?.start || !!(shift as UiShift | undefined)?.end;

  const dateTimeLabel = useMemo(() => {
    if (isUiShift) {
      return fmtDateTimeRange((shift as UiShift).start, (shift as UiShift).end);
    }
    return fmtDatePlusTimeString((shift as SimplePastShift | any)?.date, (shift as SimplePastShift | any)?.time);
  }, [isUiShift, (shift as any)?.start, (shift as any)?.end, (shift as any)?.date, (shift as any)?.time]);

  const durationLabel = useMemo(() => {
    if (isUiShift) {
      return fmtDuration((shift as UiShift).start, (shift as UiShift).end);
    }
    return (shift as SimplePastShift | any)?.duration || "";
  }, [isUiShift, (shift as any)?.start, (shift as any)?.end, (shift as any)?.duration]);

  const displayStatus = useMemo(() => getStatus(shift), [shift]);
  const participantName = useMemo(() => getParticipantName(shift), [shift]);
  const trainerName = useMemo(() => getTrainerName(shift), [shift]);

  const report = useMemo(() => getReport(shift), [shift]);
  const hasReport = hasReportFields(report);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? "24px 24px 0 0" : 4,
          background: "var(--color-background)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
          m: { xs: 0, sm: 2 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: "1px solid var(--color-border)",
          bgcolor: "var(--color-background-shade-1)",
        }}
      >
        <Typography variant="h6" fontWeight={800} color="var(--color-text)">
          {getTitle(shift)}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "var(--color-text-muted)",
            "&:hover": { bgcolor: "var(--color-hover)" },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ py: 4, px: 3 }}>
        <Stack spacing={3}>
          {/* Key fields */}
          {[
            {
              icon: <AccessTimeIcon color="primary" fontSize="small" />,
              label: "Date & Time",
              value: dateTimeLabel,
            },
            {
              icon: <TimelapseIcon color="primary" fontSize="small" />,
              label: "Duration",
              value: durationLabel,
            },
            participantName && {
              icon: <EventSeatIcon color="primary" fontSize="small" />,
              label: "Participant",
              value: participantName,
            },
            trainerName && {
              icon: <PersonIcon color="primary" fontSize="small" />,
              label: "Trainer",
              value: trainerName,
            },
          ]
            .filter(Boolean)
            .map((item: any, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "var(--color-background-shade-2)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {item.icon}
                <Box>
                  <Typography fontSize={13} color="var(--color-text-muted)">
                    {item.label}
                  </Typography>
                  <Typography fontWeight={600} color="var(--color-text)">
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            ))}

          {/* Status chip */}
          {!!displayStatus && (
            <Chip
              label={pretty(displayStatus)}
              sx={{
                alignSelf: "flex-start",
                fontWeight: 700,
                px: 2,
                py: 0.6,
                borderRadius: "999px",
                fontSize: "0.85rem",
                color: "#fff",
                background: statusBg(displayStatus || "unknown"),
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            />
          )}

          {/* Notes */}
          {!!(shift as any)?.notes && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid var(--color-border)",
                bgcolor: "var(--color-background-shade-2)",
                display: "flex",
                gap: 1.5,
              }}
            >
              <NotesIcon color="primary" fontSize="small" />
              <Box>
                <Typography fontWeight={700} mb={0.5}>
                  Notes
                </Typography>
                <Typography>{(shift as any).notes}</Typography>
              </Box>
            </Box>
          )}

          {/* Report (if present as structured fields) */}
          {hasReport && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid var(--color-border)",
                bgcolor: "var(--color-background-shade-2)",
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Submitted Shift Report
              </Typography>
              <Stack spacing={0.5}>
                {"activities" in report && report.activities && (
                  <Typography>Activities: {report.activities}</Typography>
                )}
                {"progress" in report && report.progress && (
                  <Typography>Progress: {report.progress}</Typography>
                )}
                {"incidents" in report && report.incidents && (
                  <Typography>Incidents: {report.incidents}</Typography>
                )}
                {"km" in report && typeof report.km === "number" && (
                  <Typography>Kilometres: {report.km} km</Typography>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      {/* Actions (read-only) */}
      <DialogActions
        sx={{
          px: 3,
          py: 3,
          borderTop: "1px solid var(--color-border)",
          gap: 1.5,
        }}
      >
        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
