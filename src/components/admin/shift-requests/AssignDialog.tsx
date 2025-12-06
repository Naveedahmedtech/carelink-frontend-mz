// src/components/admin/shift-requests/AssignDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Divider,
  Alert,
  Button,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SearchTrainerField from "./SearchTrainerField";
import { useApproveShiftRequestMutation } from "../../../redux/features/shiftApi";

type Props = {
  open: boolean;
  requestId: string;                 // 🔸 needed to approve
  preferredTrainerIds?: string[];
  trainerId: string;                 // controlled from parent (keep UX the same)
  setTrainerId: (v: string) => void; // "
  onClose: () => void;
  onApproved?: () => void;           // optional: parent can refetch list, show toast, etc.
};

const isObjectId = (v: string) => /^[0-9a-fA-F]{24}$/.test(v);

export default function AssignDialog({
  open,
  requestId,
  preferredTrainerIds,
  trainerId,
  setTrainerId,
  onClose,
  onApproved,
}: Props) {
  const [approveShift, { isLoading: isApproving }] = useApproveShiftRequestMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClose = () => {
    setTrainerId("");
    onClose();
  };

  const handleApprove = async () => {
    if (!trainerId || !isObjectId(trainerId)) {
      setErrorMsg("Please select a valid Trainer.");
      return;
    }
    try {
      await approveShift({ requestId, trainerId }).unwrap(); // 🔥 API call here
      if (onApproved) onApproved();
      handleClose();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.error || "Failed to approve request.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Approve & Assign Trainer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {preferredTrainerIds?.length ? (
              <TextField
                select
                label="Preferred Trainer (optional)"
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                size="small"
                fullWidth
                helperText="Select from participant-preferred trainers or use search below."
              >
                {preferredTrainerIds.map((tid) => (
                  <MenuItem key={tid} value={tid}>
                    {tid}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <>
                {/* This request has no preferred trainers. */}
              </>
            )}

            {/* Trainer search via trainerApi (ACTIVE users only) */}
            <SearchTrainerField
              value={trainerId}
              onChange={(id) => setTrainerId(id)}
              label="Find Trainer"
              placeholder="Type a trainer name or email…"
              onlyActive
            />

            {/* Optional guidance if the selected id looks wrong */}
            {trainerId && !isObjectId(trainerId) && (
              <Alert severity="warning" variant="outlined">
                Selected Trainer ID looks invalid. Please pick a trainer from search.
              </Alert>
            )}

            <Divider />

            {/* Manual field hidden by default, keep for future debugging */}
            <TextField
              label="Trainer ID (manual)"
              placeholder="e.g. 652a7b9b4c1f..."
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIndIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Paste a valid Trainer ObjectId (optional override)."
              sx={{ display: "none" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={!trainerId || !isObjectId(trainerId) || isApproving}
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-hover))",
            }}
          >
            {isApproving ? "Approving…" : "Approve & Assign"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!errorMsg}
        onClose={() => setErrorMsg(null)}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
