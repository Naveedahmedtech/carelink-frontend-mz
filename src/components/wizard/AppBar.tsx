import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

export default function CareLinkAppBar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const navItems:any = [
    // { path: "/", label: "Home" },
    // { path: "/how-it-works", label: "How it works" },
    // { path: "/support", label: "Support" },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        className="bg-backgroundShade1 border-b border-border shadow-sm"
        sx={{ background: "var(--color-background-shade-1)" }}
      >
        <Toolbar className="mx-auto max-w-7xl w-full flex justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Box component="img" src="/images/logo.png" alt="Care Link" sx={{ height: 56 }} />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item:any) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative font-medium transition-colors duration-200
                    ${
                      active
                        ? "text-primary"
                        : "text-textSecondary hover:text-primary"
                    }
                  `}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full"></span>
                  )}
                </Link>
              );
            })}

            {/* CTA */}
            <Button
              variant="contained"
              disableElevation
              className="!bg-primary hover:!bg-hover !text-textHover !rounded-lg !px-5 !py-2 !capitalize"
              onClick={() => navigate('/auth/register')}
            >
              Get Started
            </Button>
          </div>

          {/* Actions (right side) */}
          <div className="md:hidden  flex items-center gap-1">
            <IconButton
              size="large"
              className="text-textMuted hover:text-primary transition-colors"
            >
              <FlagRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-textMuted hover:text-primary"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (only on small screens) */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        className="md:hidden"
        PaperProps={{
          className: "bg-backgroundShade1 border-t border-border",
        }}
      >
        <Box className="flex flex-col min-h-screen">
          {/* Close icon row */}
          <div className="flex justify-end p-4 border-b border-border">
            <IconButton
              onClick={() => setMobileOpen(false)}
              className="text-textSecondary hover:text-primary"
            >
              <CloseIcon />
            </IconButton>
          </div>

          {/* Links */}
          <nav className="flex flex-col p-6 gap-6 text-lg flex-1">
            {navItems?.map((item:any) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="text-textSecondary hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA at bottom */}
          <div className="p-6 border-t border-border">
            <Button
              fullWidth
              variant="contained"
              className="!bg-primary hover:!bg-hover !text-textHover !rounded-lg !capitalize"
              onClick={() => navigate('/auth/register')}
            >
              Get Started
            </Button>
          </div>
        </Box>
      </Drawer>
    </>
  );
}
