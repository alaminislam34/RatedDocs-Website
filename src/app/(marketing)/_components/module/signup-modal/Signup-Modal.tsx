"use client";

import React from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";

export default function SignupModal() {
  const { showSignupModal, setShowSignupModal } = useStateContext();
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Profile registered successfully!", {
      style: {
        borderRadius: "10px",
        background: "#1A1A2E",
        color: "#fff",
      },
    });
  };

  return (
    <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
      <DialogContent className="sm:max-w-150 p-8 rounded-2xl border-none gap-0 overflow-y-auto max-h-[95vh]">
        <DialogHeader className="text-left mb-8">
          <DialogTitle className="text-[32px] font-semibold text-[#1A1A2E] leading-tight mb-2">
            Sign up
          </DialogTitle>
          <DialogDescription className="text-[#6B7280] text-[16px] leading-snug">
            Sign up to compare dentists and continue your consultation journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          <button className="w-full flex cursor-pointer items-center justify-center gap-3  py-2.5 lg:py-3.5 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors duration-200">
            <FcGoogle className="text-2xl" />
            <span className="text-[#6B7280]">Continue with Google</span>
          </button>

          <button className="w-full flex cursor-pointer items-center justify-center gap-3  py-2.5 lg:py-3.5 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors duration-200">
            <FaApple className="text-2xl text-black" />
            <span className="text-[#6B7280]">Continue with Apple</span>
          </button>

          <button className="w-full flex cursor-pointer items-center justify-center gap-3  py-2.5 lg:py-3.5 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors duration-200">
            <FaFacebook className="text-2xl text-[#1877F2]" />
            <span className="text-[#6B7280]">Continue with Facebook</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6 lg:my-8">
          <div className="grow border-t border-[#E5E7EB]"></div>
          <span className="mx-4 text-[#9EA9AA] text-sm bg-white px-2">or</span>
          <div className="grow border-t border-[#E5E7EB]"></div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-[#1A1A2E] font-semibold text-[15px] mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              required
              className="w-full px-4 py-2.5 lg:py-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0E3E65] placeholder-[#9EA9AA] font-normal transition-all"
            />
          </div>

          <div>
            <label className="block text-[#1A1A2E] font-semibold text-[15px] mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Password"
                required
                className="w-full px-4 py-2.5 lg:py-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0E3E65] placeholder-[#9EA9AA] font-normal transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
              >
                <Eye className="size-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#1A1A2E] font-semibold text-[15px] mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Password"
                required
                className="w-full px-4 py-2.5 lg:py-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0E3E65] placeholder-[#9EA9AA] font-normal transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
              >
                <Eye className="size-5" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-lg rounded-xl transition-all duration-200 mt-2 active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
