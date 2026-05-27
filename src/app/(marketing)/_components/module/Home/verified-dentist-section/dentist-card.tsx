"use client";
import { Star, ShieldCheck } from "lucide-react";
import { GoShieldCheck } from "react-icons/go";
import { cn } from "@/lib/utils";

export default function DentistCard({ dentist, isCompareMode, isSelected, onSelect }: any) {
  return (
    <div 
      className={cn(
        "group relative rounded-md p-6 flex items-start gap-5 transition-all duration-300 border-2 border-[#CEE0F4]",
        isSelected 
          ? "border-[#CEE0F4]" 
          : "",
          isCompareMode && "pl-10"
      )}
    >
      {/* Compare Checkbox Overlay */}
      {isCompareMode && (
        <button 
          onClick={() => onSelect(dentist.id)}
          className={cn(
            "absolute top-4 left-4 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
            isSelected ? "bg-[#10436B] border-[#10436B]" : "bg-white border-gray-200"
          )}
        >
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      )}

      <div className="relative flex flex-col items-center gap-2">
        <img src={dentist.image} className="w-20 h-20 rounded-full object-cover border-2 border-gray-50" alt={dentist.name} />
        <div className="flex items-center gap-1">
           <div className="text-green-400 rounded-full flex items-center justify-center">
            <GoShieldCheck />
           </div>
           <span className="text-sm uppercase text-[#1A1A2E]">UNCLAIMED</span>
        </div>
      </div>
      
      <div className="flex-1">
        <h4 className="font-bold text-[#1A1A2E] lg:text-xl mb-0.5">{dentist.name}</h4>
        <p className="text-[#0E3E65] text-sm font-semibold mb-2">{dentist.specialty}</p>
        
        <div className="flex items-center gap-1">
          <span className="text-[#10436B] font-bold text-sm">{dentist.rating}</span>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < 5 ? "#E3A32A" : "none"} className="text-[#E3A32A]" />
          ))}
          <span className="text-gray-400 text-xs ml-1">(8 Ratings)</span>
        </div>
      </div>

      <div className="text-right flex flex-col justify-between h-full">
        <div>
          <p className="text-[#6B7280] text-xs">Starting at</p>
          <p className="text-[#0E3E65] font-bold">${dentist.price}</p>
        </div>
      </div>
    </div>
  );
}