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
  <Image
    src="/images/flags/united-states.png"
    alt="US Flag"
    width={20}
    height={20}
  />
);

const Bangla = () => (
  <Image src="/images/flags/bangla.png" alt="BD Flag" width={20} height={20} />
);

const French = () => (
  <Image
    src={"/images/flags/france.png"}
    alt="FR Flag"
    width={20}
    height={20}
  />
);

const German = () => (
  <Image
    src={"/images/flags/germany.png"}
    alt="DE Flag"
    width={20}
    height={20}
  />
);

const Arabic = () => (
  <Image
    src={"/images/flags/arabic.png"}
    alt="Arabic Flag"
    width={20}
    height={20}
  />
);

const Urdu = () => (
  <Image
    src={"/images/flags/pakistan.png"}
    alt="Pakistan Flag"
    width={20}
    height={20}
  />
);

const navConfig = [
  { label: "Home", href: "/" },
  { label: "Find a Dentist", href: "/find-dentist" },
  { label: "About us", href: "/about-us", hasDropdown: false },
  { label: "Guarantee", href: "/guarantee", hasDropdown: false },
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
  const [selectedLang, setSelectedLang] = useState({
    code: "EN",
    name: "English (US)",
    flag: <English />,
  });

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

  const isDetailsPage =
    pathname.startsWith("/find-dentist/") && pathname !== "/find-dentist";
  const isSchedulePage = pathname === "/schedule";
  const isFindDentistPage = pathname === "/find-dentist";
  const isAuthenticated = !!token;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md py-4 shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-400 w-11/12 items-center justify-between gap-4">
        <div className="flex items-center gap-10 shrink-0">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90"
          >
            <Image
              src={"/logos/mainlogo.png"}
              alt="Website logo"
              height={160}
              width={320}
              loading="eager"
              className="w-36 h-auto object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navConfig.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-1 text-[14px] font-semibold transition-all duration-200 py-1.5",
                  pathname === item.href
                    ? "text-[#10436B] border-b-2 border-[#10436B]"
                    : "text-slate-500 hover:text-[#10436B]",
                )}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown
                    size={14}
                    className="text-slate-400 group-hover:text-[#10436B] transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 flex-1 max-w-2xl">
          {/* Search Input */}
          <div className="hidden md:flex flex-1 max-w-xs relative items-center group">
            <input
              type="text"
              placeholder="Search procedure or budget..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-4 pr-10 text-sm outline-none focus:bg-white focus:border-[#10436B] focus:ring-2 focus:ring-[#10436B]/10 transition-all duration-200"
            />
            <Search
              className="absolute right-3.5 text-slate-400 group-focus-within:text-[#10436B] transition-colors"
              size={16}
            />
          </div>

          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 focus:outline-none transition-all duration-200">
                  <Avatar className="h-8 w-8 border border-slate-200 shadow-sm">
                    <AvatarImage
                      src="/images/smile-1.png"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#10436B] text-white font-bold text-xs">
                      {user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-semibold text-slate-700 md:block max-w-[100px] truncate">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-1.5 mt-2 bg-white border border-slate-100 shadow-lg rounded-xl animate-in fade-in-50 slide-in-from-top-1"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <div className="border-b border-slate-100 my-1"></div>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-lg py-2 px-3 text-sm text-slate-700 font-medium transition-colors"
                    onClick={() => router.push("/patient")}
                  >
                    My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-lg py-2 px-3 text-sm text-slate-700 font-medium transition-colors">
                    Settings
                  </DropdownMenuItem>
                  <div className="border-b border-slate-100 my-1"></div>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer flex items-center gap-2 hover:bg-red-50 focus:bg-red-50 rounded-lg py-2 px-3 text-sm font-semibold transition-colors"
                    onClick={logutHandler}
                  >
                    <LogOut size={14} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {(isDetailsPage || isSchedulePage) && (
                  <button
                    onClick={() => setShowSigninModal(true)}
                    className="text-[14px] font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                  >
                    Sign In
                  </button>
                )}

                {isFindDentistPage && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSigninModal(true)}
                      className="text-[14px] font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setShowSignupModal(true)}
                      className="rounded-full bg-[#10436B] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0b2d49] hover:shadow-md active:scale-95 shadow-sm"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {!isDetailsPage && !isSchedulePage && !isFindDentistPage && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSigninModal(true)}
                      className="text-[14px] font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      Sign In
                    </button>
                    <Link
                      href="/register-doctor"
                      className="hidden sm:block rounded-full bg-[#10436B] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0b2d49] hover:shadow-md active:scale-95 shadow-sm"
                    >
                      Join as a Doctor
                    </Link>
                  </div>

                )}
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-100 hover:bg-slate-50 focus:outline-none transition-all duration-200 bg-white">
                {selectedLang.flag}
                <span className="text-[13px] font-bold text-slate-700">
                  {selectedLang.code}
                </span>
                <ChevronDown size={12} className="text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 bg-white border border-slate-100 shadow-xl rounded-xl p-1.5 mt-1 animate-in fade-in-50 slide-in-from-top-1"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLang(lang)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50 focus:outline-none",
                      selectedLang.code === lang.code &&
                      "bg-[#F4F9FD] text-[#10436B] font-bold",
                    )}
                  >
                    {lang.flag}
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="lg:hidden p-1 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-8 lg:p-12 lg:hidden flex flex-col gap-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="relative md:hidden mb-2">
            <input
              type="text"
              placeholder="Search procedure or budget..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm focus:bg-white focus:border-[#10436B] outline-none transition-all"
            />
            <Search
              className="absolute right-3.5 top-3 text-slate-400"
              size={16}
            />
          </div>

          <div className="flex flex-col gap-1">
            {navConfig.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base font-semibold text-slate-700 py-3 border-b border-slate-50 hover:text-[#10436B] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Authentication / Actions */}
          {isAuthenticated ? (
            <div className="mt-2 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage
                    src="/images/smile-1.png"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#10436B] text-white font-semibold text-sm">
                    {user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">
                    {user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <Link
                href="/patient"
                className="block text-base font-semibold text-slate-700 py-2.5 hover:text-[#10436B] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logutHandler();
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 py-3 text-center font-semibold transition-colors hover:bg-red-100"
              >
                <LogOut size={16} /> Logout
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
                  className="w-full rounded-xl border border-slate-200 py-3 text-center font-semibold text-[#10436B] hover:bg-slate-50 transition-colors"
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
                    className="w-full rounded-xl border border-slate-200 py-3 text-center font-semibold text-[#10436B] hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowSignupModal(true);
                    }}
                    className="w-full rounded-xl bg-[#10436B] py-3 text-center font-semibold text-white transition-opacity hover:opacity-95"
                  >
                    Get Started
                  </button>
                </>
              )}

              {!isDetailsPage && !isSchedulePage && !isFindDentistPage && (
                <>
                  <Link
                    href="/register-doctor"
                    className="w-full rounded-xl bg-[#10436B] py-3 text-center font-semibold text-white transition-opacity hover:opacity-95"
                    onClick={() => setIsOpen(false)}
                  >
                    Join as a Doctor
                  </Link>


                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-100 hover:bg-slate-50 focus:outline-none transition-all duration-200 bg-white">
                  {selectedLang.flag}
                  <span className="text-[13px] font-bold text-slate-700">
                    {selectedLang.code}
                  </span>
                  <ChevronDown size={12} className="text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-44 bg-white border border-slate-100 shadow-xl rounded-xl p-1.5 mt-1 animate-in fade-in-50 slide-in-from-top-1"
                >
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setSelectedLang(lang)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50 focus:outline-none",
                        selectedLang.code === lang.code &&
                        "bg-[#F4F9FD] text-[#10436B] font-bold",
                      )}
                    >
                      {lang.flag}
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
