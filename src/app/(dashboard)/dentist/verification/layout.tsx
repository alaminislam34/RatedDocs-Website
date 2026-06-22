"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { VerificationSteps } from "../../../modules/dentist/verification/verification-steps";
import StepButton from "../../../modules/dentist/verification/StepButton";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import type { VerificationPhaseStep } from "@/hooks/dentist/useStepProgress";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { verificationStep, setVerificationStep } = useVerificationStore();
  const {
    submittedByStep,
    nextIncompleteStep,
    canAccessStep,
    isProgressLoading,
    rdvScore,
  } = useVerificationProgress();
  const router = useRouter();

  const resolvedStep = useMemo<VerificationPhaseStep>(() => {
    const currentStep = verificationStep as VerificationPhaseStep;

    if (!canAccessStep(currentStep)) {
      if (!submittedByStep[1]) return 1;
      if (!submittedByStep[2]) return 2;
      return 3;
    }

    if (submittedByStep[currentStep] && currentStep !== 3) {
      return nextIncompleteStep;
    }

    return currentStep;
  }, [canAccessStep, nextIncompleteStep, submittedByStep, verificationStep]);

  useEffect(() => {
    if (isProgressLoading || resolvedStep === verificationStep) return;

    const timeoutId = window.setTimeout(() => {
      setVerificationStep(resolvedStep);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isProgressLoading, resolvedStep, setVerificationStep, verificationStep]);

  const handleBack = () => {
    if (verificationStep === 1) {
      router.push("/dentist");
    } else if (verificationStep === 2) {
      setVerificationStep(1);
    } else if (verificationStep === 3) {
      setVerificationStep(2);
    }
  };

  return (
    <div className="flex flex-col">
      <header className=" border-b pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-xl font-bold text-[#0A2533]">
              Verification Progress
            </h1>
            <p className="text-xs font-semibold text-[#F2C467]">
              RDV Score {rdvScore}%
            </p>
          </div>

          {/* Stepper Component */}
          <VerificationSteps />
        </div>
      </header>

      {/* Middle Part - Changeable Content */}
      <main className="flex-1 py-10 pb-32">
        <div className="min-h-full ">
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
            {isProgressLoading ? (
              <div className="flex min-h-80 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#0E3E65]" />
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>

      {/* Bottom Bar - Always visible */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white py-6 z-50">
        <StepButton />
      </footer>
    </div>
  );
}
