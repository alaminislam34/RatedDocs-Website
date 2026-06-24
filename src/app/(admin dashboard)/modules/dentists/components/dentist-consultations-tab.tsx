"use client";

import { useState } from "react";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";
import { ConsultationRequestDrawer } from "./consultation-request-drawer";

type Consultation = {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_initials: string;
  patient_color: string;
  treatment_procedure: string;
  approx_budget: number;
  date: string;
  time_slot: string;
  sub_status: string;
  treatment_plan_status: string | null;
  request_details: {
    traveling_dates: string;
    schedule: { date: string; slot: string };
    dental_history: { last_visited: string; existing_conditions: string[] };
    notes: string | null;
    media: Array<{ label: string; type: string }>;
  };
  treatment_plan: {
    procedure_breakdown: Array<{ procedure: string; price: number | string }>;
    estimate_amount: number;
    additional_info: string;
  } | null;
};

interface DentistConsultationsTabProps {
  consultations: Consultation[];
}

type SubStatus = "upcoming" | "active" | "waiting_estimate";

const PLAN_STATUS_BADGE: Record<string, string> = {
  "Not Sent": "bg-gray-100 text-gray-500",
  "Awaiting response": "bg-amber-50 text-amber-600 border border-amber-200",
  Rejected: "bg-red-50 text-red-500 border border-red-200",
};

function ConsultationCard({
  consultation,
  onViewDetails,
}: {
  consultation: Consultation;
  onViewDetails: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Patient row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: consultation.patient_color }}
          >
            {consultation.patient_initials}
          </span>
          <div>
            <p className="text-sm font-bold text-[#1A1A2E]">
              {consultation.patient_name}
            </p>
            <p className="text-xs text-gray-400">
              {consultation.patient_email}
            </p>
          </div>
        </div>
        {consultation.treatment_plan_status && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              PLAN_STATUS_BADGE[consultation.treatment_plan_status] ??
                "bg-gray-100 text-gray-500",
            )}
          >
            {consultation.treatment_plan_status}
          </span>
        )}
      </div>

      {/* Details grid */}
      <div className="mb-3 grid grid-cols-2 gap-y-2.5 gap-x-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Treatment Procedure
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[#1A1A2E]">
            {consultation.treatment_procedure}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Appox Budget
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[#1A1A2E]">
            ${consultation.approx_budget.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Date
          </p>
          <p className="mt-0.5 text-sm text-gray-700">{consultation.date}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Time slot
          </p>
          <p className="mt-0.5 text-sm text-gray-700">
            {consultation.time_slot}
          </p>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full rounded-xl border border-gray-200 bg-white py-2 text-sm font-semibold text-[#1A1A2E] transition-colors hover:bg-gray-50"
      >
        View Details
      </button>
    </div>
  );
}

export function DentistConsultationsTab({
  consultations,
}: DentistConsultationsTabProps) {
  const [activeSubStatus, setActiveSubStatus] = useState<SubStatus>("upcoming");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);

  const counts = {
    upcoming: consultations.filter((c) => c.sub_status === "upcoming").length,
    active: consultations.filter((c) => c.sub_status === "active").length,
    waiting_estimate: consultations.filter(
      (c) => c.sub_status === "waiting_estimate",
    ).length,
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "active", label: "Active", count: counts.active },
    {
      key: "waiting_estimate",
      label: "Waiting for Treatment estimate",
      count: counts.waiting_estimate,
    },
  ];

  const filtered = consultations.filter(
    (c) => c.sub_status === activeSubStatus,
  );

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Sub-tabs */}
        <div className="border-b border-gray-100 overflow-x-auto px-4 pt-1">
          <CustomTab
            tabs={tabs}
            active={activeSubStatus}
            onChange={(k) => setActiveSubStatus(k as SubStatus)}
          />
        </div>

        {/* Cards grid */}
        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No consultations in this category
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((c) => (
                <ConsultationCard
                  key={c.id}
                  consultation={c}
                  onViewDetails={() => setSelectedConsultation(c)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConsultationRequestDrawer
        open={selectedConsultation != null}
        consultation={selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
      />
    </>
  );
}
