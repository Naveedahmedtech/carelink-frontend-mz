import * as React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import SectionCard from './SectionCard';
import { FIELD_PROPS } from '../shared/fieldProps';
import { RegistrationErrors, RegistrationValues } from '../shared/types';

type Props = {
  values: RegistrationValues;
  errors: RegistrationErrors;
  onChange: (k: keyof RegistrationValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function IdentitySection({ values, errors, onChange }: Props) {
  return (
    <SectionCard
      title="Your Details"
      subtitle="Who you are and how we can reach you"
      icon={<BadgeRoundedIcon fontSize="small" />}
    >
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField {...FIELD_PROPS} label="Full Name" value={values.fullName}
            onChange={onChange('fullName')} error={!!errors.fullName} helperText={errors.fullName} autoComplete="name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...FIELD_PROPS} label="NDIS Number" value={values.ndisNumber}
            onChange={onChange('ndisNumber')} error={!!errors.ndisNumber}
            helperText={errors.ndisNumber || 'If applicable. Format: 9 digits.'}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><ShieldRoundedIcon fontSize="small" /></InputAdornment> }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...FIELD_PROPS} label="Date of Birth" type="date" value={values.dob}
            onChange={onChange('dob')} error={!!errors.dob} helperText={errors.dob}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <InputAdornment position="start"><EventRoundedIcon fontSize="small" /></InputAdornment> }}
            autoComplete="bday" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...FIELD_PROPS} label="Residential Address" value={values.address}
            onChange={onChange('address')} error={!!errors.address}
            helperText={errors.address || 'We’ll add address autocomplete later.'}
            autoComplete="street-address"
            InputProps={{ startAdornment: <InputAdornment position="start"><HomeRoundedIcon fontSize="small" /></InputAdornment> }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...FIELD_PROPS} label="Email" value={values.email}
            onChange={onChange('email')} error={!!errors.email} helperText={errors.email}
            autoComplete="email" inputProps={{ inputMode: 'email' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon fontSize="small" /></InputAdornment> }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...FIELD_PROPS} label="Mobile Number" value={values.phone}
            onChange={onChange('phone')} error={!!errors.phone}
            helperText={errors.phone ?? 'Australian format (e.g., 04xx xxx xxx)'}
            autoComplete="tel" inputProps={{ inputMode: 'tel' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIphoneRoundedIcon fontSize="small" /></InputAdornment> }} />
        </Grid>
      </Grid>
    </SectionCard>
  );
}
