import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { format } from "date-fns";
import { useAppSelector } from "../../../../redux/store";
import { getMockTimesheet } from "../../../../utils";
import DownloadIcon from "@mui/icons-material/Download";

// Dummy trainers for Admin dropdown
const mockTrainerList = ["trainer-1", "trainer-2", "trainer-3"];

export default function TimesheetPage() {
  const { userData } = useAppSelector((state) => state.auth);
  const role = userData.role;
  const trainerId = userData.id || "mock-trainer";

  const [selectedTrainer, setSelectedTrainer] = useState<string>(
    role === "trainer" ? trainerId : mockTrainerList[0]
  );

  const timesheet = getMockTimesheet(selectedTrainer);

  return (
    <Box className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h5" className="font-bold text-gray-900">
            {role === "admin" ? "Trainer Timesheets" : "My Timesheet"}
          </Typography>
          <Typography className="text-gray-500 text-sm">
            {format(new Date(timesheet.weekStart), "dd MMM")} –{" "}
            {format(new Date(timesheet.weekEnd), "dd MMM yyyy")}
          </Typography>
        </div>

        {/* ADMIN ONLY: Trainer Selector */}
        {role === "admin" && (
          <FormControl size="small" className="min-w-[200px]">
            <InputLabel>Trainer</InputLabel>
            <Select
              value={selectedTrainer}
              label="Trainer"
              onChange={(e) => setSelectedTrainer(e.target.value)}
            >
              {mockTrainerList.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* SUMMARY CARDS */}
      <Box className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Paper className="p-4 rounded-2xl shadow-sm">
          <Typography className="text-sm text-gray-500">Total Hours</Typography>
          <Typography className="text-2xl font-semibold text-gray-900">
            {timesheet.totalHours}
          </Typography>
        </Paper>
        <Paper className="p-4 rounded-2xl shadow-sm">
          <Typography className="text-sm text-gray-500">Total KM</Typography>
          <Typography className="text-2xl font-semibold text-gray-900">
            {timesheet.totalKilometres}
          </Typography>
        </Paper>
        <Paper className="p-4 rounded-2xl shadow-sm">
          <Typography className="text-sm text-gray-500">Clients</Typography>
          <Typography className="text-2xl font-semibold text-gray-900">
            {new Set(timesheet.entries.map((e) => e.clientId)).size}
          </Typography>
        </Paper>
        <Paper className="p-4 rounded-2xl shadow-sm">
          <Typography className="text-sm text-gray-500">Shifts</Typography>
          <Typography className="text-2xl font-semibold text-gray-900">
            {timesheet.entries.length}
          </Typography>
        </Paper>
      </Box>

      {/* TIMELINE LIST */}
      <Box className="space-y-4">
        {timesheet.entries.map((entry) => (
          <Paper
            key={entry.id}
            className="p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition"
          >
            <Box className="flex items-center gap-3">
              <Chip
                label={format(new Date(entry.date), "dd MMM")}
                color="primary"
                size="small"
              />
              <div>
                <Typography className="font-medium text-gray-900">
                  {entry.clientId}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  {entry.startTime} – {entry.endTime}
                </Typography>
              </div>
            </Box>

            <Box className="flex gap-6 mt-3 sm:mt-0">
              <Typography className="text-sm">
                <b>{entry.hours}</b> hrs
              </Typography>
              <Typography className="text-sm">
                <b>{entry.kilometres}</b> km
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* FLOATING ACTIONS */}
      <Box className="fixed bottom-6 right-6 flex gap-3">
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          className="rounded-full shadow-lg"
        >
          PDF
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadIcon />}
          className="rounded-full"
        >
          CSV
        </Button>
      </Box>
    </Box>
  );
}
