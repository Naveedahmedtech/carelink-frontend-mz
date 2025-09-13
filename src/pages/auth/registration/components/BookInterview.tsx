import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { DateCalendar } from "@mui/x-date-pickers";
import { startOfDay, addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { googleCalendarCreateUrl } from "../../../../utils/calendar";
import CareLinkAppBar from "../../../../components/wizard/AppBar";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { clearTrainerProfile } from "../../../../redux/features/trainerSlice";
import { useAppDispatch } from "../../../../redux/store";

const DURATIONS = [15, 30, 45] as const;
const MOCK_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];

export default function OwnerInterviewBookingPage() {
  const navigate = useNavigate();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [duration, setDuration] = React.useState<typeof DURATIONS[number]>(30);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);

  const [snack, setSnack] = React.useState({ open: false, msg: "", severity: "success" as "success" | "error" });

  const today = startOfDay(new Date());
  const minDate = today;
  const maxDate = addDays(today, 21);

  const dispatch = useAppDispatch();


  // ---------- new effect to check booking status ----------
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ownerInterviewBooking") || "null");

    if (stored?.status === "confirmed") {
      navigate("/auth/sign-in");
    }
  }, [navigate]);

  const selectedStart = React.useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const [h, m] = selectedTime.split(":").map(Number);
    const d = new Date(selectedDate);
    d.setHours(h, m, 0, 0);
    return d;
  }, [selectedDate, selectedTime]);

  const handleConfirm = () => {
    if (!selectedStart || !name || !email || !consent) {
      setSnack({ open: true, msg: "Please fill required fields.", severity: "error" });
      return;
    }
    const bookingData = {
      name,
      email,
      date: selectedDate?.toISOString(),
      time: selectedTime,
      duration,
      timezone: tz,
      status: "confirmed", // mark initial status as pending
    };

    // Save booking in localStorage
    localStorage.setItem("ownerInterviewBooking", JSON.stringify(bookingData));

    const url = googleCalendarCreateUrl({
      title: "Interview with Project Owner",
      start: selectedStart,
      durationMin: duration,
      details: `Participant: ${name}\nEmail: ${email}`,
      tz,
      guests: [email, "technaveedahmed@gmail.com"],
    });
    window.open(url, "_blank");

// clearTrainerProfile
    // ✅ Clear localStorage keys after booking
    localStorage.removeItem("ownerInterviewBooking");
    localStorage.removeItem("trainer-training-progress");

      dispatch(clearTrainerProfile());


    navigate("/thank-you", {
      state: {
        name,
        email,
        date: selectedDate?.toISOString(),
        time: selectedTime,
        duration,
        timezone: tz,
      },
    });

  };

  return (
    <>
      <CareLinkAppBar />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "var(--color-primary)", color: "#fff", width: 56, height: 56 }}>
                <PersonRoundedIcon />
              </Avatar>
            }
            title={<Typography variant="h6" fontWeight={800}>Book an Interview</Typography>}
            subheader={
              <Typography variant="body2" color="text.secondary">
                Founder · Your timezone: <strong>{tz}</strong>
              </Typography>
            }
          />
          <CardContent>
            <Alert severity="warning" sx={{ borderColor: "var(--color-primary)", bgcolor: "var(--color-background-shade-2)", color: "var(--color-primary)", fontWeight: 600 }}>
              This interview is required to activate your account. Your account will be activated only after completing the interview.
            </Alert>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Left: Calendar */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Select a date</Typography>
              <DateCalendar
                value={selectedDate}
                onChange={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                disablePast
                minDate={minDate}
                maxDate={maxDate}
              />
            </Card>
          </Grid>

          {/* Right: times + form */}
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
              {/* Time slots */}
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                {selectedDate ? `Available times for ${format(selectedDate, "eeee, MMM d")}` : "Pick a date to see available times"}
              </Typography>

              {selectedDate && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: 1,
                    maxHeight: 220,
                    overflowY: "auto",
                    mb: 3,
                  }}
                >
                  {MOCK_TIMES.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      onClick={() => setSelectedTime(t)}
                      clickable
                      color={selectedTime === t ? "primary" : "default"}
                      variant={selectedTime === t ? "filled" : "outlined"}
                      sx={{ py: 1.5, fontWeight: 600 }}
                    />
                  ))}
                </Box>
              )}

              {selectedTime && (
                <>
                  <Divider sx={{ my: 3 }} />
                  {/* Form */}
                  <Typography variant="subtitle1" fontWeight={700} mb={2}>
                    Your Details
                  </Typography>
                  <Stack spacing={2} mb={2}>
                    <TextField
                      label="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      size="small"
                      helperText="We'll send your invite here"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                      }
                      label={<Typography variant="body2">I agree to be contacted for this interview.</Typography>}
                    />
                  </Stack>

                  <Box mt="auto">
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={!name || !email || !consent}
                      onClick={handleConfirm}
                      startIcon={<ScheduleIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        bgcolor: "var(--color-primary)",
                        "&:hover": { bgcolor: "var(--color-hover)" },
                      }}
                    >
                      Confirm & Add to Google Calendar
                    </Button>
                  </Box>
                </>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snack.severity} variant="filled">
            {snack.msg}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
