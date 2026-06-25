"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, Plus, Star } from "lucide-react";
import { AddToCalendarModal } from "./AddToCalendarModal";
import type { ConsultationFlowItem } from "../MyBooking/data";

interface ConsultationCardProps {
  consultation: ConsultationFlowItem;
  onPrimaryAction: () => void;
  onReschedule?: () => void;
}

export function ConsultationCard({
  consultation,
  onPrimaryAction,
  onReschedule,
}: ConsultationCardProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const appointment = {
    doctorName: consultation.doctor.name,
    specialty: consultation.doctor.specialty,
    avatarSrc: consultation.doctor.image,
    date: consultation.date,
    time: consultation.time,
    durationLabel: consultation.duration,
    isoDate: consultation.isoDate,
  };

  const showRescheduleAction = (consultation.status as string) === "missed";

  return (
    <>
      <div className="rounded-xl border border-[#CEE0F4] bg-white p-5 md:p-6 shadow-[0_1px_0_rgba(17,50,84,0.02)]">
        {consultation.alertMessage ? (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#FACC15]/40 bg-[#FFF7E6] px-4 py-3 text-[12px] leading-relaxed text-[#7A4A00]">
            <div className="mt-0.5 size-5 rounded-full bg-white flex items-center justify-center text-[#F59E0B] shrink-0">
              <CalendarDays className="size-3.5" />
            </div>
            <p>{consultation.alertMessage}</p>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr_0.9fr] lg:items-start">
          <div className="flex gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F8FAFC]">
              <Image
                src={consultation.doctor.image}
                alt={consultation.doctor.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1A2E]">
                  {consultation.doctor.name}
                </h3>
                <p className="text-[13px] font-medium text-[#6B7280]">
                  {consultation.doctor.specialty}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#9CA3AF]">
                <span className="flex items-center gap-1 text-[#113254] font-semibold">
                  <span className="text-[13px]">
                    {consultation.doctor.rating}
                  </span>
                  <span className="flex items-center gap-0.5 text-[#F5B000]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-3.5 fill-current" />
                    ))}
                  </span>
                </span>
                <span>({consultation.doctor.reviewCount} Ratings)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#10B981]">
                <CheckCircle2 className="size-4" />
                Verified
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEE0F4] px-3 py-1.5 text-[#1A1A2E]">
                <span className="text-[14px] font-black">
                  {consultation.rdvScore}
                </span>
                <span className="text-[11px] font-medium text-[#6B7280]">
                  RDV Score
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1 lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
              Procedure
            </p>
            <p className="text-[15px] font-bold text-[#1A1A2E]">
              {consultation.procedure}
            </p>
            <p className="text-[13px] text-[#6B7280]">
              {consultation.timezone}
            </p>
          </div>

          <div className="space-y-1 lg:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
              Estimate Budget
            </p>
            <p className="text-[18px] font-bold text-[#113254]">
              {consultation.estimateBudget}
            </p>
            <div className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-0.5">
              <span className="text-[11px] font-bold text-[#6B7280]">
                {consultation.accuracy}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-[#EEF2F6] pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-[15px] font-bold text-[#1A1A2E]">
              {consultation.date}
            </p>
            <p className="text-[13px] font-medium text-[#6B7280]">
              {consultation.time} · {consultation.duration}
            </p>
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#113254] transition-opacity hover:opacity-80"
            >
              <Plus className="size-4" />
              Add to calendar
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={onPrimaryAction}
              className={`w-full rounded-xl px-6 py-3 text-[14px] font-bold text-white transition-all active:scale-95 sm:w-auto ${
                showRescheduleAction
                  ? "bg-[#113254] hover:bg-[#0d2844]"
                  : "bg-[#113254] hover:bg-[#0d2844]"
              }`}
            >
              {consultation.primaryActionLabel}
            </button>
            {onReschedule ? (
              <button
                type="button"
                onClick={onReschedule}
                className="text-[13px] font-semibold text-[#113254] transition-colors hover:text-[#0d2844]"
              >
                Need another slot?
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <AddToCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        appointment={appointment}
      />
    </>
  );
}
