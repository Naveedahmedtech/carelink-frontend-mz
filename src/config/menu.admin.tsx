import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export const adminMenu = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Participants", path: "/dashboard/participants", icon: <PeopleIcon /> },
  { label: "Trainers", path: "/dashboard/trainers", icon: <PeopleIcon /> },
  { label: "Calendar", path: "/dashboard/calendar", icon: <CalendarTodayIcon /> },
];
