import * as React from "react";
import { Container, Stack } from "@mui/material";
import WizardLayout from "../../../components/wizard/WizardLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { nextStep } from "../../../redux/features/auth/registrationSlice";
import ProgressHeader from "./components/ProgressHeader";
import AgreementReader from "./components/AgreementReader";
import ConsentChecklist from "./components/ConsentChecklist";
import SignatureBlock, { SignatureValue } from "./components/SignatureBlock";
import StickyActions from "./components/StickyActions";
import { STEPS } from "./shared/constants";
import { AGREEMENT_META } from "./shared/agreementText";
import { useNavigate } from "react-router-dom";
import { useUpsertParticipantMutation } from "../../../redux/features/participantApi";
import { toast } from "react-toastify";

type Role = "participant" | "trainer" | "admin";

const ROLE_ROUTES: Record<Role, string> = {
  participant: "/auth/register/participant",
  trainer: "/auth/register/trainer",
  admin: "/auth/signin",
};

// 🔹 localStorage key
const STORAGE_KEY = "participant-registration-step2";

export default function Step2ServiceAgreement() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.registration.role) as Role;
  const [upsertParticipant] = useUpsertParticipantMutation();

  // state
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const [checks, setChecks] = React.useState({
    tos: false,
    privacy: false,
    consent: false,
  });
  const [sig, setSig] = React.useState<SignatureValue>({
    dataUrl: null,
    date: "",
  });
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  // 🔹 Load from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setHasScrolled(parsed.hasScrolled || false);
      setChecks(parsed.checks || { tos: false, privacy: false, consent: false });
      setSig(parsed.sig || { dataUrl: null, date: "" });
    }
  }, []);

  // 🔹 Save to localStorage
  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ hasScrolled, checks, sig })
    );
  }, [hasScrolled, checks, sig]);

  // progress: 1/3 read-to-end, 1/3 all checks, 1/3 signature+date
  const progress = Math.round(
    ((hasScrolled ? 1 : 0) +
      (Object.values(checks).every(Boolean) ? 1 : 0) +
      (sig.dataUrl && sig.date ? 1 : 0)) /
      3 *
      100
  );

  console.log(sig)

  const canContinue =
    Object.values(checks).every(Boolean) && !!sig.dataUrl && !!sig.date;

  const handleRoleChange = (r: Role) => {
    navigate(ROLE_ROUTES[r], { replace: true });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setTriedSubmit(true);
  if (!canContinue) return;

  // 🔹 Get Step 1 data (email etc.) from localStorage
  const step1Saved = localStorage.getItem("participant-registration-step1");
  let email: string | null = null;
  if (step1Saved) {
    try {
      const parsed = JSON.parse(step1Saved);
      email = parsed.values?.email || null;
    } catch (err) {
      console.warn("Failed to parse step1 localStorage", err);
    }
  }

  try {
    await upsertParticipant({
      step: 2,
      email, // ✅ send email so backend can match participant
      agreement: {
        version: AGREEMENT_META.version,
        effectiveDate: AGREEMENT_META.effectiveDate,
        acknowledged: checks,
        signature: sig,
      },
    }).unwrap();

    toast.success("Agreement saved!");


    dispatch(nextStep());
    navigate("/auth/register/participant/create-login");
  } catch (err: any) {
    console.error("Failed to save agreement:", err);
    toast.error(
      err?.data?.message || "Failed to save agreement. Please try again."
    );
  }
};


  return (
    <WizardLayout steps={STEPS} activeStep={2}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack component="form" spacing={{ xs: 2, sm: 3 }} onSubmit={handleSubmit}>
          <ProgressHeader
            step={2}
            totalSteps={3}
            title="Service Agreement"
            progress={progress}
            role={role || "participant"}
          />

          <AgreementReader onScrolledToEnd={setHasScrolled} />

          <ConsentChecklist
            values={checks}
            onChange={(p) => setChecks((s) => ({ ...s, ...p }))}
            links={{
              tos: "/legal/terms",
              privacy: "/legal/privacy",
              consent: "/legal/consent",
            }}
            meta={{
              version: AGREEMENT_META.version,
              effectiveDate: AGREEMENT_META.effectiveDate,
            }}
            errorText={
              triedSubmit && !Object.values(checks).every(Boolean)
                ? "Please acknowledge all items to continue."
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
