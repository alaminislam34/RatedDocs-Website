"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ mode: "onTouched" });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Password changed successfully");
    reset();
  };

  const newVal = watch("newPassword");

  return (
    <section className="rounded-xl border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0E3E65]">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Old Password</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              {...register("oldPassword", { required: "Old password is required" })}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm bg-white"
            />
            <button
              type="button"
              onClick={() => setShowOld((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500"
            >
              {showOld ? "Hide" : "Show"}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.oldPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm bg-white"
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (val) => val === newVal || "Passwords must match",
              })}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm bg-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700"
          >
            Reject
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[#0F3659] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Change Password
          </button>
        </div>
      </form>
    </section>
  );
}
