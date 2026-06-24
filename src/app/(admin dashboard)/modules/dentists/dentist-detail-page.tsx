"use client";

import { useState, useMemo } from "react";
import { DentistDetailPageSkeleton } from "./DentistDetailPageSkeleton";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Star,
  Pencil,
  ShieldOff,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { DentistOverviewTab } from "./components/dentist-overview-tab";
import { DentistBookingsTab } from "./components/dentist-bookings-tab";
import { DentistConsultationsTab } from "./components/dentist-consultations-tab";
import { DentistReviewsTab } from "./components/dentist-reviews-tab";
import { mapApiDentistToUIDentist, type Dentist } from "./dentists-page";
import { useAdminDentist } from "@/hooks/admin/dentist/useDentist";

type MainTab =
  | "overview"
  | "bookings"
  | "consultations"
  | "reviews"
  | "patient_results";

interface DentistDetailPageProps {
  dentistId: string;
}

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  suspended: "bg-red-50 text-red-500",
  rejected: "bg-gray-100 text-gray-500",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  pending: "bg-amber-500",
  suspended: "bg-red-500",
  rejected: "bg-gray-400",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  rejected: "Rejected",
};

function PerformanceBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 90
      ? "bg-[#1A1A2E]"
      : value >= 70
        ? "bg-amber-400"
        : "bg-orange-400";

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={cn(
            "text-xs font-bold",
            value >= 90 ? "text-[#1A1A2E]" : "text-amber-500",
          )}
        >
          {value >= 90 ? `${value}%` : `${value}%`}
        </p>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function VerificationStatus({
  label,
  status,
  short,
}: {
  label: string;
  status: string;
  short: string;
}) {
  const isDone = status === "complete" || status === "completed";
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">
          {short}
        </span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span
        className={cn(
          "text-xs font-semibold",
          isDone ? "text-emerald-600" : "text-amber-500",
        )}
      >
        {isDone
          ? "Complete"
          : status === "pending" ||
              status === "in_review" ||
              status === "SUBMITTED"
            ? "Pending"
            : status === "rejected"
              ? "Rejected"
              : "Not started"}
      </span>
    </div>
  );
}

