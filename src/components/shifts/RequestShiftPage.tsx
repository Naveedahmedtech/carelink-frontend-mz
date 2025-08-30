// src/pages/dashboard/RequestShiftPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { format, differenceInHours, isBefore } from "date-fns";
import { mockShifts, Shift } from "../../utils";

// MUI Icons
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import NotesIcon from "@mui/icons-material/Notes";
import CategoryIcon from "@mui/icons-material/Category";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";

const mockWorkers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Sarah Lee" },
  { id: "3", name: "Michael Brown" },
];

export default function RequestShiftPage() {
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [supportType, setSupportType] = useState("");
  const [worker, setWorker] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  // Notes limits
  const maxWords = 100;
  const countWords = (str: string) =>
    str.trim().split(/\s+/).filter(Boolean).length;

  const handleNotesChange = (val: string) => {
    if (countWords(val) <= maxWords) {
      setNotes(val);
    }
  };

  // Validation
  const isFormValid =
    !!date &&
    !!startTime &&
    !!endTime &&
    !!supportType &&
    notes.trim().length > 0 &&
    isBefore(startTime, endTime);

  const handleSubmit = () => {
    if (!isFormValid) return;

    const newShift: Shift = {
      id: String(Date.now()),
      title: "Requested Shift",
      date: format(date!, "yyyy-MM-dd"),
      time: `${format(startTime!, "h:mm a")} – ${format(endTime!, "h:mm a")}`,
      duration: `${differenceInHours(endTime!, startTime!)}h`,
      worker: worker ? mockWorkers.find((w) => w.id === worker)?.name : undefined,
      status: "Pending",
      notes,
    };

    mockShifts.push(newShift);
    setSuccess(true);

    // Reset form
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setSupportType("");
    setWorker("");
    setNotes("");
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header */}
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700} color="var(--color-text)">
          Request a New Shift
        </Typography>
        <Typography variant="body2" color="var(--color-text-muted)">
          Fill out the details below to request a new shift. Your request will be sent
          for approval.
        </Typography>
      </Stack>

      {/* Section: Date & Time */}
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <ScheduleIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Choose Date & Time
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <DatePicker
            label="Shift Date"
            value={date}
            onChange={setDate}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon sx={{ color: "var(--color-primary)" }} />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon sx={{ color: "var(--color-primary)" }} />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              minTime={startTime || undefined}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon sx={{ color: "var(--color-primary)" }} />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </Stack>
          {startTime && endTime && isBefore(startTime, endTime) && (
            <Chip
              color="primary"
              label={`Duration: ${differenceInHours(endTime, startTime)} hours`}
              sx={{ alignSelf: "flex-start" }}
            />
          )}
          {startTime && endTime && !isBefore(startTime, endTime) && (
            <Typography color="error" variant="caption">
              End time must be after start time
            </Typography>
          )}
        </Stack>
      </Card>

      {/* Section: Support Type & Worker */}
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <PeopleIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Support Preferences
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <TextField
            select
            label="Support Type"
            value={supportType}
            onChange={(e) => setSupportType(e.target.value)}
            size="small"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon sx={{ color: "var(--color-primary)" }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">Select a type</MenuItem>
            <MenuItem value="community">Community Access</MenuItem>
            <MenuItem value="fitness">Fitness</MenuItem>
            <MenuItem value="personalCare">Personal Care</MenuItem>
            <MenuItem value="cooking">Cooking</MenuItem>
          </TextField>

          <TextField
            select
            label="Preferred Worker (optional)"
            value={worker}
            onChange={(e) => setWorker(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "var(--color-primary)" }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">No Preference</MenuItem>
            {mockWorkers.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Card>

      {/* Section: Notes */}
      <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <DescriptionIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Notes
          </Typography>
        </Stack>
        <TextField
          label="Reason / Notes"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          size="small"
          fullWidth
          multiline
          minRows={5}
          maxRows={5} // fixed height
          required
          error={!notes.trim() && notes.length > 0}
          helperText={
            !notes.trim() && notes.length > 0
              ? "Reason is required"
              : `${countWords(notes)} / ${maxWords} words`
          }
          sx={{
            height: 120,
            "& textarea": {
              overflowY: "auto !important",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <NotesIcon sx={{ color: "var(--color-primary)" }} />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {/* Sticky Submit */}
      <Box
        sx={{
          position: { xs: "fixed", sm: "static" },
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: { xs: "background.paper", sm: "transparent" },
          borderTop: { xs: "1px solid var(--color-border)", sm: "none" },
        }}
      >
        <Button
          fullWidth
          variant="contained"
          disabled={!isFormValid}
          onClick={handleSubmit}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            py: 1.3,
            fontWeight: 700,
            fontSize: "1rem",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-hover))",
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
            "&:hover": {
              background:
                "linear-gradient(135deg, var(--color-hover), var(--color-primary))",
              boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
            },
            "&.Mui-disabled": {
              color: "var(--color-text-hover)",                     // text stays white
              boxShadow: "none",
              opacity: 0.7,
            },
          }}
        >
          Submit Request
        </Button>

      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Shift request submitted successfully! (Pending Approval)
        </Alert>
      </Snackbar>
    </Box>
  );
}
