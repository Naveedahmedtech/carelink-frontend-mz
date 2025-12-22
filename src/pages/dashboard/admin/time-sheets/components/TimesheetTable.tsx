import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { safeFormat, money } from "../utils/tsUtils";
import EmptyState from "./EmptyState";

type TimesheetTotals = {
  hours?: number;
  km?: number;
  amountCents?: number;
  mileageCents?: number;
  totalCents?: number;
};

export default function TimesheetTable(props: {
  loading: boolean;
  error: boolean;
  items: any[];
  totals?: TimesheetTotals;
}) {
  const { loading, error, items, totals } = props;
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  if (isSmDown) {
    // ======= MOBILE (xs) — stacked cards =======
    return (
      <Box sx={{ p: 1, pt: 0.5 }}>
        {error ? (
          <Alert severity="error" sx={{ my: 1 }}>
            Couldn't load entries.
          </Alert>
        ) : loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Paper
                key={i}
                variant="outlined"
                sx={{ p: 1.25, borderRadius: 2, borderColor: "divider" }}
              >
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="50%" />
              </Paper>
            ))}
          </Stack>
        ) : (items?.length ?? 0) === 0 ? (
          <EmptyState />
        ) : (
          <Stack spacing={1.25}>
            {items.map((entry: any) => {
              const participantLabel =
                entry?.participant?.fullName ||
                entry?.participantName ||
                String(entry.participantId || "-");
              const dateLabel = safeFormat(entry.date, "EEE, dd MMM yyyy");

              const statChips = [
                { label: "Hours", value: (entry.hours ?? 0).toFixed(2) },
                { label: "KM", value: String(entry.km ?? 0) },
                { label: "Labour", value: money(entry.amountCents) },
                { label: "Mileage", value: money(entry.mileageCents) },
              ];

              return (
                <Paper
                  key={entry.shiftId || `${entry.date}-${participantLabel}`}
                  variant="outlined"
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    borderColor: "divider",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Top row: date + total */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mb: 0.5, minWidth: 0 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 0.25,
                        }}
                        title={dateLabel}
                      >
                        {dateLabel}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={participantLabel}
                      >
                        {participantLabel}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      label={`Total ${money(entry.totalCents)}`}
                      sx={{ fontWeight: 600, flexShrink: 0 }}
                    />
                  </Stack>

                  {/* Service (if present) */}
                  {entry.service ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 0.75,
                      }}
                      title={entry.service}
                    >
                      {entry.service}
                    </Typography>
                  ) : null}

                  <Divider sx={{ mb: 0.75 }} />

                  {/* Metrics row */}
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {statChips.map((chip) => (
                      <Paper
                        key={chip.label}
                        variant="outlined"
                        sx={{
                          px: 1,
                          py: 0.75,
                          borderRadius: 1.5,
                          minWidth: 120,
                          flex: "1 1 120px",
                          bgcolor: "grey.50",
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.2 }}>
                          {chip.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {chip.value}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              );
            })}

            {/* Totals summary */}
            {totals && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <Paper
                  variant="outlined"
                  sx={{ p: 1.25, borderRadius: 2, bgcolor: "grey.50", borderColor: "divider" }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Totals
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip size="small" label={`Hours ${(totals.hours ?? 0).toFixed(2)}`} />
                    <Chip size="small" label={`KM ${totals.km ?? 0}`} />
                    <Chip size="small" label={`Labour ${money(totals.amountCents)}`} />
                    <Chip size="small" label={`Mileage ${money(totals.mileageCents)}`} />
                    <Chip size="small" label={`Total ${money(totals.totalCents)}`} />
                  </Stack>
                </Paper>
              </>
            )}
          </Stack>
        )}
      </Box>
    );
  }

  // ======= TABLE (sm+) =======
  return (
    <TableContainer
      sx={{
        maxHeight: { sm: 460, md: 620 },
        overflow: "auto",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
      }}
    >
      <Table
        size="small"
        aria-label="timesheet-entries"
        stickyHeader
        sx={{
          tableLayout: "fixed",
          minWidth: 860,
          "& th, & td": { borderBottom: "1px solid", borderColor: "divider" },
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                fontWeight: 700,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              },
            }}
          >
            <TableCell sx={{ width: { sm: 160, md: 200 } }}>Date</TableCell>
            <TableCell sx={{ width: { sm: 240, md: 280 } }}>Participant</TableCell>
            <TableCell sx={{ width: { sm: 200, md: 240 } }}>Service</TableCell>
            <TableCell align="right" sx={{ width: { sm: 100, md: 110 } }}>
              Hours
            </TableCell>
            <TableCell align="right" sx={{ width: { sm: 90, md: 100 } }}>
              KM
            </TableCell>
            <TableCell align="right" sx={{ width: { sm: 120, md: 130 } }}>
              Labour
            </TableCell>
            <TableCell align="right" sx={{ width: { sm: 120, md: 130 } }}>
              Mileage
            </TableCell>
            <TableCell align="right" sx={{ width: { sm: 120, md: 130 } }}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Alert severity="error">Couldn't load entries.</Alert>
              </TableCell>
            </TableRow>
          ) : loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (items?.length ?? 0) === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <EmptyState />
              </TableCell>
            </TableRow>
          ) : (
            items.map((entry: any) => {
              const participantLabel =
                entry?.participant?.fullName ||
                entry?.participantName ||
                String(entry.participantId || "-");
              const dateLabel = safeFormat(entry.date, "EEE, dd MMM yyyy");

              return (
                <TableRow
                  key={entry.shiftId}
                  hover
                  sx={{
                    "&:last-of-type td": { borderBottom: 0 },
                    "& td": { verticalAlign: "middle" },
                  }}
                >
                  <TableCell
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={dateLabel}
                  >
                    {dateLabel}
                  </TableCell>
                  <TableCell
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={participantLabel}
                  >
                    {participantLabel}
                  </TableCell>
                  <TableCell
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={entry.service}
                  >
                    {entry.service || "-"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap" }}
                    title={(entry.hours ?? 0).toFixed(2)}
                  >
                    {(entry.hours ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap" }}
                    title={String(entry.km ?? 0)}
                  >
                    {entry.km ?? 0}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap" }}
                    title={money(entry.amountCents)}
                  >
                    {money(entry.amountCents)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap" }}
                    title={money(entry.mileageCents)}
                  >
                    {money(entry.mileageCents)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap", fontWeight: 700 }}
                    title={money(entry.totalCents)}
                  >
                    {money(entry.totalCents)}
                  </TableCell>
                </TableRow>
              );
            })
          )}

          {/* Totals footer */}
          {!loading && totals && (
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: 700 }}>
                Totals
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {totals.hours?.toFixed?.(2) ?? "0.00"}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {totals.km ?? 0}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {money(totals.amountCents)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {money(totals.mileageCents)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {money(totals.totalCents)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
