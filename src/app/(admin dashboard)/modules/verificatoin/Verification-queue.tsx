"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart2, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { VerificationCard } from "./components/verification-card";
import { CustomDrawer } from "./components/custom-drawer";
import useAdmin from "@/hooks/admin/user/useAdmin";
import type { QueueStatus, VerificationDentist } from "./types";
import toast from "react-hot-toast";
import {
  useDentistPhaseOneApprove,
  useDentistPhaseOneReject,
  useDentistPhaseTwoApprove,
  useDentistPhaseTwoReject,
  useDentistPhaseThreeApprove,
  useDentistPhaseThreeReject,
} from "@/hooks/admin/dentist/useDentist";
import {
  API_STATUS_BY_QUEUE_STATUS,
  normalizeLicenseQueue,
  PAGE_SIZE,
} from "./verification-utils";

const STAT_CARDS = [
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    iconBg: "bg-blue-50",
    label: "Total dentists",
    key: "total_dentists" as const,
    sub: "In verification pipeline",
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-500" />,
    iconBg: "bg-amber-50",
    label: "Pending review",
    key: "pending_review" as const,
    sub: "Ph.2 & Ph.3 submissions",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
    iconBg: "bg-emerald-50",
    label: "Fully approved",
    key: "fully_approved" as const,
    sub: "All 3 phases complete",
  },
  {
    icon: <XCircle className="h-6 w-6 text-red-500" />,
    iconBg: "bg-red-50",
    label: "Rejected",
    key: "rejected" as const,
    sub: "Awaiting resubmission",
  },
];

const FOOTER_MESSAGES: Record<QueueStatus, (count: number) => string> = {
  pending: (n) => `${n} submission${n !== 1 ? "s" : ""} awaiting review`,
  approved: (n) => `${n} dentist${n !== 1 ? "s" : ""} fully approved`,
  rejected: (n) => `${n} dentist${n !== 1 ? "s" : ""} awaiting resubmission`,
};

