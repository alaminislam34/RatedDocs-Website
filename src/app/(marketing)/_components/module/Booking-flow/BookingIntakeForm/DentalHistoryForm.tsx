"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  getBookingData,
  updateDentalHistory,
} from "@/lib/storage/bookingService";

const conditions = [
  "Bone loss",
  "Allergies",
  "Gum Disease",
  "TMJ Disorder",
  "Dental Anxiety",
  "Bruxism",
  "None of them",
];

export default function DentalHistoryForm() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    "Bone loss",
  ]);
  const [lastVisit, setLastVisit] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    const bookingData = getBookingData();
    const history = bookingData.dentalHistory;
    setLastVisit(history.lastVisit);
    setSelectedConditions(
      history.conditions.length > 0 ? history.conditions : ["Bone loss"],
    );
    setAdditionalInfo(history.additionalInfo);
  }, []);

  const toggleCondition = (item: string) => {
    let updated: string[];
    if (item === "None of them") {
      updated = ["None of them"];
      setSelectedConditions(updated);
    } else {
      const filtered = selectedConditions.filter((c) => c !== "None of them");
      if (filtered.includes(item)) {
        updated = filtered.filter((c) => c !== item);
      } else {
        updated = [...filtered, item];
      }
      setSelectedConditions(updated);
    }
    updateDentalHistory({ conditions: updated });
  };

  const handleLastVisitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLastVisit(value);
    updateDentalHistory({ lastVisit: value });
  };

  const handleAdditionalInfoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setAdditionalInfo(value);
    updateDentalHistory({ additionalInfo: value });
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-8">
        Tell us about your dental history
      </h2>

      <div className="space-y-8">
        {/* Last Visit Select */}
        <div className="flex flex-col gap-3">
          <label className="text-[15px] font-medium text-[#6B7280]">
            When did you last visit a dentist?
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={lastVisit}
              onChange={handleLastVisitChange}
              className="w-full h-14 pl-5 pr-12 appearance-none bg-white border border-[#E5E7EB] rounded-xl text-[#9CA3AF] outline-none focus:border-[#113254] transition-all cursor-pointer"
            >
              <option value="">Select time period</option>
              <option value="Less than 6 months ago">
                Less than 6 months ago
              </option>
              <option value="6-12 months ago">6-12 months ago</option>
              <option value="Over a year ago">Over a year ago</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* Multi-select Pills */}
        <div className="flex flex-col gap-4">
          <label className="text-[15px] font-medium text-[#6B7280]">
            Any existing dental conditions?
          </label>
          <div className="flex flex-wrap gap-3">
            {conditions.map((item) => {
              const isActive = selectedConditions.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleCondition(item)}
                  className={`px-6 py-2.5 rounded-full border text-[14px] font-medium transition-all
                    ${
                      isActive
                        ? "bg-[#113254] border-[#113254] text-white"
                        : "bg-white border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB]"
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-3">
          <label className="text-[15px] font-medium text-[#6B7280]">
            Any other information to share?
          </label>
          <textarea
            placeholder="Enter here"
            value={additionalInfo}
            onChange={handleAdditionalInfoChange}
            className="w-full min-h-32 p-5 border border-[#E5E7EB] rounded-xl outline-none focus:border-[#113254] text-[#1A1A2E] placeholder:text-[#9CA3AF] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
