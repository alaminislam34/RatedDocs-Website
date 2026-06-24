"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Video,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApprovePhaseModal } from "./approve-phase-modal";
import { RejectPhaseModal } from "./reject-phase-modal";
import {
  useDentistPhaseOneApprove,
  useDentistPhaseOneReject,
  useDentistPhaseTwoApprove,
  useDentistPhaseTwoReject,
  useDentistPhaseThreeApprove,
  useDentistPhaseThreeReject,
} from "@/hooks/admin/dentist/useDentist";

type VerificationPhase = {
  id?: number;
  label: string;
  status: string;
  rejection_reason?: string | null;
  country?: string;
  city?: string;
  registration_authority?: string;
  registration_no?: string;
  files?: Array<{ name: string; size: string; type: string; url?: string }>;
  services?: Array<{ name: string; description: string; price: number }>;
  clinic_location?: string;
  categories?: Array<{
    name: string;
    files: Array<{ name: string; size: string; type: string; url?: string }>;
  }>;
};

interface DentistOverviewTabProps {
  dentistId: string;
  verification: {
    phase1: VerificationPhase;
    phase2: VerificationPhase;
    phase3: VerificationPhase;
  };
}

function FileAttachment({
  name,
  size,
  type,
  url,
}: {
  name: string;
  size: string;
  type: string;
  url?: string;
}) {
  const isVideo = type === "video";
  const content = (
    <>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isVideo ? "bg-orange-100" : "bg-red-100",
        )}
      >
        {isVideo ? (
          <Video className="h-4 w-4 text-orange-500" />
        ) : (
          <FileText className="h-4 w-4 text-red-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-700">{name}</p>
        <p className="text-xs text-gray-400">
          {size || "Click to view document"}
        </p>
      </div>
      {url && (
        <span className="text-gray-400 transition-colors hover:text-gray-600">
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 8h8M8 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
      {content}
    </div>
  );
}

function PhaseBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    complete: {
      label: "Complete",
      className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    },
    completed: {
      label: "Complete",
      className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    },
    pending: {
      label: "Pending Review",
      className: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    in_review: {
      label: "Pending Review",
      className: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    SUBMITTED: {
      label: "Pending Review",
      className: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-500 border border-red-200",
    },
    not_started: {
      label: "Not Started",
      className: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-600 border border-blue-200",
    },
  };
  const badge = map[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badge.className,
      )}
    >
      {badge.label}
    </span>
  );
}

