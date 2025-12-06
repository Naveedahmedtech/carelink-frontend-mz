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
import { useGetParticipantShiftRequestsQuery } from "../../../../redux/features/shiftApi";

export default function UpcomingParticipantShiftsCalendar() {
  // 🔹 Fetch participant’s own shift requests
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetParticipantShiftRequestsQuery({
    page: 1,
    limit: 100,
    status: "APPROVED", // optionally filter if your API supports it
  });

  // API shape:
  // {
  //   success: true,
  //   message: "Participant shift requests",
  //   data: {
  //     data: [ { _id, service, start, end, notes, status, createdAt, trainer? } ],
  //     pagination: { ... }
  //   }
  // }

  const shifts = React.useMemo(() => data?.data?.data ?? [], [data]);

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
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="contained"
            >
              {isFetching ? "Refreshing…" : "Retry"}
            </Button>
          </Box>
        ) : (
          // ✅ Pass participant’s shift data to the calendar
          <UpcomingShiftsCalendar role="participant" shifts={shifts} refetch={refetch} />
        )}
      </CardContent>
    </Card>
  );
}
