// src/pages/ThankYouPage.tsx
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useNavigate, useLocation } from "react-router-dom";
import CareLinkAppBar from "../components/wizard/AppBar";
import { format } from "date-fns";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // if you pass booking info via navigate state
  const booking = (location.state as { date?: string; time?: string }) || {};
  const dateStr = booking.date ? format(new Date(booking.date), "eeee, MMM d yyyy") : null;
  const timeStr = booking.time || null;

  const handleDownloadICS = () => {
    if (!booking.date || !booking.time) return;
    const start = new Date(booking.date);
    const [h, m] = booking.time.split(":").map(Number);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + 30 * 60000); // default 30 min

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:CareLink Interview
DTSTART:${toICSDate(start)}
DTEND:${toICSDate(end)}
DESCRIPTION:Interview with CareLink Team
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "carelink-interview.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CareLinkAppBar />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "var(--color-background-shade-1)",
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 500,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
            border: "1px solid var(--color-border)",
            bgcolor: "background.paper",
          }}
        >
          <CheckCircleOutlineRoundedIcon
            sx={{ fontSize: 80, color: "var(--color-success)" }}
          />
          <Typography variant="h5" fontWeight={700} mt={2}>
            Interview Booked 🎉
          </Typography>
          {dateStr && timeStr && (
            <Typography variant="body1" fontWeight={600} mt={1}>
              {dateStr} at {timeStr}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" mt={2}>
            Please make sure to save this event to your calendar so you don’t miss it.
          </Typography>

          <Stack spacing={2} mt={3}>
            <Button
              variant="outlined"
              onClick={handleDownloadICS}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Download Calendar Invite (.ics)
            </Button>
          </Stack>

          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight={600}>
              What happens next?
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              After you attend your interview, our admin team will review and activate
              your account. Once approved, you’ll receive an email notification and
              then you’ll be able to sign in.
            </Typography>
          </Box>

          <Stack spacing={2} mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "var(--color-primary)",
                "&:hover": { bgcolor: "var(--color-hover)" },
              }}
            >
              Back to Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/auth/sign-in")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Sign in Later
            </Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

/** helper: convert JS Date → YYYYMMDDTHHmmssZ (UTC) */
function toICSDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
