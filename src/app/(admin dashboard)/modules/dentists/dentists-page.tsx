"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DentistsPageSkeleton } from "./DentistsPageSkeleton";
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
  Loader2,
} from "lucide-react";
import dentistsData from "@/lib/dentists-data";
import { CustomStats } from "@/app/(admin dashboard)/modules/shared/custom-stats";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";
import {
  useAdminDentists,
  type AdminDentist,
} from "@/hooks/admin/dentist/useDentist";

export type Dentist = Omit<
  (typeof dentistsData.dentists)[number],
  "profile"
> & {
  profile: Omit<
    (typeof dentistsData.dentists)[number]["profile"],
    "verification"
  > & {
    verification: {
      phase1: (typeof dentistsData.dentists)[number]["profile"]["verification"]["phase1"] & {
        id?: number;
      };
      phase2: Omit<
        (typeof dentistsData.dentists)[number]["profile"]["verification"]["phase2"],
        "rejection_reason"
      > & {
        id?: number;
        rejection_reason?: string | null;
      };
      phase3: (typeof dentistsData.dentists)[number]["profile"]["verification"]["phase3"] & {
        id?: number;
      };
    };
  };
};
export type StatusFilter =
  | "all"
  | "active"
  | "pending"
  | "suspended"
  | "rejected";

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

export const mapSpecialty = (s?: string): string => {
  if (!s) return "General";
  const upper = s.toUpperCase();
  if (upper.includes("ORTHO")) return "Orthodontics";
  if (upper.includes("ENDO")) return "Endodontics";
  if (upper.includes("PEDIATRIC") || upper.includes("PEDO")) return "Pediatric";
  if (upper.includes("COSMETIC")) return "Cosmetic";
  if (upper.includes("PERIODON")) return "Periodontics";
  if (upper.includes("SURGERY") || upper.includes("SURGEON"))
    return "Oral Surgery";
  if (upper.includes("PROSTHO")) return "Prosthodontics";
  return "General";
};

function getFileNameFromUrl(
  url: string | null | undefined,
  fallback: string,
): string {
  if (!url) return fallback;
  try {
    const parts = url.split("/");
    return parts[parts.length - 1] || fallback;
  } catch (e) {
    return fallback;
  }
}

export const mapVerificationStatus = (status?: string): string => {
  if (!status) return "not_started";
  const upper = status.toUpperCase();
  if (upper === "APPROVED" || upper === "VERIFIED") return "complete";
  if (upper === "REJECTED") return "rejected";
  if (upper === "SUBMITTED" || upper === "SUBMIT" || upper === "PENDING")
    return "SUBMITTED";
  return "not_started";
};

