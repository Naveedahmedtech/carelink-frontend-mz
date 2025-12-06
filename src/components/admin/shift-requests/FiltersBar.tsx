import React from "react";
import {
  Card,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export type AdminStatus = "PENDING_ADMIN" | "APPROVED" | "DECLINED";

const STATUS_OPTIONS: { label: string; value: AdminStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING_ADMIN" },
  { label: "Approved", value: "APPROVED" },
  { label: "Declined", value: "DECLINED" },
];

type Props = {
  status: AdminStatus | "";
  setStatus: (v: AdminStatus | "") => void;
  q: string;
  setQ: (v: string) => void;
  dateFrom: Date | null;
  setDateFrom: (v: Date | null) => void;
  dateTo: Date | null;
  setDateTo: (v: Date | null) => void;
  sort: "createdAt:desc" | "createdAt:asc" | "start:asc" | "start:desc";
  setSort: (v: "createdAt:desc" | "createdAt:asc" | "start:asc" | "start:desc") => void;
  onApply: () => void;
  onClear: () => void;
  isBusy: boolean;
};

export default function FiltersBar({
  status, setStatus,
  q, setQ,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  sort, setSort,
  onApply, onClear,
  isBusy
}: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Status"
            size="small"
            value={status}
            fullWidth
            onChange={(e) => setStatus(e.target.value as any)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterAltIcon sx={{ color: "var(--color-primary)" }} />
                </InputAdornment>
              ),
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.label} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Search (name/email/service)"
            size="small"
            fullWidth
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--color-primary)" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <DatePicker
            label="From"
            value={dateFrom}
            onChange={setDateFrom}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <DatePicker
            label="To"
            value={dateTo}
            onChange={setDateTo}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Sort by"
            size="small"
            fullWidth
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <MenuItem value="createdAt:desc">Newest</MenuItem>
            <MenuItem value="createdAt:asc">Oldest</MenuItem>
            <MenuItem value="start:asc">Start ↑</MenuItem>
            <MenuItem value="start:desc">Start ↓</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.5} mt={2} alignItems="center">
        <Button
          variant="outlined"
          onClick={onClear}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={onApply}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-hover))",
          }}
          startIcon={<SearchIcon />}
        >
          Apply
        </Button>
        {isBusy && (
          <Stack direction="row" alignItems="center" spacing={1} ml={1}>
            <CircularProgress size={20} className="premium-loader" />
            <Typography variant="caption" color="var(--color-text-muted)">
              Loading…
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
