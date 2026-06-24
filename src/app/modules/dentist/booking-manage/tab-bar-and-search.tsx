"use client";

import { Search, ChevronDown } from "lucide-react";
import { dentistBookingTabs, useStateContext } from "@/providers/StateProvider";
import CustomTabs from "../../shared/custom-tabs/custom-tabs";

const tabs = [
  {
    id: "booking-1",
    label: "In Progress",
  },
  {
    id: "booking-2",
    label: "Completed",
  },
  {
    id: "booking-3",
    label: "Rejected",
  },
];

export default function TabBarAndSearch() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsNewestFirst,
    isNewestFirst,
  } = useStateContext();

  return (
    <div className="w-full">
      <div className="flex gap-10 border-b border-slate-100 overflow-x-auto">
        <CustomTabs tabs={tabs} storageKey="booking-tabs" />
      </div>

      <div className="flex flex-wrap items-center gap-3 pb-2 pt-4">
        <div className="relative flex w-full max-w-72 items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, Procedure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsNewestFirst((prev) => !prev)}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
        >
          {isNewestFirst ? "Newest first" : "Oldest first"}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
