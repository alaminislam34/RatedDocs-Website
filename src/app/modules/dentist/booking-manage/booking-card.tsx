"use client";

import { useRouter } from "next/navigation";

interface BookingCardProps {
  id?: string;
  name?: string;
  email?: string;
  initials?: string;
  procedure?: string;
  budget?: string;
  status?: string;
  dates?: string;
  timelineLabel?: string;
  timelineStatus?: string;
}

export default function BookingCard({
  id,
  name = "Jacob Smith",
  email = "Jacob.smith@sample.com",
  initials = "AH",
  procedure = "Dental Implants",
  budget = "$1254",
  status = "In Escrow",
  dates = "12–24 Jan, 2024",
  timelineLabel = "Timeline",
  timelineStatus = "Patient in Travel",
}: BookingCardProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    if (id) {
      router.push(`/dentist/bookings/${id}`);
    }
  };

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm font-sans">
      <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-center w-14 h-14 bg-[#F1F5F9] rounded-full text-[#1E3A8A] font-bold text-base tracking-wide shrink-0">
          {initials}
        </div>
        <div className="space-y-0.5 min-w-0">
          <h2 className="text-xl font-bold text-[#0F172A] truncate">{name}</h2>
          <p className="text-[15px] text-[#0F172A] font-medium opacity-80 truncate">
            {email}
          </p>
        </div>
      </div>

      <div className="py-5 grid grid-cols-12 gap-2 border-b border-gray-100">
        <div className="col-span-5 space-y-1">
          <span className="text-[14px] text-[#64748B] font-medium">
            Treatment Procedure
          </span>
          <h3 className="text-[17px] font-bold text-[#0F172A]">{procedure}</h3>
        </div>
        <div className="col-span-3 space-y-1">
          <span className="text-[14px] text-[#64748B] font-medium">
            Est. Budget
          </span>
          <h3 className="text-[17px] font-bold text-[#0F172A]">{budget}</h3>
        </div>
        <div className="col-span-4 flex items-center justify-end">
          <span className="text-[17px] font-bold text-[#D97706]">{status}</span>
        </div>
      </div>

      <div className="py-5 border-b border-gray-100 space-y-1">
        <span className="text-[14px] text-[#64748B] font-medium">
          Traveling Dates
        </span>
        <h3 className="text-[17px] font-bold text-[#0F172A]">{dates}</h3>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between w-full h-12 px-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
          <span className="text-[15px] font-medium text-[#334155]">
            {timelineLabel}
          </span>
          <span className="text-[15px] font-bold text-[#0F172A]">
            {timelineStatus}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleViewDetail}
          className="w-full h-12 flex items-center justify-center border border-[#163E5C] text-[#163E5C] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] rounded-xl font-bold text-base transition-colors"
        >
          View Detail
        </button>
      </div>
    </div>
  );
}
