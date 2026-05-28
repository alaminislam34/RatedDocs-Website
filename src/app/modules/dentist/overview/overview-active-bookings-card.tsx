import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { overviewData, formatPatientMoney } from "./overview-data";

/** Travel date — prefer the second timeline event (first is usually "inquiry"). */
const getTravelDate = (patient: (typeof overviewData.activeBookings)[number]) =>
  patient.patient_timeline[1]?.date ?? patient.patient_timeline[0]?.date ?? "TBD";

/** Two-letter initials from a full name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Cycling avatar bg colours (navy palette). */
const AVATAR_BG = ["bg-navy-800", "bg-navy-700", "bg-navy-600"] as const;

/** Per-status badge style. */
function statusBadge(status: string) {
  if (status === "In Progress")
    return "bg-navy-800 text-white";
  return "bg-sky-50 text-sky-700";
}

/** Per-status action hint. */
function actionText(status: string) {
  if (status === "In Progress") return "Submit Final Treatment Plan";
  return "Prepare for consultation";
}

export function OverviewActiveBookingsCard() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_20px_rgba(15,35,61,0.06)] sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Active bookings
        </h2>
        <Link
          href="/dentist/bookings"
          className="text-sm font-semibold text-gold-500 transition-colors hover:text-gold-600"
        >
          View all
        </Link>
      </div>

      {/* Desktop table */}
      <div className="mt-5 hidden overflow-hidden md:block">
        <div className="divide-y divide-border">
          {overviewData.activeBookings.map((booking, index) => {
            const initials = getInitials(booking.patient_info.name);
            const avatarBg = AVATAR_BG[index % AVATAR_BG.length];

            return (
              <div
                key={booking.patient_info.email}
                className="grid grid-cols-[2fr_1.1fr_0.9fr_1.4fr_auto] items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Patient */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                      avatarBg,
                    )}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {booking.patient_info.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {booking.patient_info.procedure}
                    </p>
                  </div>
                </div>

                {/* Travel date */}
                <div>
                  <p className="text-xs text-muted-foreground">Travel date</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {getTravelDate(booking)}
                  </p>
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      statusBadge(booking.patient_info.status),
                    )}
                  >
                    {booking.patient_info.status}
                  </span>
                </div>

                {/* Price + action */}
                <div>
                  <p className="text-sm font-bold text-gold-500">
                    {formatPatientMoney(booking.patient_info.final_budget)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {actionText(booking.patient_info.status)}
                  </p>
                </div>

                {/* View button */}
                <Link
                  href="/dentist/bookings"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50"
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mt-5 space-y-3 md:hidden">
        {overviewData.activeBookings.map((booking, index) => {
          const initials = getInitials(booking.patient_info.name);
          const avatarBg = AVATAR_BG[index % AVATAR_BG.length];

          return (
            <article
              key={booking.patient_info.email}
              className="rounded-xl border border-border bg-background p-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                      avatarBg,
                    )}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {booking.patient_info.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.patient_info.procedure}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    statusBadge(booking.patient_info.status),
                  )}
                >
                  {booking.patient_info.status}
                </span>
              </div>

              {/* Bottom row */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Travel date</p>
                  <p className="text-sm font-semibold text-foreground">
                    {getTravelDate(booking)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gold-500">
                    {formatPatientMoney(booking.patient_info.final_budget)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {actionText(booking.patient_info.status)}
                  </p>
                </div>
              </div>

              {/* View link */}
              <Link
                href="/dentist/bookings"
                className="mt-3 flex items-center gap-1 text-sm font-semibold text-gold-500"
              >
                View booking <ChevronRight className="size-4" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
