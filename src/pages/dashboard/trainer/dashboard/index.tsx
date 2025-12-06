import React, { useState, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import DashboardCalendar from "./DashboardCalendar";
import DashboardNotifications from "./DashboardNotifications";
import DashboardReports from "./DashboardReports";
import DashboardStats from "./DashboardStats";
import DashboardGreeting from "./DashboardGreeting";
import ShiftDetailsModal from "../../../../components/shifts/ShiftDetailsModal";

import { mockShifts, Shift } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/store";
import { useGetMeQuery } from "../../../../redux/features/authApi";

/** 🔗 NEW: summary hook */
import { useGetTrainerDashboardSummaryQuery } from "../../../../redux/features/shiftApi";

// Sample notifications (optional)
const notifications = [
  {
    id: 1,
    message: "New rostering policy starts Sept 1",
    color: "var(--color-primary)",
    icon: <NotificationsIcon fontSize="small" />,
  },
  {
    id: 2,
    message: "Document WWCC expiring in 10 days",
    color: "var(--color-error)",
    icon: <WarningAmberIcon fontSize="small" />,
  },
];

// Include both In Progress + Report Due (placeholder until backed by API)
const pendingReports = mockShifts.filter((s) => s.status === "In Progress");

/** Small formatter for the Next Shift label */
function formatNextShiftLabel(isoStart?: string | null): string {
  if (!isoStart) return "No upcoming shift";
  const d = new Date(isoStart);
  if (isNaN(d.getTime())) return "No upcoming shift";

  const now = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (sameDay(d, now)) return `Today ${time}`;
  if (sameDay(d, tomorrow)) return `Tomorrow ${time}`;
  return `${d.toLocaleDateString()} ${time}`;
}

export default function TrainerDashboardPage() {
  // fetch auth/me
  const { data } = useGetMeQuery(undefined);
  const me = (data as any)?.data ?? (data as any) ?? {};
  const user = me;

  // 🔹 dashboard summary (total shifts, upcoming count, next shift)
  const {
    data: dashRes,
    isLoading: dashLoading,
    isFetching: dashFetching,
    refetch: refetchDash,
  } = useGetTrainerDashboardSummaryQuery();

  const summary = dashRes?.data;
  const nextShiftLabel = useMemo(
    () => formatNextShiftLabel(summary?.nextShift?.start ?? null),
    [summary?.nextShift?.start]
  );

  // Modal state
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCompleteReport = (shift: Shift) => {
    setSelectedShift(shift);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedShift(null);
    setModalOpen(false);
  };

  // Build stats from API (fallbacks while loading)
  const stats = useMemo(
    () => [
      {
        label: "Total Shifts",
        value:
          dashLoading && !summary
            ? "—"
            : typeof summary?.totalShifts === "number"
            ? summary.totalShifts
            : 0,
        color: "var(--color-primary)",
        icon: <CalendarMonthIcon />,
      },
      {
        label: "Upcoming Reports",
        value: summary?.totalUpcoming, // replace with API count when available
        color: "var(--color-success)",
        icon: <AssignmentTurnedInIcon />,
      },
      {
        label: "Next Shift",
        value: dashLoading && !summary ? "—" : nextShiftLabel,
        color: "var(--color-pending)",
        icon: <AccessTimeIcon />,
      },
    ],
    [dashLoading, summary, nextShiftLabel]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <DashboardGreeting name={user?.name} />

      {/* Stats (uses API) */}
      <DashboardStats stats={stats} />

      {/* You can show a tiny inline loader while refetching */}
      {dashFetching && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          fetching latest…
        </Box>
      )}

      <DashboardCalendar />

      {/* Notifications + Reports (optional) */}
      {/* <DashboardNotifications notifications={notifications} /> */}
      {/* <Grid item xs={12} md={4}>
        <DashboardReports
          reports={pendingReports}
          onComplete={handleCompleteReport}
          onSeeAll={() => navigate("/dashboard/reports")}
        />
      </Grid> */}

      {/* Modal for filling report */}
      <ShiftDetailsModal
        open={modalOpen}
        shift={selectedShift}
        role="trainer"
        onClose={handleCloseModal}
        onClockOut={(shift, report) => {
          console.log("Report submitted ✅", shift, report);
          handleCloseModal();
          // Optionally refresh summary after clock out:
          refetchDash();
        }}
      />
    </Box>
  );
}
