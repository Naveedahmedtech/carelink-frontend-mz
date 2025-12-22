// src/pages/portal/admin/AdminDashboard.tsx
import React, { useMemo } from "react";
import {
  Box,
  GridLegacy as Grid,
  Paper,
  Stack,
  Typography,
  IconButton,
  Skeleton,
  Chip,
  Button,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import Face6Icon from "@mui/icons-material/Face6";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TimelineIcon from "@mui/icons-material/Timeline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useGetAdminDashboardSummaryQuery } from "../../../../redux/features/shiftApi";
import { useTheme as useAppTheme } from "../../../../context/ThemeContext";
import { readCssVar } from "../../../../theme";

/* ---------- theme ---------- */
const defaultAccent = "#12D3B0";

/* ---------- helpers ---------- */
const fmt = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "-");

/* ---------- atoms ---------- */
function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent = defaultAccent,
  loading,
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: string;
  loading?: boolean;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.2, sm: 1.4 },
        borderRadius: 2,
        display: "grid",
        columnGap: 1.25,
        rowGap: 0.35,
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 1.5,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
          boxShadow: "0 4px 12px rgba(227,30,104,.18)",
        }}
      >
        {icon}
      </Box>
      <Stack sx={{ minWidth: 0, gap: 0.25 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }} noWrap>
          {title}
        </Typography>
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.05 }}>
            {value}
          </Typography>
        )}
        {subtitle ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ opacity: 0.9, lineHeight: 1.3 }}
            noWrap
            title={subtitle}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}

function Section({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, md: 1.75 }, borderRadius: 2,
     }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        mb={1}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="subtitle1" fontWeight={800}>
            {title}
          </Typography>
        </Stack>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

