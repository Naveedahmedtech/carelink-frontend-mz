import React, { useState } from "react";
import { Box, Typography, Paper, Chip, Button } from "@mui/material";
import { format } from "date-fns";
import ShiftDetailsModal from "../../../../components/shifts/ShiftDetailsModal";
import { mockShifts, Shift } from "../../../../utils";

export default function TrainerReportsPage() {
  // Filter pending shifts
  const pendingReports = mockShifts.filter(
    (s) => s.status === "In Progress"
  );

  // Modal state
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenReport = (shift: Shift) => {
    setSelectedShift(shift);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedShift(null);
    setModalOpen(false);
  };

  return (
    <Box className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Typography variant="h5" className="font-bold text-gray-900">
        Shift Reports
      </Typography>
      <Typography className="text-gray-500 text-sm">
        You have {pendingReports.length} reports to complete
      </Typography>

      {/* Pending List */}
      <Box className="space-y-4">
        {pendingReports.length ? (
          pendingReports.map((shift) => (
            <Paper
              key={shift.id}
              className="p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition"
            >
              {/* Left info */}
              <Box className="flex items-center gap-3">
                <Chip
                  label={format(new Date(shift.date), "dd MMM")}
                  color="primary"
                  size="small"
                />
                <div>
                  <Typography className="font-medium text-gray-900">
                    {shift.title}
                  </Typography>
                  <Typography className="text-sm text-gray-500">
                    {shift.time} · {shift.participant}
                  </Typography>
                </div>
              </Box>

              {/* Right actions */}
              <Box className="mt-3 sm:mt-0">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleOpenReport(shift)}
                >
                  Fill Report
                </Button>
              </Box>
            </Paper>
          ))
        ) : (
          <Paper className="p-6 rounded-xl text-center shadow-sm">
            <Typography className="text-gray-600">
              🎉 No pending reports — you’re all caught up!
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Report Modal */}
      <ShiftDetailsModal
        open={modalOpen}
        shift={selectedShift}
        role="trainer"
        onClose={handleCloseModal}
        onClockOut={(shift, report) =>
          console.log("Report submitted ✅", shift, report)
        }
      />
    </Box>
  );
}
