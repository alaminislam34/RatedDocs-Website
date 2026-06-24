"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Activity,
  OctagonAlert,
  CalendarDays,
  Search,
  ChevronDown,
  Eye,
  SearchCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import antiCollusionData from "@/lib/anti-collusion-data";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { InvestigationDrawer } from "./components/investigation-drawer";
import { ArchiveConfirmModal } from "./components/archive-confirm-modal";
import { ReactivateConfirmModal } from "./components/reactivate-confirm-modal";

/* ─── Types ───────────────────────────────────────────────────────────────── */
export type DentistStatus =
  | "suspended"
  | "warning"
  | "clean"
  | "cleared"
  | "removed";

export type Flag = {
  flag_number: number;
  flag_status: string;
  booking_id: string;
  booking_date: string;
  patient: string;
  procedure: string;
  estimate_price: number;
  final_price: number;
  variance_percent: number;
  patient_response: string;
  flagged_date: string;
  expires_date: string;
};

export type Dentist = {
  id: string;
  name: string;
  dentist_id: string;
  initials: string;
  avatar_color: string;
  country: string;
  rdv_score: number;
  status: DentistStatus;
  flag_count: number;
  flag_threshold: number;
  last_flag_date: string | null;
  days_until_reset: number | null;
  reset_urgent: boolean;
  suspended_date: string | null;
  investigation_opened: string | null;
  archived_date: string | null;
  investigation_notes: string;
  flags: Flag[];
};

type TabKey = "all" | "warning" | "suspended" | "archive";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        sz,
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function FlagBadge({ count, threshold }: { count: number; threshold: number }) {
  if (count === 0) return <span className="text-sm text-gray-400">—</span>;
  const maxed = count >= threshold;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        maxed ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700",
      )}
    >
      {count}/{threshold}
    </span>
  );
}

const STATUS_CONFIG: Record<
  DentistStatus,
  { label: string; dot: string; badge: string }
