// src/layouts/RoleBasedDashboard.tsx
import { useAppSelector } from "../hooks";
import DashboardLayout from "./DashboardLayout";
import { participantMenu } from "../config/menu.participant";
import { adminMenu } from "../config/menu.admin";
import { trainerMenu } from "../config/menu.trainer";

export default function RoleBasedDashboard() {
  const role = useAppSelector((s) => s.auth.userData.role); // 👈 matches new slice

  let menu;
  switch (role) {
    case "admin":
      menu = adminMenu;
      break;
    case "trainer":
      menu = trainerMenu;
      break;
    default:
      menu = participantMenu;
  }

  return <DashboardLayout menu={menu} />;
}
