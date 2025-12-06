// src/pages/trainers/onboarding/sections/TrainerEmploymentAgreement.tsx
import * as React from "react";
import { Alert } from "@mui/material";
import SectionCard from "../../../components/SectionCard";
import type { TrainerRegistrationErrors, TrainerRegistrationValues } from "../shared/types";
import AgreementReader from "../../../components/AgreementReader";
import ConsentChecklist from "../../../components/ConsentChecklist";
import { AGREEMENT_META } from "../../../shared/agreementText";
import SignatureBlock, { SignatureValue } from "../../../components/SignatureBlock";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";

type Props = {
  values: TrainerRegistrationValues;
  errors: TrainerRegistrationErrors;
  setValue: <K extends keyof TrainerRegistrationValues>(
    k: K,
    v: TrainerRegistrationValues[K]
  ) => void;
};

export default function TrainerEmploymentAgreement({
  values,
  errors,
  setValue,
}: Props) {
  const agreement = values.agreement || {
    tos: false,
    privacy: false,
    confidentiality: false,
    signature: { dataUrl: null, date: "" },
  };

  const updateAgreement = (patch: Partial<typeof agreement>) =>
    setValue("agreement", { ...agreement, ...patch });

  return (
    <SectionCard
      title="Employment Agreement"
      subtitle="Please review and complete before continuing"
        icon={<DescriptionIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />}

    >
      {/* Scrollable agreement text */}
      <AgreementReader onScrolledToEnd={() => {}} />

      {/* Checkboxes */}
      <ConsentChecklist
        values={{
          tos: agreement.tos,
          privacy: agreement.privacy,
        //   confidentiality: agreement.confidentiality,
        }}
        onChange={(p) => updateAgreement(p)}
        links={{
          tos: "/legal/terms",
          privacy: "/legal/privacy",
        }}
        meta={{
          version: AGREEMENT_META.version,
          effectiveDate: AGREEMENT_META.effectiveDate,
        }}
        errorText={errors.agreement}
      />

      {/* Signature */}
      <SignatureBlock
        value={agreement.signature as SignatureValue}
        onChange={(sig) => updateAgreement({ signature: sig })}
      />

      {errors.agreement && (
        <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
          {errors.agreement}
        </Alert>
      )}
    </SectionCard>
  );
}
