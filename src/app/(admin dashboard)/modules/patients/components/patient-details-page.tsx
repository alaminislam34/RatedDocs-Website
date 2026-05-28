"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { PatientOverviewTab } from "./patient-overview-tab";
import { PatientBookingsTab } from "./patient-bookings-tab";
import { PatientConsultationsTab } from "./patient-consultations-tab";
import { PatientDocumentsTab } from "./patient-documents-tab";
import patientsData from "@/lib/patients-data";

type MainTab = "overview" | "bookings" | "consultations" | "documents";

interface PatientDetailPageProps {
  patientId: string;
}

export default function PatientDetailPage({ patientId }: PatientDetailPageProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("overview");

  const patient = patientsData.patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-gray-500">Patient not found</p>
        <Link
          href="/admin/patients"
          className="mt-4 text-sm text-blue-600 underline underline-offset-2"
        >
          Back to patients
        </Link>
      </div>
    );
  }

  const { profile } = patient;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "bookings", label: "Bookings", count: profile.bookings.length },
    {
      key: "consultations",
      label: "Consultations",
      count: profile.consultations.length,
    },
    { key: "documents", label: "Documents", count: profile.documents.length },
  ];

  const detailStats = [
    {
      label: "Total Bookings",
      value: profile.stats.total_bookings.count.toString(),
      sub: `+${profile.stats.total_bookings.growth_this_month} this month`,
    },
    {
      label: "Amount Spent",
      value: `$${profile.stats.amount_spent.toLocaleString()}`,
      sub: "Lifetime value",
    },
    {
      label: "Reviews Written",
      value: profile.stats.reviews_written.count.toString(),
      sub:
        profile.stats.reviews_written.avg_rating > 0
          ? `Avg ${profile.stats.reviews_written.avg_rating} ★`
          : "No reviews yet",
    },
    {
      label: "Referrals Made",
      value: profile.referrals.total.toString(),
      sub: `${profile.referrals.credited} credited`,
    },
    {
      label: "Last Active",
      value: profile.stats.last_active,
      sub: "Last visit",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Breadcrumb + Edit ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/admin/patients"
            className="flex items-center gap-1.5 font-medium text-gray-500 hover:text-[#1A1A2E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to patients
          </Link>
          <span>/</span>
          <Link
            href="/admin/patients"
            className="hover:text-[#1A1A2E]"
          >
            Patients
          </Link>
          <span>/</span>
          <span className="text-[#1A1A2E] font-medium">{patient.name}</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] shadow-xs hover:bg-gray-50 transition-colors">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      {/* ── Hero card ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: avatar + info */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white sm:h-16 sm:w-16"
              style={{ backgroundColor: patient.avatar_color }}
            >
              {patient.initials}
            </div>
            {/* Name + badges + meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">
                  {patient.name}
                </h2>
                {/* Status badge */}
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    patient.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      patient.status === "Active"
                        ? "bg-emerald-500"
                        : "bg-gray-400"
                    )}
                  />
                  {patient.status}
                </span>
                {/* Role badge */}
                <span className="flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                  Patient
                </span>
              </div>
              {/* Meta row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {patient.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {patient.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  Joined {patient.joined}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Last visit {profile.last_visit}
                </span>
              </div>
            </div>
          </div>
          {/* Referral credits */}
          {profile.referral_credits > 0 && (
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Referral credits
              </p>
              <p className="mt-0.5 text-2xl font-bold text-amber-500">
                ${profile.referral_credits}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {detailStats.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {s.label}
            </p>
            <p
              className={cn(
                "mt-1 font-bold tracking-tight text-[#1A1A2E]",
                i === 4 ? "text-lg leading-snug" : "text-2xl"
              )}
            >
              {s.value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Tabs ─────────────────────────────────────────────── */}
      <div>
        <div className="rounded-t-xl border-b border-gray-100 bg-white px-4 pt-1 shadow-sm">
          <CustomTab
            tabs={tabs}
            active={activeTab}
            onChange={(k) => setActiveTab(k as MainTab)}
          />
        </div>

        <div className="mt-0">
          {activeTab === "overview" && (
            <PatientOverviewTab
              name={patient.name}
              email={patient.email}
              phone={patient.phone}
              city={patient.city}
              joined={patient.joined}
              profile={profile}
            />
          )}
          {activeTab === "bookings" && (
            <PatientBookingsTab bookings={profile.bookings} />
          )}
          {activeTab === "consultations" && (
            <PatientConsultationsTab consultations={profile.consultations} />
          )}
          {activeTab === "documents" && (
            <PatientDocumentsTab documents={profile.documents} />
          )}
        </div>
      </div>
    </div>
  );
}
