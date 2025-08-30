// src/layouts/AuthLayout.tsx
import * as React from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Link as MuiLink,
  Paper,
  Toolbar,
  AppBar,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/**
 * Design goals:
 * - Spacious, calm layout with clear visual hierarchy.
 * - Soft, theme-aware gradient background and subtle surface elevation.
 * - Motion that respects prefers-reduced-motion.
 * - Keyboard & screen reader friendly (landmarks, headings, roles).
 * - Flexible: split (hero + form) or centered (form only) variants.
 */

export type AuthLayoutProps = {
  /** Main form/content goes here (right side on desktop in 'split' variant) */
  children: React.ReactNode;
  /** App/brand node shown in the hero area or header */
  brand?: React.ReactNode;
  /** Optional title above the form */
  title?: React.ReactNode;
  /** Optional subtitle above the form */
  subtitle?: React.ReactNode;
  /** Node for the left hero panel (bullets/illustration) */
  hero?: React.ReactNode;
  /** Footer under the form (links, small print) */
  footer?: React.ReactNode;
  /** Max width for the form card */
  formMaxWidth?: number;
  /** Hide the left hero on xs/sm; default: true */
  hideHeroOnMobile?: boolean;
  /** Transparent form background; default: false for better contrast */
  transparentFormBg?: boolean;
  /** Optional top-right link in app bar */
  topRightLink?: { href: string; label: string };
  /** Optional back action shown in app bar */
  topLeftBack?: { href: string; label?: string };
  /** Layout style: 'split' (hero + form) or 'centered' (form only) */
  variant?: "split" | "centered";
  /** Optional custom background image url for hero (auto dimmed) */
  heroBgImageUrl?: string;
  /** Optional aria-label for the <main> landmark (a11y) */
  mainAriaLabel?: string;
};