export function mapApiDentistToUIDentist(d: AdminDentist): Dentist {
  const address = d.dentist_address?.[0];
  const location = address ? `${address.city}, ${address.country}` : "—";

  let status: StatusFilter = "pending";
  if (d.is_verified) {
    status = "active";
  } else if (
    d.dentist_verification?.license_verification === "REJECTED" ||
    d.dentist_verification?.operations_verification === "REJECTED" ||
    d.dentist_verification?.clinical_verification === "REJECTED"
  ) {
    status = "rejected";
  } else if (
    ["PENDING", "SUBMIT", "SUBMITTED"].includes(
      d.dentist_verification?.license_verification || "",
    ) ||
    ["PENDING", "SUBMIT", "SUBMITTED"].includes(
      d.dentist_verification?.operations_verification || "",
    ) ||
    ["PENDING", "SUBMIT", "SUBMITTED"].includes(
      d.dentist_verification?.clinical_verification || "",
    )
  ) {
    status = "pending";
  }

  const initials = d.full_name
    ? d.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "D";

  const colors = [
    "#1A3A5C",
    "#1E40AF",
    "#0F172A",
    "#7C3AED",
    "#0891B2",
    "#0D9488",
    "#4F46E5",
  ];
  let hash = 0;
  for (let i = 0; i < (d.full_name || "").length; i++) {
    hash = (d.full_name || "").charCodeAt(i) + ((hash << 5) - hash);
  }
  const avatarColor = colors[Math.abs(hash) % colors.length];

  // Extract Phase 1 Files
  const phase1Files = [];
  const license = d.dentist_verification?.dentist_license_verification;
  if (license?.file) {
    phase1Files.push({
      name: getFileNameFromUrl(license.file, "Dental License Certificate"),
      size: "",
      type: "pdf",
      url: license.file,
    });
  }
  if (license?.professional_headshot) {
    phase1Files.push({
      name: getFileNameFromUrl(
        license.professional_headshot,
        "Professional Headshot",
      ),
      size: "",
      type: "image",
      url: license.professional_headshot,
    });
  }

  // Extract Phase 2 Files
  const phase2Files = [];
  const steril =
    d.dentist_verification?.operation_verification?.sterilization_verification;
  if (steril?.jci_certificate) {
    phase2Files.push({
      name: getFileNameFromUrl(steril.jci_certificate, "JCI Certificate"),
      size: "",
      type: "pdf",
      url: steril.jci_certificate,
    });
  }
  if (steril?.walkthrough_video) {
    phase2Files.push({
      name: getFileNameFromUrl(
        steril.walkthrough_video,
        "Sterilization Walkthrough",
      ),
      size: "",
      type: "video",
      url: steril.walkthrough_video,
    });
  }

  // Extract Phase 3 specialties / categories
  const rawMaterials =
    (d.dentist_verification?.clinical_path_verification
      ?.procedure_material_verifications as any[]) || [];
  const phase3Categories = (rawMaterials || []).map((mat: any) => {
    let procName = "Unknown Procedure";
    const ownProc = mat.own_procedure;
    if (ownProc) {
      if (typeof ownProc === "object") {
        procName = ownProc.procedure_name || `Procedure #${ownProc.id}`;
      } else {
        procName = `Procedure #${ownProc}`;
        if (
          d.dentist_verification?.operation_verification?.procedures_feature
        ) {
          const match =
            d.dentist_verification.operation_verification.procedures_feature.find(
              (p: any) => p.id === ownProc || p.procedure === ownProc,
            );
          if (match) {
            procName = match.procedure_name;
          }
        }
      }
    }

    const catFiles = [];
    if (mat.ce_certificate) {
      catFiles.push({
        name: getFileNameFromUrl(mat.ce_certificate, "CE Certificate"),
        size: "",
        type: "pdf",
        url: mat.ce_certificate,
      });
    }
    if (mat.material_brands) {
      catFiles.push({
        name: getFileNameFromUrl(mat.material_brands, "Material Brands"),
        size: "",
        type: "pdf",
        url: mat.material_brands,
      });
    }
    if (mat.invoice) {
      catFiles.push({
        name: getFileNameFromUrl(mat.invoice, "Invoice"),
        size: "",
        type: "pdf",
        url: mat.invoice,
      });
    }
    if (mat.protocol_pdf) {
      catFiles.push({
        name: getFileNameFromUrl(mat.protocol_pdf, "Protocol PDF"),
        size: "",
        type: "pdf",
        url: mat.protocol_pdf,
      });
    }

    return {
      name: procName,
      files: catFiles,
    };
  });

  return {
    id: `DEN-${String(d.id).padStart(3, "0")}`,
    name: d.full_name || "Unknown Dentist",
    initials,
    avatar_color: avatarColor,
    email: d.user?.email || "—",
    phone: d.phone || d.user?.phone || "—",
    location,
    specialty: mapSpecialty(d.specialty),
    experience_years: d.experience_years || 0,
    languages: [],
    status,
    rating: d.rating_avg || 0,
    review_count: d.total_reviews || 0,
    bookings: 0,
    joined: d.created_at
      ? new Date(d.created_at).toISOString().split("T")[0]
      : "—",
    rdv_score: d.rdv_score || 0,
    rdv_verified: d.is_verified,
    profile: {
      stats: {
        total_bookings: { count: 0, growth_this_month: 0 },
        revenue_lifetime: { amount: 0, avg_per_visit: 0 },
        cancellation_rate: { pct: "0%", benchmark: "5.7%" },
        estimate_accuracy: { pct: "0%", note: "No data" },
        avg_response_time: { value: "—", note: "No data" },
      },
      performance: {
        show_up_rate: 0,
        five_star_reviews: 0,
        repeat_patients: 0,
        estimate_accuracy: 0,
      },
      verification: {
        phase1: {
          id: d.dentist_verification?.id,
          label: "Phase 1 — Identity",
          status: mapVerificationStatus(
            d.dentist_verification?.license_verification,
          ),
          country:
            d.dentist_verification?.dentist_license_verification?.country ||
            "—",
          city:
            d.dentist_verification?.dentist_license_verification?.city || "—",
          registration_authority:
            d.dentist_verification?.dentist_license_verification
              ?.registration_authority_name || "—",
          registration_no:
            d.dentist_verification?.dentist_license_verification
              ?.registration_no || "—",
          files: phase1Files,
        },
        phase2: {
          id: d.dentist_verification?.id,
          label: "Phase 2 — Operations",
          status: mapVerificationStatus(
            d.dentist_verification?.operations_verification,
          ),
          rejection_reason:
            d.dentist_verification?.operation_verification?.reviewer_notes ||
            null,
          services: (
            d.dentist_verification?.operation_verification
              ?.procedures_feature || []
          ).map((p) => ({
            name: p.procedure_name,
            description: p.option_notes || "",
            price: parseFloat(p.price) || 0,
          })),
          files: phase2Files,
        },
        phase3: {
          id: d.dentist_verification?.id,
          label: "Phase 3 — Clinical",
          status: mapVerificationStatus(
            d.dentist_verification?.clinical_verification,
          ),
          clinic_location: d.dentist_verification?.clinical_path_verification
            ?.clinic_address
            ? typeof d.dentist_verification.clinical_path_verification
                .clinic_address === "string"
              ? d.dentist_verification.clinical_path_verification.clinic_address
              : d.dentist_verification.clinical_path_verification.clinic_address
                  .address || "—"
            : "—",
          categories: phase3Categories,
        },
      },
      bookings: [],
      consultations: [],
      reviews: [],
    },
  };
}

