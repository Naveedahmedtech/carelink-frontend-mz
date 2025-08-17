import React from 'react';
import { Typography, Button } from '@mui/material';

const requiredDocs = [
  'NDIS Worker Screening Check',
  'Working With Children Check',
  "Driver's Licence",
];

const optionalDocs = [
  'First Aid Certificate',
  'CPR Certificate',
  'Disability Qualification',
];

const DocumentUpload: React.FC = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <Typography variant="subtitle1">Required Documents</Typography>
      {requiredDocs.map((doc) => (
        <Button
          key={doc}
          variant="outlined"
          component="label"
          className="justify-start"
        >
          {doc}
          <input type="file" hidden />
        </Button>
      ))}
    </div>
    <div className="flex flex-col gap-2">
      <Typography variant="subtitle1">Optional Documents</Typography>
      {optionalDocs.map((doc) => (
        <Button
          key={doc}
          variant="outlined"
          component="label"
          className="justify-start"
        >
          {doc}
          <input type="file" hidden />
        </Button>
      ))}
    </div>
  </div>
);

export default DocumentUpload;
