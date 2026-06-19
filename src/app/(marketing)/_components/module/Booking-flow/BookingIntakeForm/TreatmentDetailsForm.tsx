"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { getBookingData, updateTreatmentDetails } from "@/lib/storage/bookingService";

export default function TreatmentDetailsForm() {
  const initialData = getBookingData();
  const [budget, setBudget] = useState(initialData.budget);
  const [travelFrom, setTravelFrom] = useState(initialData.travelFrom);
  const [travelTo, setTravelTo] = useState(initialData.travelTo);

  const handleBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
    updateTreatmentDetails({ budget: e.target.value });
  };

  const handleTravelFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTravelFrom(e.target.value);
    updateTreatmentDetails({ travelFrom: e.target.value });
  };

  const handleTravelTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTravelTo(e.target.value);
    updateTreatmentDetails({ travelTo: e.target.value });
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-8">
        Help us create your estimate comparison
      </h2>

      <div className="space-y-6">
        {/* Budget */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#4B5563]">
            Approximate budget
          </label>
          <div className="flex items-center h-14 w-full border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:border-[#113254] transition-colors">
            <div className="flex items-center justify-center w-12 h-full bg-[#F9FAFB] border-r border-[#E5E7EB] shrink-0">
              <span className="text-[#9CA3AF] font-medium">$</span>
            </div>
            <input
              type="text"
              placeholder="10,500"
              value={budget}
              onChange={handleBudget}
              className="flex-1 px-4 h-full outline-none text-[#1A1A2E] font-semibold text-[16px] bg-white"
            />
          </div>
        </div>

        {/* Travel dates */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#4B5563]">
            When are you planning to travel?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              placeholder="06/10/2025"
              value={travelFrom}
              onChange={handleTravelFrom}
            />
            <DateInput
              placeholder="24/10/2025"
              value={travelTo}
              onChange={handleTravelTo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative flex items-center h-14 border border-[#E5E7EB] rounded-xl focus-within:border-[#113254] transition-colors">
      <input
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full px-5 pr-12 outline-none text-[#1A1A2E] font-semibold text-[16px] bg-transparent"
      />
      <CalendarDays className="absolute right-4 w-5 h-5 text-[#6B7280] pointer-events-none" />
    </div>
  );
}
