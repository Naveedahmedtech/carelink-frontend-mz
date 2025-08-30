import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography } from "@mui/material";
import './Calendar.css'
import { getStatusStyle, mockShifts, Shift } from "../../utils";
import ShiftDetailsModal from "../shifts/ShiftDetailsModal";

export default function UpcomingShiftsCalendar({role}:any) {
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const handleEventClick = (arg: EventClickArg) => {
        const shift = mockShifts.find((s) => s.id === arg.event.id);
        if (shift) setSelectedShift(shift);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={2}>
                Upcoming Shifts
            </Typography>

            {/* Calendar */}
            <Box
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
            >
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate="2025-08-01"
                    events={mockShifts.map((shift) => ({
                        id: shift.id,
                        title: shift.title,
                        date: shift.date,
                    }))}
                    eventContent={(arg) => {
                        const shift = mockShifts.find((s) => s.id === arg.event.id);
                        if (!shift) return null;

                        const style = getStatusStyle(shift.status);
                        return (
                            <div
                                style={{
                                    background: style.bg,
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#fff",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = "scale(1.03)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = "scale(1)")
                                }
                            >
                                {shift.title}
                            </div>
                        );
                    }}
                    eventClick={handleEventClick}
                    height="auto"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "",
                    }}
                    titleFormat={{ month: "long", year: "numeric" }}
                    dayMaxEventRows={3}
                    dayHeaderClassNames="!bg-background-shade-1 !text-text font-semibold"
                    dayCellClassNames={(arg) => {
                        if (arg.isToday) return "!border-primary !border-2";
                        if (arg.date.getDay() === 0 || arg.date.getDay() === 6)
                            return "!bg-background-shade-2";
                        return "";
                    }}
                />

            </Box>

            {/* Modal */}
            <ShiftDetailsModal
                open={!!selectedShift}
                shift={selectedShift}
                onClose={() => setSelectedShift(null)}
                onCancelShift={(shift) => console.log("Cancel shift", shift)}
                onRequestChange={(shift) => console.log("Request change", shift)}
                role={role}
            />
        </Box>
    );
}
