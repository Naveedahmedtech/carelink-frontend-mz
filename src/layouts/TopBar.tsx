import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutConfirmDialog from "../components/auth/LogoutConfirmDialog";
import { useAppSelector } from "../redux/store";
import { useGetMeQuery } from "../redux/features/authApi";

type TopBarProps = {
  title?: string;
  onToggleDrawer: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  drawerWidth: number;
};

export default function TopBar({
  title,
  onToggleDrawer,
  onToggleCollapse,
  collapsed,
  drawerWidth,
}: TopBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const { userData } = useAppSelector((state: any) => state.auth);
  const { data, isFetching, refetch } = useGetMeQuery(undefined);
  const me = (data as any)?.data ?? (data as any) ?? {};
  const user = me;

  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "var(--color-background)",
          color: "var(--color-text)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left section */}
          <Box className="flex items-center space-x-2">
            {/* Mobile Hamburger */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={onToggleDrawer}
              sx={{ mr: 1, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Collapse Toggle */}
            <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <IconButton
                onClick={onToggleCollapse}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  borderRadius: 2,
                  "&:hover": { bgcolor: "var(--color-hover)" },
                }}
              >
                <MenuOpenRoundedIcon
                  sx={{
                    transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              </IconButton>
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight={700} sx={{ display: { xs: "none", sm: "block" } }}>
                {title || 'Dashboard'}
              </Typography>
            </Box>
          </Box>

          {/* Right-side actions */}
          <Box className="flex items-center space-x-3">
            <Tooltip title="Account settings">
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "var(--color-primary)" }}>
                  {user?.name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1,
                  minWidth: 200,
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

              {/* Menu Items */}
              {/* <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleRoundedIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsRoundedIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem> */}
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  setLogoutDialogOpen(true); // ✅ open modal
                }}
              >
                <ListItemIcon>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Logout Confirmation Modal */}
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </>
  );
}
