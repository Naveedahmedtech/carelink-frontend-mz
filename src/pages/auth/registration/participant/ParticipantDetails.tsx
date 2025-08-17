import React, { useState } from 'react';
import {
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';

const interests = [
  'Boxing',
  'Fitness',
  'Outdoors',
  'Cooking',
  'Community Participation',
  'Arts & Crafts',
];

const fundingOptions = ['Plan Managed', 'Self-Managed', 'NDIA Managed'];

const ParticipantDetails: React.FC = () => {
  const [fundingType, setFundingType] = useState('');
  const [hasGuardian, setHasGuardian] = useState(false);

  const showPlanManager =
    fundingType === 'Plan Managed' || fundingType === 'Self-Managed';

  return (
    <div className="flex flex-col gap-4">
      <TextField label="Full Name" variant="outlined" fullWidth />
      <TextField label="NDIS Number" variant="outlined" fullWidth />
      <TextField
        label="Date of Birth"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField label="Residential Address" variant="outlined" fullWidth />
      <TextField label="Email" type="email" variant="outlined" fullWidth />
      <TextField label="Mobile Number" variant="outlined" fullWidth />

      <FormControlLabel
        control={
          <Checkbox
            checked={hasGuardian}
            onChange={(e) => setHasGuardian(e.target.checked)}
          />
        }
        label="Add Guardian/Carer Details"
      />
      {hasGuardian && (
        <div className="flex flex-col gap-4">
          <TextField label="Guardian Name" fullWidth />
          <TextField label="Guardian Phone" fullWidth />
          <TextField label="Guardian Email" type="email" fullWidth />
        </div>
      )}

      <FormGroup row>
        {interests.map((interest) => (
          <FormControlLabel
            key={interest}
            control={<Checkbox />}
            label={interest}
          />
        ))}
      </FormGroup>

      <TextField
        label="Preferred Days/Times"
        variant="outlined"
        placeholder="e.g. Mon 9am-12pm; Tue 1pm-4pm"
        fullWidth
      />

      <TextField
        select
        label="Funding Type"
        value={fundingType}
        onChange={(e) => setFundingType(e.target.value)}
        fullWidth
      >
        {fundingOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {showPlanManager && (
        <>
          <TextField label="Plan Manager Name" fullWidth />
          <TextField label="Invoice Email" type="email" fullWidth />
        </>
      )}
    </div>
  );
};

export default ParticipantDetails;
