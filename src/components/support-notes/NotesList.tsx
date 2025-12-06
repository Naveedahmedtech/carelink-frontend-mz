// src/components/notes/NotesList.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { format, parseISO } from "date-fns";
import NoteCard, { Note } from "./NoteCard";

// ⬇️ Same API hook used on the Previous Shifts page
import { useGetPastShiftsQuery } from "../../redux/features/shiftApi";

type NotesListProps = {
  role: "participant" | "trainer" | "admin";
  pageSize?: number; // optional override
};

type ApiShiftRow = {
  _id: string;
  start?: string; // ISO
  end?: string;   // ISO
  scheduledStart?: string; // ISO
  scheduledEnd?: string;   // ISO
  plannedClockOut?: string | null;
  participantName?: string | null;
  trainerName?: string | null;
  endDate?: string;
  report?: {
    activities?: string;
    progress?: string;
    incidents?: string;
    km?: number;
    notes?: string;
  };
};

const DEFAULT_PAGE_SIZE = 24;

// Small helper to produce a pretty time range
function toTimeRange(start?: string, end?: string) {
  if (!start || !end) return "—";
  try {
    return `${format(parseISO(start), "HH:mm")} – ${format(parseISO(end), "HH:mm")}`;
  } catch {
    return "—";
  }
}

// Map a shift row → Note (only if there are report fields)
function mapRowToNote(row: ApiShiftRow): Note | null {
  const start = row.start || row.scheduledStart || undefined;
  const end = row.end || row.scheduledEnd || row.plannedClockOut || undefined;

  const hasAnyNote =
    (row.report?.activities && row.report.activities.trim()) ||
    (row.report?.progress && row.report.progress.trim()) ||
    (row.report?.incidents && row.report.incidents.trim());

  if (!hasAnyNote) return null;

  // Friendly date string (prefer end date, then start)
  const dateISO =
    row.endDate ||
    row.end ||
    row.scheduledEnd ||
    row.plannedClockOut ||
    row.start ||
    row.scheduledStart;

  let dateStr = "—";
  if (dateISO) {
    try {
      dateStr = format(parseISO(dateISO), "EEE, dd MMM yyyy");
    } catch {
      dateStr = "—";
    }
  }

  return {
    id: row._id,
    date: dateStr,
    time: toTimeRange(start, end),
    trainer: row.trainerName || undefined,
    participant: row.participantName || undefined,
    activities: row.report?.activities?.trim() || "",
    progress: row.report?.progress?.trim() || "",
    incidents: row.report?.incidents?.trim() || "",
  };
}

export default function NotesList({ role, pageSize = DEFAULT_PAGE_SIZE }: NotesListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch shifts (same API)
  const { data, isFetching, isError, refetch } = useGetPastShiftsQuery({
    page,
    pageSize,
  });

  const apiRows: ApiShiftRow[] = (data as any)?.data?.data ?? [];
  const pagination = (data as any)?.pagination ?? { total: apiRows.length, page, pageSize };
  const total: number = pagination.total ?? apiRows.length;

  // Map API → notes and filter by search
  const notes: Note[] = useMemo(() => {
    const mapped = apiRows
      .map(mapRowToNote)
      .filter((n): n is Note => Boolean(n));

    if (!search) return mapped;

    const q = search.toLowerCase();
    return mapped.filter((n) => {
      const haystack = [
        n.trainer || "",
        n.participant || "",
        n.activities || "",
        n.progress || "",
        n.incidents || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [apiRows, search]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Search */}
      <TextField
        placeholder="Search notes..."
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

      {/* Loading / Error / Empty */}
      {isFetching && (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed var(--color-border)",
            bgcolor: "var(--color-background-shade-1)",
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" component="span" color="var(--color-text-muted)">
            Loading notes…
          </Typography>
        </Paper>
      )}

      {isError && !isFetching && (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed var(--color-border)",
            bgcolor: "var(--color-background-shade-1)",
          }}
        >
          <Typography variant="body2" color="error">
            Failed to load notes.
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      )}

      {!isFetching && !isError && notes.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center">
          No notes found.
        </Typography>
      )}

      {/* Notes list */}
      <Stack spacing={2}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            showTrainer={role !== "trainer"}
            showParticipant={role === "admin"}
          />
        ))}
      </Stack>

      {/* Simple pagination (optional) */}
      {(total > pageSize || page > 1) && (
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
            disabled={page * pageSize >= total || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Stack>
      )}
    </Box>
  );
}
