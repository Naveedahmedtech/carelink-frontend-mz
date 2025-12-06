import React from "react";
import { Paper, Stack, Typography, Skeleton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | null;
  icon?: React.ReactNode;
}) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 0,
      }}
    >
      <Stack spacing={isSmDown ? 0.25 : 0.5}>
        {/* Header (icon + title) */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="nowrap"
          sx={{ minWidth: 0 }}
        >
          {icon && (
            <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              {icon}
            </span>
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={title}
          >
            {title}
          </Typography>
        </Stack>

        {/* Value */}
        {value === null ? (
          <Skeleton
            variant="text"
            width={isSmDown ? 60 : 80}
            height={isSmDown ? 28 : 34}
          />
        ) : (
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
