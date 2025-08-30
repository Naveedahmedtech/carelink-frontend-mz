import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import PersonIcon from "@mui/icons-material/Person";
// import MessageIcon from "@mui/icons-material/Message";
// import NotificationsIcon from "@mui/icons-material/Notifications";

export const trainerMenu = [
  {
    label: "Dashboard",
    path: "/dashboard/trainer",
    icon: <DashboardIcon />,
  },
  {
    label: "My Schedule",
    path: "/dashboard/schedule",
    icon: <ScheduleIcon />,
  },
  {
    label: "Previous Shift",
    path: "/dashboard/previous-shifts",
    icon: <CalendarMonthIcon />,
  },
  {
    label: "Shift Reports",
    path: "/dashboard/reports",
    icon: <AssignmentIcon />,
  },
  {
    label: "Timesheets",
    path: "/dashboard/time-sheets",
    icon: <ReceiptLongIcon />,
  },
  // {
  //   label: "Profile",
  //   path: "/dashboard/profile",
  //   icon: <PersonIcon />,
  // },
  // {
  //   label: "Messages",
  //   path: "/dashboard/messages",
  //   icon: <MessageIcon />,
  // },
  // {
  //   label: "Notifications",
  //   path: "/dashboard/notifications",
  //   icon: <NotificationsIcon />,
  // },
];
