// src/pages/admin/TrainerListPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Stack,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useGetAllTrainersQuery,
  useUpdateTrainerStatusMutation,
} from "../../../../redux/features/trainerApi";

export default function TrainerListPage() {
  // Filters
  const [q, setQ] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  // Confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [pendingStatus, setPendingStatus] = useState<string>("");

  // Snackbar feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, error, isLoading, refetch, isFetching } =
    useGetAllTrainersQuery({
      page: page + 1,
      limit,
      q,
      email,
      status,
    });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateTrainerStatusMutation();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderStatusChip = (status: string) => {
    const map: Record<string, { label: string; color: any }> = {
      ACTIVE: { label: "Active", color: "success" },
      PENDING: { label: "Pending", color: "warning" },
      BLOCKED: { label: "Blocked", color: "error" },
      DELETED: { label: "Deleted", color: "default" },
    };
    const s = map[status] || { label: status, color: "default" };
    return <Chip label={s.label} color={s.color} size="small" />;
  };

  const askConfirmation = (trainer: any, newStatus: string) => {
    if (trainer.status === newStatus) return; // no-op if same
    setSelectedTrainer(trainer);
    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedTrainer || !pendingStatus) return;
    try {
      await updateStatus({
        id: selectedTrainer._id,
        status: pendingStatus,
      }).unwrap();
      setSnackbar({
        open: true,
        type: "success",
        message: "Status updated successfully",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Failed to update status",
      });
    }
    setConfirmOpen(false);
    setSelectedTrainer(null);
    setPendingStatus("");
  };

  // Extract trainers safely
  const trainers = data?.data?.data ?? [];
  const pagination = data?.data?.pagination ?? { total: 0 };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Trainers Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            label="Search (name or email)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="Email contains"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            fullWidth
          />

          <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="BLOCKED">Blocked</MenuItem>
              <MenuItem value="DELETED">Deleted</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setQ("");
                setEmail("");
                setStatus("");
                setPage(0);
                refetch();
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPage(0);
                refetch();
              }}
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper>
        {isLoading || isFetching ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography p={2} color="error">
            Error loading trainers
          </Typography>
        ) : trainers.length === 0 ? (
          <Typography p={2}>No trainers found</Typography>
        ) : (
          <>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Onboarding Step</TableCell>
                    <TableCell align="right">Change Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainers.map((trainer: any) => (
                    <TableRow key={trainer._id}>
                      <TableCell>{trainer.email}</TableCell>
                      <TableCell>{trainer.trainer?.fullName || "-"}</TableCell>
                      <TableCell>{trainer.trainer?.phone || "-"}</TableCell>
                      <TableCell>{renderStatusChip(trainer.status)}</TableCell>
                      <TableCell>{trainer.trainer?.onboardingStep}</TableCell>
                      <TableCell align="right">
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                          <Select
                            value={trainer.status}
                            disabled={isUpdating}
                            onChange={(e) =>
                              askConfirmation(trainer, e.target.value)
                            }
                          >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="BLOCKED">Blocked</MenuItem>
                            <MenuItem value="DELETED">Deleted</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={pagination.total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          Are you sure you want to change{" "}
          <strong>
            {selectedTrainer?.trainer?.fullName || selectedTrainer?.email}
          </strong>{" "}
          to status <strong>{pendingStatus}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
