"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStateContext } from "@/providers/StateProvider";
import useAuth from "@/hooks/authentication/useAuth";
import { getAccessToken, getSessionUser } from "@/lib/auth/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Premium SVG flag components
const English = () => (
  <Image src="/images/flags/united-states.png" alt="US Flag" width={20} height={20} />
);

const Bangla = () => (
  <Image src="/images/flags/bangla.png" alt="BD Flag" width={20} height={20} />
);

const French = () => (
  <Image src={"/images/flags/france.png"} alt="FR Flag" width={20} height={20} />
);

const German = () => (
  <Image src={"/images/flags/germany.png"} alt="DE Flag" width={20} height={20} />
);

const Arabic = () => (
  <Image src={"/images/flags/arabic.png"} alt="Arabic Flag" width={20} height={20} />
);

const Urdu = () => (
  <Image src={"/images/flags/pakistan.png"} alt="Pakistan Flag" width={20} height={20} />
);

const navConfig = [
  { label: "Home", href: "/" },
  { label: "Find a Dentist", href: "/find-dentist" },
  { label: "About us", href: "/about-us", hasDropdown: true },
  { label: "Guarantee", href: "/guarantee", hasDropdown: true },
];

export default function Navbar() {
  const {
    showSigninModal,
    showSignupModal,
    setShowSigninModal,
    setShowSignupModal,
    searchQuery,
    setSearchQuery,
  } = useStateContext();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState({ code: "EN", name: "English (US)", flag: <English /> });

  const pathname = usePathname();
  const router = useRouter();
  const { logoutMutation } = useAuth();
  const { mutate: logout } = logoutMutation;

  // Sync auth state whenever login/register modal closes or component mounts
  useEffect(() => {
    const tokenVal = getAccessToken();
    const userVal = getSessionUser();
    setToken(tokenVal);
    setUser(userVal);
  }, [showSigninModal, showSignupModal]);

  const logutHandler = () => {
    logout();
    setUser(null);
    setToken(null);
    router.push("/");
  };

  const languages = [
    { code: "EN", name: "English (US)", flag: <English /> },
    { code: "BN", name: "Bangla", flag: <Bangla /> },
    { code: "FR", name: "French", flag: <French /> },
    { code: "DE", name: "German", flag: <German /> },
    { code: "AR", name: "Arabic", flag: <Arabic /> },
    { code: "UR", name: "Urdu", flag: <Urdu /> },
  ];

  // Path detection to render specific layouts requested in Figma mockups
  const isDetailsPage = pathname.startsWith("/find-dentist/") && pathname !== "/find-dentist";
  const isSchedulePage = pathname === "/schedule";
  const isFindDentistPage = pathname === "/find-dentist";
  const isAuthenticated = !!token;

  return (
    <nav className="sticky shadow-md top-0 z-50 w-full border-b border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-400 w-11/12 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <div className="flex items-center gap-1">
            <Image
              src={"/logos/mainlogo.png"}
              alt="Website logo"
              height={200}
              width={400}
              loading="eager"
              className="w-43 h-auto object-contain"
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex gap-8">
          {navConfig.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex gap-1 text-[15px] font-medium transition-colors",
                pathname === item.href
                  ? "text-[#10436B] border-b-2 border-[#10436B] pb-1"
                  : "text-gray-600 hover:text-[#10436B]",
              )}
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown
                  size={16}
                  className="text-gray-400 group-hover:text-[#10436B] transition-colors"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-md relative items-center">
          <input
            type="text"
            placeholder="Search by procedure and budget"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#10436B] transition-all"
          />
          <Search className="absolute right-4 text-gray-400" size={20} />
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            /* Logged In User Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F2F5F6] hover:bg-[#E2E8F0] focus:outline-none transition-colors">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-[#10436B] text-white font-semibold text-xs">
                    {user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-semibold text-gray-700 md:block max-w-[120px] truncate">
                  {user?.email?.split("@")[0] || "User"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 space-y-2 p-4 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                    {user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-[#6B7280] truncate">
                    {user?.email || ""}
                  </p>
                </div>
                <div className="border-b border-slate-100 my-2"></div>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-lg py-2" onClick={() => router.push("/patient")}>
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-lg py-2">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer flex items-center gap-2 hover:bg-red-50 rounded-lg py-2"
                  onClick={logutHandler}
                >
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged Out Actions Based on Route */
            <>
              {(isDetailsPage || isSchedulePage) && (
                <button
                  onClick={() => setShowSigninModal(true)}
                  className="text-[15px] font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors"
                >
                  Sign In
                </button>
              )}

              {isFindDentistPage && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowSigninModal(true)}
                    className="text-[15px] font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="rounded-full bg-[#10436B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {!isDetailsPage && !isSchedulePage && !isFindDentistPage && (
                <Link
                  href="/register-doctor"
                  className="hidden sm:block rounded-lg bg-[#10436B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Join as a Doctor
                </Link>
              )}
            </>
          )}

          {/* Premium Language Dropdown - Visible on routes other than details/schedule/find-dentist */}
          {!isDetailsPage && !isSchedulePage && !isFindDentistPage && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors border border-transparent hover:border-gray-100">
                {selectedLang.flag}
                <span className="text-[15px] font-semibold text-gray-700">{selectedLang.code}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 mt-1">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none",
                      selectedLang.code === lang.code && "bg-blue-50/50 text-[#10436B] font-semibold"
                    )}
                  >
                    {lang.flag}
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Drawer Menu Toggle */}
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 lg:hidden flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative md:hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-[#10436B] outline-none transition-all"
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {navConfig.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-lg font-medium text-gray-700 py-2 border-b border-gray-50 hover:text-[#10436B] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Authentication / Actions */}
          {isAuthenticated ? (
            <div className="mt-2 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-[#10436B] text-white font-semibold text-sm">
                    {user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate max-w-[200px]">
                    {user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-[#6B7280] truncate max-w-[200px]">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <Link
                href="/patient"
                className="block text-base font-medium text-gray-700 py-2 hover:text-[#10436B] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logutHandler();
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 py-3 text-center font-semibold transition-colors hover:bg-red-100"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {(isDetailsPage || isSchedulePage) && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowSigninModal(true);
                  }}
                  className="w-full rounded-lg border border-gray-200 py-3 text-center font-semibold text-[#10436B] hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </button>
              )}

              {isFindDentistPage && (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowSigninModal(true);
                    }}
                    className="w-full rounded-lg border border-gray-200 py-3 text-center font-semibold text-[#10436B] hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowSignupModal(true);
                    }}
                    className="w-full rounded-lg bg-[#10436B] py-3 text-center font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Get Started
                  </button>
                </>
              )}

              {!isDetailsPage && !isSchedulePage && !isFindDentistPage && (
                <>
                  <Link
                    href="/register-doctor"
                    className="w-full rounded-lg bg-[#10436B] py-3 text-center font-semibold text-white transition-opacity hover:opacity-90"
                    onClick={() => setIsOpen(false)}
                  >
                    Join as a Doctor
                  </Link>

                  {/* Language Selection list in Mobile menu */}
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <p className="text-xs text-gray-400 font-semibold mb-2 uppercase">Select Language</p>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLang(lang);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all",
                            selectedLang.code === lang.code
                              ? "border-[#10436B] bg-blue-50/30 text-[#10436B]"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {lang.flag}
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
