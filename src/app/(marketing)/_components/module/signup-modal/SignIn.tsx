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
import useAuth from "@/hooks/authentication/useAuth";
import { userLoginSchema } from "@/hooks/patient/schema";
import { getApiErrorMessage } from "@/lib/api";
import { TOAST_STYLE } from "./Signup-Modal";

type LoginFormData = z.infer<typeof userLoginSchema>;

export default function SigninModal() {
  const {
    showSigninModal,
    setShowSigninModal,
    setShowSignupModal,
    setShowPersonalizeModal,
    isCompareMode,
  } = useStateContext();

  const [showPassword, setShowPassword] = useState(false);
  const { userLoginMutation, isUserLoginLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    clearErrors("root");

    userLoginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Login successfully!", { style: TOAST_STYLE });
        reset();
        setShowSigninModal(false);
        setShowPersonalizeModal(true);
      },
      onError: (error: unknown) => {
        setError("root.server", {
          type: "server",
          message: getApiErrorMessage(error),
        });
      },
    });
  };

  // const handleSocialLogin = (provider: string) => {
  //   toast.success(`Signed in with ${provider}!`, { style: TOAST_STYLE });
  //   setShowSigninModal(false);
  //   setShowPersonalizeModal(true);
  // };

  const switchToSignup = () => {
    setShowSigninModal(false);
    setTimeout(() => {
      setShowSignupModal(true);
    }, 200);
  };

  return (
    <Dialog open={showSigninModal} onOpenChange={setShowSigninModal}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-150 max-h-[95vh] overflow-y-auto backdrop-blur-xl rounded-xl border-none p-8 gap-0"
      >
        <DialogHeader className="mb-8 text-left">
          <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-[#1A1A2E]">
            Sign in {isCompareMode ? "for comparison" : ""}
          </DialogTitle>
          <DialogDescription className="text-[16px] leading-snug text-[#6B7280]">
            Welcome back! Sign in to manage your appointments and consultations.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 space-y-3">
          <button
            type="button"
            // onClick={() => handleSocialLogin("Google")}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-[#6B7280]">Continue with Google</span>
          </button>

          <button
            type="button"
            // onClick={() => handleSocialLogin("Apple")}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
          >
            <FaApple className="text-2xl text-black" />
            <span className="text-[#6B7280]">Continue with Apple</span>
          </button>

          <button
            type="button"
            // onClick={() => handleSocialLogin("Facebook")}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
          >
            <FaFacebook className="text-2xl text-[#1877F2]" />
            <span className="text-[#6B7280]">Continue with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center lg:my-8">
          <div className="grow border-t border-[#E5E7EB]"></div>
          <span className="mx-4 bg-white px-2 text-sm text-[#9EA9AA]">or</span>
          <div className="grow border-t border-[#E5E7EB]"></div>
        </div>

        {/* Form */}
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
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[15px] font-semibold text-[#1A1A2E]">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-[#113254] hover:underline"
                onClick={() => {
                  /* Implement forgot password handler if needed */
                }}
              >
                Forgot password?
              </button>
            </div>

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

          {errors.root?.server?.message && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errors.root.server.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isUserLoginLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUserLoginLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?
          <button
            type="button"
            onClick={switchToSignup}
            className="font-semibold text-[#113254] hover:underline"
          >
            Sign up
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
