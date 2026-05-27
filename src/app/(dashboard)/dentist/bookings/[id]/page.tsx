"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getSubmittedBookings,
  SubmittedBooking,
} from "@/lib/storage/bookingService";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  KeyRound,
  ShieldCheck,
  Target,
  Check,
  Info,
} from "lucide-react";
import CreateFinalTreatmentPlanModal from "@/app/modules/dentist/booking-manage/create-final-treatment-plan-modal";

// ─── Types ─────────────────────────────────────────────────────────────────────
type BookingStep =
  | "before_arrival"
  | "patient_in_travel"
  | "day1_arrival"
  | "final_plan";

const STEP_VALUES: Record<BookingStep, number> = {
  before_arrival: 0,
  patient_in_travel: 1,
  day1_arrival: 2,
  final_plan: 3,
};

// ─── Demo / fallback data ──────────────────────────────────────────────────────
const DEMO_BOOKING = {
  id: "demo",
  name: "Jacob Smith",
  email: "Jacob.smith@sample.com",
  initials: "AH",
  procedure: "All-on-4 Full Arch",
  budget: "$1,200",
  travelFrom: "12–24 Jan, 2024",
  travelTo: "12–24 Jan, 2024",
  lastVisited: "Wed 24 Jan, 2024",
  conditions: "Bone loss, Gum Disease",
};

const STEP_STORAGE_PREFIX = "booking_step_";

// ─── Sub-components ────────────────────────────────────────────────────────────

