"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Stethoscope, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PROCEDURES = [
  "Root Canal",
  "Teeth Whitening",
  "Dental Implants",
  "Braces",
  "Routine Checkup"
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [budget, setBudget] = useState({ min: "00", max: "00" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", { selectedProcedure, budget });
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-2 rounded-md border border-blue-50 bg-[#F4F9FD] p-2 shadow-sm md:flex-row md:gap-0">
      
      <div className="relative w-full md:w-1/2" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-3 px-5 py-3 transition-all hover:bg-white/50 md:rounded-l-full md:border-r md:border-gray-200"
        >
          <Stethoscope size={20} className="shrink-0 text-[#10436B]" />
          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <span className={cn(
              "truncate text-sm font-medium",
              selectedProcedure ? "text-[#10436B]" : "text-gray-500"
            )}>
              {selectedProcedure || "Select procedures"}
            </span>
            <ChevronDown 
              size={16} 
              className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in duration-150">
            {PROCEDURES.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelectedProcedure(item);
                  setIsOpen(false);
                }}
                className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[#F4F9FD] hover:text-[#10436B] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full items-center gap-3 px-5 py-3 md:w-1/3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E3A32A]/15 text-[#E3A32A]">
          <DollarSign size={14} strokeWidth={3} />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            placeholder="00"
            className="w-10 bg-transparent text-sm font-semibold text-[#10436B] outline-none placeholder:text-gray-300"
            onChange={(e) => setBudget({ ...budget, min: e.target.value })}
          />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">to</span>
          <input
            type="text"
            placeholder="00"
            className="w-10 bg-transparent text-sm font-semibold text-[#10436B] outline-none placeholder:text-gray-300"
            onChange={(e) => setBudget({ ...budget, max: e.target.value })}
          />
        </div>
      </div>

      <button 
        onClick={handleSearch}
        className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#10436B] py-3.5 text-sm font-bold text-white transition-all active:scale-95 md:w-auto md:px-8 hover:bg-[#0D3658] hover:shadow-lg"
      >
        <Search size={18} className="transition-transform group-hover:scale-110" />
        <span className="truncate">Find a Dentist</span>
      </button>
    </div>
  );
}