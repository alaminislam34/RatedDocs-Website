"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Lock,
  XCircle,
  FileText,
  Video,
  MapPin,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import verificationData from "@/lib/verification-data";

type Dentist = (typeof verificationData.dentists)[number];
type PhaseKey = "ph1" | "ph2" | "ph3";

interface CustomDrawerProps {
  dentist: Dentist | null;
  open: boolean;
  onClose: () => void;
}

const PHASE_TABS: { key: PhaseKey; short: string; full: string }[] = [
  { key: "ph1", short: "Ph.1 Identity", full: "Ph.1 Identity" },
  { key: "ph2", short: "Ph.2 Operations", full: "Ph.2 Operations" },
  { key: "ph3", short: "Ph.3 Clinical", full: "Ph.3 Clinical" },
];

function PhaseTabIcon({ status }: { status: string }) {
  if (status === "approved")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "pending") return <Clock className="h-4 w-4 text-amber-500" />;
  if (status === "rejected")
    return <XCircle className="h-4 w-4 text-red-500" />;
  return <Lock className="h-4 w-4 text-gray-300" />;
}

function FileRow({
  fileName,
  fileSize,
}: {
  fileName: string;
  fileSize: string;
}) {
  const isVideo = fileName.endsWith(".mp4") || fileName.endsWith(".mov");
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isVideo ? "bg-amber-50" : "bg-red-50",
          )}
        >
          {isVideo ? (
            <Video className="h-4 w-4 text-amber-500" />
          ) : (
            <FileText className="h-4 w-4 text-red-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1A1A2E]">{fileName}</p>
          <p className="text-xs text-gray-400">{fileSize}</p>
        </div>
      </div>
      <button className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
        View <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function MissingFileRow({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-medium text-amber-700">{label}</p>
        <p className="text-xs text-amber-500">{note}</p>
      </div>
    </div>
  );
}

function SpecialtySection({
  specialty,
}: {
  specialty: {
    name: string;
    doc_count: number;
    status: string;
    missing_count?: number;
    documents: {
      label: string;
      file_name: string | null;
      file_size: string | null;
      missing: boolean;
      missing_label?: string;
      missing_note?: string;
      expired?: boolean;
    }[];
  };
}) {
  const [open, setOpen] = useState(specialty.status !== "complete");
  const isComplete = specialty.status === "complete";
  const hasMissing = specialty.status === "missing";

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-white px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1A1A2E]">
            {specialty.name}
          </span>
          <span className="text-xs text-gray-400">
            {specialty.doc_count} docs
          </span>
          {isComplete && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
              Complete
            </span>
          )}
          {hasMissing && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
              {specialty.missing_count} missing
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="space-y-2 border-t border-gray-100 bg-gray-50/40 px-4 py-3">
          {specialty.documents.map((doc, i) => (
            <div key={i}>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {doc.label}
              </p>
              {doc.missing ? (
                <MissingFileRow
                  label={doc.missing_label ?? "Not uploaded"}
                  note={doc.missing_note ?? ""}
                />
              ) : (
                <FileRow fileName={doc.file_name!} fileSize={doc.file_size!} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Ph1Content({ data }: { data: NonNullable<Dentist["ph1_data"]> }) {
  return (
    <div className="space-y-4">
      {data.auto_approved && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <div>
            <p className="font-semibold text-emerald-700">
              Auto-approved by system
            </p>
            <p className="mt-0.5 text-xs text-emerald-600">
              {data.auto_approved_message}
            </p>
          </div>
        </div>
      )}
      {/* License */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          License Verification
        </h4>
        <div className="space-y-2.5">
          {[
            { label: "License number", value: data.license.number },
            { label: "Issuing state", value: data.license.issuing_state },
            {
              label: "Status",
              value: (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ),
            },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
            >
              <span className="text-sm text-gray-400">{r.label}</span>
              <span className="text-sm font-medium text-[#1A1A2E]">
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Gov ID */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Government ID
        </h4>
        <FileRow
          fileName={data.government_id.file_name}
          fileSize={data.government_id.file_size}
        />
        <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
          <CheckCircle2 className="h-3 w-3" />
          {data.government_id.verified_note}
        </p>
      </div>
      {/* Selfie */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Selfie Verification
        </h4>
        <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A1A2E]">
                {data.selfie.file_name}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-gray-400">
                AI match score:{" "}
                <span className="font-semibold text-[#1A1A2E]">
                  {data.selfie.ai_match_score}%
                </span>
                <span className="flex items-center gap-0.5 text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {data.selfie.confidence}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ph2Content({
  data,
  isRejected,
}: {
  data: NonNullable<Dentist["ph2_data"]>;
  isRejected?: boolean;
}) {
  const rejectionReason =
    "rejection_reason" in data ? (data.rejection_reason as string) : null;
  return (
    <div className="space-y-4">
      {isRejected && rejectionReason && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">
              Rejection reason sent to dentist
            </p>
            <p className="mt-0.5 text-xs text-red-500">{rejectionReason}</p>
          </div>
        </div>
      )}
      {/* Sterilization Evidence */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Sterilization Evidence
        </h4>
        {data.sterilization_evidence.video_walkthrough && (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Video Walkthrough
            </p>
            <FileRow
              fileName={data.sterilization_evidence.video_walkthrough.file_name}
              fileSize={data.sterilization_evidence.video_walkthrough.file_size}
            />
          </div>
        )}
        {"jci_certificate" in data.sterilization_evidence &&
          data.sterilization_evidence.jci_certificate && (
            <div className="mt-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                JCI Certificate
              </p>
              <FileRow
                fileName={
                  (
                    data.sterilization_evidence.jci_certificate as {
                      file_name: string;
                      file_size: string;
                    }
                  ).file_name
                }
                fileSize={
                  (
                    data.sterilization_evidence.jci_certificate as {
                      file_name: string;
                      file_size: string;
                    }
                  ).file_size
                }
              />
            </div>
          )}
      </div>
      {/* Procedure Pricing */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Procedure Pricing
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["PROCEDURE", "PRICE", "NOTES"].map((h) => (
                  <th
                    key={h}
                    className="pb-2 pr-4 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400 last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.procedure_pricing.map((row, i) => (
                <tr key={i}>
                  <td className="py-2.5 pr-4 text-sm text-gray-600">
                    {row.procedure}
                  </td>
                  <td className="py-2.5 pr-4 text-sm font-semibold text-blue-600">
                    ${row.price}
                  </td>
                  <td className="py-2.5 text-xs text-gray-400">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* No Surprise Guarantee */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          No Surprise Guarantee E-Signature
        </h4>
        <p className="mb-3 text-xs text-gray-500">
          {data.no_surprise_guarantee.description}
        </p>
        <div className="mb-3 grid grid-cols-2 gap-3">
          {[
            {
              label: "Signer Full Name",
              value: data.no_surprise_guarantee.signer_name,
            },
            {
              label: "Typed Signature",
              value: data.no_surprise_guarantee.typed_signature,
            },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {f.label}
              </p>
              <p className="mt-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-[#1A1A2E]">
                {f.value}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Agreed to the No Surprise Guarantee on{" "}
          {data.no_surprise_guarantee.agreed_at}
        </div>
      </div>
    </div>
  );
}

function Ph3Content({
  data,
  isRejected,
}: {
  data: NonNullable<Dentist["ph3_data"]>;
  isRejected?: boolean;
}) {
  const rejectionReason =
    "rejection_reason" in data ? (data.rejection_reason as string) : null;
  return (
    <div className="space-y-4">
      {isRejected && rejectionReason && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">
              Rejection reason sent to dentist
            </p>
            <p className="mt-0.5 text-xs text-red-500">{rejectionReason}</p>
          </div>
        </div>
      )}
      {/* Clinic Location */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Clinic Location
        </h4>
        <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          {data.clinic_location}
        </div>
      </div>
      {/* Specialties */}
      {data.specialties.map((s, i) => (
        <SpecialtySection key={i} specialty={s} />
      ))}
    </div>
  );
}

export function CustomDrawer({ dentist, open, onClose }: CustomDrawerProps) {
  const [activePhase, setActivePhase] = useState<PhaseKey>("ph2");

  useEffect(() => {
    if (dentist) {
      const pending = PHASE_TABS.find(
        (t) => dentist.phases[t.key].status === "pending",
      );
      const rejected = PHASE_TABS.find(
        (t) => dentist.phases[t.key].status === "rejected",
      );
      setActivePhase(rejected?.key ?? pending?.key ?? "ph1");
    }
  }, [dentist]);

  // Lock scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!dentist) return null;

  const activePhaseStatus = dentist.phases[activePhase].status;
  const isPendingPhase = activePhaseStatus === "pending";
  const isRejectedPhase = activePhaseStatus === "rejected";

  const overallStatus =
    dentist.queue_status === "approved"
      ? "Fully Approved"
      : dentist.queue_status === "rejected" && "rejected_phase_label" in dentist
        ? (dentist.rejected_phase_label as string)
        : `Phase ${dentist.current_phase} — ${activePhaseStatus === "pending" ? "Pending" : "Operations"} · Pending`;

  const statusColor =
    dentist.queue_status === "approved"
      ? "text-emerald-600"
      : dentist.queue_status === "rejected"
        ? "text-red-500"
        : "text-amber-600";

  const specialty = dentist.specialty;
  const location = dentist.location;
  const submittedAgo =
    "submitted_ago" in dentist
      ? (dentist.submitted_ago as string | null)
      : null;
  const approvedAgo =
    "approved_ago" in dentist ? (dentist.approved_ago as string | null) : null;
  const rejectedAgo =
    "rejected_ago" in dentist ? (dentist.rejected_ago as string | null) : null;

  const timeLabel = submittedAgo
    ? `Submitted ${submittedAgo}`
    : approvedAgo
      ? `Approved ${approvedAgo}`
      : rejectedAgo
        ? `Rejected ${rejectedAgo}`
        : "";

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-120 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: dentist.avatar_color }}
            >
              {dentist.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-[#1A1A2E]">
                  {dentist.name}
                </p>
                {dentist.queue_status === "approved" && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Fully Approved
                  </span>
                )}
                {dentist.queue_status !== "approved" && (
                  <span className={cn("text-xs font-semibold", statusColor)}>
                    {overallStatus}
                  </span>
                )}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-gray-400">
                <span>{specialty}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </span>
                {timeLabel && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeLabel}
                    </span>
                  </>
                )}
                {"rdv_score" in dentist && dentist.rdv_score && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-[#1A1A2E]">
                      RDV {dentist.rdv_score}%
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Phase tabs */}
        <div className="shrink-0 border-b border-gray-100 px-5">
          <div className="flex gap-0">
            {PHASE_TABS.map((tab) => {
              const phaseStatus = dentist.phases[tab.key].status;
              const isActive = activePhase === tab.key;
              const isLocked = phaseStatus === "locked";
              return (
                <button
                  key={tab.key}
                  disabled={isLocked}
                  onClick={() => setActivePhase(tab.key)}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-4 py-3 text-xs font-medium transition-colors disabled:cursor-not-allowed",
                    isActive
                      ? "text-[#1A1A2E] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A1A2E]"
                      : isLocked
                        ? "text-gray-300"
                        : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <div className="flex items-center gap-1">
                    <PhaseTabIcon status={phaseStatus} />
                    <span>{tab.short}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      phaseStatus === "approved"
                        ? "text-emerald-500"
                        : phaseStatus === "pending"
                          ? "text-amber-500"
                          : phaseStatus === "rejected"
                            ? "text-red-500"
                            : "text-gray-300",
                    )}
                  >
                    {phaseStatus === "approved"
                      ? "Approved"
                      : phaseStatus === "pending"
                        ? "Pending"
                        : phaseStatus === "rejected"
                          ? "Rejected"
                          : "Locked"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activePhase === "ph1" && dentist.ph1_data && (
            <Ph1Content data={dentist.ph1_data} />
          )}
          {activePhase === "ph2" && dentist.ph2_data && (
            <Ph2Content data={dentist.ph2_data} isRejected={isRejectedPhase} />
          )}
          {activePhase === "ph3" && dentist.ph3_data && (
            <Ph3Content data={dentist.ph3_data} isRejected={isRejectedPhase} />
          )}
          {activePhase === "ph3" && !dentist.ph3_data && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Lock className="mb-2 h-8 w-8 text-gray-200" />
              <p className="text-sm text-gray-400">
                Phase 3 is locked until Phase 2 is approved
              </p>
            </div>
          )}
        </div>

        {/* Footer — only for pending submissions */}
        {isPendingPhase && (
          <div className="shrink-0 flex items-center gap-3 border-t border-gray-100 px-5 py-4">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              <XCircle className="h-4 w-4" />
              Reject &amp; Request Changes
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors">
              <CheckCircle2 className="h-4 w-4" />
              Approve Phase {dentist.current_phase}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
