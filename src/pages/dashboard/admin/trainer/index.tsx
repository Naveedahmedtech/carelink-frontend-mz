import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import {
  useGetAllTrainersQuery,
  useUpdateTrainerStatusMutation,
} from "../../../../redux/features/trainerApi";
import TrainerFilters from "./components/TrainerFilters";
import TrainerTable from "./components/TrainerTable";
import TrainerStatusDialog from "./components/TrainerStatusDialog";
import TrainerSnackbar from "./components/TrainerSnackbar";
import TrainerDetailsDialog from "./components/TrainerDetailsDialog";

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

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTrainer, setDetailsTrainer] = useState<any>(null);

  const handleViewDetails = (trainer: any) => {
    setDetailsTrainer(trainer);
    setDetailsOpen(true);
  };

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

  const askConfirmation = (trainer: any, newStatus: string) => {
    if (trainer.status === newStatus) return;
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
    } catch {
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

  const trainers = data?.data?.data ?? [];
  const pagination = data?.data?.pagination ?? { total: 0 };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Trainers Management
      </Typography>

      {/* Filters */}
      <TrainerFilters
        q={q}
        email={email}
        status={status}
        setQ={setQ}
        setEmail={setEmail}
        setStatus={setStatus}
        onReset={() => {
          setQ("");
          setEmail("");
          setStatus("");
          setPage(0);
          refetch();
        }}
        onApply={() => {
          setPage(0);
          refetch();
        }}
      />

      {/* Data Table */}
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
        <TrainerTable
          trainers={trainers}
          pagination={pagination}
          page={page}
          limit={limit}
          isMobile={isMobile}
          isUpdating={isUpdating}
          onPageChange={setPage}
          onRowsPerPageChange={(val) => {
            setLimit(val);
            setPage(0);
          }}
          onStatusChange={askConfirmation}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Confirmation Dialog */}
      <TrainerStatusDialog
        open={confirmOpen}
        trainer={selectedTrainer}
        pendingStatus={pendingStatus}
        isUpdating={isUpdating}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      {/* Snackbar Notifications */}
      <TrainerSnackbar
        open={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <TrainerDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        trainer={detailsTrainer}
      />

    </Box>
  );
}
