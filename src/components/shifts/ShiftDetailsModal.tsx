import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { getStatusStyle, Shift } from "../../utils";

type Role = "participant" | "trainer" | "admin";

type Props = {
  open: boolean;
  shift: Shift | null;
  role: Role;
  onClose: () => void;

  // participant actions
  onCancelShift?: (shift: Shift, reason: string) => void;
  onRequestChange?: (shift: Shift) => void;

  // trainer actions
  onClockIn?: (shift: Shift) => void;
  onClockOut?: (shift: Shift, report: any) => void;

  // admin actions
  onApproveShift?: (shift: Shift) => void;
  onReassignShift?: (shift: Shift) => void;
  onAdminCancel?: (shift: Shift) => void;
};

export default function ShiftDetailsModal({
  open,
  shift,
  role,
  onClose,
  onCancelShift,
  onRequestChange,
  onClockIn,
  onClockOut,
  onApproveShift,
  onReassignShift,
  onAdminCancel,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // cancel state
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // trainer report modal state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    activities: "",
    progress: "",
    incidents: "",
    km: "",
  });

  if (!shift) return null;

  const handleConfirmCancel = () => {
    if (role === "participant" && onCancelShift) {
      onCancelShift(shift, cancelReason);
    }
    if (role === "admin" && onAdminCancel) {
      onAdminCancel(shift);
    }
    setCancelReason("");
    setConfirmCancelOpen(false);
    onClose();
  };

  const handleClockOut = () => {
    if (onClockOut) {
      onClockOut(shift, reportForm);
      setReportForm({ activities: "", progress: "", incidents: "", km: "" });
    }
    setReportOpen(false);
    onClose();
  };


  return (
    <>
      {/* Main Modal */}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: isMobile ? "24px 24px 0 0" : 4,
            background: "var(--color-background)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
            m: { xs: 0, sm: 2 },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid var(--color-border)",
            bgcolor: "var(--color-background-shade-1)",
          }}
        >
          <Typography variant="h6" fontWeight={800} color="var(--color-text)">
            {shift.title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "var(--color-text-muted)",
              "&:hover": { bgcolor: "var(--color-hover)" },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent sx={{ py: 4, px: 3 }}>
          <Stack spacing={3}>
            {[
              {
                icon: <AccessTimeIcon color="primary" fontSize="small" />,
                label: "Date & Time",
                value: `${shift.date} — ${shift.time}`,
              },
              {
                icon: <TimelapseIcon color="primary" fontSize="small" />,
                label: "Duration",
                value: shift.duration,
              },
              shift.worker && {
                icon: <PersonIcon color="primary" fontSize="small" />,
                label: "Trainer",
                value: shift.worker,
              },
              shift.participant && {
                icon: <EventSeatIcon color="primary" fontSize="small" />,
                label: "Participant",
                value: shift.participant,
              },
            ]
              .filter(Boolean)
              .map((item: any, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "var(--color-background-shade-2)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {item.icon}
                  <Box>
                    <Typography fontSize={13} color="var(--color-text-muted)">
                      {item.label}
                    </Typography>
                    <Typography fontWeight={600} color="var(--color-text)">
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}

            {/* Status */}
            <Chip
              label={shift.status}
              sx={{
                alignSelf: "flex-start",
                fontWeight: 700,
                px: 2,
                py: 0.6,
                borderRadius: "999px",
                fontSize: "0.85rem",
                color: "#fff",
                background: getStatusStyle(shift.status),
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            />

            {/* Completed Report (read-only) */}
            {role === "trainer" && shift.status === "Completed" && (
              <Stack spacing={2}>
                <Typography fontWeight={700}>Submitted Shift Report</Typography>
                <Typography>Activities: {reportForm.activities || "N/A"}</Typography>
                <Typography>Progress: {reportForm.progress || "N/A"}</Typography>
                <Typography>Incidents: {reportForm.incidents || "N/A"}</Typography>
                <Typography>Kilometres: {reportForm.km || "0"} km</Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 3,
            borderTop: "1px solid var(--color-border)",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          {/* Participant actions */}
          {role === "participant" &&
            !["Cancelled", "Completed"].includes(shift.status) && (
              <>
                <Button
                  color="error"
                  variant="outlined"
                  fullWidth
                  onClick={() => setConfirmCancelOpen(true)}
                >
                  Cancel Shift
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onRequestChange?.(shift)}
                >
                  Request Change
                </Button>
              </>
            )}

          {/* Trainer actions */}
          {role === "trainer" && (
            <>
              {(shift.status === "Pending") && role === "trainer" && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onClockIn?.(shift)}
                >
                  Clock In
                </Button>
              )}
              {shift.status === "In Progress" && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setReportOpen(true)}
                >
                  Clock Out
                </Button>
              )}
            </>
          )}

          {/* Admin actions */}
          {role === "admin" && (
            <>
              {shift.status === "Pending" && (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => onApproveShift?.(shift)}
                >
                  Approve & Assign
                </Button>
              )}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => onReassignShift?.(shift)}
              >
                Reassign
              </Button>
              {shift.status !== "Cancelled" && (
                <Button
                  color="error"
                  fullWidth
                  onClick={() => setConfirmCancelOpen(true)}
                >
                  Cancel Shift
                </Button>
              )}
            </>
          )}

          <Button onClick={onClose} fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Confirm Cancellation
          </Typography>
          <Typography variant="body2" color="var(--color-text-muted)" mb={2}>
            {role === "participant"
              ? "Please provide a reason for cancelling this shift:"
              : "Are you sure you want to cancel this shift?"}
          </Typography>

          {role === "participant" && (
            <TextField
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              fullWidth
              placeholder="Enter reason"
              multiline
              minRows={3}
            />
          )}
        </DialogContent>
        <DialogActions
          sx={{ gap: 1.5, px: 3, pb: 3, flexDirection: "column" }}
        >
          <Button
            onClick={handleConfirmCancel}
            disabled={role === "participant" && !cancelReason.trim()}
            variant="contained"
            color="error"
            fullWidth
          >
            Confirm Cancel
          </Button>
          <Button
            onClick={() => setConfirmCancelOpen(false)}
            fullWidth
            sx={{ color: "var(--color-text-muted)" }}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trainer Report Modal */}
      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Shift Report
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Activities Completed"
              value={reportForm.activities}
              onChange={(e) =>
                setReportForm({ ...reportForm, activities: e.target.value })
              }
              multiline
              minRows={2}
            />
            <TextField
              label="Client Progress"
              value={reportForm.progress}
              onChange={(e) =>
                setReportForm({ ...reportForm, progress: e.target.value })
              }
              multiline
              minRows={2}
            />
            <TextField
              label="Incidents / Behavioural Notes"
              value={reportForm.incidents}
              onChange={(e) =>
                setReportForm({ ...reportForm, incidents: e.target.value })
              }
              multiline
              minRows={2}
            />
            <TextField
              label="Kilometres Driven"
              value={reportForm.km}
              onChange={(e) =>
                setReportForm({ ...reportForm, km: e.target.value })
              }
              type="number"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ gap: 1.5, px: 3, pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleClockOut}
            disabled={!reportForm.activities.trim()}
          >
            Submit Report & Clock Out
          </Button>
          <Button onClick={() => setReportOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