export default function DentistDetailPage({
  dentistId,
}: DentistDetailPageProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("overview");

  const apiId = dentistId.startsWith("DEN-")
    ? String(parseInt(dentistId.replace("DEN-", ""), 10))
    : dentistId;

  const { dentist: apiDentist, isLoading, isError } = useAdminDentist(apiId);

  const dentist = useMemo(() => {
    if (!apiDentist) return null;
    return mapApiDentistToUIDentist(apiDentist);
  }, [apiDentist]);

  if (isLoading) {
    return <DentistDetailPageSkeleton />;
  }

  if (isError || !dentist) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-red-500">
          Dentist not found or failed to load
        </p>
        <Link
          href="/admin/dentists"
          className="mt-4 text-sm text-blue-600 underline underline-offset-2"
        >
          Back to dentists
        </Link>
      </div>
    );
  }

  const { profile } = dentist;
  const { stats, performance, verification } = profile;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "bookings", label: "Bookings", count: profile.bookings.length },
    {
      key: "consultations",
      label: "Consultations",
      count: profile.consultations.length,
    },
    { key: "reviews", label: "Reviews", count: profile.reviews.length },
    { key: "patient_results", label: "Patient Results", count: 0 },
  ];

  const statCards = [
    {
      icon: "calendar",
      label: "Total bookings",
      value: stats.total_bookings.count.toLocaleString(),
      sub: `+${stats.total_bookings.growth_this_month} this month`,
    },
    {
      icon: "dollar",
      label: "Revenue (lifetime)",
      value: `$${stats.revenue_lifetime.amount.toLocaleString()}`,
      sub: `Avg $${stats.revenue_lifetime.avg_per_visit}/visit`,
    },
    {
      icon: "alert",
      label: "Cancellation rate",
      value: stats.cancellation_rate.pct,
      sub: `Below avg (${stats.cancellation_rate.benchmark})`,
    },
    {
      icon: "chart",
      label: "Estimate accuracy",
      value: stats.estimate_accuracy.pct,
      sub: stats.estimate_accuracy.note,
    },
    {
      icon: "clock",
      label: "Avg response time",
      value: stats.avg_response_time.value,
      sub: stats.avg_response_time.note,
    },
  ];

  const showVerificationSidebar = activeTab === "consultations";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/admin/dentists"
          className="flex items-center gap-1.5 font-medium text-gray-500 transition-colors hover:text-[#1A1A2E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Dentists
        </Link>
        <span>/</span>
        <span className="font-medium text-[#1A1A2E]">{dentist.name}</span>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: avatar + name + badges + meta */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white sm:h-16 sm:w-16"
              style={{ backgroundColor: dentist.avatar_color }}
            >
              {dentist.initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">
                  {dentist.name}
                </h2>
                {dentist.rdv_verified && (
                  <span className="flex items-center gap-1 rounded-full bg-[#1A1A2E] px-2.5 py-0.5 text-xs font-bold text-white">
                    <CheckCircle2 className="h-3 w-3" />
                    RDV Verified · {dentist.rdv_score}
                  </span>
                )}
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    STATUS_BADGE[dentist.status] ?? "bg-gray-100 text-gray-500",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      STATUS_DOT[dentist.status] ?? "bg-gray-400",
                    )}
                  />
                  {STATUS_LABEL[dentist.status] ?? dentist.status}
                </span>
                <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                  {dentist.specialty}
                </span>
              </div>
              {/* Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {dentist.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {dentist.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {dentist.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {dentist.experience_years} yrs experience
                </span>
                {dentist.languages.map((lang) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500"
                  >
                    🌐 {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: rating */}
          {dentist.rating != null && dentist.review_count != null && (
            <div className="shrink-0 text-right">
              <div className="flex items-center justify-end gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(dentist.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xl font-bold text-[#1A1A2E]">
                  {dentist.rating}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-400">
                {dentist.review_count.toLocaleString()} verified reviews
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[#1A1A2E]">
              {s.value}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          <div className="rounded-t-xl border-b border-gray-100 overflow-x-auto bg-white px-4 pt-1 shadow-sm">
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onChange={(k) => setActiveTab(k as MainTab)}
            />
          </div>
          <div className="mt-4">
            {activeTab === "overview" && (
              <DentistOverviewTab
                dentistId={apiId}
                verification={verification}
              />
            )}
            {activeTab === "bookings" && (
              <DentistBookingsTab
                bookings={
                  profile.bookings as Parameters<
                    typeof DentistBookingsTab
                  >[0]["bookings"]
                }
              />
            )}
            {activeTab === "consultations" && (
              <DentistConsultationsTab
                consultations={
                  profile.consultations as Parameters<
                    typeof DentistConsultationsTab
                  >[0]["consultations"]
                }
              />
            )}
            {activeTab === "reviews" && (
              <DentistReviewsTab
                reviews={profile.reviews}
                totalReviews={dentist.review_count ?? profile.reviews.length}
              />
            )}
            {activeTab === "patient_results" && (
              <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                No patient results yet
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
          {/* Performance */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-1 text-sm font-bold text-[#1A1A2E]">Performance</p>
            <p className="mb-3 text-xs text-gray-400">Based on last 90 days</p>
            <div className="flex flex-col gap-3">
              <PerformanceBar
                label="Show-up rate"
                value={performance.show_up_rate}
              />
              <PerformanceBar
                label="5-star reviews"
                value={performance.five_star_reviews}
              />
              <PerformanceBar
                label="Repeat patients"
                value={performance.repeat_patients}
              />
              <PerformanceBar
                label="Estimate accuracy"
                value={performance.estimate_accuracy}
              />
            </div>
          </div>

          {/* Verification (consultations tab only) */}
          {showVerificationSidebar ? (
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-bold text-[#1A1A2E]">
                Verification
              </p>
              <div className="divide-y divide-gray-50">
                <VerificationStatus
                  label="Phase 1 — Identity"
                  status={verification.phase1.status}
                  short="Ph.1"
                />
                <VerificationStatus
                  label="Phase 2 — Operations"
                  status={verification.phase2.status}
                  short="Ph.2"
                />
                <VerificationStatus
                  label="Phase 3 — Clinical"
                  status={verification.phase3.status}
                  short="Ph.3"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-bold text-[#1A1A2E]">
                Admin actions
              </p>
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <Pencil className="h-4 w-4 text-gray-400" />
                  Edit profile
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50">
                  <ShieldOff className="h-4 w-4" />
                  Suspend account
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
