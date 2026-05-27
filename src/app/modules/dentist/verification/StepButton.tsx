"use client";

import { useStateContext } from "@/providers/StateProvider";
import { redirect } from "next/navigation";

export default function StepButton() {
  const { setVerificationStep, verificationStep } = useStateContext();
  return (
    <div className="mx-auto flex max-w-11/12 justify-end">
      <button
        onClick={() => {
          if (verificationStep < 3) {
            setVerificationStep(verificationStep + 1);
          } else {
            // Handle completion logic here, e.g., show a success message or redirect
            alert("Verification process completed!");
            redirect("/dashboard"); // Redirect to dashboard or another page after completion
          }
        }}
        className="h-12 px-10 bg-[#0E3E65] text-white font-bold rounded-lg transition-colors"
      >
        {/* here is after step 3 show this button but 3 is final step show if step 3 then show Complete Verification button */}
        {verificationStep === 3
          ? "Complete Verification"
          : `Continue to Phase ${verificationStep + 1}`}
      </button>
    </div>
  );
}