export default function AuthLayout({
  children,
  brand = (
    <Typography variant="h5" fontWeight={800} letterSpacing={0.2}>
      CareLink
    </Typography>
  ),
  title,
  subtitle,
  hero,
  footer,
  formMaxWidth = 432, // a hair wider than 400 for comfy fields
  hideHeroOnMobile = true,
  transparentFormBg = false,
  topRightLink,
  topLeftBack,
  variant = "split",
  heroBgImageUrl,
  mainAriaLabel = "Authentication",
}: AuthLayoutProps) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const showHero = variant === "split" && (mdUp || !hideHeroOnMobile);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        // Background: subtle Material-3 style radial + linear blend
        "&::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: (t) => {
            const primary = t.palette.primary.main;
            const overlay =
              t.palette.mode === "dark"
                ? alpha(primary, 0.18)
                : alpha(primary, 0.12);
            return `
              radial-gradient(1200px 600px at 10% -10%, ${overlay}, transparent 50%),
              radial-gradient(1000px 500px at 120% 10%, ${alpha(primary, 0.08)}, transparent 55%),
              linear-gradient(180deg, ${alpha(t.palette.background.paper, 0.6)}, transparent)
            `;
          },
        },
      }}
    >
      {/* Top app bar (optional actions) */}
      {(topLeftBack || topRightLink) && (
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            backdropFilter: "saturate(180%) blur(10px)",
            bgcolor: (t) =>
              alpha(
                t.palette.background.paper,
                t.palette.mode === "dark" ? 0.16 : 0.72
              ),
            borderBottom: (t) =>
              `1px solid ${alpha(t.palette.divider, 0.5)}`,
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
              {topLeftBack ? (
                <IconButton
                  aria-label={topLeftBack.label ?? "Back"}
                  href={topLeftBack.href}
                  edge="start"
                >
                  <ArrowBackRoundedIcon />
                </IconButton>
              ) : null}
              {/* Brand in app bar (small) */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {brand}
              </Box>
            </Box>

            {topRightLink ? (
              <MuiLink
                href={topRightLink.href}
                underline="hover"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  "&:focus-visible": {
                    outline: (t) => `2px solid ${t.palette.primary.main}`,
                    outlineOffset: 2,
                    borderRadius: 1,
                  },
                }}
              >
                {topRightLink.label}
              </MuiLink>
            ) : null}
          </Toolbar>
        </AppBar>
      )}

      {/* Main content */}
      <Box
        component="main"
        aria-label={mainAriaLabel}
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: showHero ? { md: "1fr 1fr" } : "1fr",
          alignItems: "stretch",
          minHeight: 0,
        }}
      >
        {/* Left hero (only for split) */}
        {showHero && (
          <Box
            role="complementary"
            aria-label="Product highlights"
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, sm: 6 },
              overflow: "hidden",
              // hero bg
              background: (t) =>
                t.palette.mode === "dark"
                  ? alpha(t.palette.primary.dark, 0.14)
                  : alpha(t.palette.primary.light, 0.18),
              // optional image blend
              ...(heroBgImageUrl && {
                backgroundImage: `linear-gradient(${alpha(
                  theme.palette.background.paper,
                  theme.palette.mode === "dark" ? 0.2 : 0.6
                )}, ${alpha(
                  theme.palette.background.paper,
                  theme.palette.mode === "dark" ? 0.2 : 0.6
                )}), url(${heroBgImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }),
            }}
          >
            {/* subtle decorative dots */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                color: (t) => alpha(t.palette.primary.main, 0.12),
                maskImage:
                  "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            <Container maxWidth="sm" disableGutters>
              <Stack spacing={3}>
                {/* Big brand for hero */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    color: "text.primary",
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    letterSpacing={0.2}
                    sx={{
                      textShadow: (t) =>
                        t.palette.mode === "dark"
                          ? "0 1px 0 rgba(0,0,0,0.4)"
                          : "0 1px 0 rgba(255,255,255,0.5)",
                    }}
                  >
                    CareLink
                  </Typography>
                </Box>

                <Box
                  sx={{
                    opacity: 0,
                    transform: "translateY(8px)",
                    animation: reduceMotion
                      ? "none"
                      : "cl-fade-in 600ms 80ms ease forwards",
                    "@keyframes cl-fade-in": {
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  {hero}
                </Box>
              </Stack>
            </Container>
          </Box>
        )}

        {/* Right: form surface */}
        <Box
          sx={{
            display: "flex",
            alignItems: variant === "centered" ? "center" : "stretch",
            justifyContent: "center",
            p: { xs: 3, sm: 6 },
          }}
        >
          <Container
            maxWidth="sm"
            disableGutters
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={transparentFormBg ? 0 : 2}
              role="region"
              aria-label="Authentication form"
              sx={{
                width: "100%",
                maxWidth: formMaxWidth,
                px: { xs: 2.5, sm: 4 },
                py: { xs: 3, sm: 4.5 },
                borderRadius: 3,
                bgcolor: transparentFormBg ? "transparent" : "background.paper",
                border: (t) =>
                  transparentFormBg
                    ? "none"
                    : `1px solid ${alpha(t.palette.divider, 0.6)}`,
                boxShadow: (t) =>
                  transparentFormBg
                    ? "none"
                    : t.palette.mode === "dark"
                    ? "0 8px 24px rgba(0,0,0,0.28)"
                    : "0 8px 24px rgba(0,0,0,0.08)",
                transition: "box-shadow 200ms ease, transform 200ms ease",
                ...(transparentFormBg
                  ? {}
                  : {
                      "&:focus-within": {
                        boxShadow: (t) =>
                          t.palette.mode === "dark"
                            ? "0 12px 28px rgba(0,0,0,0.34)"
                            : "0 12px 28px rgba(0,0,0,0.12)",
                        transform: reduceMotion ? "none" : "translateY(-1px)",
                      },
                    }),
              }}
            >
              {/* Brand (small) for centered variant or when no app bar */}
              {!showHero && !topLeftBack && (
                <Box sx={{ mb: 2 }}>
                  {brand}
                </Box>
              )}

              {(title || subtitle) && (
                <Stack spacing={0.75} sx={{ mb: 2.5 }}>
                  {title ? (
                    <Typography
                      component="h1"
                      variant="h5"
                      fontWeight={800}
                      letterSpacing={0.2}
                    >
                      {title}
                    </Typography>
                  ) : null}
                  {subtitle ? (
                    <Typography variant="body2" color="text.secondary">
                      {subtitle}
                    </Typography>
                  ) : null}
                </Stack>
              )}

              {/* Content */}
              <Box sx={{ mt: (title || subtitle) ? 0.5 : 0 }}>{children}</Box>

              {footer ? (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>{footer}</Box>
                </>
              ) : null}
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
