import { ArrowUp, CalendarDays, Clock, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatIcon, StatTrend } from "./overview-data";

const ICON_MAP: Record<StatIcon, React.ElementType> = {
  calendar: CalendarDays,
  clock: Clock,
  dollar: DollarSign,
  target: Target,
};

interface OverviewStatCardProps {
  label: string;
  value: string | number;
  subLabel: string;
  trend: StatTrend;
  icon: StatIcon;
  highlight?: boolean;
  className?: string;
}

export function OverviewStatCard({
  label,
  value,
  subLabel,
  trend,
  icon,
  highlight,
  className,
}: OverviewStatCardProps) {
  const Icon = ICON_MAP[icon];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_4px_20px_rgba(15,35,61,0.06)]",
        className,
      )}
    >
      {/* Label row */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Icon className="size-5 text-gray-500" />
        </div>
      </div>

      {/* Value */}
      <p
        className={cn(
          "mt-4 text-3xl font-bold tracking-tight sm:text-[2rem]",
          highlight ? "text-gold-500" : "text-foreground",
        )}
      >
        {String(value)}
      </p>

      {/* Sub-label */}
      {trend === "positive" ? (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="flex size-5 items-center justify-center rounded-full bg-success-50">
            <ArrowUp className="size-3 text-success-600" />
          </span>
          <p className="text-sm font-medium text-success-700">{subLabel}</p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{subLabel}</p>
      )}
    </div>
  );
}
