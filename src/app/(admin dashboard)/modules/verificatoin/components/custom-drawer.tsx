"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Lock, MapPin, ShieldCheck, X, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhaseKey, VerificationDentist } from "../types";
import { PHASE_TABS } from "./drawer/constants";
import { PhaseTabIcon } from "./drawer/phase-tab-icon";
import { Ph1Content, Ph2Content, Ph3Content } from "./drawer/phase-content";

interface CustomDrawerProps {
  dentist: VerificationDentist | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (id: number, phase: PhaseKey) => void;
  onReject?: (id: number, phase: PhaseKey) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

function getPhaseData(dentist: VerificationDentist, phase: PhaseKey) {
  if (phase === "ph1") return dentist.ph1_data;
  if (phase === "ph2") return dentist.ph2_data;
  return dentist.ph3_data;
}

export function CustomDrawer({
  dentist,
  open,
  onClose,
  onApprove,
  onReject,
  isApprovePending = false,
  isRejectPending = false,
}: CustomDrawerProps) {
  const [selectedPhase, setSelectedPhase] = useState<{
    dentistId: number;
    phase: PhaseKey;
  } | null>(null);

  const defaultPhase = useMemo<PhaseKey>(() => {
    if (!dentist) return "ph1";
    const rejected = PHASE_TABS.find(
      (tab) => dentist.phases?.[tab.key]?.status === "rejected",
    );
    const pending = PHASE_TABS.find(
      (tab) => dentist.phases?.[tab.key]?.status === "pending",
    );

    return rejected?.key ?? pending?.key ?? "ph1";
  }, [dentist]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activePhase =
    dentist && selectedPhase?.dentistId === dentist.id
      ? selectedPhase.phase
      : defaultPhase;

  const drawerDetails = useMemo(() => {
    if (!dentist) return null;

    const activePhaseStatus = dentist.phases?.[activePhase]?.status || "locked";
    const displayName = dentist.dentist_name || `Reg: ${dentist.registration_no}`;
    const displayLocation =
      dentist.location || `${dentist.city}, ${dentist.country}`;
    const displaySpecialty = dentist.specialty || dentist.doc_type || "LICENSE";

    return {
      activePhaseStatus,
      displayName,
      displayLocation,
      displaySpecialty,
      displayInitial: displayName.charAt(0).toUpperCase(),
      hasActivePhaseData: Boolean(getPhaseData(dentist, activePhase)),
      statusColor:
        dentist.queue_status === "approved"
          ? "text-emerald-600"
          : dentist.queue_status === "rejected"
            ? "text-red-500"
            : "text-amber-600",
    };
  }, [activePhase, dentist]);

  if (!dentist || !drawerDetails) return null;

  const isPendingPhase = drawerDetails.activePhaseStatus === "pending";
  const isRejectedPhase = drawerDetails.activePhaseStatus === "rejected";

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#163E5C] text-sm font-bold text-white">
              {drawerDetails.displayInitial}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="break-all text-base font-bold text-[#1A1A2E]">
                  {drawerDetails.displayName}
                </p>
                {dentist.queue_status === "approved" && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Fully Approved
                  </span>
                )}
                {dentist.queue_status !== "approved" && (
                  <span
                    className={cn("text-xs font-semibold", drawerDetails.statusColor)}
                  >
                    {activePhase.toUpperCase()} - {drawerDetails.activePhaseStatus}
                  </span>
                )}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-gray-400">
                <span>{drawerDetails.displaySpecialty}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {drawerDetails.displayLocation}
                </span>
                {dentist.submitted_ago && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {dentist.submitted_ago}
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

        <div className="shrink-0 overflow-x-auto border-b border-gray-100 px-5">
          <div className="flex min-w-max gap-0">
            {PHASE_TABS.map((tab) => {
              const phaseStatus = dentist.phases?.[tab.key]?.status || "locked";
              const isActive = activePhase === tab.key;
              const isLocked = phaseStatus === "locked";

              return (
                <button
                  key={tab.key}
                  disabled={isLocked}
                  onClick={() =>
                    setSelectedPhase({ dentistId: dentist.id, phase: tab.key })
                  }
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
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activePhase === "ph1" && dentist.ph1_data && (
            <Ph1Content data={dentist.ph1_data} licenseFile={dentist.file} />
          )}
          {activePhase === "ph2" && dentist.ph2_data && (
            <Ph2Content data={dentist.ph2_data} isRejected={isRejectedPhase} />
          )}
          {activePhase === "ph3" && dentist.ph3_data && (
            <Ph3Content data={dentist.ph3_data} isRejected={isRejectedPhase} />
          )}

          {!drawerDetails.hasActivePhaseData && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Lock className="mb-2 h-8 w-8 text-gray-200" />
              <p className="text-sm text-gray-400">
                Data for this phase is not available or locked.
              </p>
            </div>
          )}
        </div>

        {isPendingPhase && (
          <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row">
            <button
              disabled={isRejectPending || isApprovePending}
              onClick={() => onReject?.(dentist.id, activePhase)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {isRejectPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Reject & Request Changes
            </button>
            <button
              disabled={isApprovePending || isRejectPending}
              onClick={() => onApprove?.(dentist.id, activePhase)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A1A2E]/90 disabled:opacity-50"
            >
              {isApprovePending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Approve Phase
            </button>
          </div>
        )}
      </div>
    </>
  );
}
