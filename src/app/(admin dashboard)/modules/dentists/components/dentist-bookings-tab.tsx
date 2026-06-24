"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  patient_name: string;
  patient_initials: string;
  patient_color: string;
  procedure: string;
  date: string;
  status: string;
  payment_status: string;
  amount: number;
};

interface DentistBookingsTabProps {
  bookings: Booking[];
}

type BookingStatus = "All" | "In Progress" | "Completed" | "Cancelled";

const BOOKING_STATUS_BADGE: Record<string, string> = {
  "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
  Completed: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
};

const PAYMENT_BADGE: Record<string, string> = {
  "In Escrow": "text-blue-600",
  Released: "text-emerald-600",
  Refunded: "text-red-500",
};

export function DentistBookingsTab({ bookings }: DentistBookingsTabProps) {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("All");

  const counts: Record<BookingStatus, number> = {
    All: bookings.length,
    "In Progress": bookings.filter((b) => b.status === "In Progress").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  const statusTabs = (
    ["All", "In Progress", "Completed", "Cancelled"] as BookingStatus[]
  ).map((s) => ({ key: s, label: s, count: counts[s] }));

  const filtered =
    activeStatus === "All"
      ? bookings
      : bookings.filter((b) => b.status === activeStatus);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Sub-tabs */}
      <div className="border-b border-gray-100 overflow-x-auto px-4 pt-1">
        <CustomTab
          tabs={statusTabs}
          active={activeStatus}
          onChange={(k) => setActiveStatus(k as BookingStatus)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              {[
                "Booking ID",
                "Patient",
                "Procedure",
                "Date",
                "Status",
                "Payment Status",
                "Amount",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  No bookings found
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr
                  key={b.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50/80"
                >
                  <td className="px-4 py-3.5 text-sm font-semibold text-blue-600">
                    {b.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: b.patient_color }}
                      >
                        {b.patient_initials}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {b.patient_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {b.procedure}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {b.date}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        BOOKING_STATUS_BADGE[b.status] ??
                          "bg-gray-100 text-gray-500",
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        PAYMENT_BADGE[b.payment_status] ?? "text-gray-600",
                      )}
                    >
                      {b.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#1A1A2E]">
                    ${b.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <ArrowUpRight className="h-4 w-4 text-gray-300" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
