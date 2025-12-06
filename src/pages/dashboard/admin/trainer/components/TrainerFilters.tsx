import React from "react";
import {
  Paper,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

interface TrainerFiltersProps {
  q: string;
  email: string;
  status: string;
  setQ: (val: string) => void;
  setEmail: (val: string) => void;
  setStatus: (val: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export default function TrainerFilters({
  q,
  email,
  status,
  setQ,
  setEmail,
  setStatus,
  onReset,
  onApply,
}: TrainerFiltersProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <TextField
          label="Search (name or email)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          label="Email contains"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="BLOCKED">Blocked</MenuItem>
            <MenuItem value="DELETED">Deleted</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" color="secondary" onClick={onReset}>
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={onApply}>
            Apply
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
