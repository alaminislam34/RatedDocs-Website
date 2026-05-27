import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Star,
} from "lucide-react";
import { getStatusBadgeClasses, type PatientRecord } from "./patients-data";

interface PatientDetailsProps {
  patient: PatientRecord;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <ChevronDown className="size-5 text-muted-foreground" />
        </div>
      </div>
      {children}
    </div>
  );
}

function TableRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-3 last:border-b-0">
      <p
        className={`text-sm ${muted ? "text-muted-foreground" : "text-foreground"}`}
      >
        {label}
      </p>
      <p
        className={`text-sm ${muted ? "text-muted-foreground" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}

function MetricStars({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(5)].map((_, index) => (
        <Star key={index} size={13} fill="currentColor" stroke="none" />
      ))}
      <span className="ml-1 text-xs font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function TimelineEvent({
  title,
  subtitle,
  isLast = false,
}: {
  title: string;
  subtitle?: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-card text-primary">
          <CheckCircle2
            size={18}
            fill="currentColor"
            className="text-white stroke-primary stroke-[2.5]"
          />
        </div>
        {!isLast && <div className="min-h-10 w-0.5 bg-border my-1" />}
      </div>
      <div className="pb-6">
        <h4 className="text-xs font-bold text-foreground">{title}</h4>
        {subtitle && (
          <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PatientDetails({ patient }: PatientDetailsProps) {
  const showFinalPlan =
    patient.finalBreakdown.length > 0 || patient.treatmentPlan === "rejected";
  const shouldShowReview = Boolean(patient.review);
  const finalPlanBadge =
    patient.treatmentPlan === "accepted"
      ? "Within 15% protected range"
      : patient.treatmentPlan === "rejected"
        ? "Exceed 15% protected range"
        : patient.treatmentPlan === "awaiting response"
          ? "Awaiting patient approval"
          : "Draft pending review";
  const finalPlanBadgeClasses =
    patient.treatmentPlan === "accepted"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : patient.treatmentPlan === "rejected"
        ? "border-rose-200 bg-rose-50 text-rose-600"
        : patient.treatmentPlan === "awaiting response"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dentist/patients"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
          Treatment Detail
        </h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
              {patient.avatarInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {patient.name}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                {patient.email}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                  patient.status,
                )}`}
              >
                {patient.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-border pt-4 sm:grid-cols-3 sm:border-t-0 sm:pt-0">
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Procedure
              </span>
              <span className="mt-1 block text-sm font-semibold text-foreground">
                {patient.procedure}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Final Budget
              </span>
              <span className="mt-1 block text-xl font-black text-primary">
                {patient.finalBudget}
              </span>
              <span className="mt-0.5 block text-xs font-bold text-emerald-600">
                {patient.paymentStatus}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 sm:text-right">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Estimate Total
              </span>
              <span className="mt-1 block text-xl font-black text-primary">
                {patient.estimateTotal}
              </span>
              <span className="mt-0.5 block text-xs font-bold text-muted-foreground">
                {patient.finalStatusTag || "Estimate sent"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {patient.treatmentNote && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            patient.treatmentPlan === "rejected"
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {patient.treatmentNote}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Estimate Treatment plan">
            <div className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <p className="text-sm font-semibold text-foreground">
                  Procedure breakdown
                </p>
                <p className="text-sm font-semibold text-foreground">Price</p>
              </div>
              {patient.estimateBreakdown.map((item) => (
                <TableRow
                  key={item.label}
                  label={item.label}
                  value={item.price}
                  muted={item.price === "Included"}
                />
              ))}
              <div className="flex items-center justify-between border-t border-border px-5 py-4">
                <p className="text-sm font-semibold text-primary">
                  Estimate amount
                </p>
                <p className="text-sm font-bold text-primary">
                  {patient.estimateTotal}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Final treatment plan">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-foreground">
                  Final treatment plan
                </p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${finalPlanBadgeClasses}`}
                >
                  <ShieldCheck size={12} /> {finalPlanBadge}
                </span>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {showFinalPlan ? (
              <>
                <div className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <p className="text-sm font-semibold text-foreground">
                      Procedure breakdown
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Price
                    </p>
                  </div>
                  {patient.finalBreakdown.length > 0 ? (
                    patient.finalBreakdown.map((item) => (
                      <TableRow
                        key={item.label}
                        label={item.label}
                        value={item.price}
                        muted={item.price === "Included"}
                      />
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No final plan has been added yet.
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-border px-5 py-4">
                    <p className="text-sm font-semibold text-primary">
                      Final total
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {patient.finalTotal}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                Final treatment plan will appear here after approval.
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-foreground">Patient Timeline</h3>
            <div className="relative mt-6 space-y-0 pl-1">
              {patient.timeline.map((event, index) => (
                <TimelineEvent
                  key={`${event.event}-${event.date}`}
                  title={event.event}
                  subtitle={`${event.details} • ${event.date}`}
                  isLast={index === patient.timeline.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-foreground">Payment Received</h3>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <span className="font-medium text-foreground/70">
                Payment received from escrow
              </span>
              <span className="text-base font-bold text-foreground">
                {patient.paymentReceivedFromEscrow}
              </span>
            </div>

            {patient.attachedDocument && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-500">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {patient.attachedDocument.fileName}
                    </h4>
                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                      {patient.attachedDocument.fileSize}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {shouldShowReview && patient.review && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div>
            <h3 className="mb-2 font-bold text-foreground">Review</h3>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              {patient.review.text}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-border pt-4 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Communication
              </span>
              <MetricStars value={patient.review.ratings.communication} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Value for money
              </span>
              <MetricStars value={patient.review.ratings.valueForMoney} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Follow through
              </span>
              <MetricStars value={patient.review.ratings.followThrough} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
