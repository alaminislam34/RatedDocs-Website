"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EmailSuccessState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 w-full max-w-130 mx-auto animate-in fade-in zoom-in duration-300">
      {/* Icon Circle */}
      <div className="flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#163E5C] mb-8">
        <Check className="w-10 h-10 lg:w-12 lg:h-12 text-white stroke-3" />
      </div>

      {/* Heading */}
      <h2 className="text-[28px] lg:text-[32px] font-bold text-[#0A2533] leading-tight mb-4">
        Confirm your email
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-10 max-w-100">
        We've sent a confirmation link to{" "}
        <span className="font-semibold text-gray-900">
          zakaullah@zenkoders.com
        </span>
        .
      </p>

      {/* Action Button */}
      <Button
        className="w-full h-14 bg-[#163E5C] hover:bg-[#113149] text-white text-lg font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
        onClick={() => router.push("/dentist/profile")}
      >
        Go To Dashboard
      </Button>
    </div>
  );
}
