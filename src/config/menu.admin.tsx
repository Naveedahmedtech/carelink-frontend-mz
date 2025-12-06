import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment"; // ✅ new icon for shift requests
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export const adminMenu = [
  { label: "Dashboard", path: "/dashboard/admin", icon: <DashboardIcon /> },
  { label: "Participants", path: "/dashboard/participants", icon: <PeopleIcon /> },
  { label: "Trainers", path: "/dashboard/trainers", icon: <PeopleIcon /> },
  // { label: "Calendar", path: "/dashboard/calendar", icon: <CalendarTodayIcon /> },

  // 🆕 Admin Shift Requests (approval panel)
  {
    label: "Shift Requests",
    path: "/dashboard/shift-requests",
    icon: <AssignmentIcon />,
  },

  // 🆕 Admin Shift Requests (approval panel)
  {
    label: "Time Sheets",
    path: "/dashboard/time-sheet",
    icon: <ReceiptLongIcon />,
  },
];
