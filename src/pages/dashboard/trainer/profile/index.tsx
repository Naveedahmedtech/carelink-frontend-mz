// src/pages/portal/trainer/TrainerProfile.tsx
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { shallowEqual, useSelector } from "react-redux";

import { useGetMeQuery } from "../../../../redux/features/authApi";
import { useUpsertTrainerMutation } from "../../../../redux/features/trainerApi";
import { IMAGE_BASE_URL } from "../../../../constant/BASE_URL";

/** ⬇️ Unified editor (handles messy data and emits normalized ranges) */
import UnifiedAvailability from "../../../../components/common/UnifiedAvailability";

/* ================= Types / Day maps ================= */

type Slot = { start: string | null; end: string | null };
type ApiAvailabilityFull = Record<"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday", Slot[] | string | null | undefined>;

const FULL: ReadonlyArray<"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday"> = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
] as const;
const ABBR: ReadonlyArray<"Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun"> = [
  "Mon","Tue","Wed","Thu","Fri","Sat","Sun"
] as const;

/** Full ⇄ Abbrev mapping */
const FULL_TO_ABBR: Record<typeof FULL[number], typeof ABBR[number]> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};
const ABBR_TO_FULL: Record<typeof ABBR[number], typeof FULL[number]> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

/* ================= Helpers: sanitize + map ================= */

/** Treat "", null, undefined as disabled ([]). Keep only first slot if multiple. */
function sanitizeTrainerAvailabilityIn(apiVal?: ApiAvailabilityFull): Record<string, any[]> {
  const out: Record<string, any[]> = {};
  // Build a map with abbreviated keys expected by UnifiedAvailability
  ABBR.forEach((abbr) => (out[abbr] = []));
  FULL.forEach((full) => {
    const abbr = FULL_TO_ABBR[full];
    const v = apiVal?.[full];

    if (v === "" || v == null) { out[abbr] = []; return; }

    if (Array.isArray(v)) {
      if (v.length === 0) { out[abbr] = []; return; }
      const first = v[0] ?? {};
      out[abbr] = [{
        // leave strings (ISO) as-is; UnifiedAvailability will coerce safely
        start: first?.start ?? null,
        end: first?.end ?? null,
      }];
      return;
    }

    // Object with start/end
    if (typeof v === "object" && ("start" in (v as any) || "end" in (v as any))) {
      out[abbr] = [{
        start: (v as any).start ?? null,
        end: (v as any).end ?? null,
      }];
      return;
    }

    // Fallback: "09:00-17:00"
    if (typeof v === "string" && v.includes("-")) {
      const [s, e] = v.split("-").map((x) => x.trim());
      out[abbr] = [{ start: s || null, end: e || null }];
      return;
    }

    out[abbr] = [];
  });
  return out;
}

/** Map the UnifiedAvailability emission (abbrev keys) back to API’s full-day keys */
function buildTrainerAvailabilityOut(unified: Record<string, Array<{ start: any; end: any }>>): ApiAvailabilityFull {
  const out: any = {};
  FULL.forEach((full) => {
    const abbr = FULL_TO_ABBR[full];
    const arr = Array.isArray(unified?.[abbr]) ? unified[abbr] : [];
    const s = arr[0];
    // keep exactly one slot or []
    out[full] = s ? [{ start: s.start ?? null, end: s.end ?? null }] : [];
  });
  return out as ApiAvailabilityFull;
}

/* ============== Memo subcomponent (chips) ============== */

type ChipsInputProps = {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  readOnly?: boolean;
};
const ChipsInput = React.memo(
  function ChipsInput({ label, value, onChange, readOnly }: ChipsInputProps) {
    if (readOnly) {
      return (
        <Stack spacing={1}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {value.length ? (
              value.map((v, i) => <Chip key={v + i} label={v} size="small" />)
            ) : (
              <Typography variant="body2" color="text.secondary">—</Typography>
            )}
          </Stack>
        </Stack>
      );
    }
    return (
      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={value}
        onChange={(_, val) => onChange(val as string[])}
        renderTags={(vals: readonly string[], getTagProps) =>
          vals.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={`${option}-${index}`} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label={label} placeholder={`Add ${label.toLowerCase()} and press Enter`} />
        )}
        fullWidth
      />
    );
  },
  (p, n) =>
    p.label === n.label &&
    p.readOnly === n.readOnly &&
    p.value.length === n.value.length &&
    p.value.every((v, i) => v === n.value[i])
);

/* =================== Main component =================== */

