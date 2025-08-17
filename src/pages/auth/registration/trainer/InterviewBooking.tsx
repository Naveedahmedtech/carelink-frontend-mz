import React from 'react';
import { Typography, TextField } from '@mui/material';

const InterviewBooking: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Typography>Book your interview slot</Typography>
    <TextField label="Preferred Date" type="date" InputLabelProps={{ shrink: true }} fullWidth />
    <TextField label="Preferred Time" type="time" InputLabelProps={{ shrink: true }} fullWidth />
  </div>
);

export default InterviewBooking;
