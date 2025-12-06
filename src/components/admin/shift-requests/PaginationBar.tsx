import React from "react";
import { Stack, Typography, TextField, MenuItem, Button } from "@mui/material";

type Props = {
  pagination: { page: number; pages: number; total: number; limit: number };
  limit: number;
  setLimit: (n: number) => void;
  page: number;
  setPage: (n: number) => void;
};

export default function PaginationBar({
  pagination,
  limit,
  setLimit,
  page,
  setPage,
}: Props) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
      <Typography variant="caption" color="var(--color-text-muted)">
        Showing page {pagination.page} of {pagination.pages || 1} • {pagination.total} total
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          size="small"
          label="Rows"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          sx={{ width: 120 }}
        >
          {[10, 20, 50].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={pagination.page <= 1}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage(Math.min(pagination.pages || page + 1, page + 1))}
            disabled={pagination.page >= (pagination.pages || 1)}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
