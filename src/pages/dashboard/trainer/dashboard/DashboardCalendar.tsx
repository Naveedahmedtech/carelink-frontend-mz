import React from "react";
import { Card, CardContent } from "@mui/material";
import UpcomingShiftsCalendar from "../../../../components/common/Calendar";

export default function DashboardCalendar() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        <UpcomingShiftsCalendar role="trainer" />
      </CardContent>
    </Card>
  );
}
