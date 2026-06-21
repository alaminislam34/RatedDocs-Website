"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Upload,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  MoreHorizontal,
  Eye,
  ShieldOff,
  Trash2,
  UserPlus,
} from "lucide-react";
import dentistsData from "@/lib/dentists-data";
import { CustomStats } from "@/app/(admin dashboard)/modules/shared/custom-stats";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";

type Dentist = (typeof dentistsData.dentists)[number];
type StatusFilter = "all" | "active" | "pending" | "suspended" | "rejected";

const PAGE_SIZE = 8;

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  suspended: "bg-red-50 text-red-500",
  rejected: "bg-gray-100 text-gray-500",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  pending: "bg-amber-500",
  suspended: "bg-red-500",
  rejected: "bg-gray-400",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  rejected: "Rejected",
};

const SPECIALTIES = [
  "All specialties",
  "Orthodontics",
  "Endodontics",
  "Pediatric",
  "Cosmetic",
  "Periodontics",
  "Oral Surgery",
  "General",
  "Prosthodontics",
];

const CITIES = [
  "All cities",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Denver, CO",
];

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1 text-sm text-gray-700">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold">{rating}</span>
      <span className="text-gray-400">({count})</span>
    </span>
  );
}

function ActionMenu({
  dentist,
  onViewProfile,
  onSuspend,
  onDelete,
}: {
  dentist: Dentist;
  onViewProfile: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onViewProfile();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 text-gray-400" />
              View profile
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onSuspend();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ShieldOff className="h-4 w-4 text-gray-400" />
              Suspend
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function DentistsPage() {
  const router = useRouter();
  const meta = dentistsData.meta;

  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [tableSearch, setTableSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [city, setCity] = useState("All cities");
  const [page, setPage] = useState(1);

  const stats = [
    {
      label: "Total Dentists",
      value: meta.total_dentists.toLocaleString(),
      sub: `+${meta.weekly_growth} this week`,
    },
    {
      label: "Active",
      value: meta.active.toLocaleString(),
      sub: meta.active_pct,
    },
    {
      label: "Pending Verification",
      value: meta.pending_verification.toString(),
      sub: "Awaiting review",
      valueColor: "text-amber-500",
    },
    {
      label: "Suspended",
      value: meta.suspended.toString(),
      sub: meta.suspended_pct,
    },
  ];

  const tabs = [
    { key: "all", label: "All", count: meta.tab_counts.all },
    { key: "active", label: "Active", count: meta.tab_counts.active },
    { key: "pending", label: "Pending", count: meta.tab_counts.pending },
    { key: "suspended", label: "Suspended", count: meta.tab_counts.suspended },
    { key: "rejected", label: "Rejected", count: meta.tab_counts.rejected },
  ];

  const filtered = useMemo(() => {
    let list = dentistsData.dentists as Dentist[];
    if (activeTab !== "all") list = list.filter((d) => d.status === activeTab);
    if (specialty !== "All specialties")
      list = list.filter((d) => d.specialty === specialty);
    if (city !== "All cities") list = list.filter((d) => d.location === city);
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, specialty, city, tableSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleTabChange = (key: string) => {
    setActiveTab(key as StatusFilter);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Dentists
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage all practitioners on the platform — verification, status, performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex h-9 items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1A1A2E]/90">
            <UserPlus className="h-4 w-4" />
            Invite dentist
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <CustomStats stats={stats} />

      {/* ── Tabs + Table ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-4 pt-1">
          <CustomTab tabs={tabs} active={activeTab} onChange={handleTabChange} />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email or ID..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
          </div>
          <div className="relative">
            <select
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E]"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <th className="w-8 px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {["Dentist", "Specialty", "Location", "Status", "Rating", "Bookings", "Joined", ""].map(
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
                    colSpan={9}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No dentists found
                  </td>
                </tr>
              ) : (
                pageData.map((dentist) => (
                  <tr
                    key={dentist.id}
                    onClick={() => router.push(`/admin/dentists/${dentist.id}`)}
                    className="cursor-pointer transition-colors hover:bg-gray-50/80"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    {/* Dentist */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={dentist.initials} color={dentist.avatar_color} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#1A1A2E]">
                            {dentist.name}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {dentist.email} · {dentist.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Specialty */}
                    <td className="px-4 py-3.5">
                      <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {dentist.specialty}
                      </span>
                    </td>
                    {/* Location */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {dentist.location}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                          STATUS_BADGE[dentist.status] ?? "bg-gray-100 text-gray-500"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            STATUS_DOT[dentist.status] ?? "bg-gray-400"
                          )}
                        />
                        {STATUS_LABEL[dentist.status] ?? dentist.status}
                      </span>
                    </td>
                    {/* Rating */}
                    <td className="px-4 py-3.5">
                      {dentist.rating != null && dentist.review_count != null ? (
                        <StarRating rating={dentist.rating} count={dentist.review_count} />
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </td>
                    {/* Bookings */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {dentist.bookings != null ? dentist.bookings.toLocaleString() : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {dentist.joined}
                    </td>
                    {/* Actions */}
                    <td
                      className="px-4 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionMenu
                        dentist={dentist}
                        onViewProfile={() => router.push(`/admin/dentists/${dentist.id}`)}
                        onSuspend={() => {}}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-400">
            Showing{" "}
            {filtered.length === 0
              ? 0
              : (currentPage - 1) * PAGE_SIZE + 1}
            –{Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
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
