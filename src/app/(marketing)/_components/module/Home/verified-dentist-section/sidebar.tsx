"use client";
import { cn } from "@/lib/utils";

const procedures = [
  "Veneers", "Orthodontist", "Teeth Whitening", 
  "Dental Crowns", "Orthodontic Braces", "Preventive Cleanings",
  "Root Canal Therapy", "Gum Disease Treatment", "Dental Implants"
];

export default function Sidebar({ active, onChange }: { active: string, onChange: (val: string) => void }) {
  return (
    <aside className="w-full lg:w-72 flex flex-col gap-1 p-6 border-r border-gray-100">
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
  );
}