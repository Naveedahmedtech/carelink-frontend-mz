import * as React from "react";
import {
  VisibilityOff as EyeOffIcon,
  Visibility as EyeIcon,
  LockRounded as LockIcon,
} from "@mui/icons-material";
import SectionCard from "./SectionCard";
import { RegistrationErrors, RegistrationValues } from "../shared/types";

type Props = {
  values: any;
  errors: any;
  onChange: any;
  // onChange: (
  //   k: keyof RegistrationValues
  // ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CreateLoginSection({ values, errors, onChange }: Props) {
  const [showPw, setShowPw] = React.useState(false);
  const [showPw2, setShowPw2] = React.useState(false);

  const passwordStrength = getPasswordStrength(values.password);

  return (
    <SectionCard
      title="Create Login"
      subtitle="Set a strong password to secure your account"
      icon={<LockIcon fontSize="small" className="text-primary" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        {/* Password */}
        <InputField
          label="Password"
          type={showPw ? "text" : "password"}
          value={values.password}
          onChange={onChange("password")}
          error={errors.password}
          autoComplete="new-password"
          icon={<LockIcon fontSize="small" className="text-textSecondary" />}
          trailing={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="p-1 text-textSecondary"
            >
              {showPw ? <EyeOffIcon fontSize="small" /> : <EyeIcon fontSize="small" />}
            </button>
          }
        />
        {/* Confirm Password */}
        <InputField
          label="Confirm Password"
          type={showPw2 ? "text" : "password"}
          value={values.confirmPassword}
          onChange={onChange("confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
          icon={<LockIcon fontSize="small" className="text-textSecondary" />}
          trailing={
            <button
              type="button"
              onClick={() => setShowPw2((s) => !s)}
              className="p-1 text-textSecondary"
            >
              {showPw2 ? <EyeOffIcon fontSize="small" /> : <EyeIcon fontSize="small" />}
            </button>
          }
        />
      </div>

      {/* Password strength indicator */}
      {values.password && (
        <div className="mt-3">
          <div className="h-2 rounded bg-border overflow-hidden">
            <div
              className={`h-full transition-all ${
                passwordStrength.score === 3
                  ? "bg-success"
                  : passwordStrength.score === 2
                  ? "bg-warning"
                  : "bg-error"
              }`}
              style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-textSecondary">
            {passwordStrength.label}
          </p>
        </div>
      )}
    </SectionCard>
  );
}

/** Password strength checker (0–3) */
function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const label =
    score === 0
      ? "Too short"
      : score === 1
      ? "Weak"
      : score === 2
      ? "Medium"
      : "Strong";
  return { score, label };
}

function InputField({
  label,
  error,
  helper,
  icon,
  trailing,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm bg-backgroundShade1 text-text
            focus:ring-2 focus:ring-primary outline-none
            ${icon ? "pl-10" : ""}
            ${trailing ? "pr-10" : ""}
            ${error ? "border-error" : "border-border"}
          `}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-textSecondary">{helper}</p>
      ) : null}
    </div>
  );
}
