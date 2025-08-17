import React from 'react';
import { TextField } from '@mui/material';

const AccountSetup: React.FC = () => (
  <div className="flex flex-col gap-4">
    <TextField label="Username" variant="outlined" fullWidth />
    <TextField
      label="Password"
      type="password"
      helperText="Min 8 characters, at least 1 number & special character"
      variant="outlined"
      fullWidth
    />
    <TextField
      label="Confirm Password"
      type="password"
      variant="outlined"
      fullWidth
    />
  </div>
);

export default AccountSetup;
