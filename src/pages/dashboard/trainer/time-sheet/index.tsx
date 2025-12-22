// src/pages/portal/trainer/TimesheetPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Tooltip,
  Skeleton,
  Alert,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material"; // MUI v5 compat
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { format, parseISO, isValid, addDays } from "date-fns";
import { useAppSelector } from "../../../../redux/store";
import {
  useListTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useSubmitTimesheetMutation,
  useLazyExportTimesheetQuery,
  Timesheet,
} from "../../../../redux/features/shiftApi";

const PAGE_SIZE = 12;

/* ---------- utils ---------- */
function money(cents?: number) {
  if (cents == null) return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function toDate(v?: string | Date | number | null) {
  if (!v) return null;
  if (v instanceof Date) return isValid(v) ? v : null;
  if (typeof v === "string") {
    const d = parseISO(v);
    return isValid(d) ? d : null;
  }
  if (typeof v === "number") {
    const d = new Date(v);
    return isValid(d) ? d : null;
  }
  return null;
}
function safeFormat(v: string | Date | number | null | undefined, pattern: string) {
  const d = toDate(v);
  return d ? format(d, pattern) : "—";
}
function statusColor(status?: string) {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") return "success";
  if (s === "SUBMITTED") return "info";
  if (s === "REOPENED") return "warning";
  if (s === "REJECTED") return "error";
  return "default";
}

/* ---------- component ---------- */
export default function TimesheetPage() {
  const { userData } = useAppSelector((s) => s.auth);
  const role = userData?.role?.toUpperCase?.() || "TRAINER";
  const isTrainer = role === "TRAINER";

  // pagination
  const [page, setPage] = useState(1);

  // list
  const {
    data: listResp,
    isFetching: listLoading,
    refetch: refetchList,
    error: listError,
  } = useListTimesheetsQuery({ page, pageSize: PAGE_SIZE });

  // derive list ids & initial selection
  const pageIds = useMemo(() => (listResp?.data || []).map((t) => t._id), [listResp]);
  const firstIdOnPage = useMemo(() => pageIds[0], [pageIds]);

  const [activeTimesheetId, setActiveTimesheetId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!activeTimesheetId && firstIdOnPage) {
      setActiveTimesheetId(firstIdOnPage);
      return;
    }
    if (activeTimesheetId && pageIds.length && !pageIds.includes(activeTimesheetId)) {
      setActiveTimesheetId(firstIdOnPage);
    }
  }, [activeTimesheetId, firstIdOnPage, pageIds.join(",")]);

  const listItemForActive = useMemo(
    () => (listResp?.data || []).find((t) => t._id === activeTimesheetId),
    [listResp, activeTimesheetId]
  );

  // details
  const {
    data: tsResp,
    isFetching: tsLoading,
    refetch: refetchTs,
    error: tsError,
  } = useGetTimesheetByIdQuery(activeTimesheetId!, { skip: !activeTimesheetId });

  const tsDetails: Timesheet | undefined = tsResp?.data;

  // merged view (list fallback + details override)
  const tsView = useMemo(() => {
    if (!listItemForActive && !tsDetails) return undefined;
    return { ...(listItemForActive || {}), ...(tsDetails || {}) } as Timesheet;
  }, [listItemForActive, tsDetails]);

  // actions
  const [submitTimesheet, { isLoading: isSubmitting }] = useSubmitTimesheetMutation();
  const [triggerExport, { isFetching: isExporting, data: exportedBlob }] =
    useLazyExportTimesheetQuery();
  const [lastExportFmt, setLastExportFmt] = useState<"csv" | "pdf">("csv");

  useEffect(() => {
    if (exportedBlob && activeTimesheetId) {
      const ext = lastExportFmt === "pdf" ? "pdf" : "csv";
      downloadBlob(exportedBlob, `timesheet_${activeTimesheetId}.${ext}`);
    }
  }, [exportedBlob, activeTimesheetId, lastExportFmt]);

  const disabledActions = tsLoading || !tsView;
  const total = listResp?.pagination?.total ?? 0;
  const hasNext = page * PAGE_SIZE < total;

  const weekStartStr = tsView ? safeFormat(tsView.weekStart, "dd MMM") : "—";
  const weekEndStr = tsView
    ? tsView.weekEnd
      ? safeFormat(tsView.weekEnd, "dd MMM yyyy")
      : (() => {
          const ws = toDate(tsView.weekStart);
          return ws ? format(addDays(ws, 6), "dd MMM yyyy") : "—";
        })()
    : "—";

  const statusUpper = (tsView?.status || "").toUpperCase();

  return (
    <Box sx={{ p: { xs: 2, md: 3 },  minHeight: "100vh" }}>
      {/* Top bar */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {isTrainer ? "My Timesheet" : "Timesheet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tsView ? `${weekStartStr} – ${weekEndStr}` : "—"}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          {/* {tsView && (
            <Chip
              variant="filled"
              size="small"
              label={statusUpper || "—"}
              color={statusColor(statusUpper) as any}
            />
          )} */}
          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={() => Promise.all([refetchList(), refetchTs()])}
                disabled={listLoading || tsLoading}
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Body layout */}
      <Grid container spacing={2}>
        {/* Left: Weeks */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Weeks
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  disabled={listLoading || page <= 1}
                  onClick={async () => {
                    setPage((p) => Math.max(1, p - 1));
                    await refetchList();
                  }}
                >
                  Prev
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<NavigateNextIcon />}
                  disabled={listLoading || !hasNext}
                  onClick={async () => {
                    setPage((p) => p + 1);
                    await refetchList();
                  }}
                >
                  Next
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            {listError ? (
              <Alert severity="error" sx={{ mt: 1 }}>
                Couldn’t load weeks.
              </Alert>
            ) : listLoading ? (
              <Stack spacing={1}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={36} />
                ))}
              </Stack>
            ) : (listResp?.data?.length || 0) === 0 ? (
              <Alert severity="info">No timesheets yet.</Alert>
            ) : (
              <Stack spacing={1}>
                {(listResp?.data || []).map((t) => {
                  const selected = t._id === activeTimesheetId;
                  const label = `${safeFormat(t.weekStart, "dd MMM")} – ${safeFormat(
                    t.weekEnd,
                    "dd MMM"
                  )}`;
                  return (
                    <Button
                      key={t._id}
                      fullWidth
                      variant={selected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setActiveTimesheetId(t._id)}
                      sx={{
                        justifyContent: "space-between",
                        textTransform: "none",
                        fontWeight: selected ? 700 : 500,
                      }}
                    >
                      <span>{label}</span>
                      <Chip
                        size="small"
                        label={(t as any).status || "—"}
                        color={statusColor((t as any).status) as any}
                        variant={selected ? "filled" : "outlined"}
                      />
                    </Button>
                  );
                })}
              </Stack>
            )}
          </Paper>

          {/* History/help card */}
          <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <HistoryIcon fontSize="small" />
              <Typography variant="subtitle2">About Timesheets</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Select a week to view totals and submitted shifts. Submit when you’re ready; an
              admin will review and approve.
            </Typography>
          </Paper>
        </Grid>

        {/* Right: Details */}
        <Grid item xs={12} md={8} lg={9}>
          <Stack spacing={2}>
            {/* Summary */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                {/* Total Hours */}
                <Grid item xs={6} md={4}>
                  <SummaryCard
                    title="Total Hours"
                    value={
                      tsLoading
                        ? null
                        : tsView?.totals?.hours != null
                        ? tsView.totals.hours.toFixed(2)
                        : "—"
                    }
                    icon={<AssignmentTurnedInIcon />}
                  />
                </Grid>
                {/* Total KM */}
                <Grid item xs={6} md={4}>
                  <SummaryCard
                    title="Total KM"
                    value={
                      tsLoading
                        ? null
                        : tsView?.totals?.km != null
                        ? String(tsView.totals.km)
                        : "—"
                    }
                    icon={<WarningAmberIcon />}
                  />
                </Grid>
                {/* Total Amount */}
                {/* <Grid item xs={6} md={3}>
                  <SummaryCard
                    title="Total Amount"
                    value={
                      tsLoading
                        ? null
                        : tsView?.totals?.totalCents != null
                        ? money(tsView.totals.totalCents)
                        : "—"
                    }
                    icon={<TableViewIcon />}
                  />
                </Grid> */}
                {/* Shifts */}
                <Grid item xs={6} md={4}>
                  <SummaryCard
                    title="Shifts"
                    value={
                      tsLoading
                        ? null
                        : tsView?.items
                        ? String(tsView.items.length)
                        : "—"
                    }
                    icon={<HistoryIcon />}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Entries */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Entries
                </Typography>
                {tsLoading && (
                  <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                    <CircularProgress size={16} /> <span>Loading…</span>
                  </Stack>
                )}
              </Stack>

              {tsError ? (
                <Alert severity="error">Couldn’t load entries.</Alert>
              ) : tsLoading ? (
                <Stack spacing={1.5}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={64} />
                  ))}
                </Stack>
              ) : !tsView || (tsView.items?.length ?? 0) === 0 ? (
                <EmptyState />
              ) : (
                <Stack spacing={1.5}>
                  {tsView.items?.map((entry) => (
                    <EntryRow
                      key={entry.shiftId}
                      dateLabel={safeFormat(entry.date, "EEE, dd MMM yyyy")}
                      service={entry.service}
                      hours={(entry.hours ?? 0).toFixed(2)}
                      km={String(entry.km ?? 0)}
                      total={money(entry.totalCents ?? 0)}
                    />
                  ))}
                </Stack>
              )}
            </Paper>

            {/* Sticky Actions */}
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                position: { md: "sticky" },
                bottom: { md: 16 },
                zIndex: 1,
              }}
            >
              <Stack direction="row" justifyContent="flex-end" spacing={1.5} flexWrap="wrap">
                <Tooltip title="Download CSV">
                  <span>
                    <Button
                      variant="outlined"
                      startIcon={<TableViewIcon />}
                      disabled={disabledActions || isExporting || !activeTimesheetId}
                      onClick={() => {
                        if (!activeTimesheetId) return;
                        setLastExportFmt("csv");
                        triggerExport({ id: activeTimesheetId, format: "csv" });
                      }}
                    >
                      CSV
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title="Download PDF">
                  <span>
                    <Button
                      variant="contained"
                      startIcon={<PictureAsPdfIcon />}
                      disabled={disabledActions || isExporting || !activeTimesheetId}
                      onClick={() => {
                        if (!activeTimesheetId) return;
                        setLastExportFmt("pdf");
                        triggerExport({ id: activeTimesheetId, format: "pdf" });
                      }}
                    >
                      PDF
                    </Button>
                  </span>
                </Tooltip>
                {/* {isTrainer && (
                  <Tooltip title="Submit this timesheet for approval">
                    <span>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon />}
                        disabled={
                          disabledActions ||
                          isSubmitting ||
                          (statusUpper !== "DRAFT")
                        }
                        onClick={async () => {
                          if (!activeTimesheetId) return;
                          await submitTimesheet(activeTimesheetId);
                          await Promise.all([refetchTs(), refetchList()]);
                        }}
                      >
                        Submit
                      </Button>
                    </span>
                  </Tooltip>
                )} */}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

/* ---------- small components ---------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        {value === null ? (
          <Skeleton variant="text" width={80} height={34} />
        ) : (
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function EntryRow({
  dateLabel,
  service,
  hours,
  km,
  total,
}: {
  dateLabel: string;
  service: string;
  hours: string;
  km: string;
  total: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip size="small" color="primary" label={dateLabel} />
          <Typography fontWeight={600}>{service}</Typography>
        </Stack>
        <Stack direction="row" spacing={3} flexWrap="wrap">
          <Metric label="Hours" value={hours} />
          <Metric label="KM" value={km} />
          {/* <Metric label="Total" value={total} /> */}
        </Stack>
      </Stack>
    </Paper>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={700}>{value}</Typography>
    </Stack>
  );
}

function EmptyState() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: 2,
        textAlign: "center",
        bgcolor: "grey.50",
      }}
    >
      <Typography variant="body1" color="text.secondary">
        No entries this week.
      </Typography>
    </Paper>
  );
}
