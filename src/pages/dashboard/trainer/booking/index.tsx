// src/pages/portal/trainer/TrainerPreviousShiftsPage.tsx
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
import { differenceInMinutes, format, parseISO } from "date-fns";

import { useGetPastShiftsQuery } from "../../../../redux/features/shiftApi";
import PastShiftDetailsModal from "../../../../components/shifts/ShiftDetails";

/* =========================
   Types aligned to API
   ========================= */
type ApiShiftRow = {
  _id: string;
  shiftRequestId?: string;
  participantId?: string;
  trainerId?: string;

  service?: string;
  start?: string;
  end?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  scheduledDurationMinutes?: number;
  plannedClockOut?: string | null;

  status:
    | "COMPLETED"
    | "IN_PROGRESS"
    | "CANCELLED"
    | "REJECTED"
    | "APPROVED"
    | "PENDING"
    | string;

  report?: {
    activities?: string;
    progress?: string;
    incidents?: string;
    km?: number;
    notes?: string;
  };

  createdAt: string;
  updatedAt: string;

  endDate?: string;
  participantName?: string | null;
  trainerName?: string | null;
};

// UI shape
export type Shift = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  status: "Pending" | "Approved" | "In Progress" | "Completed" | "Cancelled";
  participant?: string;
  worker?: string;
  supportNotes?: {
    activities?: string;
    progress?: string;
    incidents?: string;
    km?: number;
  };
};

const getStatusStyle = (status: Shift["status"]) => {
  switch (status) {
    case "Completed":
      return { chip: "#16a34a" };
    case "In Progress":
      return { chip: "#0ea5e9" };
    case "Approved":
      return { chip: "#6366f1" };
    case "Pending":
      return { chip: "#f59e0b" };
    case "Cancelled":
    default:
      return { chip: "#ef4444" };
  }
};

const PAGE_SIZE = 24;

/* =========================
   Helpers
   ========================= */
function toTimeRange(start?: string, end?: string) {
  if (!start || !end) return "—";
  try {
    return `${format(parseISO(start), "HH:mm")} – ${format(parseISO(end), "HH:mm")}`;
  } catch {
    return "—";
  }
}

function toDuration(start?: string, end?: string) {
  if (!start || !end) return "—";
  try {
    const mins = Math.max(0, differenceInMinutes(parseISO(end), parseISO(start)));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  } catch {
    return "—";
  }
}

function normalizeStatus(s: ApiShiftRow["status"]): Shift["status"] {
  switch ((s || "").toUpperCase()) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In Progress";
    case "APPROVED":
      return "Approved";
    case "PENDING":
      return "Pending";
    case "CANCELLED":
    case "REJECTED":
      return "Cancelled";
    default:
      return "Completed";
  }
}

function toServiceLabel(code?: string) {
  if (!code) return "Shift";
  const labels: Record<string, string> = {
    personalCare: "Personal Care",
    community: "Community Support",
    fitness: "Fitness",
    cooking: "Cooking",
  };
  return labels[code] ?? code.charAt(0).toUpperCase() + code.slice(1);
}

function mapRowToShift(row: ApiShiftRow): Shift {
  const start = row.start || row.scheduledStart;
  const end = row.end || row.scheduledEnd || row.plannedClockOut || undefined;

  const dateISO =
    row.endDate ||
    row.end ||
    row.scheduledEnd ||
    row.plannedClockOut ||
    row.start ||
    row.scheduledStart ||
    new Date().toISOString();

  return {
    id: row._id,
    title: toServiceLabel(row.service),
    date: dateISO,
    time: toTimeRange(start, end),
    duration: toDuration(start, end),
    status: normalizeStatus(row.status),
    participant: row.participantName || undefined,
    worker: row.trainerName || undefined,
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
          <Stack direction="row" spacing={1}>
            <Typography variant="caption" sx={{ color: "var(--color-text-muted)", minWidth: 84 }}>
              Activities
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {activities}
            </Typography>
          </Stack>
        )}

        {progress && progress.trim() && (
          <Stack direction="row" spacing={1}>
            <Typography variant="caption" sx={{ color: "var(--color-text-muted)", minWidth: 84 }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {progress}
            </Typography>
          </Stack>
        )}

        {incidents && incidents.trim() && (
          <Stack direction="row" spacing={1}>
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

/* =========================
   Component
   ========================= */
export default function TrainerPreviousShiftsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isFetching, isError, refetch } = useGetPastShiftsQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  const apiRows: ApiShiftRow[] = (data as any)?.data?.data ?? [];
  const pagination = (data as any)?.pagination ?? { total: apiRows.length, page, pageSize: PAGE_SIZE };
  const total: number = pagination.total ?? apiRows.length;

  const rows: Shift[] = useMemo(() => {
    const list = apiRows.map(mapRowToShift);
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((s) => {
      const haystack = [
        s.title,
        s.participant,
        s.worker,
        s.supportNotes?.activities,
        s.supportNotes?.progress,
        s.supportNotes?.incidents,
        typeof s.supportNotes?.km === "number" ? String(s.supportNotes?.km) : "",
      ]
        .filter((v): v is string => Boolean(v))
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [apiRows, search]);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700} color="var(--color-text)">
          Previous Shifts
        </Typography>
        <Typography variant="body2" color="var(--color-text-muted)">
          Review your past shifts. Use the search to find what you need.
        </Typography>
      </Stack>

      {/* Search */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid var(--color-border)",
          bgcolor: "var(--color-background-shade-1)",
        }}
      >
        <TextField
          placeholder="Search shifts..."
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

      {/* States */}
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
            Failed to load past shifts.
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      )}

      {!isFetching && !isError && rows.length === 0 && (
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
            No previous shifts match your search.
          </Typography>
        </Paper>
      )}

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {rows.map((shift) => {
          const statusStyle = getStatusStyle(shift.status);
          let dateObj: Date | null = null;
          try {
            dateObj = parseISO(shift.date);
          } catch {
            dateObj = null;
          }

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
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
              }}
              onClick={() => setSelectedShift(shift)}
            >
              {/* Date badge */}
              {dateObj && (
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="h6" fontWeight={800} color="var(--color-primary)">
                    {format(dateObj, "dd")}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "uppercase", color: "var(--color-text-muted)" }}
                  >
                    {format(dateObj, "MMM")}
                  </Typography>
                </Box>
              )}

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

                {shift.participant && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PersonIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />
                    <Typography variant="body2">Participant: {shift.participant}</Typography>
                  </Stack>
                )}

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

      {/* Pagination */}
      {(total > PAGE_SIZE || page > 1) && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={page * PAGE_SIZE >= total || isFetching}
            onClick={() => setPage((p) => p + 1)}  
          >
            Next
          </Button>
        </Stack>
      )}

      {/* Modal */}
      <PastShiftDetailsModal
        open={!!selectedShift}
        shift={selectedShift as any}
        onClose={() => setSelectedShift(null)}
      />
    </Box>
  );
}
