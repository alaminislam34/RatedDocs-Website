"use client";

import { Pencil, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  dentist: string;
  procedure: string;
  date: string;
  status: string;
  amount: number;
};

type Profile = {
  patient_id: string;
  date_of_birth: string;
  gender: string;
  last_visit: string;
  engagement: {
    show_up_rate: number;
    reviews_ratio: string;
    documents_count: number;
  };
  referrals: {
    code: string;
    available_credits: number;
    total: number;
    credited: number;
  };
  activity: {
    total_bookings: number;
    amount_spent: number;
    avg_rating: number;
    last_visit: string;
  };
  bookings: Booking[];
  stats: {
    total_bookings: { count: number; growth_this_month: number };
    amount_spent: number;
    reviews_written: { count: number; avg_rating: number };
  };
};

interface PatientOverviewTabProps {
  name: string;
  email: string;
  phone: string;
  city: string;
  joined: string;
  profile: Profile;
}

const STATUS_BADGE: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-600",
  "No Show": "bg-orange-50 text-orange-600",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-[#1A1A2E]">{value}</p>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className={cn("h-full rounded-full", color)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export function PatientOverviewTab({
  name,
  email,
  phone,
  city,
  joined,
  profile,
}: PatientOverviewTabProps) {
  const recentBookings = profile.bookings.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Left (main) column */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        {/* Personal Information card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1A1A2E]">
              Personal information
            </h3>
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A1A2E]">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <InfoRow label="Full Name" value={name} />
            <InfoRow label="Patient ID" value={profile.patient_id} />
            <InfoRow label="Email Address" value={email} />
            <InfoRow label="Phone Number" value={phone} />
            <InfoRow
              label="Date of Birth"
              value={formatDate(profile.date_of_birth)}
            />
            <InfoRow label="Gender" value={profile.gender} />
            <InfoRow label="City / Location" value={city} />
            <InfoRow label="Date Joined" value={joined} />
          </div>
        </div>

        {/* Recent Bookings card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1A1A2E]">
              Recent bookings
            </h3>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Booking", "Dentist", "Procedure", "Date", "Status", "Amount"].map(
                    (h) => (
                      <th
                        key={h}
                        className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 last:pr-0"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 pr-4 text-sm font-medium text-blue-600">
                      {b.id}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600">
                      {b.dentist}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600">
                      {b.procedure}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600">
                      {b.date}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          STATUS_BADGE[b.status] ?? "bg-gray-100 text-gray-500"
                        )}
                      >
                        {b.status === "Completed" ? (
                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {b.status}
                          </span>
                        ) : b.status === "In Progress" ? (
                          b.status
                        ) : (
                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            {b.status}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-[#1A1A2E]">
                      ${b.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="flex flex-col gap-4">
        {/* Engagement card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
            Engagement
          </h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-gray-500">Booking show-up rate</span>
                <span className="font-semibold text-[#1A1A2E]">
                  {profile.engagement.show_up_rate}%
                </span>
              </div>
              <ProgressBar value={profile.engagement.show_up_rate} color="bg-[#1A1A2E]" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-gray-500">Reviews submitted</span>
                <span className="font-semibold text-[#1A1A2E]">
                  {profile.engagement.reviews_ratio}
                </span>
              </div>
              <ProgressBar
                value={
                  (parseInt(profile.engagement.reviews_ratio.split(" of ")[0]) /
                    parseInt(profile.engagement.reviews_ratio.split(" of ")[1])) *
                  100
                }
                color="bg-amber-400"
              />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-gray-500">Documents uploaded</span>
                <span className="font-semibold text-[#1A1A2E]">
                  {profile.engagement.documents_count} docs
                </span>
              </div>
              <ProgressBar
                value={Math.min(profile.engagement.documents_count * 12, 100)}
                color="bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Referrals card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
            Referrals
          </h3>
          {/* Referral code box */}
          <div className="mb-4 rounded-lg bg-[#1A1A2E] px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Referral Code
            </p>
            <p className="text-xl font-bold tracking-wide text-white">
              {profile.referrals.code}
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Available credits</span>
              <span className="font-semibold text-amber-500">
                ${profile.referrals.available_credits}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total referrals</span>
              <span className="font-semibold text-[#1A1A2E]">
                {profile.referrals.total}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Credited</span>
              <span className="font-semibold text-[#1A1A2E]">
                {profile.referrals.credited}
              </span>
            </div>
          </div>
        </div>

        {/* Activity card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
            Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total bookings</span>
              <span className="font-semibold text-[#1A1A2E]">
                {profile.activity.total_bookings}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount spent</span>
              <span className="font-semibold text-[#1A1A2E]">
                ${profile.activity.amount_spent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg rating given</span>
              <span className="font-semibold text-[#1A1A2E]">
                {profile.activity.avg_rating > 0
                  ? `${profile.activity.avg_rating} ★`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last visit</span>
              <span className="font-semibold text-[#1A1A2E]">
                {profile.activity.last_visit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
