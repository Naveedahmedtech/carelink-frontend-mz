import * as React from 'react';
import { Container, Stack } from '@mui/material';
import WizardLayout from '../../../components/wizard/WizardLayout';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { nextStep } from '../../../redux/features/auth/registrationSlice';
import ProgressHeader from './components/ProgressHeader';
import AgreementReader from './components/AgreementReader';
import ConsentChecklist from './components/ConsentChecklist';
import SignatureBlock, { SignatureValue } from './components/SignatureBlock';
import StickyActions from './components/StickyActions';
import { STEPS } from './shared/constants';
import { AGREEMENT_META } from './shared/agreementText';
import { useNavigate } from 'react-router-dom';

// ---- role routing (adjust if your paths differ)
type Role = 'participant' | 'trainer' | 'admin';
const ROLE_ROUTES: Record<Role, string> = {
  participant: '/auth/register/participant',
  trainer: '/auth/register/trainer',
  admin: '/auth/signin',
};

export default function Step2ServiceAgreement() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.registration.role) as Role;

  // state
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const [checks, setChecks] = React.useState({ tos: false, privacy: false, consent: false });
  const [sig, setSig] = React.useState<SignatureValue>({ dataUrl: null, date: '' });
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  // progress: 1/3 read-to-end, 1/3 all checks, 1/3 signature+date
  const progress = Math.round(
    ((hasScrolled ? 1 : 0) +
      (Object.values(checks).every(Boolean) ? 1 : 0) +
      (sig.dataUrl && sig.date ? 1 : 0)) /
      3 *
      100
  );

  // Your current choice: do NOT gate submit on scroll
  const canContinue = Object.values(checks).every(Boolean) && !!sig.dataUrl && !!sig.date;
  // If you want to gate on scroll again, add: && hasScrolled

  const handleRoleChange = (r: Role) => {
    // If you store role in Redux, dispatch setRole(r) here
    navigate(ROLE_ROUTES[r], { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!canContinue) return;

    // TODO: generate & upload signed PDF, then email (RTK Query mutation)
    dispatch(nextStep());
    navigate('/auth/register/participant/create-login');
  };

  return (
    <WizardLayout steps={STEPS} activeStep={2}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack component="form" spacing={{ xs: 2, sm: 3 }} onSubmit={handleSubmit}>
          <ProgressHeader
            step={2}
            totalSteps={3}
            title="Service Agreement"
            subtitle="Read the agreement, acknowledge the policies, and sign to continue."
            progress={progress}
            role={role || 'participant'}
            // roles={['participant', 'trainer', 'admin']}
            // onRoleChange={handleRoleChange}
          />

          <AgreementReader onScrolledToEnd={setHasScrolled} />

          <ConsentChecklist
            values={checks}
            onChange={(p) => setChecks((s) => ({ ...s, ...p }))}
            // keep enabled even if not scrolled; uncomment next lines to gate:
            // disabled={!hasScrolled}
            // disabledReason={!hasScrolled ? 'Scroll to the end to enable acknowledgements.' : undefined}
            links={{ tos: '/legal/terms', privacy: '/legal/privacy', consent: '/legal/consent' }}
            meta={{ version: AGREEMENT_META.version, effectiveDate: AGREEMENT_META.effectiveDate }}
            errorText={
              triedSubmit && !Object.values(checks).every(Boolean)
                ? 'Please acknowledge all items to continue.'
                : undefined
            }
          />

          <SignatureBlock value={sig} onChange={setSig} />

          <StickyActions disabled={!canContinue} />
        </Stack>
      </Container>
    </WizardLayout>
  );
}
