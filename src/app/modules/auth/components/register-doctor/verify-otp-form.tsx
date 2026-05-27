"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a valid 6-digit code"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export function VerifyOtpForm({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP Verified:", data.otp);
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Toaster position="top-right" />
      <div className="flex flex-col items-center space-y-6 md:space-y-8 lg:space-y-12">
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  containerClassName="group flex items-center justify-between w-full gap-2 lg:gap-4"
                >
                  <InputOTPGroup className="flex w-full justify-between gap-2 lg:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={`h-14 lg:h-16 w-full max-w-17.5 rounded-lg bg-white text-xl font-semibold text-[#163E5C] transition-all focus-within:ring-2 focus-within:ring-[#163E5C] ${
                          errors.otp ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-sm font-medium text-red-500 mt-2">
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="text-center text-sm lg:text-base text-gray-600">
            Didn’t receive OTP?{" "}
            <button
              type="button"
              className="font-bold text-[#163E5C] hover:underline transition-all"
              onClick={() => toast.success("OTP Resent!")}
            >
              Resend
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full bg-[#163E5C] text-white hover:bg-[#113149] rounded-xl text-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? "Verifying..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
