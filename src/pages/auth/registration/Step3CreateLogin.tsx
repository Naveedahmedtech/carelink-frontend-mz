import * as React from "react";
import { Container, Stack } from "@mui/material";
import WizardLayout from "../../../components/wizard/WizardLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { nextStep } from "../../../redux/features/auth/registrationSlice";
import ProgressHeader from "./components/ProgressHeader";
import CreateLoginSection from "./components/CreateLoginSection";
import StickyActions from "./components/StickyActions";
import { STEPS } from "./shared/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSetPasswordMutation } from "../../../redux/features/authApi";

export default function Step3CreateLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.registration.role);
  const trainerProfile = useAppSelector((s) => s.trainer);

  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<{ password?: string; confirmPassword?: string }>({});
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  const [setPassword, { isLoading }] = useSetPasswordMutation();

  // derive email
  let email: string | null = trainerProfile?.email || null;
  if (!email) {
    const step1Saved = localStorage.getItem("participant-registration-step1");
    if (step1Saved) {
      try {
        const parsed = JSON.parse(step1Saved);
        email = parsed.values?.email || null;
      } catch {
        email = null;
      }
    }
  }

  const onChange =
    (key: "password" | "confirmPassword") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((s) => ({ ...s, [key]: e.target.value }));
      };

  // validation
  React.useEffect(() => {
    const e: { password?: string; confirmPassword?: string } = {};
    if (!values.password) {
      e.password = "Password is required";
    } else if (values.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }
    if (!values.confirmPassword) {
      e.confirmPassword = "Please confirm password";
    } else if (values.password !== values.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
  }, [values]);

  const canContinue = Object.keys(errors).length === 0;

  const progress = canContinue ? 100 : 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!canContinue || !email) {
      toast.error("Please fix errors before continuing");
      return;
    }

    try {
      await setPassword({ email, password: values.password }).unwrap();
      toast.success("Password set successfully!");
      dispatch(nextStep());
      localStorage.removeItem('participant-registration-step2')

      navigate("/auth/sign-in");
    } catch (err: any) {
      const message = err?.data?.message || "Failed to set password";
      toast.error(message);
      console.error("Failed to set password", err);
    }
  };

  return (
    <WizardLayout steps={STEPS} activeStep={3}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack component="form" spacing={{ xs: 2, sm: 3 }} onSubmit={handleSubmit}>
          <ProgressHeader
            step={3}
            totalSteps={3}
            title="Create Login"
            progress={progress}
            role={role || "participant"}
          />

          <CreateLoginSection values={values} errors={errors} onChange={onChange} />

          <StickyActions
            disabled={!canContinue || isLoading}
            onContinue={handleSubmit}
          />
        </Stack>
      </Container>
    </WizardLayout>
  );
}
