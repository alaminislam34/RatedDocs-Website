"use client";

import { MapPin, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import verificationData from "@/lib/verification-data";

type Dentist = (typeof verificationData.dentists)[number];

interface VerificationCardProps {
  dentist: Dentist;
  onViewSubmission: (dentist: Dentist) => void;
}

const SPECIALTY_COLORS: Record<string, string> = {
  gray: "bg-gray-100 text-gray-600",
  purple: "bg-purple-100 text-purple-700",
  teal: "bg-teal-100 text-teal-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
};

const PHASE_BADGE_COLORS: Record<string, string> = {
  "Phase 2 — Operations": "bg-amber-50 text-amber-700 border border-amber-200",
  "Phase 3 — Clinical Depth": "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

function PhaseCheckBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3 w-3" />
      {label}
    </span>
  );
}

export function VerificationCard({ dentist, onViewSubmission }: VerificationCardProps) {
  const isPending = dentist.queue_status === "pending";
  const isApproved = dentist.queue_status === "approved";
  const isRejected = dentist.queue_status === "rejected";

  const summary = "summary" in dentist && Array.isArray(dentist.summary) ? dentist.summary as string[] : [];
  const hasWarning = "has_warning" in dentist && dentist.has_warning;
  const approvedAgo = "approved_ago" in dentist ? dentist.approved_ago as string | null : null;
  const rejectedAgo = "rejected_ago" in dentist ? dentist.rejected_ago as string | null : null;
  const rejectedPhaseLabel = "rejected_phase_label" in dentist ? dentist.rejected_phase_label as string : null;
  const rejectionReason = "rejection_reason" in dentist ? dentist.rejection_reason as string : null;
  const rdvScore = "rdv_score" in dentist ? dentist.rdv_score as number : null;
  const submittedAgo = "submitted_ago" in dentist ? dentist.submitted_ago as string | null : null;
  const experienceYears = "experience_years" in dentist ? dentist.experience_years as number : null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: info */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white sm:h-11 sm:w-11"
            style={{ backgroundColor: dentist.avatar_color }}
          >
            {dentist.initials}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Name + badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#1A1A2E]">{dentist.name}</p>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", SPECIALTY_COLORS[dentist.specialty_color] ?? "bg-gray-100 text-gray-600")}>
                {dentist.specialty}
              </span>
              {isPending && dentist.current_phase_label && (
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", PHASE_BADGE_COLORS[dentist.current_phase_label ?? ""] ?? "bg-gray-100 text-gray-500")}>
                  {dentist.current_phase_label}
                </span>
              )}
              {isRejected && rejectedPhaseLabel && (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                  {rejectedPhaseLabel}
                </span>
              )}
            </div>

            {/* Meta row */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{dentist.location}</span>
              {isPending && experienceYears && <span>{experienceYears} yrs exp</span>}
              {isPending && submittedAgo && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Submitted {submittedAgo}</span>}
              {isApproved && approvedAgo && <span>Approved {approvedAgo}</span>}
              {isApproved && rdvScore && <span className="font-semibold text-[#1A1A2E]">RDV {rdvScore}%</span>}
              {isRejected && rejectedAgo && <span>Rejected {rejectedAgo}</span>}
            </div>

            {/* Pending summary line */}
            {isPending && summary.length > 0 && (
              <p className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-gray-400">
                {hasWarning && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                {summary.map((s, i) => (
                  <span key={i}>{s}{i < summary.length - 1 && <span className="mx-1 text-gray-300">·</span>}</span>
                ))}
              </p>
            )}

            {/* Approved phase pills */}
            {isApproved && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <PhaseCheckBadge label="Ph.1 — Identity" />
                <PhaseCheckBadge label="Ph.2 — Operations" />
                <PhaseCheckBadge label="Ph.3 — Clinical" />
              </div>
            )}

            {/* Rejected reason box */}
            {isRejected && rejectionReason && (
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
