import { Lock } from "lucide-react";

export function PricingPlaceholder() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-50 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Pricings</h3>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F1F8] text-[#163E5C]">
          <Lock className="h-6 w-6" />
        </div>
        <h4 className="mb-2 text-base font-bold text-gray-900">
          Procedure pricing
        </h4>
        <p className="max-w-[340px] text-sm leading-relaxed text-gray-400">
          Complete Phase 1 verification to start adding your procedure prices.
        </p>
      </div>
    </div>
  );
}
