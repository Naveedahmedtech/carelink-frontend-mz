import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography, Alert } from "@mui/material";
import "./Calendar.css";
import { getStatusStyle } from "../../utils";
import ShiftDetailsModal from "../shifts/ShiftDetailsModal";

/** ===== API shapes from server (works for both roles) ===== */
export type ApiPerson = {
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
    status: string; // e.g. "APPROVED" | "PENDING" | "DECLINED" | "IN_PROGRESS"
    createdAt: string;
    participant?: ApiPerson; // present when trainer is viewing
    trainer?: ApiPerson;     // present when participant is viewing
};

/** ===== UI shift (what this calendar & modal use) ===== */
export type UiShift = {
    id: string;
    title: string;
    start: string;
    end: string;
    status: string; // normalized or raw, modal handles both
    notes?: string;
    service: string;
    participant?: ApiPerson;
    trainer?: ApiPerson;
    raw?: ApiShift;
};

const normalizeStatus = (s?: string) => (s || "").toLowerCase();

function toTitle(service?: string) {
    if (!service) return "Shift";
    return service.charAt(0).toUpperCase() + service.slice(1);
}

function toUiShift(s: ApiShift): UiShift {
    return {
        id: s._id,
        title: toTitle(s.service),
        start: s.start,
        end: s.end,
        status: normalizeStatus(s.status), // "APPROVED" -> "approved"
        notes: s.notes,
        service: s.service,
        participant: s.participant,
        trainer: s.trainer,
        raw: s,
    };
}

/** ===== Component ===== */
export default function UpcomingShiftsCalendar({
    role,
    shifts = [],
    refetch
}: {
    role: "trainer" | "participant" | string;
    shifts: ApiShift[]; // pass `data?.data?.data ?? []`
}) {
    const [selectedShift, setSelectedShift] = useState<UiShift | null>(null);
    console.log("shifts", shifts);
    const { events, byId, initialDate } = useMemo(() => {
        const ui = (shifts ?? []).map(toUiShift);
        const map = new Map<string, UiShift>();
        ui.forEach((s) => map.set(s.id, s));

        const evts = ui.map((s) => ({
            id: s.id,
            title: s.title,
            start: s.start,
            end: s.end,
        }));

        const first = ui[0]?.start ? new Date(ui[0].start) : undefined;
        return { events: evts, byId: map, initialDate: first };
    }, [shifts]);

    const handleEventClick = (arg: EventClickArg) => {
        const s = byId.get(arg.event.id);
        if (s) setSelectedShift(s);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={2}>
                Upcoming Shifts
            </Typography>

            {!events.length ? (
                <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                    No upcoming shifts found.
                </Alert>
            ) : null}

            <Box
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
            >
                <FullCalendar
                    timeZone="UTC"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={initialDate}
                    events={events}
                    eventContent={(arg) => {
                        const s = byId.get(arg.event.id);
                        if (!s) return null;

                        const style = getStatusStyle(s.status.toLowerCase()); // may return string or { bg }
                        const bg = typeof style === "string" ? style : style?.bg ?? "#666";
                        const otherParty =
                            role === "participant"
                                ? `Trainer: ${s.trainer?.fullName ?? "TBA"}`
                                : `Participant: ${s.participant?.fullName ?? "TBA"}`;

                        return (
                            <div
                                style={{
                                    background: bg,
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
                                title={`${s.title} — ${otherParty}`}
                            >
                                {s.title}
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
                role={role as any}
                onClose={() => setSelectedShift(null)}
                onCancelShift={(shift) => console.log("Cancel shift", shift)}
                onRequestChange={(shift) => console.log("Request change", shift)}
                // trainer actions (optional wire-ups)
                onClockIn={(shift) => console.log("Clock in", shift)}
                onClockOut={(shift, report) => console.log("Clock out", { shift, report })}
                // admin actions (optional wire-ups)
                onApproveShift={(shift) => console.log("Approve & assign", shift)}
                onReassignShift={(shift) => console.log("Reassign", shift)}
                onAdminCancel={(shift) => console.log("Admin cancel", shift)}
                refetch={refetch}
            />
        </Box>
    );
}
