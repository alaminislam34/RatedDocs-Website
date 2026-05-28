"use client";

import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  sub: string;
}

interface CustomStatsProps {
  stats: StatItem[];
  className?: string;
}

export function CustomStats({ stats, className }: CustomStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]">
            {stat.label}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[28px]">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-gray-500">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
