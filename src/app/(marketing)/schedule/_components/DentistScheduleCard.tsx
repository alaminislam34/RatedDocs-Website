"use client";
import Image from "next/image";
import { Clock, Video, ChevronDown, MapPin } from "lucide-react";
import MiniCalendar from "./MiniCalendar";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DentistSelection {
  dentistId: string;
  date: Date | null;
  timeSlot: string;
  timezone: string;
}

interface DentistScheduleCardProps {
  dentist: Dentist;
  selection: DentistSelection;
  onUpdate: (updates: Partial<Omit<DentistSelection, "dentistId">>) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIMEZONES = [
  "Eastern Time (EST, UTC-5)",
  "Central Time (CST, UTC-6)",
  "Mountain Time (MST, UTC-7)",
  "Pacific Time (PST, UTC-8)",
  "Greenwich Mean Time (GMT, UTC+0)",
  "Central European Time (CET, UTC+1)",
  "Mexico City Time (CST, UTC-6)",
  "Australia Eastern (AEST, UTC+10)",
];

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 10; h < 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      const toM = m + 15;
      const toH = toM >= 60 ? h + 1 : h;
      const toMm = toM % 60;
      if (toH > 17 || (toH === 17 && toMm > 0)) break;
      const fmt = (hh: number, mm: number) =>
        `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
      slots.push(`${fmt(h, m)} to ${fmt(toH, toMm)}`);
    }
  }
  return slots;
})();

const estimateLow = (price: number) => Math.round((price * 2.2) / 20) * 20;

// ─── Component ────────────────────────────────────────────────────────────────

export default function DentistScheduleCard({
  dentist,
  selection,
  onUpdate,
}: DentistScheduleCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E9EDEE] overflow-hidden shadow-sm">
      {/* ── Doctor header ── */}
      <div className="flex items-start justify-between gap-4 p-6 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-4">
          <Image
            src={dentist.image}
            alt={dentist.name}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover shrink-0 bg-gray-100"
          />
          <div>
            <p className="font-bold text-[16px] text-[#1A1A2E]">
              {dentist.name}
            </p>
            <p className="text-[14px] text-[#6B7280]">{dentist.specialty}</p>
            <p className="flex items-center gap-1 text-[13px] text-[#9CA3AF] mt-0.5">
              <MapPin className="size-3.5 shrink-0" />
              {dentist.location}
            </p>
          </div>
        </div>

        {/* Estimate */}
        <div className="text-right shrink-0">
          <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide">
            Estimate Budget
          </p>
          <p className="text-[22px] font-black text-[#113254]">
            ${estimateLow(dentist.price).toLocaleString()}
          </p>
          <span className="inline-block text-[11px] font-semibold text-[#113254] bg-[#EBF4FF] px-2 py-0.5 rounded-full">
            96% Accuracy
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Consultation info ── */}
        <div>
          <p className="text-[13px] font-semibold text-[#4B5563] mb-3">
            Consultation
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2 text-[13px] text-[#374151]">
              <Clock className="size-4 text-[#9CA3AF] shrink-0" />
              15 Minutes
            </span>
            <span className="flex items-center gap-2 text-[13px] text-[#374151]">
              <Video className="size-4 text-[#9CA3AF] shrink-0" />
              Video Call{" "}
              <span className="text-[#9CA3AF]">(link sent to your email)</span>
            </span>
          </div>
        </div>

        {/* ── Calendar ── */}
        <div>
          <p className="text-[13px] font-semibold text-[#4B5563] mb-3">
            Select Availability
          </p>
          <MiniCalendar
            selected={selection.date}
            onSelect={(date) => onUpdate({ date })}
          />
        </div>

        {/* ── Timezone ── */}
        <div>
          <p className="text-[13px] font-semibold text-[#4B5563] mb-2">
            Select Time Zone
          </p>
          <div className="relative">
            <select
              value={selection.timezone}
              onChange={(e) => onUpdate({ timezone: e.target.value })}
              className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-[#E5E7EB] rounded-xl text-[13px] text-[#374151] outline-none focus:border-[#113254] transition-colors cursor-pointer"
            >
              <option value="">Select Time Zone</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        {/* ── Time slots ── */}
        <div>
          <p className="text-[13px] font-semibold text-[#4B5563] mb-2">
            Select Time
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {TIME_SLOTS.map((slot) => {
              const isActive = selection.timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onUpdate({ timeSlot: slot })}
                  className={`shrink-0 px-3 py-2 rounded-lg border text-[12px] font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#113254] text-white border-[#113254]"
                      : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#113254] hover:text-[#113254]"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
