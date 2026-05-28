"use client";

import { Button } from "@/components/ui/button";
import { VerificationNextStepModal } from "./verification-next-step-modal";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StepButton() {
  const {
    setVerificationStep,
    verificationStep,
    verificationStepReady,
    verificationCompletedStep,
    setVerificationCompletedStep,
  } = useStateContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isReady = verificationStepReady[verificationStep];

  const isPhase2 = verificationStep === 2;
  const isPhase3 = verificationStep === 3;

  const buttonLabel = verificationStep === 1 ? "Continue to Phase 2" : "Submit";

  const buttonProps = isPhase2
    ? { type: "submit" as const, form: "phase-2-verification-form" }
    : isPhase3
      ? { type: "submit" as const, form: "phase-3-verification-form" }
      : { type: "button" as const };

  useEffect(() => {
    if (verificationCompletedStep === 2 || verificationCompletedStep === 3) {
      setIsModalOpen(true);
    }
  }, [verificationCompletedStep]);

  const handleContinue = () => {
    if (verificationCompletedStep === 1 || verificationStep === 1) {
      setVerificationStep(2);
    } else if (verificationCompletedStep === 2 || verificationStep === 2) {
      setVerificationStep(3);
    } else {
      router.push("/dentist");
    }

    setVerificationCompletedStep(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex w-full justify-end px-4 sm:px-6 lg:px-8">
        <Button
          {...buttonProps}
          size="lg"
          disabled={!isReady}
          onClick={() => {
            if (verificationStep === 1) {
              setIsModalOpen(true);
            }
          }}
          className="h-12 rounded-lg px-10 font-semibold"
        >
          {buttonLabel}
        </Button>
      </div>

      <VerificationNextStepModal
        open={isModalOpen}
        step={verificationCompletedStep ?? verificationStep}
        onOpenChange={setIsModalOpen}
        onContinue={handleContinue}
      />
    </>
  );
}
