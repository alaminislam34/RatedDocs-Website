"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, DollarSign, FileText, Video, Loader2 } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/app/(dashboard)/patient/_components/Module/Overview/StatsCard";
import { ConsultationCard } from "@/app/(dashboard)/patient/_components/Module/Overview/ConsultationCard";
import {
  treatmentPlansData,
  type ConsultationFlowItem,
} from "@/app/(dashboard)/patient/_components/Module/MyBooking/data";
import { RescheduleConsultationModal } from "@/app/(dashboard)/patient/_components/Module/Overview/RescheduleConsultationModal";
import DoctorCard from "@/app/(dashboard)/patient/_components/Module/MyBooking/Card";
import { usePatientConsultations } from "@/hooks/patient/usePatient";

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

function EmptySlate({ tab }: { tab: Tab }) {
  const { title, body } = EMPTY_STATE[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-xl bg-[#113254] flex items-center justify-center mb-5">
        <Video className="size-7 text-white" />
      </div>
      <p className="text-[17px] font-bold text-[#1A1A2E] mb-2">{title}</p>
      <p className="text-[14px] text-[#6B7280] max-w-xs leading-relaxed mb-6">
        {body}
      </p>
      <Link
        href="/find-dentist"
        className="px-6 py-3 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[14px] rounded-xl transition-all active:scale-95"
      >
        Find a dentist
      </Link>
    </div>
  );
}

function mapBackendConsultationToFlowItem(c: any): ConsultationFlowItem {
  let status: "upcoming" | "active" | "missed" | "completed" = "upcoming";
  if (c.status === "completed") {
    status = "completed";
  } else if (c.status === "missed") {
    status = "missed";
  } else if (c.status === "active") {
    status = "active";
  } else if (c.status === "scheduled") {
    status = "upcoming";
  }

  const dentistName = c.dentist?.full_name || "Dentist";
  const slug = c.slug || dentistName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${c.id}`;

  let formattedDate = "TBD";
  let formattedTime = "";
  let isoDate = "";
  if (c.schedule?.scheduled_at) {
    try {
      const dateObj = new Date(c.schedule.scheduled_at);
      formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
      isoDate = c.schedule.scheduled_at.split("T")[0];
    } catch (e) {
      console.error(e);
    }
  }

  const budgetNum = parseFloat(c.approximate_budget);
  const estimateBudget = !isNaN(budgetNum)
    ? `$${budgetNum.toLocaleString()}`
    : "$0";

  let primaryActionLabel = "Join Consultation";
  let alertMessage: string | undefined = undefined;

  if (status === "missed") {
    primaryActionLabel = "Reschedule";
    alertMessage =
      "You missed your consultation. You can book any available slot in the next 24 hours. After that, this option will expire.";
  } else if (status === "completed") {
    primaryActionLabel = "View Summary";
  }

  return {
    id: String(c.id),
    slug,
    status,
    doctor: {
      name: dentistName,
      specialty: c.dentist?.specialty || "DENTIST",
      image: c.dentist?.image || "/images/dentist.png",
      rating: c.dentist?.rating_avg !== undefined ? c.dentist.rating_avg : 5.0,
      reviewCount: c.dentist?.total_reviews !== undefined ? c.dentist.total_reviews : 0,
    },
    procedure: c.treatment_interest?.map((t: any) => t.name).join(", ") || "General Consultation",
    estimateBudget,
    accuracy: "95% Accuracy",
    rdvScore: c.dentist?.rdv_score !== undefined ? c.dentist.rdv_score : 95,
    date: formattedDate,
    time: formattedTime,
    timezone: c.schedule?.timezone || "UTC",
    duration: `${c.schedule?.duration_minutes || 30}-minute video call`,
    isoDate,
    alertMessage,
    primaryActionLabel,
    secondaryActionLabel: "Add to calendar",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Overview() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationFlowItem | null>(null);
  const router = useRouter();

  const { data: apiResponse, isLoading } = usePatientConsultations();

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#113254]" />
      </div>
    );
  }

  const rawConsultations = (apiResponse as any)?.data || [];
  const consultations = rawConsultations.map(mapBackendConsultationToFlowItem) as ConsultationFlowItem[];

  const consultationsToShow =
    activeTab === "upcoming"
      ? consultations.filter((item) => item.status === "upcoming")
      : activeTab === "active"
        ? consultations.filter(
            (item) => item.status === "active" || item.status === "missed",
          )
        : [];

  const openReschedule = (consultation: ConsultationFlowItem) => {
    setSelectedConsultation(consultation);
    setRescheduleOpen(true);
  };

  const totalEscrow = rawConsultations.reduce((acc: number, c: any) => {
    if (c.status === "scheduled" || c.status === "active") {
      return acc + (parseFloat(c.approximate_budget) || 0);
    }
    return acc;
  }, 0);

  const completedCount = rawConsultations.filter(
    (c: any) => c.status === "completed",
  ).length;

  const documentsCount = rawConsultations.reduce((acc: number, c: any) => {
    let count = 0;
    if (c.xrays) count++;
    if (c.dental_photo) count++;
    return acc + count;
  }, 0);

  const formattedEscrow = `$${totalEscrow.toLocaleString()}`;
  const formattedCompleted = String(completedCount).padStart(2, "0");
  const formattedDocuments = String(documentsCount).padStart(2, "0");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Overview</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          value={formattedEscrow}
          label="Amount in escrow"
        />
        <StatCard
          icon={<CalendarCheck className="w-5 h-5" />}
          value={formattedCompleted}
          label="Booking Completed"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          value={formattedDocuments}
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
          onAddToCalendar={() =>
            router.push(`/consultation/${selectedConsultation.slug}`)
          }
        />
      ) : null}
    </div>
  );
}
