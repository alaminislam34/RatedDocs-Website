"use client";

import { CheckCircle2, Circle, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/providers/StateProvider";

export function VerificationBanner() {
  const router = useRouter();
  const { verificationStep, verificationCompletedStep } = useStateContext();

  // Hide the banner if Phase 3 has been reached or completed
  if ((verificationCompletedStep ?? 0) >= 3 || verificationStep >= 3) {
    return null;
  }

  const phases = [
    { title: "Phase 1 — License Verification", subtitle: "~5 min · RDV +30%", done: false },
    { title: "Phase 2 — Operations", subtitle: "~20–30 min · RDV +40%", done: false },
    { title: "Phase 3 — Clinical depth", subtitle: "Async · RDV +30%", done: false },
  ];

  return (
    <div className="mx-auto max-w-xl my-auto bg-white p-6 lg:p-8 rounded-xl border border-gray-200">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8 h-44 w-44 sm:h-52 sm:w-52">
          <div className="absolute inset-0 rounded-full bg-sidebar-primary shadow-inner" />
          <div className="absolute inset-6 rounded-full bg-card" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl font-semibold text-yellow">0%</span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-widest text-yellow">RDV Score</span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-foreground">Start your verification</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Complete your RDV verification in phases to unlock your profile.
        </p>

        <div className="mt-8 w-full">
          <div className="max-w-xs mx-auto space-y-6">
            {phases.map((p, i) => (
              <div key={p.title} className="flex items-center gap-4">
                <div className="relative flex h-8 w-8 flex-col items-center">
                  <div className={`flex items-center justify-center rounded-full ${p.done ? 'bg-primary text-white' : 'text-gray-400'}`}>
                    {p.done ? (
                      <CircleCheck />
                    ) : (
                     <Circle/>
                    )}
                  </div>
                  {i < phases.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 h-6 w-px bg-border" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button size="lg" className="w-full h-14 rounded-xl bg-sidebar-primary hover:bg-sidebar-primary/90 text-white" onClick={() => router.push('/dentist/verification') }>
              Start Verification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