function ClinicCategory({
  name,
  files,
}: {
  name: string;
  files: Array<{ name: string; size: string; type: string; url?: string }>;
}) {
  const [expanded, setExpanded] = useState(name === "Implants");

  return (
    <div className="border-t border-gray-100 first:border-t-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-0 py-3 text-sm font-semibold text-gray-700 transition-colors hover:text-[#1A1A2E]"
      >
        {name}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="mb-3 flex flex-col gap-2">
          {files.length === 0 ? (
            <p className="text-xs text-gray-400">No documents uploaded</p>
          ) : (
            files.map((f, i) => (
              <FileAttachment
                key={i}
                name={f.name}
                size={f.size}
                type={f.type}
                url={f.url}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function DentistOverviewTab({
  dentistId,
  verification,
}: DentistOverviewTabProps) {
  const [approveModal, setApproveModal] = useState<{
    open: boolean;
    phase: "phase1" | "phase2" | "phase3" | null;
  }>({
    open: false,
    phase: null,
  });
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    phase: "phase1" | "phase2" | "phase3" | null;
  }>({
    open: false,
    phase: null,
  });
  console.log(verification);
  const [phaseStatuses, setPhaseStatuses] = useState({
    phase1: verification.phase1.status,
    phase2: verification.phase2.status,
    phase3: verification.phase3.status,
  });

  const [rejectionReasons, setRejectionReasons] = useState({
    phase1: verification.phase1.rejection_reason ?? null,
    phase2: verification.phase2.rejection_reason ?? null,
    phase3: verification.phase3.rejection_reason ?? null,
  });

  useEffect(() => {
    setPhaseStatuses({
      phase1: verification.phase1.status,
      phase2: verification.phase2.status,
      phase3: verification.phase3.status,
    });
    setRejectionReasons({
      phase1: verification.phase1.rejection_reason ?? null,
      phase2: verification.phase2.rejection_reason ?? null,
      phase3: verification.phase3.rejection_reason ?? null,
    });
  }, [verification]);

  const phase1Id = String(verification.phase1.id || "");
  const phase2Id = String(verification.phase2.id || "");
  const phase3Id = String(verification.phase3.id || "");

  const approvePhase1 = useDentistPhaseOneApprove(phase1Id, dentistId);
  const rejectPhase1 = useDentistPhaseOneReject(phase1Id, dentistId);
  const approvePhase2 = useDentistPhaseTwoApprove(phase2Id, dentistId);
  const rejectPhase2 = useDentistPhaseTwoReject(phase2Id, dentistId);
  const approvePhase3 = useDentistPhaseThreeApprove(phase3Id, dentistId);
  const rejectPhase3 = useDentistPhaseThreeReject(phase3Id, dentistId);

  console.log(verification);
  const isSubmitted = (status: string) => status === "SUBMITTED";

  const handleApprove = () => {
    if (!approveModal.phase) return;
    const phase = approveModal.phase;

    const onSuccess = () => {
      setPhaseStatuses((prev) => ({ ...prev, [phase]: "complete" }));
      setApproveModal({ open: false, phase: null });
    };

    if (phase === "phase1" && phase1Id) {
      approvePhase1.mutate(undefined, { onSuccess });
    } else if (phase === "phase2" && phase2Id) {
      approvePhase2.mutate(undefined, { onSuccess });
    } else if (phase === "phase3" && phase3Id) {
      approvePhase3.mutate(undefined, { onSuccess });
    } else {
      onSuccess();
    }
  };

  const handleReject = (reason: string) => {
    if (!rejectModal.phase) return;
    const phase = rejectModal.phase;

    const onSuccess = () => {
      setPhaseStatuses((prev) => ({ ...prev, [phase]: "rejected" }));
      setRejectionReasons((prev) => ({ ...prev, [phase]: reason }));
      setRejectModal({ open: false, phase: null });
    };

    if (phase === "phase1" && phase1Id) {
      rejectPhase1.mutate(reason, { onSuccess });
    } else if (phase === "phase2" && phase2Id) {
      rejectPhase2.mutate(reason, { onSuccess });
    } else if (phase === "phase3" && phase3Id) {
      rejectPhase3.mutate(reason, { onSuccess });
    } else {
      onSuccess();
    }
  };

  const phase2 = verification.phase2;
  const phase2Status = phaseStatuses.phase2;
  const phase2RejectionReason = rejectionReasons.phase2;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-700">
              Verify your dental licence
            </h3>
            <PhaseBadge status={phaseStatuses.phase1} />
          </div>
          {isSubmitted(phaseStatuses.phase1) && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setApproveModal({ open: true, phase: "phase1" })}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => setRejectModal({ open: true, phase: "phase1" })}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-gray-400">Country</p>
            <p className="mt-0.5 text-sm text-gray-700">
              {verification.phase1.country}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">City</p>
            <p className="mt-0.5 text-sm text-gray-700">
              {verification.phase1.city}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">
              Registration Authority
            </p>
            <p className="mt-0.5 text-sm text-gray-700">
              {verification.phase1.registration_authority}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Registration No</p>
            <p className="mt-0.5 text-sm font-medium text-[#1A1A2E]">
              {verification.phase1.registration_no}
            </p>
          </div>
        </div>

        {(verification.phase1.files ?? []).length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {(verification.phase1.files ?? []).map((f, i) => (
              <FileAttachment
                key={i}
                name={f.name}
                size={f.size}
                type={f.type}
                url={f.url}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-700">
              Facility &amp; Transparency
            </h3>
            <PhaseBadge status={phase2Status} />
          </div>
          {isSubmitted(phase2Status) && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setApproveModal({ open: true, phase: "phase2" })}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => setRejectModal({ open: true, phase: "phase2" })}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>

        {isSubmitted(phase2Status) && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-amber-700">
                Verification in progress — Phase 2 of 3 pending
              </p>
              <p className="text-xs text-amber-600">
                This dentist is not yet live on the platform. Review and approve
                Phase 2 — Operations to proceed.
              </p>
            </div>
          </div>
        )}

        {/* Rejected banner */}
        {phase2Status === "rejected" && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Phase 2 rejected — awaiting resubmission
              </p>
              {phase2RejectionReason && (
                <p className="text-xs text-red-600">{phase2RejectionReason}</p>
              )}
            </div>
          </div>
        )}

        {/* Services list */}
        {(phase2.services ?? []).length > 0 && (
          <div className="mb-4 flex flex-col divide-y divide-gray-50">
            {(phase2.services ?? []).map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-400">{s.description}</p>
                </div>
                <p className="text-sm font-bold text-[#1A1A2E]">
                  ${s.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Files */}
        {(phase2.files ?? []).length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {(phase2.files ?? []).map((f, i) => (
              <FileAttachment
                key={i}
                name={f.name}
                size={f.size}
                type={f.type}
                url={f.url}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Phase 3: Clinical ──────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-700">Clinical Depth</h3>
            <PhaseBadge status={phaseStatuses.phase3} />
          </div>
          {isSubmitted(phaseStatuses.phase3) && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setApproveModal({ open: true, phase: "phase3" })}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => setRejectModal({ open: true, phase: "phase3" })}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>

        {!isSubmitted(phaseStatuses.phase3) &&
        phaseStatuses.phase3 !== "complete" ? (
          <div className="py-8 text-center">
            <p className="text-sm font-semibold text-gray-500">
              Phase 3 not yet started
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Clinical depth documents will appear here once the dentist begins
              Phase 3.
            </p>
          </div>
        ) : (
          <>
            {verification.phase3.clinic_location && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-400">
                  Clinic Location
                </p>
                <p className="mt-0.5 text-sm text-gray-700">
                  {verification.phase3.clinic_location}
                </p>
              </div>
            )}
            <div className="flex flex-col">
              {(verification.phase3.categories ?? []).map((cat, i) => (
                <ClinicCategory key={i} name={cat.name} files={cat.files} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ApprovePhaseModal
        open={approveModal.open}
        phaseLabel={
          approveModal.phase ? verification[approveModal.phase].label : ""
        }
        onClose={() => setApproveModal({ open: false, phase: null })}
        onConfirm={handleApprove}
        isPending={
          approvePhase1.isPending ||
          approvePhase2.isPending ||
          approvePhase3.isPending
        }
      />
      <RejectPhaseModal
        open={rejectModal.open}
        phaseLabel={
          rejectModal.phase ? verification[rejectModal.phase].label : ""
        }
        onClose={() => setRejectModal({ open: false, phase: null })}
        onConfirm={handleReject}
        isPending={
          rejectPhase1.isPending ||
          rejectPhase2.isPending ||
          rejectPhase3.isPending
        }
      />
    </div>
  );
}
