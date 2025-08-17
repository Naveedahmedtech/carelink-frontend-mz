import * as React from 'react';
import {
  Checkbox, FormControlLabel, FormGroup, Paper, Box, Typography,
  Link, FormHelperText, Stack
} from '@mui/material';

type Values = { tos: boolean; privacy: boolean; consent: boolean };

type Props = {
  values: Values;
  onChange: (patch: Partial<Values>) => void;

  /** Disable interaction (e.g., until the user has scrolled to the end) */
  disabled?: boolean;
  /** Optional message explaining why it’s disabled */
  disabledReason?: string;

  /** Show legal links (recommended) */
  links?: { tos?: string; privacy?: string; consent?: string };

  /** Show agreement meta (version + effective date) */
  meta?: { version?: string; effectiveDate?: string };

  /** When not all are checked, show this error text (e.g., after submit) */
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

  const set = (k: keyof Values) => (_: any, checked: boolean) => onChange({ [k]: checked });

  const setAll = (_: any, checked: boolean) =>
    onChange({ tos: checked, privacy: checked, consent: checked });

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: { xs: 2, sm: 3 } }}>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Acknowledgements
          </Typography>
          {(meta?.version || meta?.effectiveDate) && (
            <Typography variant="caption" color="text.secondary">
              {meta?.version ? `Version ${meta.version}` : ''}
              {meta?.version && meta?.effectiveDate ? ' · ' : ''}
              {meta?.effectiveDate ? `Effective ${meta.effectiveDate}` : ''}
            </Typography>
          )}
        </Box>

        <FormGroup>
          {/* Master toggle */}
          <FormControlLabel
            control={
              <Checkbox
                checked={all}
                indeterminate={!all && some}
                onChange={setAll}
                disabled={disabled}
                inputProps={{ 'aria-label': 'Select all acknowledgements' }}
              />
            }
            label="Select all"
          />

          {/* Individual items */}
          <FormControlLabel
            control={
              <Checkbox
                checked={values.tos}
                onChange={set('tos')}
                disabled={disabled}
                inputProps={{ 'aria-describedby': 'tos-desc' }}
              />
            }
            label={
              <span>
                I have read and agree to the{' '}
                {links?.tos ? (
                  <Link href={links.tos} target="_blank" rel="noopener">
                    Terms of Service
                  </Link>
                ) : (
                  'Terms of Service'
                )}
                .
              </span>
            }
          />
          <FormHelperText id="tos-desc" sx={{ ml: 5, mt: -0.5 }}>
            Covers service scope, booking/cancellations, fees, and complaints.
          </FormHelperText>

          <FormControlLabel
            control={
              <Checkbox
                checked={values.privacy}
                onChange={set('privacy')}
                disabled={disabled}
                inputProps={{ 'aria-describedby': 'privacy-desc' }}
              />
            }
            label={
              <span>
                I have read and understand the{' '}
                {links?.privacy ? (
                  <Link href={links.privacy} target="_blank" rel="noopener">
                    Privacy &amp; Data Use policy
                  </Link>
                ) : (
                  'Privacy & Data Use policy'
                )}
                .
              </span>
            }
          />
          <FormHelperText id="privacy-desc" sx={{ ml: 5, mt: -0.5 }}>
            Explains what data is collected, how it’s stored, who can access it, and your rights.
          </FormHelperText>

          <FormControlLabel
            control={
              <Checkbox
                checked={values.consent}
                onChange={set('consent')}
                disabled={disabled}
                inputProps={{ 'aria-describedby': 'consent-desc' }}
              />
            }
            label={
              <span>
                I consent to share information relevant to my support with authorised parties.
                {links?.consent && (
                  <>
                    {' '}
                    (<Link href={links.consent} target="_blank" rel="noopener">
                      learn more
                    </Link>)
                  </>
                )}
              </span>
            }
          />
          <FormHelperText id="consent-desc" sx={{ ml: 5, mt: -0.5 }}>
            Only minimum necessary info is shared; you can change or withdraw consent anytime.
          </FormHelperText>
        </FormGroup>

        {/* Disabled reason / error messaging */}
        {disabled && disabledReason && (
          <FormHelperText sx={{ color: 'text.secondary', mt: 0.5 }}>
            {disabledReason}
          </FormHelperText>
        )}
        {!all && !!errorText && (
          <FormHelperText sx={{ color: 'error.main', mt: 0.5 }}>
            {errorText}
          </FormHelperText>
        )}
      </Stack>
    </Paper>
  );
}
