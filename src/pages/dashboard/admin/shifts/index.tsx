// src/pages/admin/ShiftRequestsPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Box, Stack, Typography, Snackbar, Alert } from "@mui/material";
import {
  // ❌ remove: useApproveShiftRequestMutation,
  useDeclineShiftRequestMutation,
  useGetShiftRequestsQuery,
} from "../../../../redux/features/shiftApi";
import FiltersBar, { AdminStatus } from "../../../../components/admin/shift-requests/FiltersBar";
import RequestsTable from "../../../../components/admin/shift-requests/RequestsTable";
import PaginationBar from "../../../../components/admin/shift-requests/PaginationBar";
import AssignDialog from "../../../../components/admin/shift-requests/AssignDialog";

interface AssignState {
  open: boolean;
  requestId?: string;
  preferredTrainerIds?: string[];
  trainerId: string;
}

export default function ShiftRequestsPage() {
  // Filters & pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<AdminStatus | "">("PENDING_ADMIN");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [sort, setSort] = useState<"createdAt:desc" | "createdAt:asc" | "start:asc" | "start:desc">("createdAt:desc");

  // Data
  const { data, isLoading, isFetching, refetch } = useGetShiftRequestsQuery({
    page,
    limit,
    status: status ? [status] : undefined,
    q: q || undefined,
    dateFrom: dateFrom ? dateFrom.toISOString() : undefined,
    dateTo: dateTo ? dateTo.toISOString() : undefined,
    sort,
  });

  // Mutations
  // ❌ remove approve hook (dialog handles it)
  // const [approveShift, { isLoading: isApproving }] = useApproveShiftRequestMutation();
  const [declineShift, { isLoading: isDeclining }] = useDeclineShiftRequestMutation();

  // UI state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [assign, setAssign] = useState<AssignState>({
    open: false,
    trainerId: "",
  });

  const pagination = data?.data?.pagination || data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  };

  const rows = useMemo(() => (data?.data?.data || data?.data || []), [data]);

  useEffect(() => {
    let t: any;
    if (successMsg) t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const handleClearFilters = () => {
    setStatus("PENDING_ADMIN");
    setQ("");
    setDateFrom(null);
    setDateTo(null);
    setSort("createdAt:desc");
    setPage(1);
  };

  const openAssignDialog = (row: any) => {
    const preferred = (row?.preferredTrainerIds || []).map((id: any) => id?.toString?.() || id);
    setAssign({
      open: true,
      requestId: row?._id,
      preferredTrainerIds: preferred,
      trainerId: preferred?.[0] || "",
    });
  };

  const closeAssignDialog = () =>
    setAssign({ open: false, trainerId: "" });

  // ❌ remove doApprove – handled inside AssignDialog

  const doDecline = async (requestId: string) => {
    try {
      await declineShift({ requestId, reason: "Declined by admin" }).unwrap();
      setSuccessMsg("Shift request declined.");
      refetch();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.error || "Failed to decline request.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack spacing={0.5} mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Shift Requests
        </Typography>
        <Typography variant="body2" color="var(--color-text-muted)">
          Review, approve, or decline participant shift requests.
        </Typography>
      </Stack>

      <FiltersBar
        status={status}
        setStatus={(v) => { setStatus(v); setPage(1); }}
        q={q}
        setQ={(v) => { setQ(v); setPage(1); }}
        dateFrom={dateFrom}
        setDateFrom={(v) => { setDateFrom(v); setPage(1); }}
        dateTo={dateTo}
        setDateTo={(v) => { setDateTo(v); setPage(1); }}
        sort={sort}
        setSort={(v) => { setSort(v); setPage(1); }}
        onApply={() => refetch()}
        onClear={handleClearFilters}
        isBusy={isLoading || isFetching}
      />

      <RequestsTable
        rows={rows}
        isLoading={isLoading}
        isFetching={isFetching}
        limit={limit}
        onOpenAssign={openAssignDialog}
        onDecline={doDecline}
        isApproving={false}                 // ✅ no longer needed by dialog, keep false if prop required
        isDeclining={isDeclining}
        pagination={pagination}
        footer={
          <PaginationBar
            pagination={pagination}
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
          />
        }
      />

      <AssignDialog
        open={assign.open}
        requestId={assign.requestId!}       
        preferredTrainerIds={assign.preferredTrainerIds}
        trainerId={assign.trainerId}
        setTrainerId={(v) => setAssign((s) => ({ ...s, trainerId: v }))}
        onClose={closeAssignDialog}
        onApproved={() => {                 {/* ✅ parent reacts after dialog approves */}
          setSuccessMsg("Shift request approved & assigned.");
          refetch();
        }}
      />

      <Snackbar
        open={!!successMsg}
        onClose={() => setSuccessMsg(null)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ borderRadius: 2 }}>
          {successMsg}
        </Alert>
      </Snackbar>

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
    </Box>
  );
}
