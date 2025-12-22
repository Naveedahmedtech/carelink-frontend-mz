import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Skeleton,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GridLegacy as Grid } from "@mui/material"; // keep GridLegacy
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { addDays } from "date-fns";
import { useAppSelector } from "../../../../redux/store";
import {
  useListTimesheetsQuery,
  useGetTimesheetByIdQuery,
  useLazyExportTimesheetQuery,
  Timesheet,
} from "../../../../redux/features/shiftApi";

import { safeFormat, toDate, money, initials, downloadBlob, norm } from "./utils/tsUtils";
import FiltersPanel from "./components/FiltersPanel";
import TrainerHeader from "./components/TrainerHeader";
import SummaryCard from "./components/SummaryCard";
import TimesheetTable from "./components/TimesheetTable";
import ExportActions from "./components/ExportActions";

const PAGE_SIZE = 12;

export default function TimesheetAdminPage() {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { userData } = useAppSelector((s) => s.auth);
  const role = userData?.role?.toUpperCase?.() || "TRAINER";
  const isAdmin = role === "ADMIN";

  // pagination
  const [page, setPage] = useState(1);

  // list
  const {
    data: listResp,
    isFetching: listLoading,
    refetch: refetchList,
    error: listError,
  } = useListTimesheetsQuery({ page, pageSize: PAGE_SIZE });

  const list: Timesheet[] = useMemo(() => listResp?.data ?? [], [listResp]);

  // derive list ids & initial selection
  const pageIds = useMemo(() => list.map((t: any) => (t as any)._id), [list]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimesheetId, firstIdOnPage, pageIds.join(",")]);

  const listItemForActive = useMemo(
    () => list.find((t: any) => t._id === activeTimesheetId),
    [list, activeTimesheetId]
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
    return { ...(listItemForActive as any), ...(tsDetails as any) } as Timesheet;
  }, [listItemForActive, tsDetails]);

  // export actions (bug fix: download only on new blob)
  const [triggerExport, { isFetching: isExporting, data: exportedBlob }] =
    useLazyExportTimesheetQuery();
  const [lastExportFmt, setLastExportFmt] = useState<"csv" | "pdf">("csv");
  const [lastExportId, setLastExportId] = useState<string | null>(null);

  useEffect(() => {
    if (exportedBlob && lastExportId) {
      const ext = lastExportFmt === "pdf" ? "pdf" : "csv";
      downloadBlob(exportedBlob, `timesheet_${lastExportId}.${ext}`);
      // setLastExportId(null); // optional: clear after download
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportedBlob]);

  const disabledActions = tsLoading || !tsView;
  const total = listResp?.pagination?.total ?? 0;
  const hasNext = page * PAGE_SIZE < total;

  const weekStartStr = tsView ? safeFormat(tsView.weekStart, "dd MMM") : "-";
  const weekEndStr = tsView
    ? tsView.weekEnd
      ? safeFormat(tsView.weekEnd, "dd MMM yyyy")
      : (() => {
          const ws = toDate(tsView.weekStart);
          return ws ? safeFormat(addDays(ws, 6), "dd MMM yyyy") : "-";
        })()
    : "-";

  const trainerName =
    (tsView as any)?.trainerId?.fullName ?? (tsView as any)?.adminView?.trainerName ?? "Select a timesheet";
  const trainerEmail =
    (tsView as any)?.trainerId?.userId?.email ?? (tsView as any)?.adminView?.trainerEmail ?? "-";
  const trainerPhone =
    (tsView as any)?.trainerId?.phone ?? (tsView as any)?.adminView?.trainerPhone ?? "-";

  const weekLabel = tsView ? `${weekStartStr} - ${weekEndStr}` : "No week selected";
  const subtitle = tsView
    ? `${weekLabel} | ${trainerName}`
    : "Pick a week or trainer from the list to view details.";

  /* ---------- Filters & Grouping state ---------- */
  const [groupBy, setGroupBy] = useState<"WEEK" | "TRAINER">("WEEK");
  const [search, setSearch] = useState("");
  const [trainerFilter, setTrainerFilter] = useState<string | null>(null);

  const trainerOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts = list
      .map((t: any) => ({
        id: t?.trainerId?._id ?? String(t?.adminView?.trainerId ?? ""),
        label: t?.trainerId?.fullName ?? t?.adminView?.trainerName ?? "Unknown",
        email: t?.trainerId?.userId?.email ?? t?.adminView?.trainerEmail ?? "",
      }))
      .filter((o) => {
        if (!o.id || seen.has(o.id)) return false;
        seen.add(o.id);
        return true;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    return opts;
  }, [list]);

  const filtered = useMemo(() => {
    const s = norm(search);
    return list.filter((t: any) => {
      const trainerId = t?.trainerId?._id ?? String(t?.adminView?.trainerId ?? "");
      if (trainerFilter && trainerId !== trainerFilter) return false;
      if (!s) return true;
      const trainerNameForFilter = t?.trainerId?.fullName ?? t?.adminView?.trainerName ?? "";
      const trainerEmailForFilter = t?.trainerId?.userId?.email ?? t?.adminView?.trainerEmail ?? "";
      const labelWeek = `${safeFormat(t.weekStart, "dd MMM")} - ${safeFormat(t.weekEnd, "dd MMM")}`;
      return [trainerNameForFilter, trainerEmailForFilter, labelWeek].some((v) => norm(v).includes(s));
    });
  }, [list, search, trainerFilter]);

  const groupedByWeek = useMemo(() => {
    const map = new Map<string, { weekStart: string; weekEnd?: string | null; rows: Timesheet[] }>();
    for (const t of filtered) {
      const key = String((t as any).weekStart);
      if (!map.has(key)) map.set(key, { weekStart: (t as any).weekStart, weekEnd: (t as any).weekEnd, rows: [] });
      map.get(key)!.rows.push(t);
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
  }, [filtered]);

  const groupedByTrainer = useMemo(() => {
    const map = new Map<
      string,
      { trainerId: string; trainerName: string; trainerEmail: string; rows: Timesheet[] }
    >();
    for (const t of filtered as any[]) {
      const id = t?.trainerId?._id ?? String(t?.adminView?.trainerId ?? "");
      const name = t?.trainerId?.fullName ?? t?.adminView?.trainerName ?? "Unknown";
      const email = t?.trainerId?.userId?.email ?? t?.adminView?.trainerEmail ?? "";
      const key = id || name;
      if (!map.has(key)) map.set(key, { trainerId: id, trainerName: name, trainerEmail: email, rows: [] });
      map.get(key)!.rows.push(t as any);
    }
    return Array.from(map.values()).sort((a, b) => a.trainerName.localeCompare(b.trainerName));
  }, [filtered]);

  const clearFilters = () => {
    setSearch("");
    setTrainerFilter(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 1.5, sm: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {/* Top bar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.25, sm: 1.75, md: 2 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexWrap: "wrap",
            gap: 1.25,
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: "1 1 60%" }}>
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              Timesheet (Admin View)
            </Typography>
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
              <Chip label={weekLabel} size="small" color="primary" variant="filled" sx={{ fontWeight: 600 }} />
              <Chip label={trainerName} size="small" variant="outlined" />
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: { xs: "100%", md: "70%" },
              }}
              title={subtitle}
            >
              {subtitle}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={() => Promise.all([refetchList(), refetchTs()])}
                  disabled={listLoading || tsLoading}
                  size={isSmDown ? "small" : "medium"}
                  color="primary"
                >
                  <RefreshIcon fontSize={isSmDown ? "small" : "medium"} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Body layout */}
        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ alignItems: "stretch" }}>
          {/* Left: Filters & Grouped list */}
          <Grid
            item
            xs={12}
            md={4}
            lg={3}
            sx={{
              minWidth: 0, // prevent children from forcing overflow
            }}
          >
            <FiltersPanel
              listLoading={listLoading}
              listError={!!listError}
              page={page}
              hasNext={hasNext}
              onPrev={async () => {
                setPage((p) => Math.max(1, p - 1));
                await refetchList();
              }}
              onNext={async () => {
                setPage((p) => p + 1);
                await refetchList();
              }}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              search={search}
              setSearch={setSearch}
              trainerOptions={trainerOptions}
              trainerFilter={trainerFilter}
              setTrainerFilter={setTrainerFilter}
              clearFilters={clearFilters}
              filtered={filtered}
              groupedByWeek={groupedByWeek}
              groupedByTrainer={groupedByTrainer}
              activeTimesheetId={activeTimesheetId}
              setActiveTimesheetId={setActiveTimesheetId}
            />
          </Grid>

          {/* Right: Details */}
          <Grid
            item
            xs={12}
            md={8}
            lg={9}
            sx={{ minWidth: 0 }} // allow content to shrink without overflow
          >
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              {/* Trainer Header */}
              <Paper sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 2 }}>
                {tsLoading ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={48} height={48} />
                    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                      <Skeleton variant="text" width={220} height={24} />
                      <Skeleton variant="text" width={340} height={18} />
                    </Stack>
                  </Stack>
                ) : !tsView ? (
                  <Typography color="text.secondary">No selection.</Typography>
                ) : (
                  <TrainerHeader
                    name={trainerName}
                    email={trainerEmail}
                    phone={trainerPhone}
                    createdAt={(tsView as any)?.createdAt}
                    updatedAt={(tsView as any)?.updatedAt}
                    initialsText={initials((tsView as any)?.trainerId?.fullName)}
                    totals={{
                      hours: (tsView as any)?.totals?.hours ?? 0,
                      km: (tsView as any)?.totals?.km ?? 0,
                      totalCents: (tsView as any)?.totals?.totalCents ?? 0,
                    }}
                  />
                )}
              </Paper>

              {/* Summary (cards) */}
              <Paper sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 2 }}>
                <Grid container spacing={{ xs: 1.5, md: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <SummaryCard
                      title="Total Hours"
                      value={
                        tsLoading
                          ? null
                          : (tsView as any)?.totals?.hours != null
                          ? (tsView as any).totals.hours.toFixed(2)
                          : "-"
                      }
                      icon={<AssignmentTurnedInIcon />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SummaryCard
                      title="Total KM"
                      value={
                        tsLoading
                          ? null
                          : (tsView as any)?.totals?.km != null
                          ? String((tsView as any).totals.km)
                          : "-"
                      }
                      icon={<LocalShippingIcon />}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Line Items Table */}
              <Paper sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
                <TimesheetTable
                  loading={tsLoading}
                  error={!!tsError}
                  items={(tsView as any)?.items ?? []}
                  totals={(tsView as any)?.totals}
                />
              </Paper>

              {/* Export actions (Admin only) */}
              <Box
                sx={{
                  position: { md: "sticky" },
                  bottom: { md: 16 },
                  zIndex: 1,
                }}
              >
                <ExportActions
                  isAdmin={isAdmin}
                  disabledActions={disabledActions}
                  isExporting={isExporting}
                  activeTimesheetId={activeTimesheetId}
                  onExportCSV={() => {
                    if (!activeTimesheetId) return;
                    setLastExportFmt("csv");
                    setLastExportId(activeTimesheetId);
                    triggerExport({ id: activeTimesheetId, format: "csv" });
                  }}
                  onExportPDF={() => {
                    if (!activeTimesheetId) return;
                    setLastExportFmt("pdf");
                    setLastExportId(activeTimesheetId);
                    triggerExport({ id: activeTimesheetId, format: "pdf" });
                  }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