export default function DentistsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [tableSearch, setTableSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [city, setCity] = useState("All cities");
  const [page, setPage] = useState(1);

  const {
    dentists: apiDentists,
    isLoading,
    isError,
  } = useAdminDentists({
    params: {
      limit: 1000,
    },
  });

  const mappedDentists = useMemo(() => {
    return (apiDentists || []).map(mapApiDentistToUIDentist);
  }, [apiDentists]);

  const meta = useMemo(() => {
    const total = mappedDentists.length;
    const active = mappedDentists.filter((d) => d.status === "active").length;
    const pending = mappedDentists.filter((d) => d.status === "pending").length;
    const suspended = mappedDentists.filter(
      (d) => d.status === "suspended",
    ).length;
    const rejected = mappedDentists.filter(
      (d) => d.status === "rejected",
    ).length;

    return {
      total_dentists: total,
      weekly_growth: 0,
      active,
      active_pct: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
      pending_verification: pending,
      suspended,
      suspended_pct:
        total > 0 ? `${Math.round((suspended / total) * 100)}%` : "0%",
      tab_counts: {
        all: total,
        active,
        pending,
        suspended,
        rejected,
      },
    };
  }, [mappedDentists]);

  const stats = [
    {
      label: "Total Dentists",
      value: meta.total_dentists.toLocaleString(),
      sub: "Registered on platform",
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
    let list = mappedDentists;
    if (activeTab !== "all") list = list.filter((d) => d.status === activeTab);
    if (specialty !== "All specialties")
      list = list.filter((d) => d.specialty === specialty);
    if (city !== "All cities") {
      const q = city.toLowerCase();
      list = list.filter(
        (d) =>
          d.location.toLowerCase().includes(q) ||
          q.includes(d.location.toLowerCase()),
      );
    }
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q),
      );
    }
    return list;
  }, [mappedDentists, activeTab, specialty, city, tableSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleTabChange = (key: string) => {
    setActiveTab(key as StatusFilter);
    setPage(1);
  };

  if (isLoading) {
    return <DentistsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-red-500 font-semibold">
        Failed to load dentists. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Dentists
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage all practitioners on the platform — verification, status,
            performance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <CustomStats stats={stats} />

      {/* ── Tabs + Table ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-100 overflow-x-auto px-4 pt-1">
          <CustomTab
            tabs={tabs}
            active={activeTab}
            onChange={handleTabChange}
          />
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
              className="h-9 appearance-none rounded-lg border border-gray-200 w-full bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E]"
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
              className="h-9 appearance-none rounded-lg border border-gray-200 w-full bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E]"
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
                {[
                  "Dentist",
                  "Specialty",
                  "Location",
                  "Status",
                  "Rating",
                  "Bookings",
                  "Joined",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                  >
                    {h}
                  </th>
                ))}
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
                    <td
                      className="px-4 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    {/* Dentist */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={dentist.initials}
                          color={dentist.avatar_color}
                        />
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
                          STATUS_BADGE[dentist.status] ??
                            "bg-gray-100 text-gray-500",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            STATUS_DOT[dentist.status] ?? "bg-gray-400",
                          )}
                        />
                        {STATUS_LABEL[dentist.status] ?? dentist.status}
                      </span>
                    </td>
                    {/* Rating */}
                    <td className="px-4 py-3.5">
                      {dentist.rating != null &&
                      dentist.review_count != null ? (
                        <StarRating
                          rating={dentist.rating}
                          count={dentist.review_count}
                        />
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </td>
                    {/* Bookings */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {dentist.bookings != null ? (
                        dentist.bookings.toLocaleString()
                      ) : (
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
                        onViewProfile={() =>
                          router.push(`/admin/dentists/${dentist.id}`)
                        }
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
            {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
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
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50",
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
