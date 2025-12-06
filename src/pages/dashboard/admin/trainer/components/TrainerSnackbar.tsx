import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface TrainerSnackbarProps {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function TrainerSnackbar({
  open,
  type,
  message,
  onClose,
}: TrainerSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