function TimelineIcon({ status }: { status: "completed" | "current" | "pending" }) {
  if (status === "completed") {
    return (
      <div className="shrink-0 w-6 h-6 rounded-full bg-[#0A2540] flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (status === "current") {
    return (
      <div className="shrink-0 w-6 h-6 rounded-full border-2 border-[#0A2540] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#0A2540]" />
      </div>
    );
  }
  return (
    <div className="shrink-0 w-6 h-6 rounded-full border-2 border-slate-200" />
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [booking, setBooking] = useState<SubmittedBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<BookingStep>("day1_arrival");
  const [arrivalCode, setArrivalCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [planSubmitted, setPlanSubmitted] = useState(false);
  const [treatmentPlanOpen, setTreatmentPlanOpen] = useState(true);

  // Load booking + persisted step
  useEffect(() => {
    if (!id) {
      router.push("/dentist/bookings");
      return;
    }
    try {
      const bookings = getSubmittedBookings();
      const found = bookings.find((b) => b.id === id) ?? null;
      setBooking(found);

      // Restore saved step from localStorage
      const savedStep = localStorage.getItem(`${STEP_STORAGE_PREFIX}${id}`);
      if (savedStep && savedStep in STEP_VALUES) {
        setStep(savedStep as BookingStep);
      }
    } catch {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const saveStep = (newStep: BookingStep) => {
    setStep(newStep);
    if (id) localStorage.setItem(`${STEP_STORAGE_PREFIX}${id}`, newStep);
  };

  // Build display data (real booking or demo fallback)
  const display = booking
    ? {
        name: `${booking.personalInfo.firstName} ${booking.personalInfo.lastName}`,
        email: booking.personalInfo.email,
        initials: `${booking.personalInfo.firstName[0] || ""}${booking.personalInfo.lastName[0] || ""}`,
        procedure: booking.procedure,
        budget: booking.budget || "$1,200",
        travelFrom: booking.travelFrom || "12–24 Jan, 2024",
        lastVisited: booking.dentalHistory?.lastVisit || "Wed 24 Jan, 2024",
        conditions:
          booking.dentalHistory?.conditions?.join(", ") || "Bone loss, Gum Disease",
      }
    : DEMO_BOOKING;

  const stepValue = STEP_VALUES[step];

  // Timeline status per step
  const timelineItems = [
    {
      label: "Payment Confirmed",
      detail: `${display.budget} held in escrow • April 30, 2026`,
      status: "completed" as const,
    },
    {
      label: "Patient in Travel",
      detail: "May 02, 2026",
      status: stepValue >= 1 ? ("completed" as const) : ("pending" as const),
    },
    {
      label: "Day 1 arrival, CBCT examination",
      detail: "May 03, 2026",
      status:
        stepValue >= 3
          ? ("completed" as const)
          : stepValue === 2
          ? ("current" as const)
          : ("pending" as const),
    },
    {
      label: "Final Treatment Plan Confirmed",
      detail: "May 02, 2026",
      status: planSubmitted ? ("completed" as const) : ("pending" as const),
    },
    {
      label: "Treatment Done",
      detail: "Waiting for review",
      status: "pending" as const,
    },
  ];

  // Arrival verification handler
  const handleVerify = async () => {
    if (arrivalCode.length !== 4) {
      setCodeError(true);
      return;
    }
    setCodeError(false);
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate API
    setIsVerifying(false);
    saveStep("final_plan");
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-8 w-52 bg-slate-200 rounded" />
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-slate-200 rounded" />
                <div className="h-3 w-28 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-10 w-28 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white rounded-2xl border border-slate-100" />
          <div className="h-72 bg-white rounded-2xl border border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* ── Back + Title ── */}
        <div>
          <button
            onClick={() => router.push("/dentist/bookings")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold">
            Treatment Detail
          </h1>
        </div>

        {/* ── Patient Info Card ── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Avatar + Name + Status */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8EEF2] flex items-center justify-center text-[#163E5C] font-bold text-base shrink-0">
                {display.initials}
              </div>
              <div>
                <div className="font-bold text-lg text-[#0F172A]">{display.name}</div>
                <div className="text-sm text-slate-500 mb-2">{display.email}</div>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  IN PROGRESS
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-14 w-px bg-slate-100" />

            {/* Procedure */}
            <div className="sm:text-center">
              <div className="text-xs text-slate-500 mb-1">Procedure</div>
              <div className="font-semibold text-[#0F172A]">{display.procedure}</div>
            </div>

            <div className="hidden sm:block h-14 w-px bg-slate-100" />

            {/* Budget */}
            <div className="sm:text-right">
              <div className="text-xs text-slate-500 mb-1">Estimate Budget</div>
              <div className="text-2xl font-bold text-[#0A2540]">{display.budget}</div>
              <div className="text-sm font-semibold text-[#D97706]">In Escrow</div>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Estimate Treatment Plan */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setTreatmentPlanOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-[#0F172A]">Estimate Treatment plan</span>
                {treatmentPlanOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {treatmentPlanOpen && (
                <div className="px-6 pb-6">
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs">
                            Procedure breakdown
                          </th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "Initial examination", price: "Included" },
                          { label: "CBCT scan (if needed)", price: "$693" },
                          { label: "Temporary prosthesis", price: "$1,039" },
                          { label: "Temporary prosthesis", price: "$1,200" },
                          { label: "Final fitting & adjustments", price: "$346" },
                        ].map((row, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-4 py-3 text-slate-500 text-xs">{row.label}</td>
                            <td className="px-4 py-3 text-right text-xs text-slate-600">
                              {row.price}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-slate-100 bg-slate-50">
                          <td className="px-4 py-3 font-bold text-[#163E5C] text-sm">
                            Estimate amount
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#163E5C] text-sm">
                            {display.budget}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* ── Step-based Section ── */}

            {/* Step: Day 1 Arrival Verification */}
            {step === "day1_arrival" && (
              <div className="space-y-4">
                {/* Dark verification banner */}
                <div className="bg-[#0A2540] rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        Patient Arrival Verification
                      </div>
                      <div className="text-slate-300 text-xs mt-0.5">
                        Ask the patient for their 4-digit arrival code
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full">
                    ACTION REQUIRED
                  </span>
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-700 leading-relaxed">
                    The patient received a unique arrival code when they booked. Ask
                    them to share it so you can verify their identity and confirm Day 1
                    arrival.
                  </p>
                </div>

                {/* Code input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Enter Arrival Code
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={arrivalCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setArrivalCode(val);
                        setCodeError(false);
                      }}
                      placeholder="e.g. 7429"
                      className={`flex-1 h-12 rounded-xl border px-4 text-base tracking-widest text-center font-mono bg-white focus:outline-none focus:ring-2 transition-all ${
                        codeError
                          ? "border-red-400 focus:ring-red-200"
                          : "border-slate-200 focus:ring-[#163E5C]/20 focus:border-[#163E5C]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={arrivalCode.length !== 4 || isVerifying}
                      className="h-12 px-6 rounded-xl bg-[#0A2540] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-[#0d2f50] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {isVerifying ? "Verifying…" : "Verify"}
                    </button>
                  </div>
                  {codeError && (
                    <p className="text-xs text-red-500 mt-1.5">
                      Please enter a valid 4-digit arrival code.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step: Final Treatment Plan */}
            {step === "final_plan" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-[#0F172A] text-base mb-5">
                  Final Treatment plan
                </h3>

                {planSubmitted ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-green-500" />
                    </div>
                    <p className="font-semibold text-slate-700">
                      Final Treatment Plan Submitted
                    </p>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Waiting for the patient to confirm the plan before treatment can
                      begin.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <Target className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                      Ensure your final treatment plan stays within 15% of the estimate
                      to uphold the No Surprise Guarantee. If it exceeds, the patient is
                      eligible for a full refund.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowFinalModal(true)}
                      className="w-full max-w-sm h-12 bg-[#0A2540] hover:bg-[#0d2f50] text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                      Create Final Plan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right Column: Patient Timeline ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit">
            <h4 className="font-bold text-[#0F172A] mb-6">Patient Timeline</h4>
            <ol className="space-y-0">
              {timelineItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* Icon + vertical connector */}
                  <div className="flex flex-col items-center">
                    <TimelineIcon status={item.status} />
                    {i < timelineItems.length - 1 && (
                      <div
                        className={`w-px flex-1 min-h-7 my-1 ${
                          item.status === "completed" ? "bg-[#0A2540]" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5">
                    <div
                      className={`font-semibold text-sm leading-tight ${
                        item.status === "pending" ? "text-slate-500" : "text-[#0F172A]"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.detail}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Dev Step Navigator (for demo) ── */}
        <div className="flex flex-wrap gap-2 mt-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="w-full text-xs text-slate-400 mb-1">
            Demo — simulate booking step:
          </p>
          {(
            [
              "before_arrival",
              "patient_in_travel",
              "day1_arrival",
              "final_plan",
            ] as BookingStep[]
          ).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => saveStep(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                step === s
                  ? "bg-[#0A2540] text-white border-[#0A2540]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* ── Create Final Treatment Plan Modal ── */}
      <CreateFinalTreatmentPlanModal
        isOpen={showFinalModal}
        onClose={() => setShowFinalModal(false)}
        onSubmit={() => {
          setPlanSubmitted(true);
          setShowFinalModal(false);
        }}
        estimateTotal={display.budget}
        patient={{
          name: display.name,
          email: display.email,
          initials: display.initials,
          procedure: display.procedure,
          budget: display.budget,
          travelDates: display.travelFrom,
          lastVisited: display.lastVisited,
          conditions: display.conditions,
        }}
      />
    </>
  );
}
