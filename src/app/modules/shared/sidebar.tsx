"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Video,
  Search,
  FolderOpen,
  Activity,
  Plane,
  BookOpen,
  Tag,
  Share2,
  Bell,
  CreditCard,
  Globe,
  Star,
  ShieldCheck,
  ShieldAlert,
  X,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { useStateContext } from "@/providers/StateProvider";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const patientNav: NavGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/patient" },
      {
        icon: Search,
        label: "Find Verified Dentist",
        href: "/patient/find-dentist",
      },
      { icon: CalendarDays, label: "My Bookings", href: "/patient/bookings" },
      { icon: FolderOpen, label: "Document Vault", href: "/patient/documents" },
      { icon: Activity, label: "My Results", href: "/patient/results" },
      { icon: Users, label: "Referrals", href: "/patient/referrals" },
      {
        icon: Plane,
        label: "Travel Checklist",
        href: "/patient/travel-checklist",
      },
      {
        icon: BookOpen,
        label: "KOL Directory",
        href: "/patient/kol-directory",
      },
      {
        icon: Settings,
        label: "Profile & Settings",
        href: "/patient/settings",
      },
    ],
  },
];

const dentistNav: NavGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dentist" },
      { icon: User, label: "Profile", href: "/dentist/profile" },
      {
        icon: Tag,
        label: "Pricing Protocols",
        href: "/dentist/pricing-protocols",
      },
      { icon: Video, label: "Consultations", href: "/dentist/consultations" },
      { icon: Calendar, label: "Bookings", href: "/dentist/bookings" },
      { icon: Users, label: "Patients", href: "/dentist/patients" },
      { icon: BarChart3, label: "Results", href: "/dentist/results" },
      { icon: Share2, label: "Referrals", href: "/dentist/referrals" },
      { icon: Settings, label: "Settings", href: "/dentist/settings" },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/admin" }],
  },
  {
    label: "PRACTICE",
    items: [
      { icon: Stethoscope, label: "Dentists", href: "/admin/dentists" },
      { icon: Users, label: "Patients", href: "/admin/patients" },
      { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
      {
        icon: ShieldCheck,
        label: "Verification Queue",
        href: "/admin/verification-queue",
        badge: 12,
      },
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [
      { icon: Star, label: "Reviews & Ratings", href: "/admin/reviews" },
      { icon: Bell, label: "Notifications", href: "/admin/notifications" },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { icon: CreditCard, label: "Payments & Escrow", href: "/admin/payments" },
      { icon: BarChart3, label: "Reports", href: "/admin/reports" },
    ],
  },
  {
    label: "DIRECTORY",
    items: [
      { icon: Globe, label: "KOL Management", href: "/admin/kol-management" },
    ],
  },
  {
    label: "TRUST & SAFETY",
    items: [
      {
        icon: ShieldAlert,
        label: "Anti-Collusion",
        href: "/admin/anti-collusion",
        badge: 7,
      },
      {
        icon: Globe,
        label: "SEO Review Pages",
        href: "/admin/seo-review-pages",
        badge: 4,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ icon: Settings, label: "Settings", href: "/admin/settings" }],
  },
];

const DASHBOARD_ROOTS = ["/dentist", "/patient", "/admin"];

export function Sidebar() {
  const pathname = usePathname();
  const { close } = useSidebar();

  const role = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/dentist")
      ? "dentist"
      : "patient";

  const navGroups =
    role === "admin" ? adminNav : role === "dentist" ? dentistNav : patientNav;

  const isAdmin = role === "admin";

  function isActive(href: string) {
    if (DASHBOARD_ROOTS.includes(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col pt-4",
        isAdmin ? "bg-[#163E5C]" : "bg-white",

        pathname === "/dentist/add-pricing" && "hidden", // Hide sidebar on Add Pricing page
        pathname === "/dentist/verification" && "hidden", // Hide sidebar on Verification page
      )}
    >
      {/* Mobile close button */}
      <div className="flex items-center justify-end px-4 pt-4 pb-2 lg:hidden">
        <button
          onClick={close}
          aria-label="Close sidebar"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            isAdmin
              ? "text-slate-300 hover:bg-white/10 hover:text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-4", "space-y-3")}>
            {group.label && (
              <p
                className={cn(
                  "mb-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest",
                  isAdmin ? "text-slate-400" : "text-slate-400",
                )}
              >
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isAdmin
                      ? active
                        ? "bg-white/15 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-[#163E5C] text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                        active
                          ? "bg-white text-[#163E5C]"
                          : isAdmin
                            ? "bg-white/20 text-white"
                            : "bg-[#163E5C] text-white",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className={cn(
          "border-t p-3",
          isAdmin ? "border-white/10" : "border-slate-100",
        )}
      >
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isAdmin
              ? "text-slate-300 hover:bg-white/10 hover:text-white"
              : "text-red-500 hover:bg-red-50",
          )}
        >
          <LogOut className="h-4.5 w-4.5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
