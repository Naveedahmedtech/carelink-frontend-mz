import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/features/authSlice";

type LogoutConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LogoutConfirmDialog({
  open,
  onClose,
}: LogoutConfirmDialogProps) {
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(logoutSuccess());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      {/* Close button top-right */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "var(--color-text-muted)",
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          gap: 1,
          pb: 0,
        }}
      >
        <WarningAmberRoundedIcon
          color="error"
          sx={{ fontSize: 48, mb: 1 }}
        />
        <Typography variant="h6" fontWeight={700}>
          Confirm Logout
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to log out? You’ll need to log in again to access your dashboard.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.25)" },
          }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
