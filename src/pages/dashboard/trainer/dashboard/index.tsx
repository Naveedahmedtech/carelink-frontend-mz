import React, { useState } from "react";
import { Box } from "@mui/material";
import { mockShifts, Shift } from "../../../../utils";
import { GridLegacy as Grid } from "@mui/material";
import DashboardCalendar from "./DashboardCalendar";
import DashboardNotifications from "./DashboardNotifications";
import DashboardReports from "./DashboardReports";
import DashboardStats from "./DashboardStats";
import DashboardGreeting from "./DashboardGreeting";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ShiftDetailsModal from "../../../../components/shifts/ShiftDetailsModal";
import { useNavigate } from "react-router-dom";

// Sample notifications
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

// ✅ Include both In Progress + Report Due
const pendingReports = mockShifts.filter(
  (s) => s.status === "In Progress"
);

export default function TrainerDashboardPage() {
  // Example stats array
  const stats = [
    {
      label: "Total Shifts",
      value: 9,
      color: "var(--color-primary)",
      icon: <CalendarMonthIcon />,
    },
    {
      label: "Pending Reports",
      value: pendingReports.length,
      color: "var(--color-success)",
      icon: <AssignmentTurnedInIcon />,
    },
    {
      label: "Next Shift",
      value: "Tomorrow 10:00 AM",
      color: "var(--color-pending)",
      icon: <AccessTimeIcon />,
    },
  ];

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

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <DashboardGreeting name="Alex" />

      <DashboardStats stats={stats} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <DashboardCalendar />
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <DashboardNotifications notifications={notifications} /> */}
          <DashboardReports
            reports={pendingReports}
            onComplete={handleCompleteReport}
            onSeeAll={() => navigate("/dashboard/reports")}
          />
        </Grid>
      </Grid>

      {/* Modal for filling report */}
      <ShiftDetailsModal
        open={modalOpen}
        shift={selectedShift}
        role="trainer"
        onClose={handleCloseModal}
        onClockOut={(shift, report) => {
          console.log("Report submitted ✅", shift, report);
          handleCloseModal();
        }}
      />
    </Box>
  );
}
