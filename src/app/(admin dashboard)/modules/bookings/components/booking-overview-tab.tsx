"use client";

import { Mail, Phone, MapPin, ChevronRight, ShieldCheck, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import bookingsData from "@/lib/bookings-data";

type Booking = (typeof bookingsData.bookings)[number];

interface BookingOverviewTabProps {
  booking: Booking;
}

function InfoGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
      {items.map((item, i) => (
        <div key={i}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {item.label}
          </p>
          <div className="mt-1 text-sm font-medium text-[#1A1A2E]">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function BookingOverviewTab({ booking }: BookingOverviewTabProps) {
  const escrowType = booking.payment.escrow_type;

  const escrowBanner = () => {
    if (escrowType === "in_escrow") {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {booking.payment.escrow_message}
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              {booking.payment.escrow_detail}
            </p>
          </div>
        </div>
      );
    }
    if (escrowType === "released") {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              {booking.payment.escrow_message}
            </p>
            <p className="mt-0.5 text-xs text-emerald-600">
              {booking.payment.escrow_detail}
            </p>
          </div>
        </div>
      );
    }
    if (escrowType === "refunded") {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {booking.payment.escrow_message}
            </p>
            <p className="mt-0.5 text-xs text-red-500">
              {booking.payment.escrow_detail}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Patient & Dentist */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
          Patient &amp; {booking.status === "Cancelled" ? "Provider" : "Dentist"}
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Patient */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Patient
            </p>
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: booking.patient.avatar_color }}
              >
                {booking.patient.initials}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A2E]">
                  {booking.patient.name}
                </p>
                <p className="text-sm text-gray-400">
                  {booking.patient.patient_ref}
                </p>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {booking.patient.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {booking.patient.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {booking.patient.location}
                  </p>
                </div>
                <button className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  View full profile <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dentist */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Treating Dentist
            </p>
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: booking.dentist.avatar_color }}
              >
                {booking.dentist.initials}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A2E]">
                  {booking.dentist.name}
                </p>
                <p className="text-sm text-gray-400">{booking.dentist.specialty}</p>
                {/* Stars */}
                <div className="mt-1.5 flex items-center gap-1 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(booking.dentist.rating)
                          ? "text-amber-400"
                          : "text-gray-200"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-gray-500">
                    {booking.dentist.rating} ({booking.dentist.review_count} reviews)
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  {booking.dentist.verified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                  <span className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                    RDV {booking.dentist.rdv_score}%
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.dentist.location}
                </p>
                <button className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  View full profile <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
          Appointment Details
        </h3>
        <InfoGrid
          items={[
            { label: "Procedure", value: booking.procedure },
            { label: "Appointment Type", value: booking.appointment_type },
            { label: "Treatment Duration", value: booking.treatment_duration },
            {
              label: "Scheduled Dates",
              value: (
                <span className="flex items-center gap-1.5">
                  📅 {booking.scheduled_dates}
                </span>
              ),
            },
            {
              label: "Clinic Location",
              value: (
                <span className="flex items-center gap-1.5">
                  📍 {booking.dentist.location}
                </span>
              ),
            },
            {
              label: "Booking Created",
              value: (
                <span className="flex items-center gap-1.5">
                  🕐 {booking.created_date}
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Payment & Escrow */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
          Payment &amp; Escrow
        </h3>
        {escrowBanner()}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between border-b border-gray-50 pb-3 text-sm">
            <span className="text-gray-500">Estimate Amount</span>
            <span className="font-medium text-[#1A1A2E]">
              ${booking.payment.estimate_amount.toLocaleString()}
            </span>
          </div>
          {booking.payment.final_amount !== null && (
            <div className="flex justify-between border-b border-gray-50 pb-3 text-sm">
              <span className="text-gray-500">Final Amount</span>
              <span className="font-medium text-[#1A1A2E]">
                ${booking.payment.final_amount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Escrow Status</span>
            <span
              className={cn(
                "font-semibold",
                escrowType === "released"
                  ? "text-emerald-600"
                  : escrowType === "refunded"
                  ? "text-red-500"
                  : escrowType === "in_escrow"
                  ? "text-amber-600"
                  : "text-gray-500"
              )}
            >
              {booking.payment.escrow_status ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Cancellation Details */}
      {"cancellation" in booking && booking.cancellation && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1A1A2E]">
              Cancellation Details
            </h3>
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              {booking.cancellation.initiated_by}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {[
              { label: "Cancelled On", value: booking.cancellation.cancelled_on },
              { label: "Cancelled By", value: booking.cancellation.cancelled_by },
              { label: "Stage at Cancel", value: booking.cancellation.stage_at_cancel },
              { label: "Refund Status", value: booking.cancellation.refund_status },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-[#1A1A2E]">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Reason
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {booking.cancellation.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
