import { cn } from "@/lib/utils";
import type { BadgeColor } from "./overview-data";
import { overviewData } from "./overview-data";

const BADGE_STYLES: Record<BadgeColor, string> = {
  success: "bg-success-50 text-success-700",
  sky: "bg-sky-50 text-sky-700",
  warning: "bg-warning-100 text-warning-700",
  destructive: "bg-destructive-50 text-destructive-700",
};

export function OverviewPerformanceCard() {
  const { chart } = overviewData;

  // Clamp to valid conic-gradient percentage
  const pct = Math.min(Math.max(chart.score, 0), 100);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_4px_20px_rgba(15,35,61,0.06)] sm:p-8">
      {/* Main layout: chart left + metrics right */}
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
        {/* Donut chart */}
        <div className="shrink-0">
          <div
            className="relative flex size-44 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(var(--color-gold-500) 0 ${pct}%, var(--color-gray-200) ${pct}% 100%)`,
            }}
          >
            {/* Inner circle — white hole */}
            <div className="absolute inset-3.5 flex flex-col items-center justify-center rounded-full bg-card text-center">
              <span className="text-[1.625rem] font-bold leading-none text-gold-500">
                {chart.score}%
              </span>
              <span className="mt-1 text-xs font-semibold text-muted-foreground">
                RDV Score
              </span>
            </div>
          </div>
        </div>

        {/* Metrics list */}
        <div className="w-full flex-1 divide-y divide-border">
          {chart.labels.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                {item.label}
              </p>
              <p className="shrink-0 text-sm font-semibold text-foreground">
                {item.value}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  BADGE_STYLES[item.badgeColor],
                )}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="mt-6 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
        Review sentiment is displayed separately and does not affect your RDV
        Score.
      </p>
    </section>
  );
}
