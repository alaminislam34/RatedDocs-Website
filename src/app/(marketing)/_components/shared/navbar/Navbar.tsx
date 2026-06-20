"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navConfig = [
  { label: "Home", href: "/" },
  { label: "Find a Dentist", href: "/find-dentist" },
  { label: "About us", href: "/about-us", hasDropdown: true },
  { label: "Guarantee", href: "/guarantee", hasDropdown: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  return (
    <nav className="sticky shadow-md top-0 z-50 w-full border-b border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-400 w-11/12 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <div className="flex items-center gap-1">
            <div>
              <Image
                src={"/logos/mainlogo.png"}
                alt="Website logo"
                height={200}
                width={400}
                loading="eager"
                className="w-43 h-auto object-contain"
              />
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex gap-8">
          {navConfig.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex gap-1 text-[15px] font-medium transition-colors",
                pathName === item.href
                  ? "text-[#10436B] border-b-2 border-[#10436B] pb-1"
                  : "text-gray-600 hover:text-[#10436B]",
              )}
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown
                  size={16}
                  className="text-gray-400 group-hover:text-[#10436B]"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex flex-1 max-w-md relative items-center">
          <input
            type="text"
            placeholder="Search by procedure and budget"
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#10436B] transition-all"
          />
          <Search className="absolute right-4 text-gray-400" size={20} />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/register-doctor"
            className="hidden sm:block rounded-lg bg-[#10436B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Join as a Doctor
          </Link>

          <button
            className="lg:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 lg:hidden flex flex-col gap-4 shadow">
          <div className="relative md:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-sm"
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
              className="text-lg font-medium text-gray-700 py-2 border-b border-gray-50"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/register-doctor"
            className="mt-2 block w-full rounded-lg bg-[#10436B] py-3 text-center font-semibold text-white"
            onClick={() => setIsOpen(false)}
          >
            Join as a Doctor
          </Link>
        </div>
      )}
    </nav>
  );
}
