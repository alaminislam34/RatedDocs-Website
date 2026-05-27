"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import {
  getBookingData,
  updateTreatmentDetails,
} from "@/lib/storage/bookingService";

const procedures = [
  {
    id: "veneers",
    title: "Porcelain Veneers",
    desc: "Improve shape, colour, and symmetry",
  },
  {
    id: "implants",
    title: "Dental Implants",
    desc: "Replace one or more missing teeth permanently",
  },
  {
    id: "whitening",
    title: "Teeth Whitening",
    desc: "Brighten and even your smile",
  },
  {
    id: "crowns",
    title: "Dental Crowns",
    desc: "Restore damaged, worn, or cracked teeth",
  },
  {
    id: "makeover",
    title: "Full Smile Makeover",
    desc: "Comprehensive cosmetic treatment plan",
  },
  {
    id: "bridges",
    title: "Dental Bridges",
    desc: "Replace missing teeth with a natural look",
  },
];

export default function ProcedureSelectionForm() {
  const [selectedId, setSelectedId] = useState("veneers");

  // Load data from localStorage on mount
  useEffect(() => {
    const bookingData = getBookingData();
    if (bookingData.procedure) {
      const procedureId = procedures.find(
        (p) => p.title === bookingData.procedure,
      )?.id;
      if (procedureId) {
        setSelectedId(procedureId);
      }
    }
  }, []);

  const handleSelectProcedure = (id: string) => {
    setSelectedId(id);
    const procedure = procedures.find((p) => p.id === id)?.title;
    if (procedure) {
      updateTreatmentDetails({ procedure });
    }
  };

  return (
    <div className="w-full bg-white">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-6">
        What procedure are you interested in?
      </h2>

      <div className="space-y-4">
        {procedures.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelectProcedure(item.id)}
              className={`
                group cursor-pointer relative flex items-center justify-between 
                p-5 rounded-2xl border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-[#113254] bg-[#F8FAFC]"
                    : "border-[#F3F4F6] hover:border-[#E5E7EB] bg-white"
                }
              `}
            >
              <div className="flex flex-col gap-1">
                <span
                  className={`text-[17px] font-bold ${isSelected ? "text-[#113254]" : "text-[#1A1A2E]"}`}
                >
                  {item.title}
                </span>
                <span className="text-[14px] font-normal text-[#6B7280]">
                  {item.desc}
                </span>
              </div>

              <div className="flex-shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-[#113254] fill-[#113254] text-white" />
                ) : (
                  <Circle className="w-6 h-6 text-[#D1D5DB]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
