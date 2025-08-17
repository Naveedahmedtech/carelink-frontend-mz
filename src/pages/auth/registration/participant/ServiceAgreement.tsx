import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
} from '@mui/material';

const ServiceAgreement: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Typography variant="body1">
      Please review the CareLink service agreement and acknowledge the terms
      before proceeding.
    </Typography>
    <FormControlLabel
      control={<Checkbox />}
      label="I have read and accept the Terms of Service"
    />
    <FormControlLabel
      control={<Checkbox />}
      label="I agree to the Privacy Policy"
    />
    <TextField label="Signature" variant="outlined" fullWidth />
    <TextField
      label="Date"
      type="date"
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  </div>
);

export default ServiceAgreement;