> = {
  suspended: {
    label: "Suspended",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  clean: {
    label: "Clean",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cleared: {
    label: "Cleared",
    dot: "bg-teal-500",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
  },
  removed: {
    label: "Removed",
    dot: "bg-gray-400",
    badge: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

function StatusBadge({ status }: { status: DentistStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        cfg.badge,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

/* ─── Country Dropdown ────────────────────────────────────────────────────── */
function CountryDropdown({
  countries,
  value,
  onChange,
}: {
  countries: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
          open
            ? "border-[#1A1A2E] bg-gray-50"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
        )}
      >
        {value || "All countries"}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-gray-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full z-20 mt-1 min-w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                !value ? "font-semibold text-[#1A1A2E]" : "text-gray-600",
              )}
            >
              All countries
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                  value === c
                    ? "font-semibold text-[#1A1A2E]"
                    : "text-gray-600",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  valueColor = "text-[#1A1A2E]",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p
          className={cn("mt-1.5 text-3xl font-bold tracking-tight", valueColor)}
        >
          {value}
        </p>
      </div>
      <span className="mt-0.5 text-gray-300">{icon}</span>
    </div>
  );
}

/* ─── Mobile Card ─────────────────────────────────────────────────────────── */
function DentistCard({
  dentist,
  onView,
}: {
  dentist: Dentist;
  onView: () => void;
}) {
  const isSuspended = dentist.status === "suspended";
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar initials={dentist.initials} color={dentist.avatar_color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-[#1A1A2E]">{dentist.name}</p>
              <p className="text-xs text-gray-400">
                {dentist.dentist_id} · {dentist.country}
              </p>
            </div>
            <StatusBadge status={dentist.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              Flags:{" "}
              <FlagBadge
                count={dentist.flag_count}
                threshold={dentist.flag_threshold}
              />
            </span>
            {dentist.last_flag_date && (
              <span>Last flag: {dentist.last_flag_date}</span>
            )}
            {dentist.days_until_reset != null && (
              <span
                className={cn(
                  dentist.reset_urgent ? "text-red-500 font-semibold" : "",
                )}
              >
                Resets in {dentist.days_until_reset}d
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-50 pt-3">
        <button
          onClick={onView}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors",
            isSuspended
              ? "bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90"
              : "border border-gray-200 bg-white text-[#1A1A2E] hover:bg-gray-50",
          )}
        >
          {isSuspended ? (
            <SearchCheck className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {isSuspended ? "Investigate" : "View"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function AntiCollusion() {
  const [dentists, setDentists] = useState<Dentist[]>(
    antiCollusionData.dentists as unknown as Dentist[],
  );
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const [drawerDentist, setDrawerDentist] = useState<Dentist | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Dentist | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<Dentist | null>(
    null,
  );

  const meta = antiCollusionData.meta;

  /* live counts from state */
  const warningCount = dentists.filter((d) => d.status === "warning").length;
  const suspendedCount = dentists.filter(
    (d) => d.status === "suspended",
  ).length;
  const archiveCount = dentists.filter((d) => d.status === "removed").length;

  const allCountries = useMemo(
    () => [...new Set(dentists.map((d) => d.country))].sort(),
    [dentists],
  );

  const tabs = [
    { key: "all", label: "All", count: dentists.length },
    { key: "warning", label: "Warning", count: warningCount },
    { key: "suspended", label: "Suspended", count: suspendedCount },
    { key: "archive", label: "Archive", count: archiveCount },
  ];

  const filtered = useMemo(() => {
    let list = dentists;
    if (activeTab === "warning")
      list = list.filter((d) => d.status === "warning");
    else if (activeTab === "suspended")
      list = list.filter((d) => d.status === "suspended");
    else if (activeTab === "archive")
      list = list.filter((d) => d.status === "removed");

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.dentist_id.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q),
      );
    }
    if (countryFilter) list = list.filter((d) => d.country === countryFilter);
    return list;
  }, [dentists, activeTab, search, countryFilter]);

  const updateDentist = (id: string, patch: Partial<Dentist>) =>
    setDentists((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );

  /* handlers */
  const handleSaveNotes = (dentist: Dentist, notes: string) => {
    updateDentist(dentist.id, { investigation_notes: notes });
    toast.success("Investigation notes saved.");
  };

  const handleReinstate = (dentist: Dentist) => {
    updateDentist(dentist.id, {
      status: "warning",
      suspended_date: null,
      investigation_opened: null,
    });
    setDrawerDentist((prev) =>
      prev
        ? {
            ...prev,
            status: "warning",
            suspended_date: null,
            investigation_opened: null,
          }
        : null,
    );
    toast.success(`${dentist.name} has been reinstated.`);
  };

  const handleArchiveRequest = (dentist: Dentist) => {
    setArchiveTarget(dentist);
  };

  const handleArchiveConfirm = () => {
    if (!archiveTarget) return;
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    updateDentist(archiveTarget.id, {
      status: "removed",
      suspended_date: null,
      archived_date: today,
    });
    setDrawerDentist((prev) =>
      prev?.id === archiveTarget.id
        ? {
            ...prev,
            status: "removed",
            suspended_date: null,
            archived_date: today,
          }
        : prev,
    );
    toast.success(`${archiveTarget.name} has been archived.`);
    setArchiveTarget(null);
  };

  const handleReactivateRequest = (dentist: Dentist) => {
    setReactivateTarget(dentist);
  };

  const handleReactivateConfirm = () => {
    if (!reactivateTarget) return;
    updateDentist(reactivateTarget.id, {
      status: "clean",
      archived_date: null,
    });
    setDrawerDentist((prev) =>
      prev?.id === reactivateTarget.id
        ? { ...prev, status: "clean", archived_date: null }
        : prev,
    );
    toast.success(`${reactivateTarget.name} has been reactivated.`);
    setReactivateTarget(null);
  };

  return (
    <>
      <div className="flex flex-col gap-5 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Anti-Collusion
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Monitor price variance flags and manage dentist suspension
            decisions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="Total Flags"
            value={meta.total_flags}
          />
          <StatCard
            icon={<Activity className="h-5 w-5 text-amber-400" />}
            label="Active Investigations"
            value={meta.active_investigations}
            valueColor="text-amber-600"
          />
          <StatCard
            icon={<OctagonAlert className="h-5 w-5 text-red-400" />}
            label="Suspended Dentists"
            value={suspendedCount}
            valueColor="text-red-600"
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Flags This Month"
            value={meta.flags_this_month}
          />
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-100 overflow-x-auto">
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onChange={(k) => {
                setActiveTab(k as TabKey);
                setSearch("");
                setCountryFilter("");
              }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-4">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by dentist name..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
              />
            </div>
            <CountryDropdown
              countries={allCountries}
              value={countryFilter}
              onChange={setCountryFilter}
            />
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {[
                    "DENTIST",
                    "COUNTRY",
                    "FLAG COUNT",
                    "LAST FLAG DATE",
                    "DAYS UNTIL RESET",
                    "STATUS",
                    "ACTION",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-14 text-center text-sm text-gray-400"
                    >
                      No dentists match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr
                      key={d.id}
                      className="transition-colors hover:bg-gray-50/60"
                    >
                      {/* Dentist */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={d.initials}
                            color={d.avatar_color}
                          />
                          <div>
                            <p className="text-sm font-bold text-[#1A1A2E]">
                              {d.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {d.dentist_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Country */}
                      <td className="px-4 py-3.5 text-sm text-gray-600">
                        {d.country}
                      </td>
                      {/* Flag Count */}
                      <td className="px-4 py-3.5">
                        <FlagBadge
                          count={d.flag_count}
                          threshold={d.flag_threshold}
                        />
                      </td>
                      {/* Last Flag Date */}
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {d.last_flag_date ?? (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      {/* Days Until Reset */}
                      <td className="px-4 py-3.5 text-sm">
                        {d.days_until_reset != null ? (
                          <span
                            className={cn(
                              "font-medium",
                              d.reset_urgent ? "text-red-500" : "text-gray-600",
                            )}
                          >
                            Resets in {d.days_until_reset}d
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={d.status} />
                      </td>
                      {/* Action */}
                      <td className="px-4 py-3.5">
                        {d.status === "suspended" ? (
                          <button
                            onClick={() => setDrawerDentist(d)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
                          >
                            <SearchCheck className="h-3.5 w-3.5" />
                            Investigate
                          </button>
                        ) : (
                          <button
                            onClick={() => setDrawerDentist(d)}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 p-4 md:hidden">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                No dentists match your filters.
              </p>
            ) : (
              filtered.map((d) => (
                <DentistCard
                  key={d.id}
                  dentist={d}
                  onView={() => setDrawerDentist(d)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-400">
              Showing {filtered.length} of {dentists.length} dentists
            </p>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <InvestigationDrawer
        dentist={drawerDentist}
        onClose={() => setDrawerDentist(null)}
        onArchive={handleArchiveRequest}
        onReinstate={handleReinstate}
        onReactivate={handleReactivateRequest}
        onSaveNotes={handleSaveNotes}
      />

      {/* Archive confirm */}
      <ArchiveConfirmModal
        open={!!archiveTarget}
        dentistName={archiveTarget?.name ?? ""}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchiveConfirm}
      />

      {/* Reactivate confirm */}
      <ReactivateConfirmModal
        open={!!reactivateTarget}
        dentistName={reactivateTarget?.name ?? ""}
        onClose={() => setReactivateTarget(null)}
        onConfirm={handleReactivateConfirm}
      />
    </>
  );
}
