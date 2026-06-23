"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, DollarSign, FileText, Video } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/app/(dashboard)/patient/_components/Module/Overview/StatsCard";
import { ConsultationCard } from "@/app/(dashboard)/patient/_components/Module/Overview/ConsultationCard";
import { consultationFlowData, treatmentPlansData, type ConsultationFlowItem } from "@/app/(dashboard)/patient/_components/Module/MyBooking/data";
import { RescheduleConsultationModal } from "@/app/(dashboard)/patient/_components/Module/Overview/RescheduleConsultationModal";
import DoctorCard from "@/app/(dashboard)/patient/_components/Module/MyBooking/Card";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "upcoming" | "active" | "estimate-updates";

const TABS: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "estimate-updates", label: "Estimate Updates" },
];

const EMPTY_STATE: Record<Tab, { title: string; body: string }> = {
  upcoming: {
    title: "No Upcoming Consultations",
    body: "You don't have any upcoming consultations. Once you book a consultation, it will appear here.",
  },
  active: {
    title: "No Active Consultations",
    body: "You don't have any active consultations right now.",
  },
  "estimate-updates": {
    title: "No Estimate Updates",
    body: "You don't have any estimate updates at the moment.",
  },
};

// ─── Empty state UI ───────────────────────────────────────────────────────────

function EmptySlate({ tab }: { tab: Tab }) {
  const { title, body } = EMPTY_STATE[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-xl bg-[#113254] flex items-center justify-center mb-5">
        <Video className="size-7 text-white" />
      </div>
      <p className="text-[17px] font-bold text-[#1A1A2E] mb-2">{title}</p>
      <p className="text-[14px] text-[#6B7280] max-w-xs leading-relaxed mb-6">{body}</p>
      <Link
        href="/find-dentist"
        className="px-6 py-3 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[14px] rounded-xl transition-all active:scale-95"
      >
        Find a dentist
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Overview() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationFlowItem | null>(null);
  const router = useRouter();

  const consultationsToShow =
    activeTab === "upcoming"
      ? consultationFlowData.filter((item) => item.status === "upcoming")
      : activeTab === "active"
        ? consultationFlowData.filter((item) => item.status === "active" || item.status === "missed")
        : [];

  const openReschedule = (consultation: ConsultationFlowItem) => {
    setSelectedConsultation(consultation);
    setRescheduleOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Overview</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          value="$1500"
          label="Amount in escrow"
        />
        <StatCard
          icon={<CalendarCheck className="w-5 h-5" />}
          value="02"
          label="Booking Completed"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          value="08"
          label="Documents stored"
        />
      </div>

      {/* Consultation section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Consultation</h2>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-[15px] font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === key
                  ? "text-[#113254] border-[#113254]"
                  : "text-[#9CA3AF] border-transparent hover:text-[#6B7280]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "estimate-updates" ? (
          treatmentPlansData.length ? (
            <div className="space-y-5">
              {treatmentPlansData.map((plan) => (
                <DoctorCard key={plan.id} data={plan} />
              ))}
            </div>
          ) : (
            <EmptySlate tab={activeTab} />
          )
        ) : consultationsToShow.length ? (
          <div className="space-y-5">
            {consultationsToShow.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                onPrimaryAction={() => {
                  if (consultation.status === "missed") {
                    openReschedule(consultation);
                    return;
                  }
                  router.push(`/consultation/${consultation.slug}`);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptySlate tab={activeTab} />
        )}
      </div>

      {selectedConsultation ? (
        <RescheduleConsultationModal
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          consultation={selectedConsultation}
          onConfirmed={() => setActiveTab("active")}
          onAddToCalendar={() => router.push(`/consultation/${selectedConsultation.slug}`)}

          />
      ) : null}
    </div>
  );
}