export default function TrainerProfile() {
  // Fetch me (payload under data.*)
  const { data, isFetching, refetch } = useGetMeQuery(undefined);
  const me = (data as any)?.data ?? (data as any) ?? {};
  const user = me;
  const trainer = me?.trainer ?? {};

  // ids/step from slice (fallback to server)
  const { trainerId, userId, onboardingStep } = useSelector(
    (s: any) => ({
      trainerId: s?.trainer?.trainerId ?? trainer?._id ?? null,
      userId: s?.trainer?.userId ?? user?._id ?? null,
      onboardingStep:
        typeof s?.trainer?.onboardingStep === "number"
          ? s.trainer.onboardingStep
          : typeof trainer?.onboardingStep === "number"
          ? trainer.onboardingStep
          : 0,
    }),
    shallowEqual
  );

  const [upsertTrainer, { isLoading: isSaving }] = useUpsertTrainerMutation();

  // editable state
  const [fullName, setFullName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [travelAreas, setTravelAreas] = useState<string[]>([]);
  const [specialisations, setSpecialisations] = useState<string[]>([]);

  /** ⬇️ unified availability state (abbrev day keys). UnifiedAvailability will normalize/emit. */
  const [availabilityUnified, setAvailabilityUnified] = useState<Record<string, any[]>>({});

  // read-only display fields
  const email = user?.email ?? "";
  const phone = trainer?.phone ?? "";

  // hydrate once
  const didHydrate = useRef(false);
  useEffect(() => {
    if (isFetching || didHydrate.current) return;
    if (!user?._id) return;

    setFullName(trainer?.fullName || user?.name || "");
    setAddress(trainer?.address || "");
    setTravelAreas(Array.isArray(trainer?.travelAreas) ? trainer.travelAreas : []);
    setSpecialisations(Array.isArray(trainer?.specialisations) ? trainer.specialisations : []);

    // ⬇️ Map API full-day availability -> Unified (abbrev keys), tolerate "", null, weird shapes
    setAvailabilityUnified(sanitizeTrainerAvailabilityIn(trainer?.availability));

    didHydrate.current = true;
  }, [isFetching, user?._id, trainer]);

  const payloadBase = useMemo(
    () => ({
      trainerId,
      userId,
      step: onboardingStep,
      signup: "completed" as const,
    }),
    [trainerId, userId, onboardingStep]
  );

  const [snack, setSnack] = useState<{ open: boolean; type: "success" | "error"; msg: string; }>(
    { open: false, type: "success", msg: "" }
  );

  const handleSave = useCallback(async () => {
    try {
      // Convert abbrev-key unified state back to API's full-day keys
      const availabilityForApi = buildTrainerAvailabilityOut(availabilityUnified);

      const payload = {
        ...payloadBase,
        fullName: fullName?.trim() || undefined,
        address: address?.trim() || undefined,
        travelAreas,
        specialisations,
        availability: availabilityForApi,
      };

      await upsertTrainer(payload).unwrap();
      await refetch();
      setSnack({ open: true, type: "success", msg: "Profile updated." });
    } catch (e: any) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.data?.message || e?.message || "Failed to update profile.",
      });
    }
  }, [payloadBase, fullName, address, travelAreas, specialisations, availabilityUnified, upsertTrainer, refetch]);

  /* =================== UI =================== */
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>Trainer Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          Edit your basic info, availability, travel areas, and specialisations. Other details are visible but read-only.
        </Typography>
      </Stack>

      {(!didHydrate.current && isFetching) ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px dashed var(--color-border)" }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" component="span" color="text.secondary">Loading profile…</Typography>
        </Paper>
      ) : (
        <>
          {/* Account (read-only) */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Account</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Email" value={email} fullWidth disabled /></Grid>
              <Grid item xs={12} md={6}><TextField label="Phone" value={phone} fullWidth disabled /></Grid>
            </Grid>
          </Paper>

          {/* Basic (editable) */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Basic Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Full Name" value={fullName} onChange={(e)=>setFullName(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Address" value={address} onChange={(e)=>setAddress(e.target.value)} fullWidth />
              </Grid>
            </Grid>
          </Paper>

          {/* Availability (Unified editor) */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <UnifiedAvailability
              title="Weekly Availability (time ranges)"
              helperText="Toggle days and select start/end. One time block per day."
              mode="auto"           // detects incoming shape
              rangeFormat="iso"     // emit ISO strings (API-friendly)
              value={availabilityUnified}
              onChange={(next) => setAvailabilityUnified(next)}
              ampm
              minutesStep={15}
            />
          </Paper>

          {/* Travel Areas & Specialisations */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Service Areas & Specialisations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <ChipsInput label="Travel Areas" value={travelAreas} onChange={setTravelAreas} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ChipsInput label="Specialisations" value={specialisations} onChange={setSpecialisations} />
              </Grid>
            </Grid>
          </Paper>

          {/* Documents (read-only) */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Documents (read-only)
            </Typography>
            {trainer?.documents ? (
              <Stack spacing={1}>
                {Object.entries(trainer.documents).map(([key, doc]: any) => (
                  <Stack key={key} direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip label={key} size="small" />
                    {doc?.originalName && <Chip label={doc.originalName} size="small" />}
                    {doc?.filePath && (
                      <Link href={`${IMAGE_BASE_URL}${doc.filePath}`} target="_blank" rel="noopener noreferrer">
                        View / Download
                      </Link>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {doc?.expiry ? `Expiry: ${new Date(doc.expiry).toLocaleDateString()}` : "No expiry"}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No documents uploaded.</Typography>
            )}
          </Paper>

          {/* Agreement (summary, read-only) */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={700}>Agreement (summary, read-only)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {trainer?.agreement ? (
                <Stack spacing={1}>
                  <Typography variant="body2">
                    TOS: {trainer.agreement.tos ? "Accepted" : "Not accepted"} • Privacy:{" "}
                    {trainer.agreement.privacy ? "Accepted" : "Not accepted"} • Consent:{" "}
                    {trainer.agreement.consent ? "Accepted" : "Not accepted"}
                  </Typography>
                  {trainer.agreement.signature?.dataUrl && (
                    <Stack spacing={1}>
                      <Typography variant="caption" color="text.secondary">Signature</Typography>
                      <Link
                        href={`${IMAGE_BASE_URL}${trainer.agreement.signature.dataUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open signature image
                      </Link>
                    </Stack>
                  )}
                  {trainer.agreement.signature?.date && (
                    <Typography variant="caption" color="text.secondary">
                      Signed on {new Date(trainer.agreement.signature.date).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No agreement info.</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Actions */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </Stack>
        </>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.type} variant="filled" sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
