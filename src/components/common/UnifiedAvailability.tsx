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
import { DAYS } from "../../pages/auth/registration/shared/constants";

// 🔁 adjust this import path if your DAYS constant lives elsewhere

/* ===================== Types & Props ===================== */

export type TimeSlot = { start: Date | null; end: Date | null };
type RangeOutputFormat = "iso" | "hhmm" | "date"; // how we emit onChange
type Mode = "auto" | "range" | "hours"; // reserved for future explicit parsing modes

type UnifiedAvailabilityProps = {
  title?: string;
  helperText?: string;
  mode?: Mode;                 // "auto" by default; we detect shape
  rangeFormat?: RangeOutputFormat; // "iso" by default
  value: any;                  // messy inbound value from API/DB
  onChange: (next: any) => void;    // emits normalized { Day: [ { start, end } ] }
  ampm?: boolean;
  minutesStep?: number;
};

/* ===================== Helpers (parsing + formatting) ===================== */

const EPOCH = "1970-01-01";

/** Date ← "HH:mm" (local-time, anchored to epoch date) */
function dateFromHHmm(hhmm?: string | null): Date | null {
  if (!hhmm || typeof hhmm !== "string") return null;
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const [_, H, M] = m;
  const d = new Date(`${EPOCH}T${H.padStart(2, "0")}:${M}:00`);
  return isNaN(d.getTime()) ? null : d;
}

/** Date ← ISO | number | Date | null */
function safeToDate(v: any): Date | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/** Valid if both exist and end > start. Allows partial while editing. */
function isValidSlotRange(s: TimeSlot) {
  if (!s.start || !s.end) return true;
  return s.end > s.start;
}

/** Human label for chip (tolerant to partials) */
function labelOf(slot?: TimeSlot) {
  if (!slot) return "";
  const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  const start = slot.start ? slot.start.toLocaleTimeString([], opts) : "Start";
  const end = slot.end ? slot.end.toLocaleTimeString([], opts) : "End";
  if (!slot.start && !slot.end) return "Set hours";
  return `${start} – ${end}`;
}

/** Parse any supported shape into a single TimeSlot or undefined */
function parseDayToSlot(raw: any): TimeSlot | undefined {
  // Treat "" as disabled (backend junk case)
  if (raw === "") return undefined;

  if (raw == null) return undefined;

  // Array -> take first entry
  if (Array.isArray(raw)) {
    const first = raw[0];
    if (!first) return undefined;
    return parseDayToSlot(first);
  }

  // String "09:00-17:00"
  if (typeof raw === "string") {
    const parts = raw.split("-").map((s) => s.trim());
    if (parts.length === 2) {
      return { start: dateFromHHmm(parts[0]), end: dateFromHHmm(parts[1]) };
    }
    return undefined;
  }

  // Object with start/end (Date | ISO | "HH:mm" | null)
  if (typeof raw === "object" && ("start" in raw || "end" in raw)) {
    const start =
      typeof raw.start === "string" && /^\d{1,2}:\d{2}$/.test(raw.start)
        ? dateFromHHmm(raw.start)
        : safeToDate(raw.start);
    const end =
      typeof raw.end === "string" && /^\d{1,2}:\d{2}$/.test(raw.end)
        ? dateFromHHmm(raw.end)
        : safeToDate(raw.end);

    // IMPORTANT: preserve explicitly empty slot so toggling ON doesn't snap OFF
    return { start, end };
  }

  return undefined;
}

/** Normalize full object to map Day -> (slot | undefined) */
function normalizeIncomingAvailability(value: any): Record<string, TimeSlot | undefined> {
  const out: Record<string, TimeSlot | undefined> = {};
  DAYS.forEach((day) => {
    const raw = value?.[day];

    // Missing, null, or empty string => disabled
    if (raw === "" || raw === undefined || raw === null) {
      out[day] = undefined;
      return;
    }

    if (Array.isArray(raw)) {
      if (raw.length === 0) {
        out[day] = undefined;
        return;
      }
      out[day] = parseDayToSlot(raw[0]);
      return;
    }

    out[day] = parseDayToSlot(raw);
  });
  return out;
}

/** Emit conversions */
function toISO(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}
function toHHmm(d: Date | null): string | null {
  if (!d) return null;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Build outgoing payload per requested format */
function buildOutgoing(
  map: Record<string, TimeSlot | undefined>,
  format: RangeOutputFormat
): Record<string, Array<{ start: any; end: any }>> {
  const out: Record<string, Array<{ start: any; end: any }>> = {};
  DAYS.forEach((day) => {
    const s = map[day];

    // Disabled or totally missing => []
    if (!s) {
      out[day] = [];
      return;
    }

    // Allow partials while editing so parent UI doesn't collapse
    const convert = (d: Date | null) =>
      format === "iso" ? toISO(d) : format === "hhmm" ? toHHmm(d) : d;

    out[day] = [{ start: convert(s.start), end: convert(s.end) }];
  });
  return out;
}

/* ===================== Styles (matches your theme) ===================== */

const inputSx = {
  minWidth: 140,
  bgcolor: "var(--color-background-shade-1)",
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "& fieldset": { borderColor: "var(--color-border)" },
    "&:hover fieldset": { borderColor: "var(--color-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px var(--color-shadow)" },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "var(--color-text-muted)" },
  "& .MuiInputAdornment-root:hover .MuiSvgIcon-root": { color: "var(--color-primary)" },
};

