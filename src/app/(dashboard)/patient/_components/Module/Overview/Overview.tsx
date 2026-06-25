"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  DollarSign,
  FileText,
  Video,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Component Imports
import { StatCard } from "@/app/(dashboard)/patient/_components/Module/Overview/StatsCard";
import { ConsultationCard } from "@/app/(dashboard)/patient/_components/Module/Overview/ConsultationCard";
import { RescheduleConsultationModal } from "@/app/(dashboard)/patient/_components/Module/Overview/RescheduleConsultationModal";
import { usePatientConsultations } from "@/hooks/patient/usePatient";

// Type Imports
import {
  Consultation,
  ConsultationStatus,
} from "@/types/patient_portal.interface";
import type { ConsultationFlowItem } from "@/app/(dashboard)/patient/_components/Module/MyBooking/data";

// ─── Types & Constants ────────────────────────────────────────────────────────

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

// ─── Helper Components ────────────────────────────────────────────────────────

/**
 * EmptySlate displays a placeholder message when a specific tab has no data.
 * It provides a call-to-action to find a dentist.
 */
function EmptySlate({ tab }: { tab: Tab }) {
  const { title, body } = EMPTY_STATE[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
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

// ─── Data Transformation ──────────────────────────────────────────────────────

const isToday = (isoDateStr: string) => {
  if (!isoDateStr) return false;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const localTodayStr = `${year}-${month}-${day}`;
  return isoDateStr === localTodayStr;
};

/**
 * Transforms raw backend Consultation data into the UI-specific ConsultationFlowItem format.
 * This function handles date formatting, budget parsing, and status mapping to ensure
 * the UI receives data in the exact shape it expects.
 */

function mapBackendConsultationToFlowItem(
  c: Consultation,
): ConsultationFlowItem {
  // Map backend status to UI status
  let status: ConsultationStatus = c.status;
  switch (c.status) {
    case ConsultationStatus.COMPLETED:
      status = ConsultationStatus.COMPLETED;
      break;
    case ConsultationStatus.CANCELLED:
      status = ConsultationStatus.CANCELLED;
      break;
    case ConsultationStatus.SCHEDULED:
      status = ConsultationStatus.SCHEDULED;
      break;
    case ConsultationStatus.ESTIMATE_PENDING:
      status = ConsultationStatus.ESTIMATE_PENDING;
      break;
    case ConsultationStatus.ESTIMATE_RECEIVED:
      status = ConsultationStatus.ESTIMATE_RECEIVED;
      break;
    case ConsultationStatus.ESTIMATE_ACCEPT:
      status = ConsultationStatus.ESTIMATE_ACCEPT;
      break;
    default:
      status = ConsultationStatus.DRAFT;
  }

  const dentistName = c.dentist?.full_name || "Dentist";
  const slug = `consultation-${c.id}`;

  let formattedDate = "TBD";
  let formattedTime = "";
  let isoDate = "";

  if (c.schedule?.scheduled_at) {
    try {
      const dateObj = new Date(c.schedule.scheduled_at);
      if (!isNaN(dateObj.getTime())) {
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
      }
    } catch (error) {
      console.error("Error parsing consultation date:", error);
    }
  }

  const budgetNum = parseFloat(c.approximate_budget);
  const estimateBudget = !isNaN(budgetNum)
    ? `$${budgetNum.toLocaleString()}`
    : "$0";

  let primaryActionLabel = "Join Consultation";
  let alertMessage: string | undefined = undefined;

  if (new Date().getTime() > new Date(c.travel_end_date).getTime()) {
    console.log("Missed");
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
      image: "/images/dentist.png",
      rating: c.dentist?.rating_avg ?? 5.0,
      reviewCount: c.dentist?.total_reviews ?? 0,
    },
    procedure:
      c.treatment_interest?.map((t) => t.name).join(", ") ||
      "General Consultation",
    estimateBudget,
    accuracy: "95% Accuracy",
    rdvScore: 95,
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

// ─── Sub-Components ───────────────────────────────────────────────────────────

interface OverviewStatsProps {
  consultations: Consultation[];
}

/**
 * OverviewStats calculates and displays key metrics (escrow, completed bookings, documents)
 * based on the raw consultation data. Calculations are memoized for performance.
 */
function OverviewStats({ consultations }: OverviewStatsProps) {
  const stats = useMemo(() => {
    let totalEscrow = 0;
    let completedCount = 0;
    let documentsCount = 0;

    consultations.forEach((c) => {
      // Calculate escrow for scheduled or active consultations
      if (c.status === ConsultationStatus.SCHEDULED) {
        totalEscrow += parseFloat(c.approximate_budget) || 0;
      }
      // Count completed consultations
      if (c.status === ConsultationStatus.COMPLETED) {
        completedCount++;
      }
      // Count documents (xrays and dental photos)
      if (c.xrays) documentsCount++;
      if (c.dental_photo) documentsCount++;
    });

    return {
      escrow: `$${totalEscrow.toLocaleString()}`,
      completed: String(completedCount).padStart(2, "0"),
      documents: String(documentsCount).padStart(2, "0"),
    };
  }, [consultations]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<DollarSign className="w-5 h-5" />}
        value={stats.escrow}
        label="Amount in escrow"
      />
      <StatCard
        icon={<CalendarCheck className="w-5 h-5" />}
        value={stats.completed}
        label="Booking Completed"
      />
      <StatCard
        icon={<FileText className="w-5 h-5" />}
        value={stats.documents}
        label="Documents stored"
      />
    </div>
  );
}

interface ConsultationTabsProps {
  consultations: ConsultationFlowItem[];
  onReschedule: (consultation: ConsultationFlowItem) => void;
}

function ConsultationTabs({
  consultations,
  onReschedule,
}: ConsultationTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const router = useRouter();

  const filteredConsultations = useMemo(() => {
    if (activeTab === "upcoming") {
      return consultations.filter(
        (item) =>
          item.status === ConsultationStatus.SCHEDULED && !item.alertMessage,
      );
    }

    if (activeTab === "active") {
      return consultations.filter(
        (item) =>
          item.status === ConsultationStatus.SCHEDULED && isToday(item.isoDate),
      );
    }

    if (activeTab === "estimate-updates") {
      return consultations.filter((item) =>
        [
          ConsultationStatus.COMPLETED,
          ConsultationStatus.ESTIMATE_PENDING,
          ConsultationStatus.ESTIMATE_RECEIVED,
          ConsultationStatus.ESTIMATE_ACCEPT,
        ].includes(item.status),
      );
    }
    return [];
  }, [consultations, activeTab]);

  const handlePrimaryAction = (consultation: ConsultationFlowItem) => {
    if (consultation.status === ConsultationStatus.DRAFT) {
      onReschedule(consultation);
      return;
    }
    router.push(`/consultation/${consultation.id}`);
  };

  console.log("consultations", consultations);

  console.log("filteredConsultations", filteredConsultations);
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
      <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Consultation</h2>

      <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`pb-3 text-[15px] font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === key
                ? "text-[#113254] border-[#113254]"
                : "text-[#9CA3AF] border-transparent hover:text-[#6B7280]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {filteredConsultations.length > 0 ? (
        <div className="space-y-5">
          {filteredConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onPrimaryAction={() => handlePrimaryAction(consultation)}
            />
          ))}
        </div>
      ) : (
        <EmptySlate tab={activeTab} />
      )}
    </div>
  );
}

export default function Overview() {
  const router = useRouter();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationFlowItem | null>(null);

  const { data: apiResponse, isLoading } = usePatientConsultations();

  const rawConsultations = apiResponse ?? [];

  const mappedConsultations = useMemo(
    () => rawConsultations.map(mapBackendConsultationToFlowItem),
    [rawConsultations],
  );

  const openReschedule = (consultation: ConsultationFlowItem) => {
    setSelectedConsultation(consultation);
    setRescheduleOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#113254]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Overview</h1>

      <OverviewStats consultations={rawConsultations} />

      <ConsultationTabs
        consultations={mappedConsultations}
        onReschedule={openReschedule}
      />

      {selectedConsultation && (
        <RescheduleConsultationModal
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          consultation={selectedConsultation}
          onConfirmed={() => setRescheduleOpen(false)}
          onAddToCalendar={() =>
            router.push(`/consultation/${selectedConsultation.id}`)
          }
        />
      )}
    </div>
  );
}
