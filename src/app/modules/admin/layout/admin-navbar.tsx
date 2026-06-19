"use client";

import { HelpCircle, Bell, Menu, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/context/sidebar-context";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/authentication/useAuth";

export function AdminNavbar() {
  const { toggle } = useSidebar();
  const router = useRouter();
  const { logoutMutation } = useAuth()
  const {mutate: logout} = logoutMutation;
  function handleLogout() {
    logout();
    router.push("/admin-login");
  }

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white w-full z-30 sticky top-0 left-0">
      <nav className="px-4 lg:px-6 flex h-14 items-center justify-between">
        {/* Left: hamburger (mobile only) */}
        <div className="flex items-center">
          <button
            onClick={toggle}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile logo — only shows on small screens when sidebar is hidden */}
          <div className="flex items-center gap-2 ml-2 lg:hidden">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C9963F]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 text-white"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  d="M22 12h-4l-3 9L9 3l-3 9H2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#0D2B3E]">RatedDocs</span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Help */}
          <button
            aria-label="Help"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
          </button>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="User menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D2B3E] text-white text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0D2B3E]/30 focus:ring-offset-1 ml-1"
              >
                JS
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2 mt-1">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  Jordan Smith
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  admin@rateddocs.com
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-[13px] cursor-pointer">
                <User className="h-3.5 w-3.5 text-gray-500" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-[13px] cursor-pointer">
                <Settings className="h-3.5 w-3.5 text-gray-500" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-[13px] text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
