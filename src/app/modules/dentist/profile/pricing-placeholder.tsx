// modules/dentist/profile/pricing-placeholder.tsx
import { Lock } from "lucide-react";

interface PricingPlaceholderProps {
  verificationPhase?: string;
}

export function PricingPlaceholder({ verificationPhase }: PricingPlaceholderProps) {
  const isPhase1Complete = verificationPhase && verificationPhase !== "LICENSE";

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-50 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Pricings</h3>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F1F8] text-[#163E5C]">
          <Lock className="h-6 w-6" />
        </div>
        <h4 className="mb-2 text-base font-bold text-gray-900">Procedure pricing</h4>
        <p className="max-w-[340px] text-sm leading-relaxed text-gray-400">
          {isPhase1Complete 
            ? "You can now add your procedure prices." 
            : "Complete Phase 1 verification to start adding your procedure prices."}
        </p>
      </div>
    </div>
  );
}

export function PricingPlaceholderSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="border-b border-gray-50 px-6 py-4">
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 h-12 w-12 rounded-full bg-gray-200" />
        <div className="mb-2 h-5 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
    </div>
  );
}