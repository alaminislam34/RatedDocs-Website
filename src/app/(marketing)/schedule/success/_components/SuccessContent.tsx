"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Video } from "lucide-react";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredSelection {
  dentistId: string;
  date: string;
  timeSlot: string;
  timezone: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

// ─── SuccessContent ───────────────────────────────────────────────────────────

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dentistIdsParam = searchParams.get("dentistIds") ?? "";

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [selections, setSelections] = useState<StoredSelection[]>([]);

  useEffect(() => {
    const all = getDentistsFromStorage();
    const ids = dentistIdsParam
      ? dentistIdsParam.split(",").map((s) => s.trim())
      : [];
    const found = ids.length
      ? all.filter((d) => ids.includes(d.id))
      : all.slice(0, 2);
    setDentists(found.length ? found : all.slice(0, 2));

    // Read appointment data from sessionStorage
    try {
      const raw = sessionStorage.getItem("schedule_selections");
      if (raw) setSelections(JSON.parse(raw) as StoredSelection[]);
    } catch {
      // sessionStorage unavailable — leave empty, render with fallback
    }
  }, [dentistIdsParam]);

  const getSelection = (dentistId: string): StoredSelection | undefined =>
    selections.find((s) => s.dentistId === dentistId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#F9FAFB]">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl px-8 pt-10 pb-8 flex flex-col items-center text-center">
        {/* Check icon */}
        <div className="size-16 rounded-full bg-[#113254] flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle2 className="size-9 text-white fill-white stroke-[#113254]" />
        </div>

        {/* Title */}
        <h2 className="text-[24px] font-black text-[#1A1A2E] mb-2 leading-tight">
          You&apos;re booked with{" "}
          {dentists
            .map((d, i) =>
              i === 0 ? d.name : `Dr ${d.name.split(" ").slice(-1)[0]}`,
            )
            .join(" and ")}
        </h2>
        <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-sm">
          Your dentist will review your details before the consultation. Please
          have your photos, any X-rays, and a list of questions ready.
        </p>

        {/* Appointment summary */}
        <div className="w-full mt-6 rounded-2xl border border-[#E9EDEE] overflow-hidden">
          {dentists.map((doc) => {
            const sel = getSelection(doc.id);
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-4 p-4 border-b border-[#F3F4F6] last:border-b-0 text-left"
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
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5 flex items-center justify-end gap-1">
                    {sel?.timeSlot ?? "—"}
                    {" · "}
                    <Video className="size-3.5 inline shrink-0" />
                    {" "}15-min video call
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => router.push("/patient/bookings")}
          className="mt-6 px-8 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[15px] rounded-xl active:scale-95 transition-all"
        >
          Go to my Bookings
        </button>
      </div>
    </div>
  );
}
