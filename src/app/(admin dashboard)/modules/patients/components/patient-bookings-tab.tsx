"use client";

import { useState } from "react";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  dentist: string;
  procedure: string;
  date: string;
  status: string;
  amount: number;
};

interface PatientBookingsTabProps {
  bookings: Booking[];
}

type BookingStatus = "All" | "In Progress" | "Completed" | "Cancelled";

const STATUS_BADGE: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
  "No Show": "bg-orange-50 text-orange-500",
};

export function PatientBookingsTab({ bookings }: PatientBookingsTabProps) {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("All");

  const counts = {
    All: bookings.length,
    "In Progress": bookings.filter((b) => b.status === "In Progress").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter(
      (b) => b.status === "Cancelled" || b.status === "No Show"
    ).length,
  };

  const statusTabs = (
    ["All", "In Progress", "Completed", "Cancelled"] as BookingStatus[]
  ).map((s) => ({ key: s, label: s, count: counts[s] }));

  const filtered =
    activeStatus === "All"
      ? bookings
      : activeStatus === "Cancelled"
      ? bookings.filter(
          (b) => b.status === "Cancelled" || b.status === "No Show"
        )
      : bookings.filter((b) => b.status === activeStatus);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Sub-tabs */}
      <div className="border-b border-gray-100 px-4 pt-1">
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
              {["Booking", "Dentist", "Procedure", "Date", "Status", "Amount"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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
                  <td className="px-4 py-3.5 text-sm font-medium text-blue-600">
                    {b.id}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {b.dentist}
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
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        STATUS_BADGE[b.status] ?? "bg-gray-100 text-gray-500"
                      )}
                    >
                      {b.status === "Completed" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                      {(b.status === "Cancelled" || b.status === "No Show") && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      )}
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-[#1A1A2E]">
                    ${b.amount.toLocaleString()}
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
