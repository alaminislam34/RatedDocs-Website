"use client";

import { useState } from "react";
import { BarChart2, Clock, CheckCircle2, XCircle } from "lucide-react";
import verificationData from "@/lib/verification-data";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { VerificationCard } from "./components/verification-card";
import { CustomDrawer } from "./components/custom-drawer";

type QueueStatus = "pending" | "approved" | "rejected";
type Dentist = (typeof verificationData.dentists)[number];

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
  const meta = verificationData.meta;
  const [activeTab, setActiveTab] = useState<QueueStatus>("pending");
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = verificationData.dentists.filter(
    (d) => d.queue_status === activeTab
  ) as Dentist[];

  const tabs = [
    { key: "pending", label: "Pending", count: meta.pending_review },
    { key: "approved", label: "Approved", count: meta.fully_approved },
    { key: "rejected", label: "Rejected", count: meta.rejected },
  ];

  const handleViewSubmission = (dentist: Dentist) => {
    setSelectedDentist(dentist);
    setDrawerOpen(true);
  };

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
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${card.iconBg}`}>
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
          <div className="border-b border-gray-100 px-4 pt-1">
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onChange={(k) => setActiveTab(k as QueueStatus)}
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

          {filtered.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-400">
                {FOOTER_MESSAGES[activeTab](filtered.length)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <CustomDrawer
        dentist={selectedDentist}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
