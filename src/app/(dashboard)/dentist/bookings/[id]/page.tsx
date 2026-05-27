"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSubmittedBookings, SubmittedBooking } from "@/lib/storage/bookingService";
import { ArrowLeft } from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const [booking, setBooking] = useState<SubmittedBooking | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect back to bookings if id is missing
  useEffect(() => {
    if (!id) {
      router.push("/dentist/bookings");
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    try {
      const bookings = getSubmittedBookings();
      const found = bookings.find((b) => b.id === id) ?? null;
      setBooking(found);
    } catch (e) {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6" />

        <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div>
                <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-32 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="h-4 w-24 bg-slate-200 rounded" />

            <div className="text-right">
              <div className="h-3 w-28 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-64 bg-white rounded-2xl border border-slate-100 shadow-sm" />
          </div>
          <div>
            <div className="h-64 bg-white rounded-2xl border border-slate-100 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="">
        <button
          onClick={() => router.push("/dentist/bookings")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h2 className="text-xl font-bold">Booking not found</h2>
      </div>
    );
  }

  const patientName = `${booking.personalInfo.firstName} ${booking.personalInfo.lastName}`;
  const initials = (booking.personalInfo.firstName[0] || "") + (booking.personalInfo.lastName[0] || "");

  return (
    <div className="">
      <button
        onClick={() => router.push("/dentist/bookings")}
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold mb-6">Treatment Detail</h1>

      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#163E5C] font-bold">
              {initials}
            </div>
            <div>
              <div className="font-bold text-lg text-[#0F172A]">{patientName}</div>
              <div className="text-sm text-slate-500">{booking.personalInfo.email}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">Procedure</div>
            <div className="font-bold text-lg">{booking.procedure}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">Estimate Budget</div>
            <div className="font-bold text-lg text-[#0A2540]">{booking.budget || "$1,200"}</div>
            <div className="text-sm text-orange-500">In Escrow</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Estimate Treatment plan</h3>
              <button className="text-sm text-slate-500">▾</button>
            </div>

            <div className="mt-4">
              <div className="rounded-lg border border-slate-50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3">Procedure breakdown</th>
                      <th className="text-right p-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-xs text-slate-500">Initial examination</td>
                      <td className="p-3 text-right text-xs">Included</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-xs text-slate-500">CBCT scan (if needed)</td>
                      <td className="p-3 text-right text-xs">$693</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-xs text-slate-500">Temporary prosthesis</td>
                      <td className="p-3 text-right text-xs">$1,039</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-xs text-slate-500">Temporary prosthesis</td>
                      <td className="p-3 text-right text-xs">$1,200</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-xs text-slate-500">Final fitting & adjustments</td>
                      <td className="p-3 text-right text-xs">$346</td>
                    </tr>
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="p-3 font-bold">Estimate amount</td>
                      <td className="p-3 text-right font-bold">{booking.budget || "$1,200"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold mb-4">Patient Timeline</h4>
            <ol className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A2540] text-white text-xs">✓</div>
                <div>
                  <div className="font-bold">Payment Confirmed</div>
                  <div className="text-sm text-slate-500">{booking.budget || "$1,200"} held in escrow • April 30, 2026</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full border border-slate-200" />
                <div>
                  <div className="font-bold">Patient in Travel</div>
                  <div className="text-sm text-slate-500">May 02, 2026</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full border border-slate-200" />
                <div>
                  <div className="font-bold">Day 1 arrival, CBCT examination</div>
                  <div className="text-sm text-slate-500">May 03, 2026</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full border border-slate-200" />
                <div>
                  <div className="font-bold">Final Treatment Plan Confirmed</div>
                  <div className="text-sm text-slate-500">May 02, 2026</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 rounded-full border border-slate-200" />
                <div>
                  <div className="font-bold">Treatment Done</div>
                  <div className="text-sm text-slate-500">Waiting for review</div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

