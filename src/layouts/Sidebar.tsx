import React, { useState } from "react";
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon as MuiListItemIcon,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

// Icons
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutConfirmDialog from "../components/auth/LogoutConfirmDialog";
import { useAppSelector } from "../redux/store";
import { useGetMeQuery } from "../redux/features/authApi";

type MenuItemType = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  menu: MenuItemType[];
  onNavigate: (path: string) => void;
  collapsed: boolean;
};

export default function Sidebar({ menu, onNavigate, collapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state: any) => state.auth);
  const { data, isFetching, refetch } = useGetMeQuery(undefined);
  const me = (data as any)?.data ?? (data as any) ?? {};
  const user = me;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 260,
        transition: "width 0.3s",
        height: "100%",
        bgcolor: "backgroundShade1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header / Logo */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <Avatar sx={{ bgcolor: "var(--color-primary)" }}>C</Avatar>
        {!collapsed && (
          <Typography variant="h6" fontWeight={700}>
            CareLink
          </Typography>
        )}
      </Box>
      <Divider />

      {/* Nav List */}
      <List sx={{ flex: 1, mt: 1 }}>
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.path);

          const listItem = (
            <ListItemButton
              key={item.label}
              onClick={() => onNavigate(item.path)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                transition: "all 0.2s",
                justifyContent: collapsed ? "center" : "flex-start",
                color: active ? "#fff" : "var(--color-text)",
                backgroundColor: active ? "var(--color-primary)" : "transparent",
                "&:hover": {
                  backgroundColor: active
                    ? "var(--color-primary)"
                    : "var(--color-hover)",
                  color: "var(--color-text-hover)",
                  "& .MuiListItemIcon-root": {
                    color: "var(--color-text-hover)",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "var(--color-text-hover)" : "var(--color-text)",
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                  }}
                />
              )}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={item.label} title={item.label} placement="right">
              {listItem}
            </Tooltip>
          ) : (
            listItem
          );
        })}
      </List>

      {/* Footer / Profile (Whole area clickable) */}
      <Box
        onClick={handleProfileClick}
        sx={{
          p: 2,
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
      >
        <Avatar sx={{ bgcolor: "var(--color-primary)" }}>            {user?.name?.[0]}</Avatar>
        {!collapsed && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Profile Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: -1,
            ml: collapsed ? 0 : -4,
            minWidth: 220,
            borderRadius: 2,
            bgcolor: "var(--color-background)",
            color: "var(--color-text)",
          },
        }}
      >
        {/* Profile Header */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.role}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* <MenuItem onClick={handleMenuClose}>
          <MuiListItemIcon>
            <AccountCircleRoundedIcon fontSize="small" />
          </MuiListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <MuiListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </MuiListItemIcon>
          Settings
        </MenuItem> */}
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setLogoutDialogOpen(true);
          }}
        >
          <MuiListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </MuiListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Logout Modal */}
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </Box>
  );
}
