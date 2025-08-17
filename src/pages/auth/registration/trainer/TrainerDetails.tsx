import React from 'react';
import { TextField } from '@mui/material';

const TrainerDetails: React.FC = () => (
  <div className="flex flex-col gap-4">
    <TextField label="Full Name" variant="outlined" fullWidth />
    <TextField label="Email" type="email" variant="outlined" fullWidth />
    <TextField label="Mobile Number" variant="outlined" fullWidth />
    <TextField label="Home Address" variant="outlined" fullWidth />
    <TextField
      label="Availability"
      variant="outlined"
      placeholder="e.g. Mon–Fri 9am-5pm"
      fullWidth
    />
    <TextField label="Travel Areas" variant="outlined" fullWidth />
    <TextField
      label="Specialisations"
      variant="outlined"
      placeholder="e.g. Autism, Disabilities, Mental Health"
      fullWidth
    />
  </div>
);

export default TrainerDetails;
