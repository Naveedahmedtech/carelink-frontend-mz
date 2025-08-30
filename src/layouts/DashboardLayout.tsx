import React from "react";
import { Box, CssBaseline, Drawer } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ScrollToTop from "../components/common/ScrollToTop";

type MenuItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

type DashboardLayoutProps = {
  title?: string;
  menu: MenuItem[];
};

export default function DashboardLayout({ title, menu }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const drawerWidth = collapsed ? 72 : 260;
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Sidebar
      menu={menu}
      onNavigate={(path) => navigate(path)}
      collapsed={collapsed}
    />
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Bar */}
      <TopBar
        title={title}
        onToggleDrawer={handleDrawerToggle}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        collapsed={collapsed}
        drawerWidth={drawerWidth}
      />

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: 260, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: "var(--color-background)",
          minHeight: "100vh",
          transition: "margin 0.3s",
        }}
      >
        <ScrollToTop />

        <Outlet />
      </Box>
    </Box>
  );
}
