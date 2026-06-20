"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useAdminLogin } from "@/hooks/admin/user/useAdmin";

export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.literal("ADMIN"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: adminLogin, isError } = useAdminLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    adminLogin(data, {
      onSuccess: () => {
        toast.success("Welcome back, Admin!", {
          style: {
            borderRadius: "10px",
            background: "#1A1A2E",
            color: "#fff",
          },
        });
        router.push("/admin/");
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        toast.error(message, {
          style: {
            borderRadius: "10px",
            background: "#1A1A2E",
            color: "#fff",
          },
        });
      },
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-screen">
        {/* Left panel — form */}
        <div className="flex w-full flex-col lg:w-1/2">
          {/* Logo */}
          <div className="px-8 pt-8 sm:px-12">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9963F] shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-white"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    d="M22 12h-4l-3 9L9 3l-3 9H2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#1A1A2E] leading-tight">
                  RatedDocs
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Admin Console
                </p>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12">
            <div className="w-full max-w-md">
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-[28px] font-extrabold text-[#1A1A2E] leading-tight tracking-tight mb-2">
                  Welcome back
                </h1>
                <p className="text-sm text-gray-500">
                  Sign in to manage dentists, patients and bookings.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
              >
                {/* Work email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]"
                  >
                    Work email
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="admin@rateddocs.com"
                    autoComplete="email"
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none transition-all",
                      "focus:ring-2 focus:ring-[#163E5C]/20 focus:border-[#163E5C]",
                      errors.email
                        ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
                        : "border-gray-200 bg-white hover:border-gray-300",
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[13px] font-medium text-[#1A1A2E]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="demopassword"
                      autoComplete="current-password"
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 pr-11 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none transition-all",
                        "focus:ring-2 focus:ring-[#163E5C]/20 focus:border-[#163E5C]",
                        errors.password
                          ? "border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 bg-white hover:border-gray-300",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-sm text-[#1A1A2E] underline underline-offset-2 hover:text-[#163E5C] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150",
                    "bg-[#1A1A2E] hover:bg-[#0D2B3E]",
                    "focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/30 focus:ring-offset-2",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 sm:px-12">
            <p className="text-xs text-gray-400">
              &copy; 2026 RatedDocs Inc. &middot;{" "}
              <a
                href="#"
                className="hover:text-gray-600 hover:underline transition-colors"
              >
                Terms
              </a>{" "}
              &middot;{" "}
              <a
                href="#"
                className="hover:text-gray-600 hover:underline transition-colors"
              >
                Privacy
              </a>
            </p>
          </div>
        </div>

        {/* Right panel — marketing */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-start p-14 bg-[#0D2B3E] overflow-hidden">
          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-40 h-120 w-120 rounded-full border border-white/5 bg-white/3"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full border border-white/5 bg-[#0D2B3E]"
          />

          {/* Content */}
          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-xs lg:text-sm  uppercase tracking-[0.2em] text-white">
              Admin Console
            </p>
            <h2 className="mb-6 text-[36px] font-extrabold leading-[1.15] tracking-tight text-white">
              Run your network of dentists, bookings and patients from one
              place.
            </h2>
            <p className="text-[15px] text-slate-400 leading-relaxed">
              Verify practitioners, moderate reviews, manage payouts, and
              connect bookings end&#8209;to&#8209;end &mdash; securely.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
