import EventIcon from "@mui/icons-material/Event";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HistoryIcon from "@mui/icons-material/History";
import NoteIcon from "@mui/icons-material/Note";
import PersonIcon from "@mui/icons-material/Person";

export const participantMenu = [
  { label: "Upcoming Shifts", path: "/dashboard/upcoming", icon: <EventIcon /> },
  { label: "Request Shift", path: "/dashboard/request", icon: <AddCircleIcon /> },
  // { label: "Previous Shifts", path: "/dashboard/previous", icon: <HistoryIcon /> },
  { label: "Support Notes", path: "/dashboard/notes", icon: <NoteIcon /> },
    {
    label: "Profile",
    path: "/dashboard/profile/participant",
    icon: <PersonIcon />,
  },
];




