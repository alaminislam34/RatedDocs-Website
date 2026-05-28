"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Circle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import bookingsData from "@/lib/bookings-data";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { BookingOverviewTab } from "./booking-overview-tab";
import { BookingTreatmentTab } from "./booking-treatment-tab";
import { BookingReviewTab } from "./booking-review-tab";

type MainTab = "overview" | "treatment_plan" | "review_results";

interface BookingDetailPageProps {
  bookingId: string;
}

export default function BookingDetailPage({
  bookingId,
}: BookingDetailPageProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("overview");

  const booking = bookingsData.bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-gray-500">Booking not found</p>
        <Link
          href="/admin/bookings"
          className="mt-4 text-sm text-blue-600 underline underline-offset-2"
        >
          Back to bookings
        </Link>
      </div>
    );
  }

  const isCancelled = booking.status === "Cancelled";
  const hasReview = !!booking.review;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "treatment_plan", label: "Treatment Plan" },
    {
      key: "review_results",
      label: "Review & Results",
      ...(hasReview ? {} : {}),
    },
  ];

  const escrowBadge = () => {
    const et = booking.payment.escrow_type;
    if (et === "in_escrow") {
      return (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold">
              ${booking.amount.toLocaleString()} In Escrow
            </p>
            <p className="text-xs text-amber-600">
              Protected · No Surprise Guarantee
            </p>
          </div>
        </div>
      );
    }
    if (et === "released") {
      return (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold">
              Payment Released · ${booking.amount.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600">journey complete</p>
          </div>
        </div>
      );
    }
    if (et === "refunded") {
      return (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold">
              Cancelled · Refund Issued
            </p>
            <p className="text-xs text-red-400">
              ${booking.amount.toLocaleString()} refunded to patient
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
      Completed: "bg-emerald-50 text-emerald-600",
      Cancelled: "bg-red-50 text-red-500 border border-red-200",
    };
    return map[status] ?? "bg-gray-100 text-gray-500";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/admin/bookings"
          className="flex items-center gap-1.5 font-medium hover:text-[#1A1A2E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Bookings
        </Link>
        <span>›</span>
        <span className="font-semibold text-[#1A1A2E]">{booking.booking_id}</span>
      </div>

      {/* ── Booking hero + escrow ────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
              {booking.booking_id}
            </h1>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                statusBadge(booking.status)
              )}
            >
              {booking.status}
            </span>
            {!isCancelled && booking.booking_stage && booking.booking_stage !== "Payment Released" && (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                {booking.booking_stage}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Created {booking.created_date} · {booking.procedure} ·{" "}
            {booking.treatment_duration}
          </p>
        </div>
        <div className="shrink-0">{escrowBadge()}</div>
      </div>

      {/* ── Main layout: content + sidebar ──────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: tabs + content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 rounded-t-xl border-b border-gray-100 bg-white px-4 pt-1 shadow-sm">
            <CustomTab
              tabs={tabs.map((t) => ({
                ...t,
                dot: t.key === "review_results" && hasReview,
              }))}
              active={activeTab}
              onChange={(k) => setActiveTab(k as MainTab)}
            />
          </div>

          {activeTab === "overview" && (
            <BookingOverviewTab booking={booking} />
          )}
          {activeTab === "treatment_plan" && (
            <BookingTreatmentTab booking={booking} />
          )}
          {activeTab === "review_results" && (
            <BookingReviewTab booking={booking} />
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Booking Journey */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
              Booking Journey
            </h3>
            <ol className="space-y-3">
              {booking.journey.map((step, i) => {
                const isCurrent = "current" in step && step.current === true;
                const isCancelledStep =
                  "cancelled" in step && step.cancelled === true;
                const isCompleted = step.completed && !isCancelledStep;

                return (
                  <li key={i} className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5 shrink-0">
                      {isCancelledStep ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-red-400 bg-red-50">
                          <span className="text-[10px] font-bold text-red-500">✕</span>
                        </div>
                      ) : isCompleted ? (
                        isCurrent ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#1A1A2E] bg-[#1A1A2E]">
                            <span className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        ) : (
                          <CheckCircle className="h-5 w-5 text-[#1A1A2E]" />
                        )
                      ) : (
                        <Circle className="h-5 w-5 text-gray-200" />
                      )}
                    </div>
                    {/* Label + date */}
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isCompleted || isCurrent
                            ? "text-[#1A1A2E]"
                            : isCancelledStep
                            ? "text-red-500"
                            : "text-gray-300"
                        )}
                      >
                        {step.step}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-400">{step.date}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Platform Fee */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
              Platform Fee
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gross Amount</span>
                <span className="font-medium text-[#1A1A2E]">
                  ${booking.platform_fee.gross_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Platform Fee ({booking.platform_fee.fee_pct}%)
                </span>
                <span
                  className={cn(
                    "font-medium",
                    booking.platform_fee.fee_amount !== null
                      ? "text-red-500"
                      : "text-gray-300"
                  )}
                >
                  {booking.platform_fee.fee_amount !== null
                    ? `-$${booking.platform_fee.fee_amount.toLocaleString()}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-sm">
                <span className="font-semibold text-[#1A1A2E]">
                  Net to Dentist
                </span>
                <span
                  className={cn(
                    "font-bold",
                    booking.platform_fee.net_to_dentist !== null
                      ? "text-emerald-600"
                      : "text-gray-300"
                  )}
                >
                  {booking.platform_fee.net_to_dentist !== null
                    ? `$${booking.platform_fee.net_to_dentist.toLocaleString()}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
