"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  key: string;
  label: string;
  count?: number;
  dot?: boolean;
}

interface CustomTabProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

export function CustomTab({
  tabs,
  active,
  onChange,
  variant = "underline",
  className,
}: CustomTabProps) {
  if (variant === "pill") {
    return (
      <div className={cn("flex gap-1.5", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "rounded-full px-3.5 py-1 text-sm font-medium transition-colors",
              active === tab.key
                ? "bg-[#1A1A2E] text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  active === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-0 border-b border-gray-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
            active === tab.key
              ? "text-[#1A1A2E] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A1A2E]"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
          {tab.dot && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
          {tab.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                active === tab.key
                  ? "bg-[#1A1A2E] text-white"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {tab.count.toLocaleString()}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
