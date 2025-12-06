import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import NotesIcon from "@mui/icons-material/Notes";
import SearchIcon from "@mui/icons-material/Search";
import { isBefore, parseISO, format } from "date-fns";
import { getStatusStyle, Shift as UiShift } from "../../utils";
import { useGetPastShiftsQuery } from "../../redux/features/shiftApi";

/** ==== API row type – matches your payload ==== */
type TimesheetRow = {
  _id: string;
  shiftRequestId: string;
  participantId: string;
  trainerId: string;
  service: string;
  scheduledStart: string; // ISO
  scheduledEnd: string;   // ISO
  scheduledDurationMinutes: number;
  actualClockIn?: string | null;
  plannedClockOut?: string | null;
  actualClockOut?: string | null;
  status: "COMPLETED" | "IN_PROGRESS" | "CANCELLED" | "REJECTED" | "APPROVED" | "PENDING";
  report?: {
    activities?: string;
    progress?: string;
    incidents?: string;
    km?: number;
  };
  createdAt: string;
  updatedAt: string;
  endDate?: string;
  trainer?: {
    _id: string;
    userId: string;
    fullName: string;
    userEmail?: string;
  };
};

/** ==== UI shape (extended to carry structured notes) ==== */
type Shift = UiShift & {
  supportNotes?: {
    activities?: string;
    progress?: string;
    incidents?: string;
    km?: number;
  };
  worker?: string;
};

/** ==== helpers ==== */
const SERVICE_LABELS: Record<string, string> = {
  personalCare: "Personal Care",
  community: "Community Support",
  fitness: "Fitness",
  cooking: "Cooking",
};

const toServiceLabel = (code?: string) =>
  SERVICE_LABELS[code ?? ""] ?? (code ? code[0].toUpperCase() + code.slice(1) : "Shift");

function toTimeRange(start?: string, end?: string) {
  if (!start || !end) return "—";
  return `${format(parseISO(start), "HH:mm")} – ${format(parseISO(end), "HH:mm")}`;
}

function toDurationLabel(mins?: number | null) {
  if (!mins && mins !== 0) return "—";
  const m = Math.max(0, mins);
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h && r) return `${h}h ${r}m`;
  if (h) return `${h}h`;
  return `${r}m`;
}

function normalizeStatus(s: TimesheetRow["status"]): UiShift["status"] {
  switch (s) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In Progress";
    case "CANCELLED":
    case "REJECTED":
      return "Cancelled";
    case "APPROVED":
      return "Approved";
    case "PENDING":
    default:
      return "Pending";
  }
}

/** Map API row → card shape (keeping structured notes) */
function mapRow(row: TimesheetRow): Shift {
  const cardDate = row.endDate || row.scheduledEnd || row.scheduledStart;

  return {
    id: row._id,
    title: toServiceLabel(row.service),
    date: cardDate!,
    time: toTimeRange(row.scheduledStart, row.scheduledEnd),
    duration: toDurationLabel(row.scheduledDurationMinutes),
    status: normalizeStatus(row.status),
    worker: row.trainer?.fullName || row.trainerId,
    notes: undefined, // we’ll render structured notes instead when available
    supportNotes: row.report
      ? {
          activities: row.report.activities,
          progress: row.report.progress,
          incidents: row.report.incidents,
          km: row.report.km,
        }
      : undefined,
  };
}

