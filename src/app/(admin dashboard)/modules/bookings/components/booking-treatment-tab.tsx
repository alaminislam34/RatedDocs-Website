"use client";

import { ShieldCheck, Pencil } from "lucide-react";
import bookingsData from "@/lib/bookings-data";

type Booking = (typeof bookingsData.bookings)[number];

interface BookingTreatmentTabProps {
  booking: Booking;
}

function PlanTable({
  label,
  badge,
  items,
  total,
  totalLabel,
  totalColor,
}: {
  label: string;
  badge?: string;
  items: { name: string; price?: number | null; included?: boolean }[];
  total: number;
  totalLabel: string;
  totalColor?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1A1A2E]">{label}</h3>
        {badge && (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
            {badge}
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                Procedure breakdown
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-sm text-gray-600">{item.name}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-600">
                  {item.included ? (
                    <span className="text-gray-400">Included</span>
                  ) : item.price !== null && item.price !== undefined ? (
                    `$${item.price.toLocaleString()}`
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/40">
              <td className="px-4 py-3 text-sm font-semibold text-[#1A1A2E]">
                {totalLabel}
              </td>
              <td
                className={`px-4 py-3 text-right text-sm font-bold ${
                  totalColor ?? "text-blue-600"
                }`}
              >
                ${total.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function BookingTreatmentTab({ booking }: BookingTreatmentTabProps) {
  const plan = booking.treatment_plan;

  return (
    <div className="flex flex-col gap-4">
      {/* Estimate plan */}
      <PlanTable
        label="Treatment plan breakdown"
        badge={plan.label}
        items={plan.items}
        total={plan.estimate_total}
        totalLabel="Estimate amount"
        totalColor="text-blue-600"
      />

      {/* No Surprise Guarantee notice */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p>
          <span className="font-semibold">
            {plan.guarantee_pct}% No Surprise Guarantee
          </span>{" "}
          — The final price confirmed on Day 1 will be within $
          {Math.round(plan.estimate_total * (plan.guarantee_pct / 100))} of
          this estimate. Maximum possible charge: ${plan.max_charge.toLocaleString()}.
        </p>
      </div>

      {/* Final plan (if available for completed bookings) */}
      {plan.final_plan && (
        <>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1A1A2E]">
                {plan.final_plan.label}
              </h3>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Within {plan.guarantee_pct}% protected range
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      Procedure breakdown
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {plan.final_plan.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {item.included ? (
                          <span className="text-gray-400">Included</span>
                        ) : item.price !== null && item.price !== undefined ? (
                          `$${item.price.toLocaleString()}`
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-100 bg-gray-50/40">
                    <td className="px-4 py-3 text-sm font-semibold text-[#1A1A2E]">
                      Final total
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-emerald-600">
                      ${plan.final_plan.final_total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Treatment Plan Agreement */}
      {plan.signed_by && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
            Treatment Plan Agreement
          </h3>
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Digitally signed by {plan.signed_by}
              </p>
              <p className="mt-0.5 text-xs text-emerald-600">
                Patient accepted the treatment plan and estimate on{" "}
                {plan.signed_date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
