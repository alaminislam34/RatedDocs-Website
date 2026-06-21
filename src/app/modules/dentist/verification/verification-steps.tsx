"use client";

import { User, Lock, Award, Building, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";

export function VerificationSteps() {
  const { verificationStep } = useVerificationStore();
  const {
    submittedByStep,
    canAccessStep,
  } = useVerificationProgress();

  const steps = [
    {
      step: 1,
      label: "Licence + identity",
      icon: User,
      unlocked: true,
      submitted: submittedByStep[1],
    },
    {
      step: 2,
      label: "Facility & Transparency",
      icon: Building,
      unlocked: canAccessStep(2),
      submitted: submittedByStep[2],
    },
    {
      step: 3,
      label: "Clinical Excellence",
      icon: Award,
      unlocked: canAccessStep(3),
      submitted: submittedByStep[3],
    },
  ];

  return (
    <div className="flex items-center gap-2 md:gap-8">
      {steps.map((step, index) => {
        const IconComponent = !step.unlocked
          ? Lock
          : step.submitted
            ? CheckCircle2
            : step.icon;

        const isActive = step.step === verificationStep;

        return (
          <div key={index} className="flex items-center gap-2 md:gap-6">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : step.unlocked
                      ? step.submitted
                        ? "border-green-500 bg-green-50 text-green-600"
                        : "border-primary/40 bg-card text-primary"
                      : "border-border bg-gray-50 text-muted-foreground"
                )}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "hidden md:block text-sm text-center",
                  isActive
                    ? "font-medium text-foreground"
                    : step.unlocked
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
