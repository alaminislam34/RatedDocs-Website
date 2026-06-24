"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const procedures = [
  "Veneers", "Orthodontist", "Teeth Whitening", 
  "Dental Crowns", "Orthodontic Braces", "Preventive Cleanings",
  "Root Canal Therapy", "Gum Disease Treatment", "Dental Implants"
];

export default function Sidebar({ active, onChange }: { active: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile/Tablet Dropdown Select Selector */}
      <div className="w-full lg:hidden p-4 border-b border-gray-100" ref={dropdownRef}>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Procedure
        </label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#CEE0F4] rounded-xl text-left text-[15px] font-medium text-[#10436B] shadow-sm hover:border-[#10436B] transition-all duration-200"
          >
            <span>{active}</span>
            <ChevronDown
              className={cn(
                "size-5 text-[#10436B] transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Options List */}
          {isOpen && (
            <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto bg-white border border-[#CEE0F4] rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
              {procedures.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onChange(p);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[15px] transition-colors duration-150",
                    active === p
                      ? "bg-[#F4F9FD] text-[#10436B] font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#10436B]"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar Selector */}
      <aside className="hidden lg:flex w-full lg:w-72 flex-col gap-1 p-6 border-r border-gray-100">
        <h3 className="text-[#10436B] text-lg font-bold mb-6 px-2">Select Procedure</h3>
        <div className="flex flex-col gap-1">
          {procedures.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "text-left px-4 py-3 rounded-xl text-[15px] transition-all duration-200",
                active === p 
                  ? "bg-[#F4F9FD] text-[#10436B] font-bold shadow-sm" 
                  : "text-gray-500 hover:text-[#10436B] hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="text-[#10436B] text-sm font-semibold mt-6 px-4 hover:underline text-left">
          View all procedure
        </button>
      </aside>
    </>
  );
}