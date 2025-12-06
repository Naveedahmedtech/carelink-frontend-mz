// src/pages/portal/participant/ParticipantProfile.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { shallowEqual, useSelector } from "react-redux";

import { useGetMeQuery } from "../../../../redux/features/authApi";
import { useUpsertParticipantMutation } from "../../../../redux/features/participantApi";
import { IMAGE_BASE_URL } from "../../../../constant/BASE_URL";

// ⬇️ Reusable availability component (range + hours, auto-detects input)
import UnifiedAvailability  from "../../../../components/common/UnifiedAvailability";

/* ================= Helpers ================= */

const formatDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");

/* ============== Memo subcomponent ============== */

type ChipsInputProps = {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  readOnly?: boolean;
};
const ChipsInput = React.memo(function ChipsInput({ label, value, onChange, readOnly }: ChipsInputProps) {
  if (readOnly) {
    return (
      <Stack spacing={1}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {value.length ? value.map((v, i) => <Chip key={v + i} label={v} size="small" />) : (
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
}, (p, n) =>
  p.label === n.label && p.readOnly === n.readOnly &&
  p.value.length === n.value.length && p.value.every((v, i) => v === n.value[i])
);

/* =================== Main =================== */

export default function ParticipantProfile() {
  const { data, isFetching, refetch } = useGetMeQuery(undefined);
  const me = (data as any)?.data ?? (data as any) ?? {};
  const user = me;
  const participant = me?.participant ?? {};

  const { participantId, userId, onboardingStep } = useSelector(
    (s: any) => ({
      participantId: s?.participant?.participantId ?? participant?._id ?? null,
      userId: s?.participant?.userId ?? user?._id ?? null,
      onboardingStep:
        typeof s?.participant?.onboardingStep === "number"
          ? s.participant.onboardingStep
          : typeof participant?.onboardingStep === "number"
          ? participant.onboardingStep
          : 0,
    }),
    shallowEqual
  );

  const [upsertParticipant, { isLoading: isSaving }] = useUpsertParticipantMutation();

  // Editable state
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  // ⬇️ Availability: keep as a generic object; UnifiedAvailability will normalize it
  const [availability, setAvailability] = useState<any>({});
  const [planManagerName, setPlanManagerName] = useState("");
  const [planManagerEmail, setPlanManagerEmail] = useState("");
  const [fundingType, setFundingType] = useState("plan");
  const [isMinor, setIsMinor] = useState(false);

  // Read-only account & locked fields
  const email = user?.email ?? "";
  const ndisNumber = participant?.ndisNumber || ""; // locked
  const phone = participant?.phone || "";           // locked
  const dob = formatDateInput(participant?.dob);    // locked

  // Hydrate once
  const didHydrate = useRef(false);
  useEffect(() => {
    if (isFetching || didHydrate.current) return;
    if (!user?._id) return;

    setFullName(participant?.fullName || user?.name || "");
    setAddress(participant?.address || "");
    setGuardianName(participant?.guardianName || "");
    setGuardianPhone(participant?.guardianPhone || "");
    setGuardianEmail(participant?.guardianEmail || "");
    setInterests(Array.isArray(participant?.interests) ? participant.interests : []);

    // ⬇️ Hydrate availability as-is (range ISO, range HH:mm, or legacy hours map)
    setAvailability(participant?.availability ?? {});

    setPlanManagerName(participant?.planManagerName || "");
    setPlanManagerEmail(participant?.planManagerEmail || "");
    setFundingType(participant?.fundingType || "plan");
    setIsMinor(!!participant?.isMinor);

    didHydrate.current = true;
  }, [isFetching, user?._id, participant]);

  const payloadBase = useMemo(
    () => ({ participantId, userId, step: onboardingStep, signup: "completed" as const }),
    [participantId, userId, onboardingStep]
  );

  const [snack, setSnack] = useState<{ open: boolean; type: "success" | "error"; msg: string; }>(
    { open: false, type: "success", msg: "" }
  );

  const handleSave = useCallback(async () => {
    try {
      // availability is already normalized/emitted by UnifiedAvailability via setAvailability
      // We send it straight through. (For participants we prefer ISO ranges.)
      const payload = {
        ...payloadBase,
        fullName: fullName?.trim() || undefined,
        address: address?.trim() || undefined,
        guardianName: guardianName?.trim() || undefined,
        guardianPhone: guardianPhone?.trim() || undefined,
        guardianEmail: guardianEmail?.trim() || undefined,
        interests,
        availability, // <- already in { Day: [{ start, end }] } (ISO) from the component
        planManagerName: planManagerName?.trim() || undefined,
        planManagerEmail: planManagerEmail?.trim() || undefined,
        fundingType: fundingType || undefined,
        isMinor,
      };

      await upsertParticipant(payload).unwrap();
      await refetch();
      setSnack({ open: true, type: "success", msg: "Profile updated." });
    } catch (e: any) {
      setSnack({
        open: true,
        type: "error",
        msg: e?.data?.message || e?.message || "Failed to update profile.",
      });
    }
  }, [
    payloadBase,
    fullName,
    address,
    guardianName,
    guardianPhone,
    guardianEmail,
    interests,
    availability,
    planManagerName,
    planManagerEmail,
    fundingType,
    isMinor,
    upsertParticipant,
    refetch,
  ]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>Participant Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          Edit your details, support contacts, interests, availability, and funding info. Some fields are locked.
        </Typography>
      </Stack>

      {!didHydrate.current && isFetching ? (
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
              <Grid item xs={12} md={6}><TextField label="Role" value={user?.role ?? "PARTICIPANT"} fullWidth disabled /></Grid>
            </Grid>
          </Paper>

          {/* Basic (editable + locked fields) */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Basic Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Full Name" value={fullName} onChange={(e)=>setFullName(e.target.value)} fullWidth />
              </Grid>

              {/* LOCKED FIELDS */}
              <Grid item xs={12} md={6}>
                <TextField label="NDIS Number" value={ndisNumber} fullWidth disabled helperText="This field cannot be changed." />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Date of Birth" type="date" value={dob} fullWidth disabled InputLabelProps={{ shrink: true }} helperText="This field cannot be changed." />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Phone" value={phone} fullWidth disabled helperText="This field cannot be changed." />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Address" value={address} onChange={(e)=>setAddress(e.target.value)} fullWidth />
              </Grid>
            </Grid>
          </Paper>

          {/* Guardian */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Guardian / Carer (if applicable)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextField label="Guardian Name" value={guardianName} onChange={(e)=>setGuardianName(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Guardian Phone" value={guardianPhone} onChange={(e)=>setGuardianPhone(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="Guardian Email" value={guardianEmail} onChange={(e)=>setGuardianEmail(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12}>
                <TextField
                  label="Is Minor"
                  value={isMinor ? "Yes" : "No"}
                  onChange={() => setIsMinor((v) => !v)}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  helperText="Click field to toggle"
                  onClick={() => setIsMinor((v) => !v)}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Interests */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Interests</Typography>
            <ChipsInput label="Interests" value={interests} onChange={setInterests} />
          </Paper>

          {/* Availability (Unified – range editor, emits ISO) */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <UnifiedAvailability
              title="Weekly Availability (time ranges)"
              helperText="Toggle days and select start/end. One time block per day."
              mode="auto"           // detects current shape; still emits as ISO ranges
              rangeFormat="iso"     // ensure we store ISO datetimes in the payload
              value={availability}  // whatever we hydrated
              onChange={(next) => setAvailability(next)}
              ampm
              minutesStep={15}
            />
          </Paper>

          {/* Funding & Plan Manager */}
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Funding & Plan Manager</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField select label="Funding Type" value={fundingType} onChange={(e)=>setFundingType(e.target.value)} fullWidth>
                  <MenuItem value="plan">Plan Managed</MenuItem>
                  <MenuItem value="self">Self Managed</MenuItem>
                  <MenuItem value="agency">Agency Managed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Plan Manager Name" value={planManagerName} onChange={(e)=>setPlanManagerName(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Plan Manager Email" value={planManagerEmail} onChange={(e)=>setPlanManagerEmail(e.target.value)} fullWidth />
              </Grid>
            </Grid>
          </Paper>

          {/* Agreement (read-only) */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={700}>Agreement (summary, read-only)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {participant?.agreement ? (
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Version: {participant.agreement.version ?? "—"} • Effective:{" "}
                    {participant.agreement.effectiveDate ? new Date(participant.agreement.effectiveDate).toLocaleDateString() : "—"}
                  </Typography>
                  <Typography variant="body2">
                    TOS: {participant.agreement.acknowledged?.tos ? "Accepted" : "Not accepted"} •
                    Privacy: {participant.agreement.acknowledged?.privacy ? "Accepted" : "Not accepted"} •
                    Consent: {participant.agreement.acknowledged?.consent ? "Accepted" : "Not accepted"}
                  </Typography>
                  {participant.agreement.signature?.date && (
                    <Typography variant="caption" color="text.secondary">
                      Signed on {new Date(participant.agreement.signature.date).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No agreement info.</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Documents (read-only, if present) */}
          {participant?.documents && (
            <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid var(--color-border)" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Documents (read-only)</Typography>
              <Stack spacing={1}>
                {Object.entries(participant.documents).map(([key, doc]: any) => (
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
            </Paper>
          )}

          {/* Actions */}
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSave} disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} /> : undefined}>
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
