"use client";

import { memo } from "react";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationDentist } from "../types";
import { getRelativeTime } from "../verification-utils";

interface VerificationCardProps {
  dentist: VerificationDentist;
  onViewSubmission: (dentist: VerificationDentist) => void;
}

const SPECIALTY_COLORS: Record<string, string> = {
  gray: "bg-gray-100 text-gray-600",
  purple: "bg-purple-100 text-purple-700",
  teal: "bg-teal-100 text-teal-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
};

function PhaseCheckBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3 w-3" />
      {label}
    </span>
  );
}

function VerificationCardComponent({
  dentist,
  onViewSubmission,
}: VerificationCardProps) {
  const isPending = dentist.queue_status === "pending";
  const isApproved = dentist.queue_status === "approved";
  const isRejected = dentist.queue_status === "rejected";

  // 🗺️ Map API fields to UI variables
  const displayName = dentist.registration_no
    ? `Reg: ${dentist.registration_no}`
    : `Dentist #${dentist.dentist}`;

  const location = [dentist.city, dentist.country].filter(Boolean).join(", ");
  const submittedAgo = getRelativeTime(dentist.created_at);
  const approvedAgo = getRelativeTime(dentist.verified_at);
  const rejectionReason =
    dentist.reviewer_notes || "No specific reason provided.";

  // Fallback initials if no headshot is available
  const initials = dentist.registration_no
    ? dentist.registration_no.substring(0, 2).toUpperCase()
    : "D";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: info */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-11 sm:w-11">
            {dentist.professional_headshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dentist.professional_headshot}
                alt="Professional Headshot"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#163E5C] text-sm font-bold text-white">
                {initials}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Name + badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {displayName}
              </p>
              {/* Using doc_type as the badge since specialty isn't in the API */}
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  SPECIALTY_COLORS["blue"],
                )}
              >
                {dentist.doc_type || "LICENSE"}
              </span>
            </div>

            {/* Meta row */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location || "Location unavailable"}
              </span>
              {isPending && submittedAgo && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Submitted {submittedAgo}
                </span>
              )}
              {isApproved && approvedAgo && <span>Approved {approvedAgo}</span>}
              {isRejected && <span>Rejected</span>}
            </div>

            {/* Pending summary line */}
            {isPending && (
              <p className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-gray-400">
                <span>Document: {dentist.doc_type}</span>
                <span className="mx-1 text-gray-300">·</span>
                <span>Status: {dentist.status}</span>
              </p>
            )}

            {/* Approved phase pills */}
            {isApproved && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <PhaseCheckBadge label="Identity Verified" />
                <PhaseCheckBadge label="License Approved" />
              </div>
            )}

            {/* Rejected reason box */}
            {isRejected && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                <span className="mt-0.5 shrink-0">⊗</span>
                <span>{rejectionReason}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 self-start sm:self-center">
          <button
            onClick={() => onViewSubmission(dentist)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1A1A2E]/90 active:scale-95"
          >
            {isRejected ? "View Details" : "View Submission"}
            <span className="text-white/60 text-base leading-none">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export const VerificationCard = memo(VerificationCardComponent);
