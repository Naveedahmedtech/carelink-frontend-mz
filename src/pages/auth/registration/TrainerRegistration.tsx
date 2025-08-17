import React from 'react';
import RegistrationStepper, { RegistrationStep } from './components/RegistrationStepper';
import TrainerDetails from './trainer/TrainerDetails';
import DocumentUpload from './trainer/DocumentUpload';
import TrainingModules from './trainer/TrainingModules';
import InterviewBooking from './trainer/InterviewBooking';

const steps: RegistrationStep[] = [
  { label: 'Trainer Details', component: <TrainerDetails /> },
  { label: 'Document Uploads', component: <DocumentUpload /> },
  { label: 'Training Modules', component: <TrainingModules /> },
  { label: 'Interview Booking', component: <InterviewBooking /> },
];

const TrainerRegistration: React.FC = () => (
  <RegistrationStepper steps={steps} />
);

export default TrainerRegistration;
