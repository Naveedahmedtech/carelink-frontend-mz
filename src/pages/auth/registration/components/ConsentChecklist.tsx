import * as React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormHelperText,
  Link as MuiLink,
  Divider,
  Chip,
  Tooltip,
  Alert,
} from "@mui/material";

type Values = { tos: boolean; privacy: boolean; consent: boolean };

type Props = {
  values: Values;
  onChange: (patch: Partial<Values>) => void;
  disabled?: boolean;
  disabledReason?: string;
  links?: { tos?: string; privacy?: string; consent?: string };
  meta?: { version?: string; effectiveDate?: string };
  errorText?: string;
};

export default function ConsentChecklist({
  values,
  onChange,
  disabled = false,
  disabledReason,
  links,
  meta,
  errorText,
}: Props) {
  const all = values.tos && values.privacy && values.consent;
  const some = values.tos || values.privacy || values.consent;

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [k]: e.target.checked });

  const setAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({
      tos: e.target.checked,
      privacy: e.target.checked,
      consent: e.target.checked,
    });

  // helper IDs for a11y
  const tosHelpId = "consent-tos-help";
  const privHelpId = "consent-privacy-help";
  const consHelpId = "consent-consent-help";

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        borderColor: "var(--color-border)",
        bgcolor: "var(--color-background-shade-1)",
      }}
    >
      <Stack spacing={2.5}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "baseline" }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Acknowledgements
          </Typography>

          {(meta?.version || meta?.effectiveDate) && (
            <Stack direction="row" spacing={1}>
              {meta?.version && (
                <Chip
                  size="small"
                  label={`Version ${meta.version}`}
                  sx={{
                    borderColor: "var(--color-border)",
                    bgcolor: "var(--color-background)",
                    fontWeight: 600,
                  }}
                  variant="outlined"
                />
              )}
              {meta?.effectiveDate && (
                <Chip
                  size="small"
                  label={`Effective ${meta.effectiveDate}`}
                  sx={{
                    borderColor: "var(--color-border)",
                    bgcolor: "var(--color-background)",
                    fontWeight: 600,
                  }}
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </Stack>

        {/* Master toggle */}
        <FormControl
          disabled={disabled}
          component="fieldset"
          variant="standard"
          sx={{ m: 0 }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={all}
                  indeterminate={!all && some}
                  onChange={setAll}
                  color="primary"
                />
              }
              label={
                <Tooltip
                  title="Selects or clears all acknowledgements below"
                  arrow
                  placement="top"
                >
                  <Typography variant="body2" color="text.primary" fontWeight={600}>
                    Select all
                  </Typography>
                </Tooltip>
              }
            />
          </FormGroup>
        </FormControl>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        {/* Individual items */}
        <FormControl
          disabled={disabled}
          error={!all && Boolean(errorText)}
          component="fieldset"
          variant="standard"
          sx={{ m: 0 }}
        >
          <FormGroup sx={{ gap: 1.5 }}>
            {/* TOS */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.tos}
                    onChange={set("tos")}
                    color="primary"
                    inputProps={{ "aria-describedby": tosHelpId }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    I have read and agree to the{" "}
                    {links?.tos ? (
                      <MuiLink
                        href={links.tos}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        underline="hover"
                        fontWeight={600}
                      >
                        Terms of Service
                      </MuiLink>
                    ) : (
                      <strong>Terms of Service</strong>
                    )}
                    .
                  </Typography>
                }
              />
              <FormHelperText id={tosHelpId} sx={{ ml: 5.5 }}>
                Covers service scope, booking/cancellations, fees, and complaints.
              </FormHelperText>
            </Box>

            {/* Privacy */}
            <Box>
              <FormControlLabel
                control={
                    <Checkbox
                      checked={values.privacy}
                      onChange={set("privacy")}
                      color="primary"
                      inputProps={{ "aria-describedby": privHelpId }}
                    />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    I have read and understand the{" "}
                    {links?.privacy ? (
                      <MuiLink
                        href={links.privacy}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        underline="hover"
                        fontWeight={600}
                      >
                        Privacy &amp; Data Use policy
                      </MuiLink>
                    ) : (
                      <strong>Privacy &amp; Data Use policy</strong>
                    )}
                    .
                  </Typography>
                }
              />
              <FormHelperText id={privHelpId} sx={{ ml: 5.5 }}>
                Explains what data is collected, how it’s stored, who can access it, and your rights.
              </FormHelperText>
            </Box>

            {/* Consent */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.consent}
                    onChange={set("consent")}
                    color="primary"
                    inputProps={{ "aria-describedby": consHelpId }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    I consent to share information relevant to my support with authorised parties.
                    {links?.consent && (
                      <>
                        {" "}
                        (
                        <MuiLink
                          href={links.consent}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          underline="hover"
                          fontWeight={600}
                        >
                          learn more
                        </MuiLink>
                        )
                      </>
                    )}
                  </Typography>
                }
              />
              <FormHelperText id={consHelpId} sx={{ ml: 5.5 }}>
                Only minimum necessary info is shared; you can change or withdraw consent anytime.
              </FormHelperText>
            </Box>
          </FormGroup>

          {/* Messages */}
          <Stack spacing={1.25} sx={{ mt: 2 }}>
            {disabled && disabledReason && (
              <Alert severity="info" variant="outlined" sx={{ borderColor: "var(--color-border)" }}>
                {disabledReason}
              </Alert>
            )}
            {!all && errorText && (
              <Alert
                severity="error"
                variant="outlined"
                role="alert"
                aria-live="polite"
                sx={{ borderColor: "var(--color-border)" }}
              >
                {errorText}
              </Alert>
            )}
          </Stack>
        </FormControl>
      </Stack>
    </Paper>
  );
}