/** Compact support-notes block, respecting your design */
function SupportNotes({ notes }: { notes?: Shift["supportNotes"] }) {
  if (!notes) return null;

  const { activities, progress, incidents, km } = notes;
  const show =
    (activities && activities.trim()) ||
    (progress && progress.trim()) ||
    (incidents && incidents.trim()) ||
    typeof km === "number";

  if (!show) return null;

  return (
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
      <Stack spacing={0.75} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.25 }}>
          Support Notes
        </Typography>

        {activities && activities.trim() && (
          <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: "var(--color-text-muted)", minWidth: 84 }}>
              Activities
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {activities}
            </Typography>
          </Stack>
        )}

        {progress && progress.trim() && (
          <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: "var(--color-text-muted)", minWidth: 84 }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {progress}
            </Typography>
          </Stack>
        )}

        {incidents && incidents.trim() && (
          <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: "var(--color-text-muted)", minWidth: 84 }}>
              Incidents
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {incidents}
            </Typography>
          </Stack>
        )}

        {typeof km === "number" && (
          <Stack direction="row" spacing={1}>
            <Typography variant="caption" sx={{ color: "var(--color-text-muted)", minWidth: 84 }}>
              KM
            </Typography>
            <Typography variant="body2">{km}</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default function PreviousShiftsPage() {
  const today = new Date();
  const [search, setSearch] = useState("");

  const { data, isFetching, isError, refetch } = useGetPastShiftsQuery({
    page: 1,
    pageSize: 100,
  });

  // path: data.data.data (your previous shape)
  const apiRows: TimesheetRow[] = (data as any)?.data?.data ?? [];

  const mappedShifts: Shift[] = useMemo(() => apiRows.map(mapRow), [apiRows]);

  // Past-only filter
  const previousShifts = useMemo(
    () =>
      mappedShifts.filter((s) => {
        try {
          return isBefore(parseISO(s.date), today);
        } catch {
          return false;
        }
      }),
    [mappedShifts, today]
  );

  // Search over title, worker, and all support note fields
  const filteredShifts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return previousShifts;
    return previousShifts.filter((s) => {
      const haystack = [
        s.title,
        s.worker,
        s.supportNotes?.activities,
        s.supportNotes?.progress,
        s.supportNotes?.incidents,
        typeof s.supportNotes?.km === "number" ? String(s.supportNotes?.km) : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [previousShifts, search]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700} color="var(--color-text)">
          Previous Requests
        </Typography>
        <Typography variant="body2" color="var(--color-text-muted)">
          Review your past requests. Use search to find what you need.
        </Typography>
      </Stack>

      {/* Search only */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid var(--color-border)",
          bgcolor: "var(--color-background-shade-1)",
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr" },
        }}
      >
        <TextField
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "var(--color-text-muted)" }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Loading / Error / Empty */}
      {isFetching && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed var(--color-border)",
            bgcolor: "var(--color-background-shade-1)",
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" component="span" color="var(--color-text-muted)">
            Loading…
          </Typography>
        </Paper>
      )}

      {isError && !isFetching && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed var(--color-border)",
            bgcolor: "var(--color-background-shade-1)",
          }}
        >
          <Typography variant="body2" color="error">
            Failed to load requests.
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      )}

      {!isFetching && !isError && filteredShifts.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed var(--color-border)",
            bgcolor: "var(--color-background-shade-1)",
          }}
        >
          <Typography variant="body1" color="var(--color-text-muted)">
            No previous requests match your search.
          </Typography>
        </Paper>
      )}

      {/* Cards */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {filteredShifts.map((shift) => {
          const statusStyle = getStatusStyle(shift.status);
          return (
            <Paper
              key={shift.id}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid var(--color-border)",
                bgcolor: "var(--color-background)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {/* Date badge */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={800} color="var(--color-primary)">
                  {format(parseISO(shift.date), "dd")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ textTransform: "uppercase", color: "var(--color-text-muted)" }}
                >
                  {format(parseISO(shift.date), "MMM")}
                </Typography>
              </Box>

              {/* Details */}
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={700} color="var(--color-text)">
                  {shift.title}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AccessTimeIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />
                  <Typography variant="body2">{shift.time}</Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TimelapseIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />
                  <Typography variant="body2">Duration: {shift.duration}</Typography>
                </Stack>

                {shift.worker && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PersonIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />
                    <Typography variant="body2">Trainer: {shift.worker}</Typography>
                  </Stack>
                )}

                {/* Support Notes (structured, clean) */}
                <SupportNotes notes={shift.supportNotes} />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Chip
                label={shift.status}
                size="small"
                sx={{
                  bgcolor: statusStyle.chip,
                  color: "#fff",
                  fontWeight: 600,
                  alignSelf: "flex-end",
                }}
              />
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
