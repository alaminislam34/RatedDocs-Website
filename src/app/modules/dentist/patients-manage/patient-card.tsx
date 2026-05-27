"use client";

import { Calendar } from "lucide-react";
import type { PatientRecord } from "./patients-data";
import {
  getStatusBadgeClasses,
  getTreatmentPlanBadgeClasses,
} from "./patients-data";

interface PatientCardProps {
  patient: PatientRecord;
  mode: "consultations" | "bookings";
  onViewDetails: (patient: PatientRecord) => void;
}

function PatientCard({ patient, mode, onViewDetails }: PatientCardProps) {
  const primaryLabel = mode === "bookings" ? "Appointment" : "Treatment Plan";
  const secondaryValue =
    mode === "bookings" ? patient.appointmentDate : patient.consultationSummary;

  return (
    <article className="group w-full rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-border/80 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] lg:items-center lg:gap-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#0F2745] to-[#163E5C] text-base font-semibold tracking-tight text-white sm:size-14 sm:text-lg">
            {patient.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">
              {patient.name}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {patient.procedure}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <span aria-hidden="true">🇬🇧</span>
              <span className="truncate">{patient.country}</span>
              <span className="text-border">·</span>
              <span className="font-mono text-foreground/70">
                {patient.patientCode}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:block">
          <Calendar className="size-4 shrink-0 text-muted-foreground lg:hidden" />
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase lg:normal-case lg:tracking-normal">
              {primaryLabel}
            </p>
            <p className="truncate text-sm font-medium text-foreground sm:text-base">
              {secondaryValue}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase lg:normal-case lg:tracking-normal">
            {mode === "bookings" ? "Status" : "Treatment Plan"}
          </p>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
              mode === "bookings"
                ? getStatusBadgeClasses(patient.status)
                : getTreatmentPlanBadgeClasses(patient.treatmentPlan)
            }`}
          >
            {mode === "bookings" ? patient.status : patient.treatmentPlan}
          </span>
        </div>

        <div className="flex items-baseline gap-2 lg:block">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase lg:normal-case lg:tracking-normal">
            {mode === "bookings" ? "Amount" : "Estimate"}
          </p>
          <p className="text-base font-semibold text-foreground sm:text-lg">
            {mode === "bookings" ? patient.amount : patient.approxBudget}
          </p>
        </div>

        <div className="lg:justify-self-end">
          <button
            type="button"
            onClick={() => onViewDetails(patient)}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#0F4C81] bg-card px-5 text-sm font-medium text-[#0F4C81] transition-all hover:bg-[#0F4C81] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]/30 sm:w-auto"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

interface PatientCardsSectionProps {
  patients: PatientRecord[];
  mode: "consultations" | "bookings";
  onViewDetails: (patient: PatientRecord) => void;
}

export default function PatientCardsSection({
  patients,
  mode,
  onViewDetails,
}: PatientCardsSectionProps) {
  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
        No patients found for the current filters.
      </div>
    );
  }
  return (
    <section className="space-y-3 sm:space-y-4" aria-label="Patient bookings">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          mode={mode}
          onViewDetails={onViewDetails}
        />
      ))}
    </section>
  );
}
