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
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import LogoutButton from "./logout-button";

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

const DASHBOARD_ROOTS = ["/dentist", "/patient"];

export function Sidebar() {
  const pathname = usePathname();
  const { close } = useSidebar();

  const isVerificationPath = pathname === "/dentist/verification";

  if (isVerificationPath) {
    return null;
  }

  const role = pathname.startsWith("/dentist") ? "dentist" : "patient";
  const navGroups = role === "dentist" ? dentistNav : patientNav;

  function isActive(href: string) {
    if (DASHBOARD_ROOTS.includes(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="flex h-full w-64 flex-col pt-4 bg-white">
      {/* Mobile close button */}
      <div className="flex items-center justify-end px-4 pt-4 pb-2 lg:hidden">
        <button
          onClick={close}
          aria-label="Close sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-4", "space-y-3")}>
            {group.label && (
              <p className="mb-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
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
                    active
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
      <div className="border-t border-slate-100 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
