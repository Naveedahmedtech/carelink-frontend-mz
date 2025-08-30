import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import NotesIcon from "@mui/icons-material/Notes";
import SearchIcon from "@mui/icons-material/Search";
import { isBefore, parseISO, isSameMonth, format } from "date-fns";
import { mockShifts, getStatusStyle, Shift } from "../../utils";

// unique workers list
const workers = Array.from(new Set(mockShifts.map((s) => s.worker))).filter(Boolean);

// all statuses
const statuses: Shift["status"][] = [
  "Pending",
  "Approved",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function PreviousShiftsPage() {
  const today = new Date();

  const [workerFilter, setWorkerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // only previous shifts
  const previousShifts = mockShifts.filter((s) => isBefore(parseISO(s.date), today));

  const filteredShifts = previousShifts.filter((s) => {
    if (workerFilter && s.worker !== workerFilter) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    if (monthFilter !== null && !isSameMonth(parseISO(s.date), new Date(2025, monthFilter)))
      return false;
    if (search && !(`${s.title} ${s.notes || ""}`.toLowerCase().includes(search.toLowerCase())))
      return false;
    return true;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700} color="var(--color-text)">
          Previous Shifts
        </Typography>
        <Typography variant="body2" color="var(--color-text-muted)">
          Review your past shifts. Use filters to narrow results.
        </Typography>
      </Stack>

      {/* Filters Row */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid var(--color-border)",
          bgcolor: "var(--color-background-shade-1)",
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        {/* Worker filter */}
        <TextField
          select
          label="Worker"
          value={workerFilter}
          onChange={(e) => setWorkerFilter(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="">All</MenuItem>
          {workers.map((w) => (
            <MenuItem key={w} value={w}>
              {w}
            </MenuItem>
          ))}
        </TextField>

        {/* Status filter */}
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="">All</MenuItem>
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        {/* Month filter */}
        <TextField
          select
          label="Month"
          value={monthFilter ?? ""}
          onChange={(e) =>
            setMonthFilter(e.target.value === "" ? null : Number(e.target.value))
          }
          size="small"
          fullWidth
        >
          <MenuItem value="">All</MenuItem>
          {Array.from({ length: 12 }).map((_, i) => (
            <MenuItem key={i} value={i}>
              {new Date(2025, i).toLocaleString("default", { month: "long" })}
            </MenuItem>
          ))}
        </TextField>


        {/* Search */}
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

      {/* Empty State */}
      {filteredShifts.length === 0 && (
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
            No previous shifts match your filters.
          </Typography>
        </Paper>
      )}

      {/* Shifts Grid */}
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
                    <Typography variant="body2">Worker: {shift.worker}</Typography>
                  </Stack>
                )}

                {shift.notes && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <NotesIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />
                    <Typography variant="body2">{shift.notes}</Typography>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Status chip */}
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
