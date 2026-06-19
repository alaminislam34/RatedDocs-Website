"use client";

import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import Phase1 from "../../../modules/dentist/verification/phase-1/Phase1";
import MultiStepForm from "../../../modules/dentist/verification/phase-2/MultiStepForm";
import Phase3 from "../../../modules/dentist/verification/phase-3/Phase3";

export default function PhaseOnePage() {
  const { verificationStep } = useVerificationStore();

  return (
    <>
      {verificationStep === 1 && <Phase1 />}
      {verificationStep === 2 && <MultiStepForm />}
      {verificationStep === 3 && <Phase3 />}
    </>
  );
}
