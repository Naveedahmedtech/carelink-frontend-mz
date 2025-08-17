import * as React from 'react';
import { Alert, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SectionCard from './SectionCard';
import { FIELD_PROPS } from '../shared/fieldProps';
import { RegistrationErrors, RegistrationValues } from '../shared/types';
import { GridLegacy as GridLegacy } from '@mui/material';
const GridComp = GridLegacy; // keeps TS happy with v1 Grid API

type Props = {
  isMinor: boolean;
  setIsMinor: (v: boolean) => void;
  values: RegistrationValues;
  errors: RegistrationErrors;
  onChange: (k: keyof RegistrationValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function GuardianSection({ isMinor, setIsMinor, values, errors, onChange }: Props) {
  return (
    <SectionCard
      title="Guardian / Carer"
      subtitle="Only required if you are under 18 or have a guardian"
      icon={<FavoriteRoundedIcon fontSize="small" />}
    >
      <FormControlLabel
        sx={{ mb: isMinor ? 1 : 0 }}
        control={<Checkbox checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />}
        label="I am under 18 or have a guardian/carer"
      />
      {isMinor && (
        <>
          <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
            Please provide guardian/carer contact details.
          </Alert>
          <GridComp container spacing={{ xs: 1.5, sm: 2 }}>
            <GridComp item xs={12} sm={4}>
              <TextField {...FIELD_PROPS} label="Guardian/Carer Name"
                value={values.guardianName} onChange={onChange('guardianName')}
                error={!!errors.guardianName} helperText={errors.guardianName} />
            </GridComp>
            <GridComp item xs={12} sm={4}>
              <TextField {...FIELD_PROPS} label="Guardian/Carer Phone"
                value={values.guardianPhone} onChange={onChange('guardianPhone')}
                error={!!errors.guardianPhone} helperText={errors.guardianPhone}
                inputProps={{ inputMode: 'tel' }} />
            </GridComp>
            <GridComp item xs={12} sm={4}>
              <TextField {...FIELD_PROPS} label="Guardian/Carer Email"
                value={values.guardianEmail} onChange={onChange('guardianEmail')}
                error={!!errors.guardianEmail} helperText={errors.guardianEmail}
                inputProps={{ inputMode: 'email' }} />
            </GridComp>
          </GridComp>
        </>
      )}
    </SectionCard>
  );
}
