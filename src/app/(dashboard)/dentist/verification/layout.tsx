"use client"
import { ArrowLeft } from "lucide-react";
import { VerificationSteps } from "../../../modules/dentist/verification/verification-steps";
import StepButton from "../../../modules/dentist/verification/StepButton";
import { useRouter } from "next/navigation";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  return (
    <div className="flex flex-col">
      <header className=" border-b pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-xl font-bold text-[#0A2533]">
              Verification Progress
            </h1>
          </div>

          {/* Stepper Component */}
          <VerificationSteps />
        </div>
      </header>

      {/* Middle Part - Changeable Content */}
      <main className="flex-1 py-10 pb-32">
        <div className="">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Bar - Always visible */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white py-6 z-50">
        <StepButton />
      </footer>
    </div>
  );
}
