"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/authentication/useAuth";
import { ProfessionalDetailsForm } from "@/app/modules/auth/components/register-doctor/professional-details-form";
import { getApiErrorMessage } from "@/lib/api";
import { getRoleHome } from "@/lib/auth/roles";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.literal("DENTIST"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function DoctorLoginPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "DENTIST",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    clearErrors("root");

    try {
      const response = await loginMutation.mutateAsync(data);
      toast.success("Welcome back, Doctor!");

      const payload = response?.data || response;
      const profileCreated = payload?.profile_created;

      if (profileCreated === false) {
        setStep(2);
      } else {
        router.replace(getRoleHome(payload.type ?? payload.role ?? data.role));
      }
    } catch (error: unknown) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleProfessionalDetailsStep = (nextStep: number) => {
    if (nextStep === 4) {
      toast.success("Profile details saved! Redirecting to dashboard...");
      router.replace("/dentist");
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <Toaster position="top-right" />
      <section className="relative hidden w-full flex-col bg-[#163E5C] p-10 text-white lg:flex lg:w-3/5 lg:p-20">
        <div className="flex items-center gap-2">
          <Image
            src="/logos/whitelogo.png"
            alt="Website logo"
            height={200}
            width={400}
            className="w-43 h-auto object-contain"
          />
        </div>

        <div className="flex flex-1 items-center">
          <h1 className="max-w-xl w-full text-[40px] font-semibold leading-[1.3] tracking-tight">
            Sign in to manage your community activities and stay connected with
            members.
          </h1>
        </div>
      </section>

      {/* Right panel */}
      <section className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-2/5 xl:px-20">
        <div className="w-full max-w-11/12 md:max-w-10/12 mx-auto space-y-6 md:space-y-8 lg:space-y-12">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => router.push("/")}
                  className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </button>
                <h2 className="text-[28px] font-semibold text-[#1A1A1A]">
                  Doctor Sign In
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Access your dentist portal account
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="doctor@example.com"
                    className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                      className={`h-11 pr-10 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {errors.root?.server?.message && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {errors.root.server.message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 bg-[#163E5C] hover:bg-[#0E3E65] focus:ring-0 focus:ring-offset-0 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500 mt-4">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register-doctor"
                  className="font-semibold text-[#163E5C] hover:underline"
                >
                  Register as a Dentist
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </button>
                <h2 className="text-[28px] font-semibold text-[#1A1A1A]">
                  Complete your Profile
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Please provide your professional details to set up your
                  account.
                </p>
              </div>

              <div className="w-full">
                <ProfessionalDetailsForm
                  setStep={handleProfessionalDetailsStep}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
