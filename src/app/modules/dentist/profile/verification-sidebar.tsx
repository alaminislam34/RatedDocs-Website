// modules/dentist/profile/verification-sidebar.tsx
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationSidebarProps {
  verificationPhase?: string;
  isVerified?: boolean;
}

export function VerificationSidebar({ verificationPhase = "LICENSE", isVerified = false }: VerificationSidebarProps) {
  const phaseOrder = ["LICENSE", "OPERATIONS", "CLINICAL"];
  const currentPhaseIndex = phaseOrder.indexOf(verificationPhase);

  const steps = [
    {
      title: "Phase 1 — Licence verify",
      sub: "~5 min · RDV +30%",
      status: currentPhaseIndex > 0 ? "completed" : currentPhaseIndex === 0 ? "active" : "pending",
    },
    {
      title: "Phase 2 — Operations",
      sub: "~20-30 min · RDV +40%",
      status: currentPhaseIndex > 1 ? "completed" : currentPhaseIndex === 1 ? "active" : "pending",
    },
    {
      title: "Phase 3 — Clinical depth",
      sub: "Async · RDV +30%",
      status: currentPhaseIndex > 2 ? "completed" : currentPhaseIndex === 2 ? "active" : "pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-6 font-bold text-gray-900">Verification Progress</h3>
        <div className="space-y-8 relative">
          <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-gray-100" />
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : step.status === "active" ? (
                  <div className="h-5 w-5 rounded-full border-2 border-[#163E5C] p-1">
                    <div className="h-full w-full rounded-full bg-[#163E5C]" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-400">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-8 h-12 w-full bg-[#163E5C] hover:bg-[#113149]" disabled={isVerified}>
          {isVerified ? "Fully Verified" : `Start Phase ${currentPhaseIndex + 1}`} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-4 font-bold text-gray-900">Profile completeness</h3>
        <div className="space-y-4">
          {[
            { label: "Basic Info", completed: true },
            { label: "License Verification", phase: "Phase 1", completed: currentPhaseIndex > 0 },
            { label: "Headshot", phase: "Phase 1", completed: false }, // Update if you have headshot data
            { label: "Pricing Set", phase: "Phase 2", completed: currentPhaseIndex > 1 },
            { label: "Credentials", phase: "Phase 3", completed: currentPhaseIndex > 2 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <span className="text-gray-400">{item.phase}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VerificationSidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-6 h-6 w-40 bg-gray-200 rounded" />
        <div className="space-y-8 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 h-12 w-full bg-gray-200 rounded" />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-4 h-6 w-40 bg-gray-200 rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}