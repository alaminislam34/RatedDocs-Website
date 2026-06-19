import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Phase 1 — Licence verify",
    sub: "~5 min · RDV +30%",
    status: "active",
  },
  {
    title: "Phase 2 — Operations",
    sub: "~20-30 min · RDV +40%",
    status: "pending",
  },
  {
    title: "Phase 3 — Clinical depth",
    sub: "Async · RDV +30%",
    status: "pending",
  },
];

export function VerificationSidebar() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-6 font-bold text-gray-900">Verification Progress</h3>
        <div className="space-y-8 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                {step.status === "active" ? (
                  <div className="h-5 w-5 rounded-full border-2 border-[#163E5C] p-1">
                    <div className="h-full w-full rounded-full bg-[#163E5C]" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-8 h-12 w-full bg-[#163E5C] hover:bg-[#113149]">
          Start Phase 1 <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-4 font-bold text-gray-900">Profile completeness</h3>
        <div className="space-y-4">
          {[
            { label: "Basic Info", completed: true },
            { label: "License Verification", phase: "Phase 1" },
            { label: "Headshot", phase: "Phase 1" },
            { label: "Pricing Set", phase: "Phase 2" },
            { label: "Credentials", phase: "Phase 3" },
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
