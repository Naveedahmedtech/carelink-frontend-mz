import React from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const modules = [
  'Company Orientation',
  'Dealing with People with Disabilities',
  'Our Processes',
  'Privacy & Confidentiality',
  'Our Mission & Values',
];

const TrainingModules: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Typography>
      Complete the following CareLink training modules. Progress and quizzes
      will be implemented.
    </Typography>
    <FormGroup>
      {modules.map((module) => (
        <FormControlLabel
          key={module}
          control={<Checkbox />}
          label={module}
        />
      ))}
    </FormGroup>
  </div>
);

export default TrainingModules;
