import * as React from "react";
import {
    Box,
    Typography,
    Switch,
    Stack,
    Chip,
    IconButton,
    Button,
    Divider,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { DAYS } from "../shared/constants";

type TimeSlot = { start: Date | null; end: Date | null };
type Props = {
    availability: any;
    // availability: Record<string, TimeSlot[]>;
    // setDayAvailability: (day: string, slots: TimeSlot[]) => void;
    setDayAvailability: any;
};

/** Range validation (allow partial while editing) */
function isValidSlotRange(s: TimeSlot) {
    if (!s.start || !s.end) return true;
    return s.start < s.end;
}

function labelOf(slot: TimeSlot) {
    if (!slot.start || !slot.end) return "";
    const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    return `${slot.start.toLocaleTimeString([], opts)} – ${slot.end.toLocaleTimeString([], opts)}`;
}

export default function AvailabilitySelector({ availability, setDayAvailability }: Props) {
    const [editing, setEditing] = React.useState<{ day: string } | null>(null);

    /** 🔒 Enforce single slot per day */
    React.useEffect(() => {
        DAYS.forEach((day) => {
            const slots = availability[day] || [];
            if (slots.length > 1) setDayAvailability(day, slots.slice(0, 1));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availability]);

    const enableDay = (day: string) => {
        const current = availability[day] || [];
        const first = current[0] ?? { start: null, end: null };
        setDayAvailability(day, [first]);
        setEditing({ day });
    };

    const disableDay = (day: string) => {
        setDayAvailability(day, []);
        setEditing(null);
    };

    const handleUpdate = (day: string, key: "start" | "end", value: Date | null) => {
        const current = availability[day]?.[0] ?? { start: null, end: null };
        const next: TimeSlot = { ...current, [key]: value };
        if (!isValidSlotRange(next)) return;
        setDayAvailability(day, [next]);
        // keep editing open so user can pick minutes (no auto-close)
    };

    const handleDelete = (day: string) => disableDay(day);

    return (
        <Box
            sx={{
                bgcolor: "var(--color-background-shade-1)",
                borderRadius: 3,
                p: 3,
                border: "1px solid var(--color-border)",
                boxShadzow: "0 8px 28px var(--color-shadow)",
                color: "var(--color-text)",
            }}
        >
            <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "var(--color-text-dark)" }}>
                Availability
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack divider={<Divider sx={{ borderColor: "var(--color-border)" }} />} spacing={2}>
                    {DAYS.map((day) => {
                        const slot: TimeSlot | undefined = (availability[day] || [])[0];
                        const enabled = !!slot;
                        const startValue = slot && slot.start ? slot.start : null;
                        const endValue = slot && slot.end ? slot.end : null;
                        const complete = !!startValue && !!endValue;
                        const invalid = slot ? !isValidSlotRange(slot) : false;

                        return (
                            <Box
                                key={day}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
                                    alignItems: "flex-start",
                                    gap: 2,
                                    py: 1,
                                }}
                            >
                                {/* Left: day + switch */}
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Switch
                                        checked={enabled}
                                        onChange={(e) => (e.target.checked ? enableDay(day) : disableDay(day))}
                                        size="small"
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-primary)" },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "var(--color-primary)", opacity: 1 },
                                            "& .MuiSwitch-track": { bgcolor: "var(--color-border)" },
                                        }}
                                    />
                                    <Typography fontWeight={600}>{day}</Typography>
                                </Stack>

                                {/* Right: single slot editor or chip */}
                                <Stack spacing={1.5}>
                                    {enabled && (
                                        <>
                                            {editing?.day === day ? (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        p: 1.5,
                                                        border: "1px solid var(--color-border)",
                                                        borderRadius: 2,
                                                        bgcolor: "var(--color-background)",
                                                    }}
                                                >
                                                    <TimePicker
                                                        label="Start"
                                                        value={startValue}
                                                        onChange={(v) => handleUpdate(day, "start", v)}
                                                        minutesStep={15}
                                                        views={["hours", "minutes"]}
                                                        openTo="hours"
                                                        ampm
                                                        closeOnSelect={false}
                                                        slotProps={{
                                                            textField: { size: "small", sx: inputSx, error: invalid, helperText: invalid ? "End must be after start" : undefined },
                                                            desktopPaper: { sx: pickerPaperStyles },
                                                            mobilePaper: { sx: pickerPaperStyles },
                                                            popper: { sx: pickerPaperStyles },
                                                        }}
                                                    />

                                                    <TimePicker
                                                        label="End"
                                                        value={endValue}
                                                        onChange={(v) => handleUpdate(day, "end", v)}
                                                        minutesStep={15}
                                                        views={["hours", "minutes"]}
                                                        openTo="hours"
                                                        ampm
                                                        closeOnSelect={false}
                                                        slotProps={{
                                                            textField: { size: "small", sx: inputSx, error: invalid, helperText: invalid ? "End must be after start" : undefined },
                                                            desktopPaper: { sx: pickerPaperStyles },
                                                            mobilePaper: { sx: pickerPaperStyles },
                                                            popper: { sx: pickerPaperStyles },
                                                        }}
                                                    />

                                                    <IconButton
                                                        size="small"
                                                        title="Done"
                                                        onClick={() => setEditing(null)}
                                                        disabled={!complete || invalid}
                                                        sx={{
                                                            bgcolor: !complete || invalid ? "var(--color-border)" : "var(--color-primary)",
                                                            color: !complete || invalid ? "var(--color-text-muted)" : "#fff",
                                                            border: "1px solid transparent",
                                                            "&:hover": {
                                                                bgcolor:
                                                                    !complete || invalid ? "var(--color-border)" : "var(--color-hover)",
                                                                color:
                                                                    !complete || invalid ? "var(--color-text-muted)" : "var(--color-text-hover)",
                                                            },
                                                        }}
                                                    >
                                                        <CheckIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        title="Delete"
                                                        onClick={() => handleDelete(day)}
                                                        sx={{
                                                            color: "var(--color-text-muted)",
                                                            "&:hover": { color: "var(--color-text-hover)", bgcolor: "var(--color-hover)" },
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <Chip
                                                    label={labelOf(slot!)}
                                                    onClick={() => setEditing({ day })}
                                                    onDelete={() => handleDelete(day)}
                                                    deleteIcon={<DeleteIcon />}
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: "22px",
                                                        borderColor: "var(--color-border)",
                                                        bgcolor: "var(--color-background)",
                                                        fontWeight: 600,
                                                        px: 1.5,
                                                        transition: "all .2s ease",
                                                        "& .MuiChip-deleteIcon": { color: "var(--color-text-muted)" },
                                                        "&:hover": {
                                                            bgcolor: "var(--color-background)",
                                                            color: "var(--color-primary)",  
                                                            borderColor: "var(--color-primary)",
                                                            "& .MuiChip-deleteIcon": { color: "var(--color-primary)" },
                                                        },
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}

                                    {!enabled && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => enableDay(day)}
                                            sx={{
                                                borderColor: "var(--color-border)",
                                                color: "var(--color-primary)",
                                                textTransform: "none",
                                                fontWeight: 700,
                                                borderRadius: "22px",
                                                px: 2,
                                                alignSelf: "flex-start",
                                                   '&:hover': {
                                                       borderColor: "var(--color-primary)",
                                                       bgcolor: "var(--color-background-shade-2)",
                                                },
                                            }}
                                        >
                                            Set hours
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            </LocalizationProvider>
        </Box>
    );
}

/** Centralized styles to brand the MUI X picker popper/paper + selection states */
// Text field styling (applied via slotProps.textField.sx)
const inputSx = {
  minWidth: 140,
  bgcolor: 'var(--color-background-shade-1)',
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: 'var(--color-border)' },
    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
    '&.Mui-focused': { boxShadow: '0 0 0 4px var(--color-shadow)' },
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'var(--color-text-muted)' },
    '& .MuiInputAdornment-root:hover .MuiSvgIcon-root': { color: 'var(--color-primary)' },
};

// Dialog/paper styling (applied via slotProps.mobilePaper/desktopPaper/popper.sx)
const pickerPaperStyles = {
  borderRadius: 2,
  boxShadow: '0 16px 40px var(--color-shadow)',
  overflow: 'hidden',
  /* Action bar */
  '& .MuiPickersActionBar-root': {
    borderTop: '1px solid var(--color-border)',
    px: 1,
    '& .MuiButton-root': { textTransform: 'none', fontWeight: 700 },
        '& .MuiButton-root:first-of-type': { color: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-background-shade-2)' } },
        '& .MuiButton-root:last-of-type': {
            color: '#fff', backgroundColor: 'var(--color-primary)', borderRadius: 12, px: 1.5,
            '&:hover': { backgroundColor: 'var(--color-hover)' },
        },
  },
  /* Multi-section wheels + list */
  '& .MuiMultiSectionDigitalClockSection-item': {
    borderRadius: 999, margin: '4px 8px',
        '&:hover': { bgcolor: 'var(--color-background-shade-2)' },
        '&.Mui-selected': { bgcolor: 'var(--color-primary) !important', color: '#fff !important' },
    },
    '& .MuiDigitalClock-item.Mui-selected': {
        bgcolor: 'var(--color-primary) !important', color: '#fff !important',
    },
};
