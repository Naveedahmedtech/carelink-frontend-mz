import React from "react";
import { Card, Typography, Avatar, Box } from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";

// type for each stat
type Stat = {
  label: string;
  value: string | number;
  color: string; // background color for icon avatar
  icon: React.ReactNode; // pass in a MUI Icon
};

type Props = { stats: Stat[] };

export default function DashboardStats({ stats }: Props) {
  if (!stats || stats.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          No stats yet
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Once you start scheduling shifts and submitting reports, your stats
          will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} mb={3}>
      {stats.map((stat, i) => (
        <Grid item xs={12} md={4} key={i}>
          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              height: "100%",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: stat.color,
                width: 48,
                height: 48,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              {stat.icon}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stat.value}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
