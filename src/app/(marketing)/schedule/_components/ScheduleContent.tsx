"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Video } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";
import { useStateContext } from "@/providers/StateProvider";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";
import DentistScheduleCard, {
  type DentistSelection,
} from "./DentistScheduleCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORED_KEY = "schedule_selections";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function makeSelection(dentistId: string): DentistSelection {
  return { dentistId, date: null, timeSlot: "", timezone: "" };
}

// ─── ScheduleContent ──────────────────────────────────────────────────────────

export default function ScheduleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setShowCompareModal } = useStateContext();

  const dentistIdsParam = searchParams.get("dentistIds") ?? "";

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [selections, setSelections] = useState<DentistSelection[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load dentists from storage filtered by URL param
  useEffect(() => {
    const all = getDentistsFromStorage();
    const ids = dentistIdsParam
      ? dentistIdsParam.split(",").map((s) => s.trim())
      : [];
    const found = ids.length
      ? all.filter((d) => ids.includes(d.id))
      : all.slice(0, 2);
    const list = found.length ? found : all.slice(0, 2);
    setDentists(list);
    setSelections(list.map((d) => makeSelection(d.id)));
  }, [dentistIdsParam]);

  const updateSelection = useCallback(
    (dentistId: string, updates: Partial<Omit<DentistSelection, "dentistId">>) => {
      setSelections((prev) =>
        prev.map((s) =>
          s.dentistId === dentistId ? { ...s, ...updates } : s,
        ),
      );
    },
    [],
  );

  const handleConfirm = () => {
    // Validate: each dentist must have a date and time slot
    const missing = selections.filter((s) => !s.date || !s.timeSlot);
    if (missing.length > 0) {
      const idx = selections.indexOf(missing[0]);
      const name = dentists[idx]?.name ?? "a dentist";
      toast.error(`Please select a date and time for ${name}`);
      return;
    }

    // Persist to sessionStorage so success page can read it
    const storable = selections.map((s) => ({
      dentistId: s.dentistId,
      date: s.date!.toISOString(),
      timeSlot: s.timeSlot,
      timezone: s.timezone,
    }));
    sessionStorage.setItem(STORED_KEY, JSON.stringify(storable));

    setShowSuccess(true);
  };

  const handleGoToBookings = () => {
    router.push("/patient/bookings");
  };

  return (
    <>
      {/* ── Page ── */}
      <div className="max-w-7xl w-11/12 mx-auto py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[26px] font-black text-[#1A1A2E] leading-tight">
              Book your free 15-minute video consultation
            </h1>
            <p className="mt-1 text-[14px] text-[#6B7280]">
              Choose a time that works for you. All times shown in your timezone
              (Eastern Time, UTC&#8209;5).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="shrink-0 px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-[14px] font-semibold text-[#1A1A2E] hover:bg-[#F9FAFB] transition-colors"
          >
            View Comparison
          </button>
        </div>

        {/* Dentist cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dentists.map((doc, i) => (
            <DentistScheduleCard
              key={doc.id}
              dentist={doc}
              selection={selections[i] ?? makeSelection(doc.id)}
              onUpdate={(updates) => updateSelection(doc.id, updates)}
            />
          ))}
        </div>

        {/* Confirm button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleConfirm}
            className="px-8 py-4 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[15px] rounded-xl active:scale-95 transition-all"
          >
            Confirm Video Consultation
          </button>
        </div>
      </div>

      {/* ── Success modal ── */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl">
          <DialogTitle className="sr-only">Booking confirmed</DialogTitle>

          <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
            {/* Check icon */}
            <div className="size-16 rounded-full bg-[#113254] flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle2 className="size-9 text-white fill-white stroke-[#113254]" />
            </div>

            {/* Title */}
            <h2 className="text-[22px] font-black text-[#1A1A2E] mb-2">
              You&apos;re booked with{" "}
              {dentists
                .map((d, i) => (i === 0 ? d.name : `Dr ${d.name.split(" ").slice(-1)[0]}`))
                .join(" and ")}
            </h2>
            <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-sm">
              Your dentist will review your details before the consultation.
              Please have your photos, any X-rays, and a list of questions ready.
            </p>

            {/* Booked appointments */}
            <div className="w-full mt-6 rounded-xl border border-[#E9EDEE] overflow-hidden">
              {dentists.map((doc, i) => {
                const sel = selections[i];
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-4 p-4 border-b border-[#F3F4F6] last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        width={48}
                        height={48}
                        className="size-12 rounded-full object-cover shrink-0 bg-gray-100"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[14px] text-[#1A1A2E] truncate">
                          {doc.name}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {doc.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-semibold text-[#1A1A2E]">
                        {sel?.date ? formatDate(sel.date) : "—"}
                      </p>
                      <p className="text-[12px] text-[#9CA3AF] flex items-center justify-end gap-1 mt-0.5">
                        {sel?.timeSlot
                          ? `${sel.timeSlot} ${sel.timezone ? "· " + sel.timezone.split(" ")[0] : ""}`.trim()
                          : ""}
                        {" · "}
                        <Video className="size-3.5 inline" /> 15-min video call
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleGoToBookings}
              className="mt-6 px-8 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[15px] rounded-xl active:scale-95 transition-all"
            >
              Go to my Bookings
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
