"use client";

import { useEffect } from "react";
import { useStateContext } from "@/providers/StateProvider";
import { VerificationBanner } from "./verification-banner";
import MainOverviewPage from "./main-overview-page";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import type {
  DentistVerificationProgress,
  VerificationProgressStep,
  VerificationPhase,
} from "./verification-progress.types";

const getStepByPhase = (
  steps: VerificationProgressStep[],
  phase: VerificationPhase,
) => steps.find((step) => step.phase === phase);

export function OverviewPageSwitcher() {
  const { setVerificationStep } = useStateContext();
  const {
    data: progressData,
    isLoading,
    isError,
    refetch,
  } = useDentistProgress();

  const progress = progressData?.data as DentistVerificationProgress | undefined;

  const steps = progress?.steps || [];
  const licenseStep = getStepByPhase(steps, "LICENSE");
  const operationalStep = getStepByPhase(steps, "OPERATIONAL");
  const clinicalStep = getStepByPhase(steps, "CLINICAL");

  const step1Done = licenseStep
    ? licenseStep.completed
    : progress?.is_step_one_completed ||
      (progress?.step_one_status && progress?.step_one_status !== "PENDING");
  const step2Done = operationalStep
    ? operationalStep.completed
    : progress?.is_step_two_completed ||
      (progress?.step_two_status && progress?.step_two_status !== "PENDING");
  const step3Done = clinicalStep
    ? clinicalStep.completed
    : progress?.is_step_three_completed ||
      (progress?.step_three_status &&
        progress?.step_three_status !== "PENDING");

  useEffect(() => {
    if (progress) {
      if (!step1Done) {
        setVerificationStep(1);
      } else if (!step2Done) {
        setVerificationStep(2);
      } else if (!step3Done) {
        setVerificationStep(3);
      } else {
        setVerificationStep(3);
      }
    }
  }, [progress, step1Done, step2Done, step3Done, setVerificationStep]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center w-full px-4">
        <div className="mx-auto max-w-xl w-full bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm animate-pulse">
          <div className="flex flex-col items-center text-center">
            {/* Circular progress skeleton */}
            <div className="mb-8 h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-white flex flex-col items-center justify-center">
                <div className="h-6 w-12 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Title & subtitle skeletons */}
            <div className="h-6 w-48 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-72 bg-gray-100 rounded mb-8" />

            {/* Step row skeletons */}
            <div className="mt-8 w-full max-w-md mx-auto space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 text-left space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                  </div>
                  <div className="h-6 w-16 rounded bg-gray-100 shrink-0" />
                </div>
              ))}
            </div>

            {/* Button skeleton */}
            <div className="mt-8 w-full">
              <div className="h-14 w-full rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 w-full">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800">
            Verification Error
          </h3>
          <p className="mt-2 text-sm text-red-600">
            We encountered a server error (500) while fetching your verification
            status. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0E3E65] hover:bg-[#082842] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const isVerified =
    progress?.is_verified ||
    progress?.verification_phase === "COMPLETE" ||
    (step1Done && step2Done && step3Done);

  return isVerified ? (
    <MainOverviewPage />
  ) : (
    <div className="min-h-[80vh] flex items-center justify-center">
      <VerificationBanner />
    </div>
  );
}
