import React, { useState } from 'react';
import ParticipantRegistration from './ParticipantRegistration';
import TrainerRegistration from './TrainerRegistration';

const Registration: React.FC = () => {
  const [role] = useState<'TRAINER' | 'PARTICIPANT' | null>(null);


  if (role === 'PARTICIPANT') {
    return <ParticipantRegistration />;
  }

  if (role === 'TRAINER') {
    return <TrainerRegistration />;
  }

  return null;
};

export default Registration;
