import React from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
  Button,
} from "@mui/material";
import UpcomingShiftsCalendar from "../../../../components/common/Calendar";
import { useGetTrainerShiftRequestsQuery } from "../../../../redux/features/shiftApi";

// Match the server response for trainer "mine"
type ApiPerson = {
  _id: string;
  fullName: string;
  phone?: string;
  email?: string;
};

export type ApiShift = {
  _id: string;
  service: string;
  start: string; // ISO
  end: string;   // ISO
  notes?: string;
  status: string; // e.g. "APPROVED" | "PENDING" | "DECLINED"
  createdAt: string;
  participant?: ApiPerson; // present for trainer view
  trainer?: ApiPerson;     // may be absent here (used for participant view)
};

export default function DashboardCalendar() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetTrainerShiftRequestsQuery({
      page: 1,
      limit: 100,
      status: "APPROVED", // if your API supports this filter
      // dateFrom: "2025-01-01",
      // dateTo: "2025-12-31",
      // sort: "-start",
    });

  // API shape:
  // {
  //   success: true,
  //   message: "...",
  //   data: { data: ApiShift[], pagination: {...} }
  // }
  const shifts: ApiShift[] = React.useMemo(
    () => data?.data?.data ?? [],
    [data]
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        {isLoading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              Couldn’t load your upcoming shifts. Please try again.
            </Alert>
            <Button onClick={() => refetch()} disabled={isFetching} variant="contained">
              {isFetching ? "Refreshing…" : "Retry"}
            </Button>
          </Box>
        ) : (
          // ✅ Pass raw API list — UpcomingShiftsCalendar handles mapping & role-specific UI
          <UpcomingShiftsCalendar role="trainer" shifts={shifts} refetch={refetch} />
        )}
      </CardContent>
    </Card>
  );
}
