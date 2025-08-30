import React from "react";
import { Card, Typography, Stack, Avatar, Box, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Notification = { 
  id: number; 
  message: string; 
  color: string; 
  icon: React.ReactNode;
};

type Props = { notifications: Notification[] };

export default function DashboardNotifications({ notifications }: Props) {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: 3, p: 2.5, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Notifications
      </Typography>

      <Stack spacing={2} divider={<Divider flexItem />}>
        {notifications.map((n) => (
          <Box
            key={n.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "var(--color-primary)",
                color: "#fff",
                "& .MuiTypography-root": { color: "#fff" },
                "& .MuiAvatar-root": { bgcolor: "#fff", color: n.color },
                cursor: "pointer",
              },
            }}
          >
            <Avatar sx={{ bgcolor: n.color, width: 36, height: 36 }}>
              {n.icon}
            </Avatar>
            <Typography variant="body2">{n.message}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Footer - See All */}
      <Divider sx={{ my: 2 }} />
      <Button
        fullWidth
        variant="outlined"
        sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
        onClick={() => navigate("/dashboard/notifications")}
      >
        See All Notifications
      </Button>
    </Card>
  );
}