/* ---------- page ---------- */
export default function AdminDashboard() {
  const { theme } = useAppTheme();
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminDashboardSummaryQuery();
  const s = data?.data;

  const brandPink = readCssVar("--color-primary", defaultAccent);
  const lightTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: { main: brandPink },
          background: {
            default: readCssVar("--color-background", "#f9fafb"),
            paper: readCssVar("--color-background-shade-1", "#ffffff"),
          },
          divider: readCssVar("--color-border", "rgba(5,5,22,.08)"),
          text: {
            primary: readCssVar("--color-text", "#0f172a"),
            secondary: readCssVar("--color-text-secondary", "#475569"),
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontWeightBold: 800,
        },
        components: {
          MuiPaper: {
            styleOverrides: { root: { border: "1px solid rgba(5,5,22,.08)" } },
          },
          MuiButton: {
            styleOverrides: { root: { textTransform: "none", fontWeight: 700, borderRadius: 10 } },
          },
          MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
        },
      }),
    [brandPink, theme]
  );

  const totalUsers = s?.users.total ?? 0;
  const totalShiftReq = s?.shiftRequests.total ?? 0;
  const totalShifts = s?.shifts.total ?? 0;

  const topStats = useMemo(
    () => [
      {
        title: "Total Users",
        value: fmt(totalUsers),
        subtitle: `Admins ${fmt(s?.users.byRole.admins)} | Trainers ${fmt(
          s?.users.byRole.trainers
        )} | Participants ${fmt(s?.users.byRole.participants)}`,
        icon: <PeopleAltIcon />,
        accent: brandPink,
      },
      {
        title: "Trainers",
        value: fmt(s?.trainers.total),
        subtitle: `Active ${fmt(s?.trainers.active)} | Pending ${fmt(s?.trainers.pending)}`,
        icon: <SchoolIcon />,
        accent: "#06B6D4",
      },
      {
        title: "Participants",
        value: fmt(s?.participants.total),
        subtitle: `Active ${fmt(s?.participants.byStatus.active)}`,
        icon: <Face6Icon />,
        accent: "#0EA5E9",
      },
      {
        title: "Shift Requests",
        value: fmt(totalShiftReq),
        subtitle: `Pending ${fmt(s?.shiftRequests.byStatus.pending_admin)} | Approved ${fmt(
          s?.shiftRequests.byStatus.approved
        )}`,
        icon: <EventNoteIcon />,
        accent: "#F59E0B",
      },
      {
        title: "Shifts",
        value: fmt(totalShifts),
        subtitle: `In Progress ${fmt(s?.shifts.byStatus.in_progress)} | Completed ${fmt(
          s?.shifts.byStatus.completed
        )}`,
        icon: <TimelineIcon />,
        accent: "#14B8A6",
      },
      {
        title: "Timesheets",
        value: fmt(s?.timesheets.total),
        subtitle: `Submitted ${fmt(s?.timesheets.byStatus.submitted)} | Paid ${fmt(
          s?.timesheets.byStatus.paid
        )}`,
        icon: <ReceiptLongIcon />,
        accent: "#6366F1",
      },
    ],
    [s, totalUsers, totalShiftReq, totalShifts, brandPink]
  );

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={(t) => ({
          p: { xs: 1.5, md: 3 },
          display: "grid",
          gap: { xs: 1.5, md: 2 },
          maxWidth: 1400,
          mx: "auto",
          "--color-border": t.palette.divider,
        })}
      >
        {/* HEADER */}
        <Paper elevation={0} sx={{ p: { xs: 1.4, md: 2 }, borderRadius: 2, }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack spacing={0.25}>
              <Typography variant="h6" fontWeight={900}>
                Admin Command Center
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                Snapshot as of {s?.generatedAt ? new Date(s.generatedAt).toLocaleString() : "-"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              {isFetching ? <Skeleton width={100} /> : null}
              <Tooltip title="Refresh">
                <IconButton
                  onClick={() => refetch()}
                  sx={{ border: "1px solid var(--color-border)", borderRadius: 2 }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* ERROR STRIP */}
        {isError && (
          <Paper sx={{ p: 1.5, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                <ErrorOutlineIcon color="error" />
                <Typography color="error" fontWeight={700}>
                  Couldn't load dashboard.
                </Typography>
              </Stack>
              <Button onClick={() => refetch()} size="small" sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>
                Retry
              </Button>
            </Stack>
          </Paper>
        )}

        {/* KPI GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fit, minmax(170px, 1fr))",
              sm: "repeat(auto-fit, minmax(210px, 1fr))",
              lg: "repeat(auto-fit, minmax(230px, 1fr))",
            },
            gap: { xs: 1, sm: 1.25, md: 1.5 },
            alignItems: "stretch",
          }}
        >
          {topStats.map((k, i) => (
            <KpiCard
              key={i}
              title={k.title}
              value={k.value}
              subtitle={k.subtitle}
              icon={k.icon}
              accent={k.accent as string}
              loading={isLoading && !s}
            />
          ))}
        </Box>

        {/* RECENT ROWS ONLY */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={4}>
            <Section
              title="Recent Users"
              icon={<AdminPanelSettingsIcon sx={{ color: "var(--color-primary)" }} />}
              action={<Chip size="small" label={`Total ${fmt(s?.users?.total)}`} />}
            >
              {!s ? (
                <Stack spacing={1}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={44} />
                  ))}
                </Stack>
              ) : s.users.recent?.length ? (
                <List dense disablePadding>
                  {s.users.recent.map((u: any) => (
                    <ListItem
                      key={u._id}
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        mb: 1,
                        borderRadius: 1.5,
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <ListItemIcon>
                        <PeopleAltIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                        primary={u.email}
                        secondary={`${u.role} | ${new Date(u.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent users.
                </Typography>
              )}
            </Section>
          </Grid>

          <Grid item xs={12} md={4}>
            <Section
              title="Recent Shift Requests"
              icon={<EventNoteIcon sx={{ color: "var(--color-primary)" }} />}
              action={<Chip size="small" label={`Total ${fmt(s?.shiftRequests?.total)}`} />}
            >
              {!s ? (
                <Stack spacing={1}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={44} />
                  ))}
                </Stack>
              ) : s.shiftRequests.recent?.length ? (
                <List dense disablePadding>
                  {s.shiftRequests.recent.map((r: any) => (
                    <ListItem
                      key={r._id}
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        mb: 1,
                        borderRadius: 1.5,
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <ListItemIcon>
                        <EventNoteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                        primary={`${r.status} | ${new Date(r.start).toLocaleString()}`}
                        secondary={`Created ${new Date(r.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent requests.
                </Typography>
              )}
            </Section>
          </Grid>

          <Grid item xs={12} md={4}>
            <Section
              title="Recent Shifts"
              icon={<DoneAllIcon sx={{ color: "var(--color-primary)" }} />}
              action={<Chip size="small" label={`Total ${fmt(s?.shifts?.total)}`} />}
            >
              {!s ? (
                <Stack spacing={1}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={44} />
                  ))}
                </Stack>
              ) : s.shifts.recent?.length ? (
                <List dense disablePadding>
                  {s.shifts.recent.map((sh: any) => (
                    <ListItem
                      key={sh._id}
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        mb: 1,
                        borderRadius: 1.5,
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <ListItemIcon>
                        <DoneAllIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                        primary={`${sh.status} | ${new Date(sh.scheduledStart).toLocaleString()}`}
                        secondary={`Created ${new Date(sh.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent shifts.
                </Typography>
              )}
            </Section>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
