"use client";

import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

export function VerificationBanner() {
  const router = useRouter();
  const { data: progressData } = useDentistProgress();
  console.log(progressData, "data");

  const progress = progressData?.data as
    | DentistVerificationProgress
    | undefined;

  const steps = progress?.steps || [];
  const licenseStep = getStepByPhase(steps, "LICENSE");
  const operationalStep = getStepByPhase(steps, "OPERATIONAL");
  const clinicalStep = getStepByPhase(steps, "CLINICAL");

  // Helper to resolve step status
  const getStepStatus = (
    step: VerificationProgressStep | undefined,
    fallbackStatus?: string | null,
  ) => {
    if (fallbackStatus && fallbackStatus !== "PENDING") return fallbackStatus;
    if (!step) return "PENDING";
    if (step.status) return step.status;
    return step.completed ? "VERIFIED" : "PENDING";
  };

  const step1Status = getStepStatus(licenseStep, progress?.step_one_status);
  const step2Status = getStepStatus(operationalStep, progress?.step_two_status);
  const step3Status = getStepStatus(clinicalStep, progress?.step_three_status);

  const step1Done = licenseStep
    ? licenseStep.completed
    : progress?.is_step_one_completed || step1Status === "VERIFIED";
  const step2Done = operationalStep
    ? operationalStep.completed
    : progress?.is_step_two_completed || step2Status === "VERIFIED";
  const step3Done = clinicalStep
    ? clinicalStep.completed
    : progress?.is_step_three_completed || step3Status === "VERIFIED";

  // Calculate completion percentage
  let computedScore = 0;
  if (step1Done) computedScore += 30;
  if (step2Done) computedScore += 40;
  if (step3Done) computedScore += 30;

  const score =
    progress?.progress_percentage ?? progress?.score ?? computedScore;

  const renderStepStatus = (status: string) => {
    switch (status) {
      case "VERIFIED":
      case "COMPLETE":
      case "COMPLETED":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          label: "Verified",
          labelClass:
            "text-green-600 bg-green-50 border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        };
      case "IN_REVIEW":
      case "UNDER_REVIEW":
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500 animate-pulse" />,
          label: "In Review",
          labelClass:
            "text-yellow-600 bg-yellow-50 border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        };
      case "REJECTED":
      case "FAILED":
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          label: "Rejected",
          labelClass:
            "text-red-600 bg-red-50 border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        };
      default:
        return {
          icon: <Circle className="h-6 w-6 text-gray-300" />,
          label: "Pending",
          labelClass:
            "text-gray-500 bg-gray-50 border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        };
    }
  };

  const phases = [
    {
      title: "Phase 1 — License Verification",
      subtitle: "~5 min · RDV +30%",
      status: step1Status,
    },
    {
      title: "Phase 2 — Operations",
      subtitle: "~20–30 min · RDV +40%",
      status: step2Status,
    },
    {
      title: "Phase 3 — Clinical depth",
      subtitle: "Async · RDV +30%",
      status: step3Status,
    },
  ];

  return (
    <div className="mx-auto max-w-xl my-auto bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8 h-44 w-44 sm:h-52 sm:w-52">
          {/* based on my progress its update complete color #F2C467 now */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#0E3E65"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F2C467"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="251.3"
              strokeDashoffset={251.3 - (251.3 * score) / 100}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl font-semibold text-[#F2C467]">
                {score}%
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#F2C467]">
                RDV Score
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-foreground">
          Start your verification
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Complete your RDV verification in phases to unlock your profile.
        </p>

        <div className="mt-8 w-full">
          <div className="w-fit mx-auto space-y-6">
            {phases.map((p, i) => {
              const { icon, label, labelClass } = renderStepStatus(p.status);
              return (
                <div key={p.title} className="flex items-center gap-4">
                  <div className="relative flex h-8 w-8 flex-col items-center justify-center">
                    {icon}
                    {i < phases.length - 1 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 h-6 w-px bg-border" />
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.subtitle}
                    </p>
                  </div>

                  <div hidden={label === "Pending"}>
                    <span className={labelClass}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              className="w-full h-14 rounded-xl bg-[#0E3E65] hover:bg-[#082842] text-white font-semibold shadow-sm"
              onClick={() => router.push("/dentist/verification")}
            >
              {score > 0 ? "Continue Verification" : "Start Verification"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
