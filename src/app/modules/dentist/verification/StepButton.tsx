"use client";

import { Button } from "@/components/ui/button";
import { VerificationNextStepModal } from "./verification-next-step-modal";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import useDentist from "@/hooks/dentist/useDentist";
import { Loader2 } from "lucide-react";

export default function StepButton() {
  const {
    setVerificationStep,
    verificationStep,
    verificationStepReady,
    verificationCompletedStep,
    setVerificationCompletedStep,
  } = useStateContext();
  const router = useRouter();

  const { stepOneMutation, stepTwoMutation, stepThreeMutation } = useDentist();
  const isSubmitting =
    stepOneMutation.isPending ||
    stepTwoMutation.isPending ||
    stepThreeMutation.isPending;

  const isReady = verificationStepReady[verificationStep];

  const buttonLabel =
    verificationStep === 3
      ? "Submit & Complete"
      : `Continue to Phase ${verificationStep + 1}`;

  const buttonProps = {
    type: "submit" as const,
    form: `phase-${verificationStep}-verification-form`,
  };

  const isModalOpen =
    verificationCompletedStep !== null &&
    verificationCompletedStep === verificationStep;

  const handleContinue = () => {
    if (verificationCompletedStep === 1) {
      setVerificationStep(2);
    } else if (verificationCompletedStep === 2) {
      setVerificationStep(3);
    } else {
      router.push("/dentist");
    }

    setVerificationCompletedStep(null);
  };

  return (
    <>
      <div className="flex w-full justify-end px-4 sm:px-6 lg:px-8">
        <Button
          {...buttonProps}
          size="lg"
          disabled={!isReady || isSubmitting}
          className="h-12 rounded-lg px-10 font-semibold bg-[#0E3E65] text-white hover:bg-[#0E3E65]/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            buttonLabel
          )}
        </Button>
      </div>

      <VerificationNextStepModal
        open={isModalOpen}
        step={verificationCompletedStep ?? verificationStep}
        onOpenChange={(open) => {
          if (!open) {
            setVerificationCompletedStep(null);
          }
        }}
        onContinue={handleContinue}
      />
    </>
  );
}
