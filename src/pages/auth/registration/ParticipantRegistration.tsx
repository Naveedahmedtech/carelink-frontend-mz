import React from 'react';
import RegistrationStepper, { RegistrationStep } from './components/RegistrationStepper';
import ParticipantDetails from './participant/ParticipantDetails';
import ServiceAgreement from './participant/ServiceAgreement';
import AccountSetup from './participant/AccountSetup';

const steps: RegistrationStep[] = [
  { label: 'Participant Details', component: <ParticipantDetails /> },
  { label: 'Service Agreement', component: <ServiceAgreement /> },
  { label: 'Create Account', component: <AccountSetup /> },
];

const ParticipantRegistration: React.FC = () => (
  <RegistrationStepper steps={steps} />
);

export default ParticipantRegistration;
