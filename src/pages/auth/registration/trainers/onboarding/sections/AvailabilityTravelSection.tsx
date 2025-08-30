// -----------------------------------------------
// src/pages/trainers/onboarding/sections/AvailabilityTravelSection.tsx
import * as React from "react";
import { Chip, TextField, IconButton, Tooltip } from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/CloseRounded";
import EditIcon from "@mui/icons-material/EditOutlined";
import PlaceIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTimeRounded";
import {
    LocalizationProvider,
    TimePicker,
    MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type {
    TrainerRegistrationErrors,
    TrainerRegistrationValues,
    DaySlot,
} from "../shared/types";
import { DAYS } from "../shared/constants";
import SectionCard from "../../../components/SectionCard";

/** Helpers to keep DaySlot as "HH:mm" while letting pickers use Date */
const toDate = (hhmm?: string | null) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h ?? 0, m ?? 0, 0, 0);
    return d;
};
const toHHmm = (d: Date | null) =>
    d ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : "";

export default function AvailabilityTravelSection({
    values,
    errors,
    setValue,
}: {
    values: TrainerRegistrationValues;
    errors: TrainerRegistrationErrors;
    setValue: <K extends keyof TrainerRegistrationValues>(
        k: K,
        v: TrainerRegistrationValues[K]
    ) => void;
}) {
    const availability = values.availability || {};

    const [areaInput, setAreaInput] = React.useState("");
    const [areaError, setAreaError] = React.useState<string | null>(null);

    const handleAddArea = () => {
        const raw = areaInput.trim();
        if (!raw) return;
        const candidate = raw.replace(/\s+/g, " ");
        const exists = values.travelAreas.some(
            (a) => a.toLowerCase() === candidate.toLowerCase()
        );
        if (exists) {
            setAreaError("Already added");
            return;
        }
        setValue("travelAreas", [...values.travelAreas, candidate]);
        setAreaInput("");
        setAreaError(null);
    };

    // const handleAreaKeyDown = (
    //     e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    // ) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();         // <-- stops form submit
    //         handleAddArea();
    //     }
    // };

    const handleAreaKeyDown: React.KeyboardEventHandler = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddArea();
        }
    };

    // For “one-time adding” per day
    const [draft, setDraft] = React.useState<Record<
        string,
        { start: Date | null; end: Date | null; editingIndex?: number | null }
    >>({});

    const setDraftFor = (
        day: string,
        patch: Partial<{ start: Date | null; end: Date | null; editingIndex?: number | null }>
    ) =>
        setDraft((s) => ({
            ...s,
            // [day]: { start: null, end: null, editingIndex: null, ...s[day], ...patch },
            [day]: { ...s[day], ...patch },
        }));

    const slotsOf = (day: string) => availability[day] || [];

    const commitAddOrEdit = (day: string) => {
        const d = draft[day] || {};
        const start = d.start;
        const end = d.end;
        if (!start || !end) return;
        if (start >= end) return;

        const newSlot: DaySlot = { start: toHHmm(start), end: toHHmm(end) };
        const existing = slotsOf(day);

        // If editingIndex present, replace; otherwise push
        if (d.editingIndex != null && d.editingIndex > -1) {
            const next = [...existing];
            next[d.editingIndex] = newSlot;
            setValue("availability", { ...availability, [day]: next });
        } else {
            setValue("availability", { ...availability, [day]: [...existing, newSlot] });
        }
        setDraftFor(day, { start: null, end: null, editingIndex: null });
    };

    const beginAdd = (day: string) => setDraftFor(day, { start: toDate("09:00"), end: toDate("12:00") });

    const beginEdit = (day: string, idx: number) => {
        const slot = slotsOf(day)[idx];
        setDraftFor(day, {
            start: toDate(slot.start),
            end: toDate(slot.end),
            editingIndex: idx,
        });
    };

    const removeSlot = (day: string, idx: number) => {
        const next = [...slotsOf(day)];
        next.splice(idx, 1);
        setValue("availability", { ...availability, [day]: next });
        // If we were editing this row, clear draft
        if (draft[day]?.editingIndex === idx) {
            setDraftFor(day, { start: null, end: null, editingIndex: null });
        }
    };

    const cancelDraft = (day: string) => setDraftFor(day, { start: null, end: null, editingIndex: null });

    const addArea = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        if (e.key === "Enter" && input.value.trim()) {
            setValue("travelAreas", [...values.travelAreas, input.value.trim()]);
            input.value = "";
        }
    };
    const removeArea = (area: string) =>
        setValue("travelAreas", values.travelAreas.filter((a) => a !== area));

    // Mobile-friendly: use MobileTimePicker under 600px
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches;
    const Picker = isMobile ? MobileTimePicker : TimePicker;

    return (
        <>
            <SectionCard
                title="Availability"
                subtitle="Days and time ranges you can work"
                icon={<AccessTimeIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                        {DAYS.map((day) => {
                            const d = draft[day] || {};
                            const hasDraft = Boolean(d.start || d.end || d.editingIndex != null);
                            const invalid = d.start && d.end ? d.start >= d.end : false;

                            return (
                                <Grid key={day} item xs={12} sm={6}>
                                    <div className="rounded-2xl border border-border p-3 bg-backgroundShade1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{day}</span>

                                            {!hasDraft ? (
                                                <Tooltip title="Add time slot">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => beginAdd(day)}
                                                        className="text-textSecondary hover:text-hover"
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <div className="text-xs text-textSecondary">Editing…</div>
                                            )}
                                        </div>

                                        {/* Existing slots */}
                                        {slotsOf(day).map((slot, idx) => (
                                            <div key={`${slot.start}-${slot.end}-${idx}`} className="flex gap-2 items-center mb-2">
                                                <div className="text-sm min-w-[120px] font-medium">
                                                    {slot.start}–{slot.end}
                                                </div>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => beginEdit(day, idx)}
                                                        className="text-textSecondary hover:text-hover"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove">
                                                    <IconButton
                                                        onClick={() => removeSlot(day, idx)}
                                                        size="small"
                                                        className="text-textSecondary hover:text-hover"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        ))}
                                        {!slotsOf(day).length && !hasDraft && (
                                            <div className="text-sm text-textSecondary">No slots yet</div>
                                        )}

                                        {/* Draft row (Add or Edit) */}
                                        {hasDraft && (
                                            <div className="flex flex-col gap-2 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Picker
                                                        label="Start"
                                                        value={d.start}
                                                        onChange={(val) => setDraftFor(day, { start: val })}
                                                        minutesStep={15}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                sx: { minWidth: 130 },
                                                            },
                                                        }}
                                                    />
                                                    <Picker
                                                        label="End"
                                                        value={d.end}
                                                        onChange={(val) => setDraftFor(day, { end: val })}
                                                        minutesStep={15}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                sx: { minWidth: 130 },
                                                                error: Boolean(invalid),
                                                                helperText: invalid ? "End must be after start" : undefined,
                                                            },
                                                        }}
                                                    />

                                                    <Tooltip title={d.editingIndex != null ? "Save changes" : "Add slot"}>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => commitAddOrEdit(day)}
                                                                disabled={!d.start || !d.end || invalid}
                                                                className="text-textSecondary hover:text-hover"
                                                            >
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>

                                                    <Tooltip title="Cancel">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => cancelDraft(day)}
                                                            className="text-textSecondary hover:text-hover"
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                </LocalizationProvider>
            </SectionCard>

            <SectionCard
                title="Travel Areas"
                subtitle="Suburbs or regions you can travel to"
                icon={<PlaceIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}>
                <div className="rounded-2xl border border-border p-3 bg-backgroundShade1">
                    <div className="flex gap-2 items-start">
                        <TextField
                            size="small"
                            placeholder="Type an area"
                            value={areaInput}
                            onChange={(e) => { setAreaInput(e.target.value); if (areaError) setAreaError(null); }}
                            onKeyDown={handleAreaKeyDown}
                            error={Boolean(areaError)}
                            helperText={areaError ?? "Press Enter or click Add"}
                            sx={{ flex: 1 }}
                        />
                        <Tooltip title="Add area">
                            <span>
                                <IconButton
                                    onClick={handleAddArea}
                                    disabled={!areaInput.trim()}
                                    className="text-textSecondary hover:text-hover"
                                    size="small">
                                    <AddIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {values.travelAreas.map((area) => (
                            <Chip
                                key={area}
                                label={area}
                                onDelete={() => removeArea(area)}
                                className="hover:bg-backgroundShade2"
                            />
                        ))}
                    </div>

                    {errors.travelAreas && (
                        <p className="text-[12px] text-error mt-2">{errors.travelAreas}</p>
                    )}
                </div>
            </SectionCard>

        </>
    );
}
