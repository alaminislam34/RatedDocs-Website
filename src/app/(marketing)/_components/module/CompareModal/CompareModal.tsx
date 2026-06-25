"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";
import {
  getBookingDraft,
  setSelectedDentistsForBooking,
} from "@/lib/storage/bookingService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LANG_CODE: Record<string, string> = {
  English: "EN",
  Spanish: "ES",
  French: "FR",
  Portuguese: "PT",
  German: "DE",
  Italian: "IT",
  Mandarin: "ZH",
  Japanese: "JA",
};

const langAbbr = (languages: string[]) =>
  languages.map((l) => LANG_CODE[l] ?? l.slice(0, 2).toUpperCase()).join(", ");

const estimateLow = (price: number) => Math.round((price * 2.2) / 20) * 20;

const estimateHigh = (price: number) => Math.round((price * 2.87) / 20) * 20;

export default function CompareModal() {
  const {
    showCompareModal,
    setShowCompareModal,
    setShowBookingModal,
    setSelectedDentistId,
    compareModalPurpose,
    setCompareModalPurpose,
    selectedDentistId,
    schedule,
    dentistsToCompare,
  } = useStateContext();

  const router = useRouter();
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isPostBooking = compareModalPurpose === "postBooking";

  useEffect(() => {
    if (!showCompareModal) return;

    const timeoutId = window.setTimeout(() => {
      if (dentistsToCompare.length > 0) {
        setDentists(dentistsToCompare);
        setSelectedIds(dentistsToCompare.map((d) => d.id));
        return;
      }

      // Fallback: load from storage (postBooking flow or direct open)
      const stored = getDentistsFromStorage();
      if (isPostBooking && selectedDentistId) {
        const main = stored.find((d) => d.id === selectedDentistId);
        const others = stored.filter((d) => d.id !== selectedDentistId);
        const list = main ? [main, ...others.slice(0, 2)] : stored.slice(0, 3);
        setDentists(list);
        setSelectedIds([selectedDentistId]);
      } else {
        setDentists(stored.slice(0, 3));
        setSelectedIds([]);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [showCompareModal, dentistsToCompare, isPostBooking, selectedDentistId]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };
  // please here add some console to debug this function
  const handleBook = () => {
    if (selectedIds.length === 0) return;
    setSelectedDentistId(selectedIds[0]);
    const selectedDentists = dentists.filter((dentist) =>
      selectedIds.includes(dentist.id),
    );
    const backendIds = selectedDentists
      .map((dentist) => dentist.backendId ?? Number(dentist.id))
      .filter((id) => Number.isFinite(id));

    setSelectedDentistsForBooking(selectedIds, backendIds);

    if (schedule) {
      const draft = getBookingDraft();
      const q = selectedIds.join(",");
      const params = new URLSearchParams();
      if (q) params.set("dentistIds", q);
      if (draft.consultationId) {
        params.set("consultationId", String(draft.consultationId));
      }
      router.push(`/schedule?${params.toString()}`);
      return;
    }
    if (isPostBooking) {
      const q = selectedIds.join(",");
      const draft = getBookingDraft();
      const params = new URLSearchParams();
      params.set("dentistIds", q);
      if (draft.consultationId) {
        params.set("consultationId", String(draft.consultationId));
      }
      setShowCompareModal(false);
      setCompareModalPurpose("compare");
      router.push(`/schedule?${params.toString()}`);
    } else {
      setShowCompareModal(false);
      setShowBookingModal("startBooking");
    }
  };

  const colCount = dentists.length;

  return (
    <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
      <DialogContent className="sm:max-w-4xl w-11/12 mx-auto p-0 rounded-xl overflow-hidden bg-white max-h-[92vh] flex flex-col">
        <DialogTitle className="sr-only">
          {isPostBooking
            ? "Your personalised estimates are ready"
            : "Compare Dentists"}
        </DialogTitle>

        {/* ── Header ── */}
        <div className="shrink-0 px-8 py-6 border-b border-border">
          {isPostBooking ? (
            <>
              <h2 className="text-2xl font-bold text-foreground">
                Your personalised estimates are ready
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Select a dentist to continue
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground">
                Compare Dentists
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Compare verified dentist data, not marketing claims
              </p>
            </>
          )}
        </div>

        {/* ── Scrollable table ── */}
        <div className="flex-1 overflow-auto">
          <div style={{ minWidth: `${200 + colCount * 220}px` }}>
            {/* Dentist header row */}
            <div
              className="px-8 pt-8 pb-4"
              style={{
                display: "grid",
                gridTemplateColumns: `180px repeat(${colCount}, 1fr)`,
              }}
            >
              <div />
              {dentists.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col items-center text-center px-4"
                >
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    width={80}
                    height={80}
                    className="size-20 rounded-full object-cover bg-muted mb-4"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      type="button"
                      aria-label={`${selectedIds.includes(doc.id) ? "Deselect" : "Select"} ${doc.name}`}
                      onClick={() => toggleSelect(doc.id)}
                      className="shrink-0 transition-transform active:scale-90"
                    >
                      {selectedIds.includes(doc.id) ? (
                        <CheckCircle2 className="size-5 fill-primary text-primary stroke-white" />
                      ) : (
                        <Circle
                          className={`size-5 transition-colors ${
                            selectedIds.length >= 2
                              ? "text-gray-200 cursor-not-allowed"
                              : "text-gray-400 hover:text-primary"
                          }`}
                        />
                      )}
                    </button>
                    <span className="text-[15px] font-semibold text-foreground">
                      {doc.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground mb-2">
                    {doc.specialty}
                  </span>
                  {isPostBooking && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground">
                      96% Estimate accuracy
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            <Row
              label="RDV SCORE"
              colCount={colCount}
              values={dentists.map((d) => `${d.rdvScore}/100`)}
            />
            <Row
              label="EXPERIENCE"
              colCount={colCount}
              values={dentists.map((d) => `${d.experience} years`)}
            />
            <Row
              label="PATIENT RATING"
              colCount={colCount}
              values={dentists.map((d) => (
                <span
                  key={d.id}
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">
                    {d.rating}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({d.reviewCount} Reviews)
                  </span>
                </span>
              ))}
            />
            <Row
              label="LOCATION"
              colCount={colCount}
              values={dentists.map((d) => d.location)}
            />
            <Row
              label="LANGUAGES"
              colCount={colCount}
              values={dentists.map((d) => langAbbr(d.languages))}
            />
            <Row
              label="ESTIMATE RANGE"
              colCount={colCount}
              isLast={!isPostBooking}
              values={dentists.map((d) =>
                isPostBooking ? (
                  <span key={d.id} className="text-lg font-bold text-primary">
                    ${estimateLow(d.price).toLocaleString()} – $
                    {estimateHigh(d.price).toLocaleString()}
                  </span>
                ) : (
                  <span key={d.id} className="text-lg font-bold text-primary">
                    ${d.price.toLocaleString()}
                  </span>
                ),
              )}
            />

            {/* Guarantee banner — post-booking only */}
            {isPostBooking && (
              <div className="px-8 py-4 border-b border-border">
                <div className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                  <ShieldCheck className="size-4 shrink-0 text-primary" />
                  <p className="text-sm text-primary font-medium text-center">
                    These estimates are binding and protected by the No Surprise
                    Guarantee.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex flex-col items-center gap-3 border-t border-border px-8 py-7">
          <button
            onClick={handleBook}
            disabled={selectedIds.length === 0}
            className="inline-flex items-center gap-3 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
          >
            <span>
              {schedule
                ? `Schedule ${selectedIds.length} Consult${selectedIds.length !== 1 ? "s" : ""}`
                : isPostBooking
                  ? `Schedule ${selectedIds.length} Consult${selectedIds.length !== 1 ? "s" : ""}`
                  : "Book consultation"}
            </span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">
              {selectedIds.length}
            </span>
          </button>

          {isPostBooking ? (
            <p className="text-sm text-muted-foreground text-center">
              You&apos;ll only fill in your details once.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              By continuing you are agree with our{" "}
              <button className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
                terms and Conditions
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({
  label,
  values,
  colCount,
  isLast = false,
}: {
  label: string;
  values: React.ReactNode[];
  colCount: number;
  isLast?: boolean;
}) {
  return (
    <div
      className={`px-8 py-5 items-center ${isLast ? "" : "border-b border-border"}`}
      style={{
        display: "grid",
        gridTemplateColumns: `180px repeat(${colCount}, 1fr)`,
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {values.map((val, i) => (
        <div
          key={i}
          className="px-4 text-center text-[15px] font-medium text-foreground"
        >
          {val}
        </div>
      ))}
    </div>
  );
}
