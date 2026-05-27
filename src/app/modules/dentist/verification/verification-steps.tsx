"use client";

import { User, Lock, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";

const STEPS = [
  { step: 1, label: "Licence + identity", icon: User },
  { step: 2, label: "Facility & Transparency", icon: Lock },
  { step: 3, label: "Clinical Excellence", icon: Award },
];

export function VerificationSteps() {
  const { verificationStep } = useStateContext();
  return (
    <div className="flex items-center gap-2 md:gap-8">
      {STEPS.map((step, index) => (
        <div key={index} className="flex items-center gap-2 md:gap-6">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                step.step <= verificationStep
                  ? "border-[#163E5C] bg-[#163E5C] text-white"
                  : "border-gray-100 bg-white text-gray-300",
              )}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "hidden md:block text-sm text-center",
                step.step <= verificationStep
                  ? "text-[#0A2533] font-medium"
                  : "text-gray-400",
              )}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
