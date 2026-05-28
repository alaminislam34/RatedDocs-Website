import { ChevronRight, Clock } from "lucide-react";
import { overviewData } from "./overview-data";

export function OverviewAlertsCard() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_20px_rgba(15,35,61,0.06)] sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">Alerts</h2>

      <div className="mt-5 divide-y divide-border">
        {overviewData.alerts.map((alert) => (
          <div
            key={alert.label}
            className="flex cursor-pointer items-start gap-4 py-4 transition-colors hover:bg-gray-50 first:pt-0 last:pb-0"
          >
            {/* Clock icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-50">
              <Clock className="size-5 text-warning-600" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {alert.label}
              </p>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                {alert.detail}
              </p>
            </div>

            {/* Chevron */}
            <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          </div>
        ))}
      </div>
    </section>
  );
}
