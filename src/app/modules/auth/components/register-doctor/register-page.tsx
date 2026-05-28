"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Image from "next/image";
import { CreateAccountForm } from "./create-account";
import { useState } from "react";
import { VerifyOtpForm } from "./verify-otp-form";
import { useRouter } from "next/navigation";
import { SuccessState } from "./SuccessState";
import { ProfessionalDetailsForm } from "./professional-details-form";
import { EmailSuccessState } from "./ProfileSuccessRate";

export default function RegisterPageComponent() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <section className="relative hidden w-full flex-col bg-[#163E5C] p-10 text-white lg:flex lg:w-3/5 lg:p-20">
        <div className="flex items-center gap-2">
          <div className="">
            <Image
              src={"/logos/whitelogo.png"}
              alt="Website logo"
              height={200}
              width={400}
              className="w-43 h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <h1 className="max-w-xl w-full text-[40px] font-semibold leading-[1.3] tracking-tight">
            Sign in to manage your community activities and stay connected with
            members.
          </h1>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-2/5 lg:px-20">
        <div className="w-full max-w-11/12 md:max-w-10/12 mx-auto space-y-6 md:space-y-8 lg:space-y-12">
          <div hidden={step === 3 || step === 5}>
            <button
              onClick={() => {
                if (step === 1) {
                  router.back();
                } else if (step === 2) {
                  setStep(1);
                } else if (step === 3) {
                  setStep(2);
                } else if (step === 4) {
                  setStep(3);
                } else if (step === 5) {
                  setStep(4);
                }
              }}
              className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-[28px] font-semibold text-[#1A1A1A]">
              {step === 4
                ? "Enter your Professional Details"
                : "Create an Account"}
            </h2>
          </div>

          <div className="mb-8">
            {step === 2 && (
              <div className="mt-">
                <p className="text-lg md:text-xl lg:text-2xl leading-[150%] font-semibold text-[#073031]">
                  Check your inbox!
                </p>
                <p className="text-[#414651] leading-[150%]">
                  We've sent you a temporary 6-digit login code at
                  <span className="font-semibold">zakaullah@zenkoders.com</span>
                  . Please enter this code to login to your account.
                </p>
              </div>
            )}
          </div>
          {step === 1 && <CreateAccountForm setStep={setStep} />}
          {step === 2 && <VerifyOtpForm setStep={setStep} />}
          {step === 3 && <SuccessState setStep={setStep} />}
          {step === 4 && <ProfessionalDetailsForm setStep={setStep} />}
          {step === 5 && <EmailSuccessState />}
        </div>
      </section>
    </main>
  );
}
