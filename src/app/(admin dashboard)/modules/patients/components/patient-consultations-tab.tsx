"use client";

import { useState } from "react";
import { ShieldCheck, Star, CalendarPlus } from "lucide-react";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";

type Consultation = {
  id: string;
  dentist_name: string;
  dentist_image: string | null;
  specialty: string;
  rating: number;
  review_count: number;
  verified: boolean;
  rdv_score: number;
  procedure: string;
  date: string | null;
  time: string | null;
  duration: string | null;
  tab: string;
  estimate_min?: number;
  estimate_max?: number;
  estimate_status?: string;
  time_remaining?: string;
  estimate_message?: string;
};

interface PatientConsultationsTabProps {
  consultations: Consultation[];
}

type ConsultTab = "upcoming" | "active" | "estimate_updates";

function DentistCard({ c }: { c: Consultation }) {
  return (
    <div className="flex items-start gap-4">
      {/* Dentist avatar */}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
        {c.dentist_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.dentist_image}
            alt={c.dentist_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-semibold text-gray-500">
            {c.dentist_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-[#1A1A2E]">
          {c.dentist_name}
        </p>
        <p className="text-sm text-gray-500">{c.specialty}</p>
        {/* Stars */}
        <div className="mt-1 flex items-center gap-1">
          <span className="text-sm font-semibold text-[#1A1A2E]">
            {c.rating}
          </span>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < c.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              )}
            />
          ))}
          <span className="text-xs text-gray-400">({c.review_count} Ratings)</span>
        </div>
        {/* Verified */}
        {c.verified && (
          <div className="mt-1.5 flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">VERIFIED</span>
          </div>
        )}
        {/* RDV Score */}
        <div className="mt-2 inline-flex items-center rounded-md border border-gray-200 px-2.5 py-1 text-sm font-semibold text-[#1A1A2E]">
          {c.rdv_score} RDV Score
        </div>
      </div>
    </div>
  );
}

export function PatientConsultationsTab({
  consultations,
}: PatientConsultationsTabProps) {
  const upcoming = consultations.filter((c) => c.tab === "upcoming");
  const active = consultations.filter((c) => c.tab === "active");
  const estimates = consultations.filter((c) => c.tab === "estimate_updates");

  const [activeTab, setActiveTab] = useState<ConsultTab>("upcoming");

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "active", label: "Active", count: active.length },
    { key: "estimate_updates", label: "Estimate Updates", count: estimates.length },
  ];

  const currentList =
    activeTab === "upcoming"
      ? upcoming
      : activeTab === "active"
      ? active
      : estimates;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Sub-tabs */}
      <div className="border-b border-gray-100 px-4 pt-1">
        <CustomTab
          tabs={tabs}
          active={activeTab}
          onChange={(k) => setActiveTab(k as ConsultTab)}
        />
      </div>

      <div className="space-y-3 p-4">
        {currentList.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No consultations found
          </div>
        )}

        {/* Upcoming / Active cards */}
        {(activeTab === "upcoming" || activeTab === "active") &&
          currentList.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <DentistCard c={c} />
                {/* Right info */}
                <div className="shrink-0 text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Procedure
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#1A1A2E]">
                    {c.procedure}
                  </p>
                  {c.estimate_min !== undefined && (
                    <>
                      <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">
                        Estimate Budget
                      </p>
                      <p className="mt-0.5 text-lg font-bold text-[#1A1A2E]">
                        {c.estimate_min === c.estimate_max
                          ? `$${c.estimate_min.toLocaleString()}`
                          : `$${c.estimate_min.toLocaleString()} – $${c.estimate_max!.toLocaleString()}`}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {c.date && (
                <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">
                      {formatDate(c.date)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {c.time} · {c.duration}
                    </p>
                  </div>
                  {activeTab === "upcoming" && (
                    <button className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#1A1A2E] underline underline-offset-2 sm:mt-0">
                      <CalendarPlus className="h-4 w-4" />
                      Add to calendar
                    </button>
                  )}
                  {activeTab === "active" && (
                    <button className="mt-2 rounded-lg bg-[#1A1A2E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors sm:mt-0">
                      Join Consultation
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

        {/* Estimate Updates cards */}
        {activeTab === "estimate_updates" &&
          currentList.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <DentistCard c={c} />
                {/* Right info */}
                <div className="shrink-0 text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Procedure
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#1A1A2E]">
                    {c.procedure}
                  </p>
                  {c.estimate_status === "pending" ? (
                    <>
                      <span className="mt-2 inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white">
                        Estimate Pending
                      </span>
                      {c.time_remaining && (
                        <div className="mt-2 text-right">
                          <p className="text-xl font-bold text-[#1A1A2E]">
                            {c.time_remaining}
                          </p>
                          <p className="text-xs text-gray-400">Time remaining</p>
                        </div>
                      )}
                    </>
                  ) : (
                    c.estimate_min !== undefined && (
                      <>
                        <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">
                          Estimate Budget
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-[#1A1A2E]">
                          ${c.estimate_min.toLocaleString()}
                        </p>
                      </>
                    )
                  )}
                </div>
              </div>

              {c.estimate_message && (
                <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-1.5 text-sm text-gray-500">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400">
                      i
                    </span>
                    {c.estimate_message}
                  </p>
                  {c.estimate_status === "received" && (
                    <button className="shrink-0 rounded-lg bg-[#1A1A2E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors">
                      Review full plan
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
