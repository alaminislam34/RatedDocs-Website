"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ConsultationFlowItem } from "../MyBooking/data";

interface RescheduleConsultationModalProps {
  open: boolean;
  onClose: () => void;
  consultation: ConsultationFlowItem;
  onAddToCalendar?: () => void;
  onConfirmed?: () => void;
}

const TIME_ZONES = [
  "EST (UTC -05:00)",
  "CST (UTC -06:00)",
  "PST (UTC -08:00)",
  "GMT (UTC +00:00)",
];

const TIME_SLOTS = [
  "10:30 to 10:45",
  "10:45 to 11:00",
  "11:00 to 11:15",
  "11:15 to 11:30",
  "11:30 to 11:45",
  "12:00 to 12:15",
];

export function RescheduleConsultationModal({
  open,
  onClose,
  consultation,
  onAddToCalendar,
  onConfirmed,
}: RescheduleConsultationModalProps) {
  const [phase, setPhase] = useState<"choose" | "success">("choose");
  const [selectedZone, setSelectedZone] = useState(TIME_ZONES[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);

  const selectedDate = useMemo(() => {
    return (consultation.status as string) === "missed"
      ? "Thursday 16 April 2026"
      : consultation.date;
  }, [consultation.date, consultation.status]);

  const handleClose = () => {
    setPhase("choose");
    onClose();
  };

  const handleConfirm = () => {
    setPhase("success");
    onConfirmed?.();
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-220 rounded-[28px] border-0 p-0 shadow-[0_24px_80px_rgba(15,23,42,0.2)]"
        showCloseButton={false}
      >
        {phase === "choose" ? (
          <div>
            <div className="flex items-center justify-between border-b border-[#EEF2F6] px-5 py-4 md:px-6">
              <DialogTitle className="text-[18px] font-bold text-[#1A1A2E]">
                Book new slot
              </DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                className="size-9 rounded-full flex items-center justify-center text-[#6B7280] transition-colors hover:bg-slate-100 hover:text-[#1A1A2E]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 md:px-6">
              <div>
                <p className="text-[16px] font-bold text-[#1A1A2E]">
                  Pick an available slot
                </p>
                <p className="mt-1 text-[12px] text-[#6B7280]">
                  These are Dr. {consultation.doctor.name.replace("Dr. ", "")}
                  &apos;s available times in the next 24 hours. Choose one to
                  rebook your consultation.
                </p>
              </div>

              <div className="rounded-xl border border-[#E6EEF6] bg-white p-0">
                <div className="px-4 py-4 md:px-5">
                  <p className="text-[16px] font-bold text-[#0F3659]">
                    {selectedDate}
                  </p>
                </div>

                <div className="border-t border-[#E6EEF6] px-4 py-4 md:px-5">
                  <label className="mb-2 block text-[13px] font-semibold text-[#1A1A2E]">
                    Select Time Zone
                  </label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="h-12 rounded-xl border-[#E5E7EB] bg-white text-[14px] text-[#1A1A2E] focus:ring-[#113254]">
                      <SelectValue placeholder="Select Time Zone" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#E5E7EB]">
                      {TIME_ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone} className="py-3">
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-5">
                    <p className="mb-3 text-[13px] font-semibold text-[#1A1A2E]">
                      Select Time
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = slot === selectedSlot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                              isSelected
                                ? "border-[#113254] bg-[#F1F6FB] text-[#113254]"
                                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#113254]/30"
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
            </div>

            <div className="flex items-center justify-end border-t border-[#EEF2F6] px-5 py-4 md:px-6">
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-xl bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95"
              >
                Confirm Slot
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-10 text-center md:px-10 md:py-14">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#113254] text-white shadow-[0_8px_24px_rgba(17,50,84,0.25)]">
              <Check className="size-10 stroke-[3px]" />
            </div>
            <h3 className="mt-8 text-[28px] font-bold text-[#1A1A2E]">
              New slot confirmed
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#64748B]">
              Your consultation with {consultation.doctor.name} is rebooked for{" "}
              {selectedDate} during {selectedSlot} in {selectedZone}. Don&apos;t
              miss it, this is your last chance.
            </p>
            <button
              type="button"
              onClick={() => {
                onAddToCalendar?.();
                handleClose();
              }}
              className="mt-8 rounded-xl bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95"
            >
              Add to calendar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
