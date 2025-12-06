import React from "react";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import NotesIcon from "@mui/icons-material/Notes";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export type AdminStatus = "PENDING_ADMIN" | "APPROVED" | "DECLINED";

const statusChipColor = (s: AdminStatus) =>
  s === "PENDING_ADMIN" ? "warning" : s === "APPROVED" ? "success" : "error";

const fmtDT = (iso: string | Date) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

type Row = any;

type Props = {
  rows: Row[];
  isLoading: boolean;
  isFetching: boolean;
  limit: number;
  onOpenAssign: (row: Row) => void;
  onDecline: (id: string) => void;
  isApproving: boolean;
  isDeclining: boolean;
  pagination: { page: number; pages: number; limit: number; total: number };
  footer?: React.ReactNode; // place to inject pagination bar
};

export default function RequestsTable({
  rows,
  isLoading,
  isFetching,
  limit,
  onOpenAssign,
  onDecline,
  isApproving,
  isDeclining,
  pagination,
  footer,
}: Props) {
  return (
    <Card variant="outlined" sx={{ p: 0, borderRadius: 3 }}>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Participant</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Pref. Trainers</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(isLoading || isFetching) &&
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell colSpan={7}>
                    <Box className="bg-skeleton shimmer" sx={{ height: 40, borderRadius: 2 }} />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              !isFetching &&
              rows?.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon fontSize="small" />
                        <Typography fontWeight={600}>
                          {row?.participant?.fullName || "—"}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="var(--color-text-muted)">
                        {row?.participant?.email || "—"}
                      </Typography>
                      {row?.notes && (
                        <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                          <NotesIcon fontSize="inherit" />
                          <Tooltip title={row.notes}>
                            <Typography variant="caption" sx={{ maxWidth: 280 }} noWrap>
                              {row.notes}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip label={row.service} color="primary" size="small" variant="outlined" />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">{fmtDT(row.start)}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">{fmtDT(row.end)}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {row?.preferredTrainerIds?.length ? (
                      <Chip
                        label={`${row.preferredTrainerIds.length} preferred`}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="var(--color-text-muted)">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.status.replace("_", " ")}
                      size="small"
                      color={statusChipColor(row.status)}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Approve & Assign">
                        <span>
                          <IconButton
                            color="success"
                            onClick={() => onOpenAssign(row)}
                            disabled={row.status !== "PENDING_ADMIN" || isApproving}
                          >
                            <AssignmentIndIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Decline">
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => onDecline(row._id)}
                            disabled={row.status !== "PENDING_ADMIN" || isDeclining}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && !isFetching && rows?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box py={6} textAlign="center">
                    <Typography variant="body1" fontWeight={600}>
                      No shift requests found
                    </Typography>
                    <Typography variant="body2" color="var(--color-text-muted)">
                      Try adjusting your filters.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {footer}
    </Card>
  );
}
