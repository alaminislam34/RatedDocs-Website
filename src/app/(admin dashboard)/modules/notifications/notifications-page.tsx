"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  Shield,
  TriangleAlert,
  DollarSign,
  Settings,
  Star,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  BellOff,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import notificationsData, {
  type Notification,
  type NotificationType,
  type NotificationPriority,
} from "@/lib/notifications-data";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";

/* ─── Constants ────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 8;

const TYPE_META: Record<
  NotificationType,
  {
    label: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  verification: {
    label: "Verification",
    icon: Shield,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
  },
  flag: {
    label: "Flag",
    icon: TriangleAlert,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
  },
  payment: {
    label: "Payment",
    icon: DollarSign,
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
    badgeBg: "bg-success-50",
    badgeText: "text-success-700",
  },
  system: {
    label: "System",
    icon: Settings,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-600",
  },
  review: {
    label: "Review",
    icon: Star,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
  },
  booking: {
    label: "Booking",
    icon: CalendarDays,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
  },
};

const PRIORITY_META: Record<
  NotificationPriority,
  { label: string; dot: string; badge: string }
> = {
  low: { label: "Low", dot: "bg-gray-300", badge: "bg-gray-100 text-gray-500" },
  medium: {
    label: "Medium",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700",
  },
  high: {
    label: "High",
    dot: "bg-orange-400",
    badge: "bg-orange-50 text-orange-700",
  },
  critical: {
    label: "Critical",
    dot: "bg-destructive-500",
    badge: "bg-destructive-50 text-destructive-700",
  },
};

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function ActorAvatar({
  actor,
  size = "md",
}: {
  actor: NonNullable<Notification["actor"]>;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        sz,
      )}
      style={{ backgroundColor: actor.avatarColor }}
    >
      {actor.initials}
    </span>
  );
}

/* ─── Filter Dropdown ──────────────────────────────────────────────────────── */
function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (v: T | "") => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
          value
            ? "border-[#1A1A2E] bg-[#1A1A2E]/5 text-[#1A1A2E]"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
        )}
      >
        {current}
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
          <div className="absolute top-full left-0 z-20 mt-1 min-w-[160px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                !value ? "font-semibold text-[#1A1A2E]" : "text-gray-600",
              )}
            >
              All
            </button>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                  value === opt.value
                    ? "font-semibold text-[#1A1A2E]"
                    : "text-gray-600",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Stat Card ────────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p
          className={cn(
            "text-2xl font-bold tracking-tight",
            valueColor ?? "text-[#1A1A2E]",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Notification Row ─────────────────────────────────────────────────────── */
function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const typeMeta = TYPE_META[notification.type];
  const priorityMeta = PRIORITY_META[notification.priority];
  const TypeIcon = typeMeta.icon;

  return (
    <div
      className={cn(
        "group flex items-start gap-4 border-b border-gray-50 px-5 py-4 transition-colors last:border-0",
        !notification.read
          ? "bg-sky-50/30 hover:bg-sky-50/50"
          : "hover:bg-gray-50/60",
      )}
    >
      {/* Unread dot */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <span
          className={cn(
            "mt-1 h-2 w-2 shrink-0 rounded-full transition-all",
            !notification.read ? "bg-sky-500" : "bg-transparent",
          )}
        />
      </div>

      {/* Type icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          typeMeta.iconBg,
        )}
      >
        <TypeIcon className={cn("h-4 w-4", typeMeta.iconColor)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={cn(
                "text-sm",
                !notification.read
                  ? "font-bold text-[#1A1A2E]"
                  : "font-semibold text-gray-700",
              )}
            >
              {notification.title}
            </p>
            {/* Priority badge — only medium+ */}
            {notification.priority !== "low" && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  priorityMeta.badge,
                )}
              >
                {priorityMeta.label}
              </span>
            )}
            {/* Type badge */}
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                typeMeta.badgeBg,
                typeMeta.badgeText,
              )}
            >
              {typeMeta.label}
            </span>
          </div>
          <span className="shrink-0 text-xs text-gray-400">
            {relativeTime(notification.timestamp)}
          </span>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {notification.description}
        </p>

        {/* Actor + actions row */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {notification.actor && (
              <>
                <ActorAvatar actor={notification.actor} size="sm" />
                <span className="text-xs font-medium text-gray-500">
                  {notification.actor.name}
                </span>
                <span className="text-gray-200">·</span>
              </>
            )}
            <span className="text-xs text-gray-400">
              {new Date(notification.timestamp).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            {notification.actionLabel && (
              <button
                onClick={() =>
                  toast.success(`Navigating to: ${notification.actionLabel}`)
                }
                className="rounded-lg bg-[#1A1A2E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
              >
                {notification.actionLabel}
              </button>
            )}
            {!notification.read && (
              <button
                onClick={() => onMarkRead(notification.id)}
                title="Mark as read"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Read
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              title="Dismiss"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination ───────────────────────────────────────────────────────────── */
function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3.5">
      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {from}–{to}
        </span>{" "}
        of <span className="font-semibold text-gray-600">{total}</span>{" "}
        notifications
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 text-center text-sm text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                page === p
                  ? "border-[#1A1A2E] bg-[#1A1A2E] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
type TabKey = "all" | "unread" | NotificationType;

const TYPE_FILTERS: NotificationType[] = [
  "verification",
  "flag",
  "payment",
  "review",
  "booking",
  "system",
];
const PRIORITY_FILTERS: NotificationPriority[] = [
  "critical",
  "high",
  "medium",
  "low",
];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(notificationsData);
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");
  const [priorityFilter, setPriorityFilter] = useState<
    NotificationPriority | ""
  >("");
  const [page, setPage] = useState(1);

  /* ── Derived counts ── */
  const unreadCount = items.filter((n) => !n.read).length;
  const todayCount = items.filter(
    (n) =>
      new Date(n.timestamp).toDateString() ===
      new Date("2026-05-29").toDateString(),
  ).length;
  const criticalCount = items.filter((n) => n.priority === "critical").length;

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    let list = items;

    if (tab === "unread") list = list.filter((n) => !n.read);
    else if (tab !== "all") list = list.filter((n) => n.type === tab);

    if (typeFilter) list = list.filter((n) => n.type === typeFilter);
    if (priorityFilter)
      list = list.filter((n) => n.priority === priorityFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.actor?.name.toLowerCase().includes(q),
      );
    }

    return list;
  }, [items, tab, typeFilter, priorityFilter, search]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!search || !!typeFilter || !!priorityFilter;

  const resetPage = () => setPage(1);

  /* ── Tab counts ── */
  const tabCounts: Record<TabKey, number> = {
    all: items.length,
    unread: unreadCount,
    verification: items.filter((n) => n.type === "verification").length,
    flag: items.filter((n) => n.type === "flag").length,
    payment: items.filter((n) => n.type === "payment").length,
    review: items.filter((n) => n.type === "review").length,
    booking: items.filter((n) => n.type === "booking").length,
    system: items.filter((n) => n.type === "system").length,
  };

  const TABS = [
    { key: "all", label: "All", count: tabCounts.all },
    { key: "unread", label: "Unread", count: tabCounts.unread },
    {
      key: "verification",
      label: "Verification",
      count: tabCounts.verification,
    },
    { key: "flag", label: "Flags", count: tabCounts.flag },
    { key: "payment", label: "Payments", count: tabCounts.payment },
    { key: "review", label: "Reviews", count: tabCounts.review },
    { key: "booking", label: "Bookings", count: tabCounts.booking },
    { key: "system", label: "System", count: tabCounts.system },
  ];

  /* ── Actions ── */
  const markRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification dismissed.");
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const clearAll = () => {
    setItems([]);
    toast.success("All notifications cleared.");
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Notifications
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""} · ${items.length} total`
              : "All caught up — no unread notifications"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Stat row ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Bell}
          iconBg="bg-[#1A1A2E]/8"
          iconColor="text-[#1A1A2E]"
          label="Total"
          value={items.length}
        />
        <StatCard
          icon={Circle}
          iconBg="bg-sky-50"
          iconColor="text-sky-500"
          label="Unread"
          value={unreadCount}
          valueColor="text-sky-600"
        />
        <StatCard
          icon={CalendarDays}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          label="Today"
          value={todayCount}
          valueColor="text-purple-600"
        />
        <StatCard
          icon={TriangleAlert}
          iconBg="bg-destructive-50"
          iconColor="text-destructive-500"
          label="Critical"
          value={criticalCount}
          valueColor={
            criticalCount > 0 ? "text-destructive-600" : "text-[#1A1A2E]"
          }
        />
      </div>

      {/* ── Tabs + filters ── */}
      <div className="overflow-hidden rounded-xl border border-gray-100 overflow-x-auto bg-white shadow-sm">
        {/* Tabs */}
        <div className="overflow-x-auto">
          <CustomTab
            tabs={TABS}
            active={tab}
            onChange={(k) => {
              setTab(k as TabKey);
              resetPage();
            }}
            variant="underline"
            className="px-2 pt-1 min-w-max"
          />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search notifications…"
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] transition-colors"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  resetPage();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <FilterDropdown
            label="Type"
            options={TYPE_FILTERS.map((t) => ({
              value: t,
              label: TYPE_META[t].label,
            }))}
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v as NotificationType | "");
              resetPage();
            }}
          />

          {/* Priority filter */}
          <FilterDropdown
            label="Priority"
            options={PRIORITY_FILTERS.map((p) => ({
              value: p,
              label: PRIORITY_META[p].label,
            }))}
            value={priorityFilter}
            onChange={(v) => {
              setPriorityFilter(v as NotificationPriority | "");
              resetPage();
            }}
          />

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("");
                setPriorityFilter("");
                resetPage();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}

          {/* Right: results count */}
          <span className="ml-auto text-xs text-gray-400 hidden sm:block">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Notification list */}
        <div className="divide-y-0">
          {paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <BellOff className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                {hasFilters
                  ? "No notifications match your filters."
                  : "No notifications here."}
              </p>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("");
                    setPriorityFilter("");
                  }}
                  className="text-sm font-semibold text-[#1A1A2E] underline-offset-2 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            paged.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                onDelete={dismiss}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
