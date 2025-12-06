import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface TrainerStatusDialogProps {
  open: boolean;
  trainer: any;
  pendingStatus: string;
  isUpdating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TrainerStatusDialog({
  open,
  trainer,
  pendingStatus,
  isUpdating,
  onClose,
  onConfirm,
}: TrainerStatusDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        Are you sure you want to change{" "}
        <strong>{trainer?.trainer?.fullName || trainer?.email}</strong> to status{" "}
        <strong>{pendingStatus}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
