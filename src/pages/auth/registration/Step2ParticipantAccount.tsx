import * as React from 'react';
import { Container, Stack } from '@mui/material';
import WizardLayout from '../../../components/wizard/WizardLayout';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { nextStep, setAccountDraft /*, setRole*/ } from '../../../redux/features/auth/registrationSlice';
import ProgressHeader from './components/ProgressHeader';
import IdentitySection from './components/IdentitySection';
import GuardianSection from './components/GuardianSection';
import PreferencesFundingSection from './components/PreferencesFundingSection';
import StickyActions from './components/StickyActions';
import { STEPS } from './shared/constants';
import { FundingType, RegistrationErrors, RegistrationValues } from './shared/types';
import { useNavigate } from 'react-router-dom';

// NEW: shared Role type for the header switcher
type Role = 'participant' | 'trainer'  | 'admin';

const ROLE_ROUTES: Record<Role, string> = {
  participant: '/auth/register/participant',       // step 1 route
  trainer: '/auth/register/trainer',
  admin: '/auth/register/admin',
};

export default function Step1ParticipantRegistration() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.registration.role) as Role;

  // If you still want to hard-guard participant only, uncomment:
  // React.useEffect(() => {
  //   if (role !== 'participant') navigate('/register/role', { replace: true });
  // }, [role, navigate]);

  // NEW: handle role change from the header
  const handleRoleChange = (r: Role) => {
    // If you keep role in Redux, set it here so other steps see it:
    // dispatch(setRole(r));
    // Navigate to that role's step 1 route (adjust if your paths differ).
    navigate(ROLE_ROUTES[r], { replace: true });
  };

  const [isMinor, setIsMinor] = React.useState(false);
  const [fundingType, setFundingType] = React.useState<FundingType>('plan');

  const [values, setValues] = React.useState<RegistrationValues>({
    fullName: '', ndisNumber: '', dob: '', address: '', email: '', phone: '',
    guardianName: '', guardianPhone: '', guardianEmail: '',
    interests: [], availability: {}, planManagerName: '', planManagerEmail: '',
  });

  const onChange = (key: keyof RegistrationValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((s) => ({ ...s, [key]: e.target.value }));

  const setDayAvailability = (day: string, val: string) =>
    setValues((s) => ({ ...s, availability: { ...s.availability, [day]: val } }));

  const setInterests = (tags: string[]) =>
    setValues((s) => ({ ...s, interests: tags }));

  // validation (unchanged)
  const errors = React.useMemo<RegistrationErrors>(() => {
    const e: RegistrationErrors = {};
    if (!values.fullName.trim()) e.fullName = 'Required';
    if (!values.ndisNumber.trim()) e.ndisNumber = 'Required';
    if (!values.dob) e.dob = 'Required';
    if (!values.address.trim()) e.address = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Enter a valid email';
    if (!/^\+?[0-9()\-.\s]{7,}$/.test(values.phone)) e.phone = 'Enter a valid phone';
    if (isMinor) {
      if (!values.guardianName.trim()) e.guardianName = 'Required for minors';
      if (!/^\+?[0-9()\-.\s]{7,}$/.test(values.guardianPhone)) e.guardianPhone = 'Enter a valid phone';
      if (!/^\S+@\S+\.\S+$/.test(values.guardianEmail)) e.guardianEmail = 'Enter a valid email';
    }
    if (fundingType !== 'ndia') {
      if (!values.planManagerName.trim()) e.planManagerName = 'Required';
      if (!/^\S+@\S+\.\S+$/.test(values.planManagerEmail)) e.planManagerEmail = 'Enter a valid email';
    }
    return e;
  }, [values, isMinor, fundingType]);

  const canContinue = Object.keys(errors).length === 0;

  const progressParts = [
    !!values.fullName.trim(), !!values.ndisNumber.trim(), !!values.dob, !!values.address.trim(),
    /^\S+@\S+\.\S+$/.test(values.email), /^\+?[0-9()\-.\s]{7,}$/.test(values.phone),
    ...(isMinor ? [!!values.guardianName.trim(),
      /^\+?[0-9()\-.\s]{7,}$/.test(values.guardianPhone),
      /^\S+@\S+\.\S+$/.test(values.guardianEmail)] : []),
    ...(fundingType !== 'ndia' ? [!!values.planManagerName.trim(),
      /^\S+@\S+\.\S+$/.test(values.planManagerEmail)] : []),
  ];
  const progress = Math.round((progressParts.filter(Boolean).length / Math.max(progressParts.length, 1)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    dispatch(setAccountDraft({ role: 'participant', ...values, isMinor, fundingType }));
    dispatch(nextStep());
    navigate('/auth/register/participant/agreement');
  };

  return (
    <WizardLayout steps={STEPS} activeStep={1}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack component="form" spacing={{ xs: 2, sm: 3 }} onSubmit={handleSubmit}>
          {/* NEW: role-aware header */}
          <ProgressHeader
            step={1}
            totalSteps={3}
            title="Participant Registration"
            subtitle="Provide your personal details, preferences, and funding info."
            progress={progress}
            role={role}
          />

          <IdentitySection values={values} errors={errors} onChange={onChange} />
          <GuardianSection isMinor={isMinor} setIsMinor={setIsMinor} values={values} errors={errors} onChange={onChange} />
          <PreferencesFundingSection
            values={values}
            errors={errors}
            fundingType={fundingType}
            setFundingType={setFundingType}
            onChange={onChange}
            setDayAvailability={setDayAvailability}
            setInterests={setInterests}
          />
          <StickyActions disabled={!canContinue} />
        </Stack>
      </Container>
    </WizardLayout>
  );
}
