import React from "react";
import { Card, Typography, Stack, Box, Button, Divider } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Shift } from "../../../../utils";

type Props = {
  reports: Shift[];
  onComplete: (shift: Shift) => void;
  onSeeAll?: () => void; // optional "See all" action
};

export default function DashboardReports({ reports, onComplete, onSeeAll }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2.5,
        // mt: 3,
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with icon */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <AssignmentTurnedInIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Pending Reports
        </Typography>
      </Stack>

      {/* Report List */}
      <Stack spacing={2} flex={1}>
        {reports.length ? (
          reports.map((shift) => (
            <Box
              key={shift.id}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "var(--color-background-shade-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start", // 👈 keep content and button together
                gap: 2,
                flexWrap: "wrap", // 👈 button drops under text on small screens
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "var(--color-primary)",
                  color: "#fff",
                  "& .MuiTypography-root": { color: "#fff" },
                  "& .MuiSvgIcon-root": { color: "#fff" },
                  "& .MuiButton-root": {
                    bgcolor: "#fff",
                    color: "var(--color-primary)",
                  },
                },
              }}
            >
              {/* Shift Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Box>
                  <Typography fontWeight={600}>{shift.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {shift.date} — {shift.time}
                  </Typography>
                </Box>
              </Box>

              {/* Action Button */}
              <Button
                size="small"
                variant="contained"
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2,
                  ml: "auto", // 👈 pushes button right but keeps it aligned with row
                }}
                onClick={() => onComplete(shift)}
              >
                In Progress
              </Button>
            </Box>
          ))
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ py: 4, flex: 1, color: "text.secondary" }}
          >
            <CheckCircleOutlineIcon color="success" fontSize="large" />
            <Typography variant="body2" fontWeight={500}>
              No pending reports — you’re all caught up
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Footer "See All" */}
      {onSeeAll && (
        <>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
            onClick={onSeeAll}
          >
            See All Reports
          </Button>
        </>
      )}
    </Card>
  );
}
