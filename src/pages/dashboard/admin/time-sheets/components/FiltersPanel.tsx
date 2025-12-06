import React, { useMemo, useRef } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Divider,
  Skeleton,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Autocomplete,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HistoryIcon from "@mui/icons-material/History";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { safeFormat, money } from "../utils/tsUtils";

type TrainerOption = { id: string; label: string; email: string };

export default function FiltersPanel(props: {
  listLoading: boolean;
  listError: boolean;
  page: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;

  groupBy: "WEEK" | "TRAINER";
  setGroupBy: (v: "WEEK" | "TRAINER") => void;

  search: string;
  setSearch: (s: string) => void;

  trainerOptions: TrainerOption[];
  trainerFilter: string | null;
  setTrainerFilter: (id: string | null) => void;
  clearFilters: () => void;

  filtered: any[];
  groupedByWeek: { weekStart: string; weekEnd?: string | null; rows: any[] }[];
  groupedByTrainer: { trainerId: string; trainerName: string; trainerEmail: string; rows: any[] }[];

  activeTimesheetId?: string;
  setActiveTimesheetId: (id?: string) => void;
}) {
  const {
    listLoading,
    listError,
    page,
    hasNext,
    onPrev,
    onNext,
    groupBy,
    setGroupBy,
    search,
    setSearch,
    trainerOptions,
    trainerFilter,
    setTrainerFilter,
    clearFilters,
    filtered,
    groupedByWeek,
    groupedByTrainer,
    activeTimesheetId,
    setActiveTimesheetId,
  } = props;

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const panelRef = useRef<HTMLDivElement | null>(null);

  // for Autocomplete popper bounding (prevents overflow out of card)
  const popperProps = useMemo(
    () => ({
      // @ts-ignore MUI Popper accepts 'container' through slotProps
      container: panelRef.current,
      modifiers: [
        { name: "preventOverflow", enabled: true, options: { altBoundary: true, tether: false } },
        { name: "flip", enabled: true },
      ],
    }),
    []
  );

  return (
    <Stack spacing={1.5} sx={{ position: { md: "sticky" }, top: { md: 16 }, minWidth: 0 }}>
      <Paper
        ref={panelRef}
        sx={{
          p: 1.25,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minWidth: 0,
          overflow: "hidden", // ⟵ ensure nothing bleeds outside
          maxHeight: { xs: 560, sm: 620, md: 700 }, // safety cap
        }}
      >
        {/* Header + pagination */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 0.25, minWidth: 0 }}
          spacing={1}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" color="text.secondary" noWrap>
              Filters & Grouping
            </Typography>
            <Chip size="small" label={`${filtered.length} result${filtered.length === 1 ? "" : "s"}`} sx={{ height: 22 }} />
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            {isSmDown ? (
              <>
                <Tooltip title="Previous">
                  <span>
                    <IconButton size="small" disabled={listLoading || page <= 1} onClick={onPrev}>
                      <NavigateBeforeIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Next">
                  <span>
                    <IconButton size="small" disabled={listLoading || !hasNext} onClick={onNext}>
                      <NavigateNextIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  disabled={listLoading || page <= 1}
                  onClick={onPrev}
                  sx={{ py: 0.25 }}
                >
                  Prev
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<NavigateNextIcon />}
                  disabled={listLoading || !hasNext}
                  onClick={onNext}
                  sx={{ py: 0.25 }}
                >
                  Next
                </Button>
              </>
            )}
          </Stack>
        </Stack>

        {/* Group toggle */}
        <ToggleButtonGroup
          exclusive
          size="small"
          value={groupBy}
          onChange={(_, val) => val && setGroupBy(val)}
          sx={{ width: "100%" }}
        >
          <ToggleButton value="WEEK" sx={{ px: isSmDown ? 1 : 2 }}>
            {isSmDown ? <DateRangeIcon fontSize="small" /> : "Group by Week"}
          </ToggleButton>
          <ToggleButton value="TRAINER" sx={{ px: isSmDown ? 1 : 2 }}>
            {isSmDown ? <PersonIcon fontSize="small" /> : "Group by Trainer"}
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Search + Trainer */}
        <Stack direction="row" spacing={1} useFlexGap flexWrap="nowrap" alignItems="center" sx={{ minWidth: 0 }}>
          <TextField
            size="small"
            placeholder={groupBy === "WEEK" ? "Search weeks or trainers…" : "Search trainers or weeks…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ flex: "1 1 auto", minWidth: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Autocomplete
            options={trainerOptions}
            getOptionLabel={(o) => o.label}
            value={trainerOptions.find((o) => o.id === trainerFilter) ?? null}
            onChange={(_, v) => setTrainerFilter(v?.id ?? null)}
            renderInput={(params) => <TextField {...params} size="small" placeholder="Trainer" />}
            disablePortal // keep popup inside the panel
            slotProps={{ popper: popperProps as any }}
            sx={{ flex: "0 0 210px", minWidth: 0 }}
            ListboxProps={{ style: { maxHeight: 240 } }}
            clearOnEscape
          />
          <Tooltip title="Clear filters">
            <span>
              <IconButton size="small" onClick={clearFilters}>
                <ClearAllIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Divider sx={{ my: 0.75 }} />

        {/* Scrollable list area */}
        <Box
          sx={{
            flex: 1,
            minHeight: 220,
            overflowY: "auto",
            overflowX: "hidden",
            pr: 0.5,
          }}
        >
          {listError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              Couldn’t load weeks.
            </Alert>
          ) : listLoading ? (
            <Stack spacing={0.75}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={34} />
              ))}
            </Stack>
          ) : filtered.length === 0 ? (
            <Alert severity="info">No results for current filters.</Alert>
          ) : groupBy === "WEEK" ? (
            <Stack spacing={0.75}>
              {groupedByWeek.map((group) => {
                const label = `${safeFormat(group.weekStart, "dd MMM")} – ${safeFormat(group.weekEnd, "dd MMM yyyy")}`;
                return (
                  <Box key={String(group.weekStart)} sx={{ pb: 0.5, minWidth: 0 }}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.25, lineHeight: 1.6 }}
                      noWrap
                      title={label}
                    >
                      {label}
                    </Typography>
                    <Stack spacing={0.5}>
                      {group.rows.map((t: any) => {
                        const selected = t._id === activeTimesheetId;
                        const trainerName = t?.trainerId?.fullName ?? t?.adminView?.trainerName ?? "Unknown";
                        const totals = t?.adminView?.amounts ?? t?.totals;
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
                              py: 0.5,
                              px: 1,
                              minWidth: 0,
                            }}
                          >
                            {/* left label (truncate) */}
                            <Box
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                mr: 1,
                                flex: "1 1 60%",
                                textAlign: "left",
                                minWidth: 0,
                              }}
                              title={trainerName}
                            >
                              {trainerName}
                            </Box>
                            {/* right chips (wrap within button) */}
                            {/* <Stack
                              direction="row"
                              spacing={0.5}
                              useFlexGap
                              flexWrap="wrap"
                              sx={{ justifyContent: "flex-end", maxWidth: "40%" }}
                            >
                              <Chip size="small" label={`Items ${t?.adminView?.itemsCount ?? t?.items?.length ?? 0}`} />
                              <Chip size="small" label={`Total ${money(totals?.totalCents)}`} />
                            </Stack> */}
                          </Button>
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <Stack spacing={0.75}>
              {groupedByTrainer.map((group) => (
                <Box key={group.trainerId || group.trainerName} sx={{ pb: 0.5, minWidth: 0 }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.25, lineHeight: 1.6 }}
                    noWrap
                    title={`${group.trainerName}${group.trainerEmail ? ` · ${group.trainerEmail}` : ""}`}
                  >
                    {group.trainerName} {group.trainerEmail ? `· ${group.trainerEmail}` : ""}
                  </Typography>
                  <Stack spacing={0.5}>
                    {group.rows
                      .slice()
                      .sort((a: any, b: any) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
                      .map((t: any) => {
                        const selected = t._id === activeTimesheetId;
                        const label = `${safeFormat(t.weekStart, "dd MMM")} – ${safeFormat(t.weekEnd, "dd MMM")}`;
                        const totals = t?.adminView?.amounts ?? t?.totals;
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
                              py: 0.5,
                              px: 1,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                mr: 1,
                                flex: "1 1 60%",
                                textAlign: "left",
                                minWidth: 0,
                              }}
                              title={label}
                            >
                              {label}
                            </Box>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              useFlexGap
                              flexWrap="wrap"
                              sx={{ justifyContent: "flex-end", maxWidth: "40%" }}
                            >
                              <Chip size="small" label={`Items ${t?.adminView?.itemsCount ?? t?.items?.length ?? 0}`} />
                              <Chip size="small" label={`Total ${money(totals?.totalCents)}`} />
                            </Stack>
                          </Button>
                        );
                      })}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Info card – compact */}
      <Paper sx={{ p: 1.25, borderRadius: 2, overflow: "hidden" }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <HistoryIcon fontSize="small" />
          <Typography variant="subtitle2">About Timesheets</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Select a week or trainer to view detailed entries and totals. Export CSV/PDF for payroll or audit.
        </Typography>
      </Paper>
    </Stack>
  );
}
