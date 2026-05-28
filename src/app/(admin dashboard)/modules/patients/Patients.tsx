"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import patientsData from "@/lib/patients-data";
import { CustomStats } from "@/app/(admin dashboard)/modules/shared/custom-stats";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";

type Patient = (typeof patientsData.patients)[number];
type Status = "all" | "Active" | "Inactive";

const PAGE_SIZE = 8;

const STATUS_BADGE: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-gray-100 text-gray-500",
};

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

export default function Patients() {
  const router = useRouter();
  const meta = patientsData.meta;

  const [headerSearch, setHeaderSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Status>("all");
  const [tableSearch, setTableSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);

  const stats = [
    {
      label: "Total Patients",
      value: meta.total_patients.toLocaleString(),
      sub: `+${meta.weekly_growth} this week`,
    },
    {
      label: "Active (90D)",
      value: meta.active_90d.toLocaleString(),
      sub: `${meta.active_engagement_pct} engagement`,
    },
    {
      label: "New Today",
      value: meta.new_today.toString(),
      sub: `vs avg ${meta.avg_per_day}/day`,
    },
    {
      label: "Inactive",
      value: meta.inactive_today.toString(),
      sub: meta.inactive_pct,
    },
  ];

  const tabs = [
    { key: "all", label: "All patients", count: meta.total_patients },
    { key: "Active", label: "Active", count: meta.active_count },
    { key: "Inactive", label: "Inactive", count: meta.inactive_count },
  ];

  const allCities = useMemo(() => {
    const cities = new Set(patientsData.patients.map((p) => p.city));
    return ["all", ...Array.from(cities)];
  }, []);

  const filtered = useMemo(() => {
    let list = patientsData.patients as Patient[];
    if (activeTab !== "all") list = list.filter((p) => p.status === activeTab);
    if (cityFilter !== "all") list = list.filter((p) => p.city === cityFilter);
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, cityFilter, tableSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleTabChange = (key: string) => {
    setActiveTab(key as Status);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Patients
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            View and manage all registered patients across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search patients..."
              className="h-9 w-52 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
          </div>
          {/* Status dropdown */}
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Status <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {/* City dropdown */}
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            City <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {/* Export */}
          <button className="flex h-9 items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <CustomStats stats={stats} />

      {/* ── Tabs + Table card ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs row */}
        <div className="border-b border-gray-100 px-4 pt-1">
          <CustomTab
            tabs={tabs}
            active={activeTab}
            onChange={handleTabChange}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, phone..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
          </div>
          {/* City select */}
          <div className="relative">
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            >
              {allCities.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All cities" : c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
          {/* Time filter */}
          <div className="relative">
            <select className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E]">
              <option>All time</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                {["Patient", "Phone", "City", "Status", "Total bookings", "Last booking", "Joined", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No patients found
                  </td>
                </tr>
              ) : (
                pageData.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() =>
                      router.push(`/admin/patients/${patient.id}`)
                    }
                    className="cursor-pointer transition-colors hover:bg-gray-50/80"
                  >
                    {/* Patient */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={patient.initials}
                          color={patient.avatar_color}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#1A1A2E]">
                            {patient.name}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Phone */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {patient.phone}
                    </td>
                    {/* City */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {patient.city}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          STATUS_BADGE[patient.status] ?? "bg-gray-100 text-gray-500"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            patient.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-gray-400"
                          )}
                        />
                        {patient.status}
                      </span>
                    </td>
                    {/* Total bookings */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {patient.total_bookings}
                    </td>
                    {/* Last booking */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {patient.last_booking}
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {patient.joined}
                    </td>
                    {/* Arrow */}
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-400">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} results
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  p === currentPage
                    ? "bg-[#1A1A2E] text-white"
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