const pickerPaperStyles = {
  borderRadius: 2,
  boxShadow: "0 16px 40px var(--color-shadow)",
  overflow: "hidden",
  "& .MuiPickersActionBar-root": {
    borderTop: "1px solid var(--color-border)",
    px: 1,
    "& .MuiButton-root": { textTransform: "none", fontWeight: 700 },
    "& .MuiButton-root:first-of-type": { color: "var(--color-primary)", "&:hover": { bgcolor: "var(--color-background-shade-2)" } },
    "& .MuiButton-root:last-of-type": {
      color: "#fff",
      backgroundColor: "var(--color-primary)",
      borderRadius: 12,
      px: 1.5,
      "&:hover": { backgroundColor: "var(--color-hover)" },
    },
  },
  "& .MuiMultiSectionDigitalClockSection-item": {
    borderRadius: 999,
    margin: "4px 8px",
    "&:hover": { bgcolor: "var(--color-background-shade-2)" },
    "&.Mui-selected": { bgcolor: "var(--color-primary) !important", color: "#fff !important" },
  },
  "& .MuiDigitalClock-item.Mui-selected": {
    bgcolor: "var(--color-primary) !important",
    color: "#fff !important",
  },
};

/* ===================== Component ===================== */

export default function UnifiedAvailability({
  title = "Availability",
  helperText,
  mode = "auto",
  rangeFormat = "iso",
  value,
  onChange,
  ampm = true,
  minutesStep = 15,
}: UnifiedAvailabilityProps) {
  // Normalized read-view of what's coming from parent
  const normalized = React.useMemo(
    () => normalizeIncomingAvailability(value),
    [value]
  );

  // Local state mirrors normalized
  const [map, setMap] = React.useState<Record<string, TimeSlot | undefined>>(
    () => normalized
  );
  const [editing, setEditing] = React.useState<{ day: string } | null>(null);

  // Keep local map synced if parent changes externally
  React.useEffect(() => {
    setMap(normalized);
  }, [normalized]);

  // Emit helper
  const emit = React.useCallback(
    (nextMap: Record<string, TimeSlot | undefined>) => {
      const payload = buildOutgoing(nextMap, rangeFormat);
      onChange(payload);
    },
    [onChange, rangeFormat]
  );

  // Initial canonical emit once (so parent gets a normalized shape immediately)
  const didInitialEmit = React.useRef(false);
  React.useEffect(() => {
    if (didInitialEmit.current) return;
    didInitialEmit.current = true;
    emit(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enableDay = (day: string) => {
    const existing = map[day];
    const first: TimeSlot = existing ?? { start: null, end: null };
    const next = { ...map, [day]: first };
    setMap(next);
    emit(next);
    setEditing({ day });
  };

  const disableDay = (day: string) => {
    const next = { ...map, [day]: undefined };
    setMap(next);
    emit(next);
    setEditing((e) => (e?.day === day ? null : e));
  };

  const updateSlot = (day: string, key: "start" | "end", value: Date | null) => {
    const current = map[day] ?? { start: null, end: null };
    const nextSlot: TimeSlot = { ...current, [key]: value ? safeToDate(value) : null };

    // soft-block invalid transitions; allow partial while editing
    if (!isValidSlotRange(nextSlot)) return;

    const next = { ...map, [day]: nextSlot };
    setMap(next);
    emit(next);
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--color-background-shade-1)",
        borderRadius: 3,
        p: 3,
        border: "1px solid var(--color-border)",
        boxShadow: "0 8px 28px var(--color-shadow)",
        color: "var(--color-text)",
      }}
    >
      <Stack spacing={0.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
        {helperText && (
          <Typography variant="body2" color="text.secondary">{helperText}</Typography>
        )}
      </Stack>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack divider={<Divider sx={{ borderColor: "var(--color-border)" }} />} spacing={2}>
          {DAYS.map((day) => {
            const slot = map[day];
            const enabled = !!slot;
            const complete = !!slot?.start && !!slot?.end;
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
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        bgcolor: "var(--color-primary)",
                        opacity: 1,
                      },
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
                            value={slot?.start || null}
                            onChange={(v) => updateSlot(day, "start", v)}
                            minutesStep={minutesStep}
                            views={["hours", "minutes"]}
                            openTo="hours"
                            ampm={ampm}
                            closeOnSelect={false}
                            slotProps={{
                              textField: {
                                size: "small",
                                sx: inputSx,
                                error: invalid,
                                helperText: invalid ? "End must be after start" : undefined,
                              },
                              desktopPaper: { sx: pickerPaperStyles },
                              mobilePaper: { sx: pickerPaperStyles },
                              popper: { sx: pickerPaperStyles },
                            }}
                          />

                          <TimePicker
                            label="End"
                            value={slot?.end || null}
                            onChange={(v) => updateSlot(day, "end", v)}
                            minutesStep={minutesStep}
                            views={["hours", "minutes"]}
                            openTo="hours"
                            ampm={ampm}
                            closeOnSelect={false}
                            slotProps={{
                              textField: {
                                size: "small",
                                sx: inputSx,
                                error: invalid,
                                helperText:
                                  invalid
                                    ? "End must be after start"
                                    : !slot?.end && slot?.start
                                    ? "Pick an end time"
                                    : undefined,
                              },
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
                                bgcolor: !complete || invalid ? "var(--color-border)" : "var(--color-hover)",
                                color: !complete || invalid ? "var(--color-text-muted)" : "var(--color-text-hover)",
                              },
                            }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            title="Delete"
                            onClick={() => disableDay(day)}
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
                          onDelete={() => disableDay(day)}
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
                        "&:hover": {
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
