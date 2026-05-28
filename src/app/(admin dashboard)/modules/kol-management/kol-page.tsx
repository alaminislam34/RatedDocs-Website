"use client";

import { useState, useMemo } from "react";
import {
  Search, Plus, Globe, Mail, Phone, FileText,
  ExternalLink, Power, PowerOff, Pencil, Users,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import kolData from "@/lib/kol-data";
import { AddEditKolModal, type KOL } from "./components/add-edit-kol-modal";
import { DeactivateModal } from "./components/deactivate-modal";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function Avatar({ initials, color, headshot, size = "md" }: {
  initials: string; color: string; headshot?: string | null; size?: "sm" | "md" | "lg";
}) {
  const sz = size === "lg" ? "h-10 w-10 text-sm" : size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-sm";
  if (headshot) {
    return <img src={headshot} alt={initials} className={cn("rounded-full object-cover shrink-0", sz)} />;
  }
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", sz)}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
      status === "active"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-gray-100 text-gray-500"
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "active" ? "bg-emerald-500" : "bg-gray-400")} />
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function LanguageTags({ languages }: { languages: string[] }) {
  const visible = languages.slice(0, 2);
  const overflow = languages.length - 2;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((l) => (
        <span key={l} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
          {l}
        </span>
      ))}
      {overflow > 0 && (
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function ContactDisplay({ type, value }: { type: KOL["contact_type"]; value: string }) {
  if (type === "email") return (
    <span className="flex items-center gap-1.5 text-sm text-gray-600">
      <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" /> Email
    </span>
  );
  if (type === "whatsapp") return (
    <span className="flex items-center gap-1.5 text-sm text-gray-600">
      <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" /> WhatsApp
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-sm text-gray-600">
      <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0" /> Contact Form
    </span>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, iconBg, valueColor }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  iconBg: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className={cn("mt-1 text-3xl font-bold tracking-tight", valueColor)}>{value}</p>
        <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Mobile KOL Card ─────────────────────────────────────────────────────── */
function KolCard({ kol, onEdit, onDeactivate, onReactivate }: {
  kol: KOL;
  onEdit: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar initials={kol.initials} color={kol.avatar_color} headshot={kol.headshot} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-bold text-[#1A1A2E]">{kol.name}</p>
              <p className="text-xs text-gray-500">{kol.credentials} · {kol.years_experience} yrs</p>
            </div>
            <StatusBadge status={kol.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>{kol.specialty}</span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> {kol.country}
            </span>
          </div>
          <div className="mt-2">
            <LanguageTags languages={kol.languages} />
          </div>
          <div className="mt-2">
            <ContactDisplay type={kol.contact_type} value={kol.contact_value} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 border-t border-gray-50 pt-3">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-[#1A1A2E] hover:bg-gray-50 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        {kol.status === "active" ? (
          <button
            onClick={onDeactivate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <PowerOff className="h-3.5 w-3.5" /> Deactivate
          </button>
        ) : (
          <button
            onClick={onReactivate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <Power className="h-3.5 w-3.5" /> Reactivate
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Dropdown ────────────────────────────────────────────────────────────── */
function FilterDropdown({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const displayed = value || label;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
          open ? "border-[#1A1A2E] bg-gray-50 text-[#1A1A2E]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        )}
      >
        {displayed}
        <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full z-20 mt-1 min-w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className={cn("w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                !value ? "font-semibold text-[#1A1A2E]" : "text-gray-600")}
            >
              All
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn("w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                  value === opt ? "font-semibold text-[#1A1A2E]" : "text-gray-600")}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
function generateId() {
  return `kol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function KolPage() {
  const [kols, setKols] = useState<KOL[]>(kolData.kols as KOL[]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingKol, setEditingKol] = useState<KOL | null>(null);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivatingKol, setDeactivatingKol] = useState<KOL | null>(null);

  const totalActive = kols.filter((k) => k.status === "active").length;
  const totalInactive = kols.filter((k) => k.status === "inactive").length;

  const allCountries = useMemo(
    () => [...new Set(kols.map((k) => k.country))].sort(),
    [kols]
  );

  const filtered = useMemo(() => {
    let list = kols;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((k) =>
        k.name.toLowerCase().includes(q) ||
        k.specialty.toLowerCase().includes(q) ||
        k.country.toLowerCase().includes(q) ||
        k.credentials.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((k) => k.status === statusFilter.toLowerCase());
    }
    if (countryFilter) {
      list = list.filter((k) => k.country === countryFilter);
    }
    return list;
  }, [kols, search, statusFilter, countryFilter]);

  const openAdd = () => {
    setEditingKol(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEdit = (kol: KOL) => {
    setEditingKol(kol);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDeactivate = (kol: KOL) => {
    setDeactivatingKol(kol);
    setDeactivateOpen(true);
  };

  const handleSave = (data: Partial<KOL>) => {
    if (modalMode === "add") {
      const newKol: KOL = { id: generateId(), status: "active", ...data } as KOL;
      setKols((prev) => [newKol, ...prev]);
      toast.success(`${data.name} added to the KOL directory.`);
    } else if (editingKol) {
      setKols((prev) => prev.map((k) => k.id === editingKol.id ? { ...k, ...data } : k));
      toast.success("KOL profile updated.");
    }
    setModalOpen(false);
  };

  const handleDeactivate = () => {
    if (!deactivatingKol) return;
    setKols((prev) => prev.map((k) => k.id === deactivatingKol.id ? { ...k, status: "inactive" } : k));
    toast.success(`${deactivatingKol.name} removed from the directory.`);
    setDeactivateOpen(false);
    setDeactivatingKol(null);
  };

  const handleReactivate = (kol: KOL) => {
    setKols((prev) => prev.map((k) => k.id === kol.id ? { ...k, status: "active" } : k));
    toast.success(`${kol.name} is now visible to dentists.`);
  };

  const footerText = useMemo(() => {
    const parts: string[] = [];
    const activeCount = filtered.filter((k) => k.status === "active").length;
    const inactiveCount = filtered.filter((k) => k.status === "inactive").length;
    if (activeCount) parts.push(`${activeCount} active`);
    if (inactiveCount) parts.push(`${inactiveCount} inactive`);
    return `Showing ${filtered.length} of ${kols.length} KOLs · ${parts.join(" · ")}`;
  }, [filtered, kols.length]);

  return (
    <>
      <div className="flex flex-col gap-5 pb-8">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">KOL Management</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Manage Key Opinion Leaders visible to dentists on the platform.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1A1A2E]/90 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add KOL
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={<Users className="h-5 w-5 text-[#1A1A2E]" />}
            iconBg="bg-gray-100"
            label="Total KOLs"
            value={kols.length}
            sub="In directory"
            valueColor="text-[#1A1A2E]"
          />
          <StatCard
            icon={<Power className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label="Active"
            value={totalActive}
            sub="Visible to dentists"
            valueColor="text-emerald-600"
          />
          <StatCard
            icon={<PowerOff className="h-5 w-5 text-gray-400" />}
            iconBg="bg-gray-100"
            label="Inactive"
            value={totalInactive}
            sub="Hidden from directory"
            valueColor="text-gray-500"
          />
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-4">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialty..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
              />
            </div>
            <FilterDropdown
              label="Status"
              options={["Active", "Inactive"]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="All Countries"
              options={allCountries}
              value={countryFilter}
              onChange={setCountryFilter}
            />
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {["KOL", "SPECIALTY", "COUNTRY", "LANGUAGES", "CONTACT", "STATUS", "ACTIONS"].map((h) => (
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
                    <td colSpan={7} className="px-4 py-14 text-center text-sm text-gray-400">
                      No KOLs match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((kol) => (
                    <tr key={kol.id} className="group transition-colors hover:bg-gray-50/60">
                      {/* KOL */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar initials={kol.initials} color={kol.avatar_color} headshot={kol.headshot} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-sm font-bold text-[#1A1A2E]">{kol.name}</p>
                              {kol.website_url && (
                                <a
                                  href={kol.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-gray-300 hover:text-[#1A1A2E] transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">
                              {kol.credentials} · {kol.years_experience} yrs
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Specialty */}
                      <td className="px-4 py-3.5 text-sm text-gray-600">{kol.specialty}</td>
                      {/* Country */}
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          {kol.country}
                        </span>
                      </td>
                      {/* Languages */}
                      <td className="px-4 py-3.5">
                        <LanguageTags languages={kol.languages} />
                      </td>
                      {/* Contact */}
                      <td className="px-4 py-3.5">
                        <ContactDisplay type={kol.contact_type} value={kol.contact_value} />
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={kol.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(kol)}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          {kol.status === "active" ? (
                            <button
                              onClick={() => openDeactivate(kol)}
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <PowerOff className="h-3 w-3" /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivate(kol)}
                              className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <Power className="h-3 w-3" /> Reactivate
                            </button>
                          )}
                        </div>
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
              <p className="py-8 text-center text-sm text-gray-400">No KOLs match your filters.</p>
            ) : (
              filtered.map((kol) => (
                <KolCard
                  key={kol.id}
                  kol={kol}
                  onEdit={() => openEdit(kol)}
                  onDeactivate={() => openDeactivate(kol)}
                  onReactivate={() => handleReactivate(kol)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-400">{footerText}</p>
          </div>
        </div>
      </div>

      <AddEditKolModal
        open={modalOpen}
        mode={modalMode}
        kol={editingKol}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeactivateModal
        open={deactivateOpen}
        kolName={deactivatingKol?.name ?? ""}
        onClose={() => { setDeactivateOpen(false); setDeactivatingKol(null); }}
        onConfirm={handleDeactivate}
      />
    </>
  );
}
