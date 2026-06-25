"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { signupSchema } from "@/hooks/patient/schema";
import OtpVerifyModal from "./Otp-Verify-Modal";
import useAuth from "@/hooks/authentication/useAuth";
import { getApiErrorMessage } from "@/lib/api";

type SignupFormData = z.infer<typeof signupSchema>;

export const TOAST_STYLE = {
  borderRadius: "10px",
  background: "#1A1A2E",
  color: "#fff",
};

export default function SignupModal() {
  const {
    showSignupModal,
    setShowSignupModal,
    setShowPersonalizeModal,
    setShowSigninModal,
  } = useStateContext();

  const switchToSignin = () => {
    setShowSignupModal(false);
    setTimeout(() => {
      setShowSigninModal(true);
    }, 200);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showconfirm_password, setShowconfirm_password] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { registerMutation, isRegisterLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      role: "PATIENT",
    },
  });

  const onSubmit = async (data: SignupFormData) => {

    try {
      const res = await registerMutation.mutateAsync(data)
      if (res) {
        toast.success("Account created successfully. Please verify your email.", {
          style: TOAST_STYLE,
        });
        setPendingEmail(data.email);
        reset();
        setShowSignupModal(false);
        setShowOtpModal(true);
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error), { style: TOAST_STYLE });
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast.success(`Signed up with ${provider}!`, { style: TOAST_STYLE });
    setShowPersonalizeModal(true);
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    setPendingEmail("");
    setShowPersonalizeModal(true);
  };

  return (
    <>
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-150 max-h-[95vh] overflow-y-auto backdrop-blur-xl rounded-xl border-none p-8 gap-0">
          <DialogHeader className="mb-8 text-left">
            <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-[#1A1A2E]">
              Sign up
            </DialogTitle>
            <DialogDescription className="text-[16px] leading-snug text-[#6B7280]">
              Sign up to compare dentists and continue your consultation
              journey.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4 space-y-3">
            <button
              onClick={() => handleSocialSignup("Google")}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
            >
              <FcGoogle className="text-2xl" />
              <span className="text-[#6B7280]">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialSignup("Apple")}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
            >
              <FaApple className="text-2xl text-black" />
              <span className="text-[#6B7280]">Continue with Apple</span>
            </button>

            <button
              onClick={() => handleSocialSignup("Facebook")}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
            >
              <FaFacebook className="text-2xl text-[#1877F2]" />
              <span className="text-[#6B7280]">Continue with Facebook</span>
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center lg:my-8">
            <div className="grow border-t border-[#E5E7EB]"></div>
            <span className="mx-4 bg-white px-2 text-sm text-[#9EA9AA]">
              or
            </span>
            <div className="grow border-t border-[#E5E7EB]"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-[#1A1A2E]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                {...register("email")}
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-semibold text-[#1A1A2E]">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password")}
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-semibold text-[#1A1A2E]">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showconfirm_password ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("confirm_password")}
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
                />
                <button
                  type="button"
                  onClick={() => setShowconfirm_password((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
                >
                  {showconfirm_password ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isRegisterLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRegisterLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Footer Toggle Link */}
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToSignin}
              className="font-semibold text-[#113254] hover:underline"
            >
              Sign in
            </button>
          </p>
        </DialogContent>
      </Dialog>

      <OtpVerifyModal
        email={pendingEmail}
        open={showOtpModal}
        onOpenChange={setShowOtpModal}
        onVerified={handleOtpVerified}
      />
    </>
  );
}