export default function VerificationQueue() {
  const [activeTab, setActiveTab] = useState<QueueStatus>("pending");
  const [page, setPage] = useState(1);
  const [selectedDentist, setSelectedDentist] =
    useState<VerificationDentist | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dentistIdStr = selectedDentist ? String(selectedDentist.id) : "";
  const actualDentistId = selectedDentist
    ? String(selectedDentist.dentist)
    : "";

  const approvePhase1 = useDentistPhaseOneApprove(
    dentistIdStr,
    actualDentistId,
  );
  const rejectPhase1 = useDentistPhaseOneReject(dentistIdStr, actualDentistId);

  const approvePhase2 = useDentistPhaseTwoApprove(
    dentistIdStr,
    actualDentistId,
  );
  const rejectPhase2 = useDentistPhaseTwoReject(dentistIdStr, actualDentistId);

  const approvePhase3 = useDentistPhaseThreeApprove(
    dentistIdStr,
    actualDentistId,
  );
  const rejectPhase3 = useDentistPhaseThreeReject(
    dentistIdStr,
    actualDentistId,
  );

  const isApprovePending =
    approvePhase1.isPending ||
    approvePhase2.isPending ||
    approvePhase3.isPending;
  const isRejectPending =
    rejectPhase1.isPending || rejectPhase2.isPending || rejectPhase3.isPending;

  const handleApprove = useCallback(
    async (id: number, phase: "ph1" | "ph2" | "ph3") => {
      const toastId = toast.loading("Approving phase...");
      try {
        if (phase === "ph1") {
          await approvePhase1.mutateAsync();
        } else if (phase === "ph2") {
          await approvePhase2.mutateAsync();
        } else if (phase === "ph3") {
          await approvePhase3.mutateAsync();
        }
        toast.success("Phase approved successfully!", { id: toastId });
        setDrawerOpen(false);
      } catch (err: any) {
        toast.error(err?.message || "Failed to approve phase.", {
          id: toastId,
        });
      }
    },
    [approvePhase1, approvePhase2, approvePhase3],
  );

  const handleReject = useCallback(
    async (id: number, phase: "ph1" | "ph2" | "ph3") => {
      const reason = window.prompt("Please enter the reason for rejection:");
      if (!reason || !reason.trim()) return;

      const toastId = toast.loading("Rejecting phase...");
      try {
        if (phase === "ph1") {
          await rejectPhase1.mutateAsync(reason.trim());
        } else if (phase === "ph2") {
          await rejectPhase2.mutateAsync(reason.trim());
        } else if (phase === "ph3") {
          await rejectPhase3.mutateAsync(reason.trim());
        }
        toast.success("Phase rejected successfully!", { id: toastId });
        setDrawerOpen(false);
      } catch (err: any) {
        toast.error(err?.message || "Failed to reject phase.", { id: toastId });
      }
    },
    [rejectPhase1, rejectPhase2, rejectPhase3],
  );

  const licenseQueueParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      status: API_STATUS_BY_QUEUE_STATUS[activeTab],
    }),
    [activeTab, page],
  );

  const { getLicenseQueue, isLicenseQueueLoading, isLicenseQueueError } =
    useAdmin({ licenseQueueParams });

  const { meta, mappedLicenses, pagination } = useMemo(
    () => normalizeLicenseQueue(getLicenseQueue.data),
    [getLicenseQueue.data],
  );

  // Sync selected dentist with updated query queue data
  useEffect(() => {
    if (selectedDentist) {
      const updated = mappedLicenses.find((d) => d.id === selectedDentist.id);
      if (updated) {
        setSelectedDentist(updated);
      }
    }
  }, [mappedLicenses, selectedDentist?.id]);

  const filtered = useMemo(
    () =>
      mappedLicenses.filter((dentist) => dentist.queue_status === activeTab),
    [mappedLicenses, activeTab],
  );

  const tabs = [
    { key: "pending", label: "Pending", count: meta.pending_review },
    { key: "approved", label: "Approved", count: meta.fully_approved },
    { key: "rejected", label: "Rejected", count: meta.rejected },
  ];

  const activeTotal =
    activeTab === "pending"
      ? meta.pending_review
      : activeTab === "approved"
        ? meta.fully_approved
        : meta.rejected;

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as QueueStatus);
    setPage(1);
  }, []);

  const handleViewSubmission = useCallback((dentist: VerificationDentist) => {
    setSelectedDentist(dentist);
    setDrawerOpen(true);
  }, []);

  if (isLicenseQueueLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#163E5C]" />
      </div>
    );
  }

  if (isLicenseQueueError) {
    return (
      <div className="flex min-h-100 items-center justify-center text-red-500">
        Failed to load verification queue. Please try again.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Verification Queue
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Review dentist credentials across 3 phases before they go live.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${card.iconBg}`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-0.5 text-3xl font-bold tracking-tight text-[#1A1A2E]">
                  {meta[card.key]}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + list */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 overflow-x-auto px-4 pt-1">
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onChange={handleTabChange}
            />
          </div>

          <div className="space-y-3 p-4">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">
                No dentists in this category
              </div>
            )}
            {filtered.map((dentist) => (
              <VerificationCard
                key={dentist.id}
                dentist={dentist}
                onViewSubmission={handleViewSubmission}
              />
            ))}
          </div>

          {(filtered.length > 0 || pagination.totalPages > 1) && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-400">
                {FOOTER_MESSAGES[activeTab](activeTotal || filtered.length)}
              </p>
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || getLicenseQueue.isFetching}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={
                      page >= pagination.totalPages ||
                      getLicenseQueue.isFetching
                    }
                    onClick={() =>
                      setPage((value) =>
                        Math.min(pagination.totalPages, value + 1),
                      )
                    }
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <CustomDrawer
        dentist={selectedDentist}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        isApprovePending={isApprovePending}
        isRejectPending={isRejectPending}
      />
    </>
  );
}
