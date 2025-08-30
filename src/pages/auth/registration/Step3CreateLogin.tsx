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

export default function Step3CreateLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.registration.role);

  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<{ password?: string; confirmPassword?: string }>({});
  const [triedSubmit, setTriedSubmit] = React.useState(false);

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
    } else if (values.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    if (!values.confirmPassword) {
      e.confirmPassword = "Please confirm password";
    } else if (values.password !== values.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
  }, [values]);

  const canContinue = Object.keys(errors).length === 0;

  const progress = canContinue ? 100 : 50; // just an example; can be more granular

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!canContinue) return;

    // TODO: dispatch a register action with credentials
    dispatch(nextStep());
    navigate("/auth/sign-in"); // adjust final route
  };

  return (
    <WizardLayout steps={STEPS} activeStep={3}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Stack component="form" spacing={{ xs: 2, sm: 3 }} onSubmit={handleSubmit}>
          <ProgressHeader
            step={3}
            totalSteps={3}
            title="Create Login"
            // subtitle="Choose a secure password for your account."
            progress={progress}
            role={role || "participant"}
          />

          <CreateLoginSection values={values} errors={errors} onChange={onChange} />

          <StickyActions disabled={!canContinue} onContinue={() => navigate('/auth/participant/book-interview')} />
        </Stack>
      </Container>
    </WizardLayout>
  );
}
