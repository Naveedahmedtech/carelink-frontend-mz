import React, { useMemo, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { getStatusStyle } from "../../utils";
import type { UiShift } from "../common/Calendar";
import {
  useClockInShiftMutation,
  useClockOutShiftMutation,
} from "../../redux/features/shiftApi";

type Role = "participant" | "trainer" | "admin";

type Props = {
  open: boolean;
  shift: UiShift | null;
  role: Role;
  onClose: () => void;

  // participant actions
  onCancelShift?: (shift: UiShift, reason: string) => void;
  onRequestChange?: (shift: UiShift) => void;

  // trainer actions
  onClockIn?: (shift: UiShift) => void;
  onClockOut?: (shift: UiShift, report: any) => void;

  // admin actions
  onApproveShift?: (shift: UiShift) => void;
  onReassignShift?: (shift: UiShift) => void;
  onAdminCancel?: (shift: UiShift) => void;
};

/** ===== Helpers ===== */
const norm = (s?: string) => (s || "").toLowerCase().replace(/\s+/g, "_");

// getStatusStyle can return a color string or { bg }
const statusBg = (status: string) => {
  const style = getStatusStyle(norm(status));
  return typeof style === "string" ? style : style?.bg || "#666";
};

const fmtDateTimeRange = (startISO?: string, endISO?: string) => {
  if (!startISO || !endISO) return "";
  const start = new Date(startISO);
  const end = new Date(endISO);

  const dateFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(start);

  const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateFmt} — ${timeFmt.format(start)} to ${timeFmt.format(end)}`;
};

const fmtDuration = (startISO?: string, endISO?: string) => {
  if (!startISO || !endISO) return "";
  const ms = Math.max(0, new Date(endISO).getTime() - new Date(startISO).getTime());
  const mins = Math.round(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

const pretty = (s?: string) =>
  (s || "unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Core status derivation */
const getReqStatus = (s?: UiShift | null) => norm(s?.status);
const getOpStatus = (s?: UiShift | null) => norm(s?.raw?.shift?.status);
const getDisplayStatus = (s?: UiShift | null) => getOpStatus(s) || getReqStatus(s);

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
  refetch
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [clockIn, { isLoading: isClockingIn }] = useClockInShiftMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutShiftMutation();

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

  /** ===== Derived data (hooks always run) ===== */
  const reqStatus = useMemo(() => getReqStatus(shift), [shift]);
  const opStatus = useMemo(() => getOpStatus(shift), [shift]);
  const displayStatus = useMemo(() => getDisplayStatus(shift), [shift]);
  const isClockedInFlag = !!shift?.raw?.isClockedIn;

  const isPendingReq = ["pending"].includes(reqStatus);
  const isApprovedReq = ["approved"].includes(reqStatus);
  const isCancelledReq = ["cancelled", "canceled", "declined"].includes(reqStatus);

  const isInProgressOp = ["in_progress", "started", "active"].includes(opStatus);
  const isCompletedOp = ["completed", "done"].includes(opStatus);

  const isCancelled =
    isCancelledReq ||
    displayStatus === "cancelled" ||
    displayStatus === "canceled";
  const isCompleted =
    isCompletedOp ||
    displayStatus === "completed" ||
    displayStatus === "done";

  const dateTimeLabel = useMemo(
    () => fmtDateTimeRange(shift?.start, shift?.end),
    [shift?.start, shift?.end]
  );
  const durationLabel = useMemo(
    () => fmtDuration(shift?.start, shift?.end),
    [shift?.start, shift?.end]
  );

  /** ===== Action availability (single source of truth) ===== */
  const actions = useMemo(() => {
    const canMutate = !isCancelled && !isCompleted;

    // TRAINER
    const trainerCanClockOut = !!shift && (isInProgressOp || isClockedInFlag);
    const trainerCanClockIn =
      !!shift &&
      canMutate &&
      !trainerCanClockOut &&
      (isApprovedReq || isPendingReq || (!opStatus && !isClockedInFlag));

    // PARTICIPANT
    const participantCanCancel = !!shift && canMutate;
    const participantCanRequestChange = !!shift && canMutate;

    // ADMIN
    const adminCanApproveAssign = !!shift && isPendingReq;
    const adminCanReassign = !!shift && !isCancelled && !isCompleted;
    const adminCanCancel = !!shift && !isCancelled;

    return {
      trainerCanClockIn,
      trainerCanClockOut,
      participantCanCancel,
      participantCanRequestChange,
      adminCanApproveAssign,
      adminCanReassign,
      adminCanCancel,
    };
  }, [
    shift,
    isCancelled,
    isCompleted,
    isInProgressOp,
    isClockedInFlag,
    isApprovedReq,
    isPendingReq,
    opStatus,
  ]);

  /** ===== Handlers ===== */
  const handleConfirmCancel = () => {
    if (!shift) return;
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

  const handleClockOut = async () => {
    if (!shift) return;



    try {
      await clockOut({
        requestId: shift.id,
        report: {
          activities: reportForm.activities,
          progress: reportForm.progress,
          incidents: reportForm.incidents,
          km: reportForm.km,
        },
      }).unwrap();

      setReportForm({ activities: "", progress: "", incidents: "", km: "" });
      setReportOpen(false);
      refetch()
      onClose();
    } catch (err) {
      console.error("Clock-out failed", err);
    }
  };

  const handleClockInClick = async () => {
    if (!shift) return;


    try {
      await clockIn({ requestId: shift.id }).unwrap();
      refetch()
      onClose();
    } catch (err) {
      console.error("Clock-in failed", err);
    }
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
            {shift?.title || "Shift Details"}
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
                value: dateTimeLabel,
              },
              {
                icon: <TimelapseIcon color="primary" fontSize="small" />,
                label: "Duration",
                value: durationLabel,
              },
              shift?.participant && {
                icon: <EventSeatIcon color="primary" fontSize="small" />,
                label: "Participant",
                value: shift.participant.fullName,
              },
              shift?.trainer && {
                icon: <PersonIcon color="primary" fontSize="small" />,
                label: "Trainer",
                value: shift.trainer.fullName,
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

            {/* Status chip */}
            <Chip
              label={pretty(displayStatus)}
              sx={{
                alignSelf: "flex-start",
                fontWeight: 700,
                px: 2,
                py: 0.6,
                borderRadius: "999px",
                fontSize: "0.85rem",
                color: "#fff",
                background: statusBg(displayStatus || "unknown"),
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            />

            {/* Notes */}
            {!!shift?.notes && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid var(--color-border)",
                  bgcolor: "var(--color-background-shade-2)",
                }}
              >
                <Typography fontWeight={700} mb={0.5}>
                  Notes
                </Typography>
                <Typography>{shift.notes}</Typography>
              </Box>
            )}

            {/* Completed Report (placeholder) */}
            {role === "trainer" && isCompleted && (
              <Stack spacing={2}>
                <Typography fontWeight={700}>Submitted Shift Report</Typography>
                <Typography>Activities: —</Typography>
                <Typography>Progress: —</Typography>
                <Typography>Incidents: —</Typography>
                <Typography>Kilometres: 0 km</Typography>
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
          {role === "participant" && (
            <>
              {/* {actions.participantCanCancel && (
                <Button
                  color="error"
                  variant="outlined"
                  fullWidth
                  onClick={() => setConfirmCancelOpen(true)}
                >
                  Cancel Shift
                </Button>
              )} */}
              {/* {actions.participantCanRequestChange && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => shift && onRequestChange?.(shift)}
                >
                  Request Change
                </Button>
              )} */}
            </>
          )}

          {/* Trainer actions */}
          {role === "trainer" && (
            <>
              {actions.trainerCanClockIn && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleClockInClick}
                  disabled={isClockingIn}
                  startIcon={isClockingIn ? <CircularProgress size={18} /> : null}
                >
                  {isClockingIn ? "Clocking In..." : "Clock In"}
                </Button>
              )}
              {actions.trainerCanClockOut && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setReportOpen(true)}
                  disabled={isClockingOut}
                >
                  Clock Out
                </Button>
              )}
            </>
          )}

          {/* Admin actions */}
          {role === "admin" && (
            <>
              {actions.adminCanApproveAssign && (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => shift && onApproveShift?.(shift)}
                >
                  Approve &amp; Assign
                </Button>
              )}
              {actions.adminCanReassign && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => shift && onReassignShift?.(shift)}
                >
                  Reassign
                </Button>
              )}
              {actions.adminCanCancel && (
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
        </DialogContent>
        <DialogContent>
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
            disabled={!reportForm.activities.trim() || isClockingOut}
            startIcon={isClockingOut ? <CircularProgress size={18} /> : null}
          >
            {isClockingOut ? "Submitting..." : "Submit Report & Clock Out"}
          </Button>

          <Button onClick={() => setReportOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
