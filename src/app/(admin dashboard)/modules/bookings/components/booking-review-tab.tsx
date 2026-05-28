"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import bookingsData from "@/lib/bookings-data";

type Booking = (typeof bookingsData.bookings)[number];

interface BookingReviewTabProps {
  booking: Booking;
}

export function BookingReviewTab({ booking }: BookingReviewTabProps) {
  const review = booking.review;

  if (!review) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-gray-400">
          No review available for this booking.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Patient Review */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#1A1A2E]">
            Patient Review
          </h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            {review.status}
          </span>
        </div>

        {/* Reviewer header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: review.reviewer_avatar_color }}
            >
              {review.reviewer_initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {review.reviewer_name}
              </p>
              <p className="text-xs text-gray-400">{review.review_date}</p>
            </div>
          </div>
          {/* Overall rating */}
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-[#1A1A2E]">
              {review.overall_rating.toFixed(1)} overall
            </span>
          </div>
        </div>

        {/* Category ratings */}
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {review.categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{cat.name}</span>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < cat.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-100 text-gray-100"
                    )}
                  />
                ))}
                <span className="w-4 text-right text-sm font-semibold text-[#1A1A2E]">
                  {cat.rating}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Written review */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Written Review
          </p>
          <p className="text-sm leading-relaxed text-gray-600">
            &ldquo;{review.written_review}&rdquo;
          </p>
        </div>

        {/* Procedure + Dentist tags */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-sm text-gray-400">
          <span>
            Procedure:{" "}
            <span className="font-medium text-gray-600">{review.procedure}</span>
          </span>
          <span>
            Dentist:{" "}
            <span className="font-medium text-gray-600">{review.dentist}</span>
          </span>
        </div>
      </div>

      {/* Before & After Results */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-[#1A1A2E]">
          Before &amp; After Results
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {/* Before */}
          <div>
            <span className="mb-2 inline-block rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500">
              Before
            </span>
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              {review.before_after.has_images ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  📷 Before image
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-300">
                  No image
                </div>
              )}
            </div>
          </div>
          {/* After */}
          <div>
            <span className="mb-2 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              After
            </span>
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              <div className="flex h-full items-center justify-center text-sm text-gray-300">
                No image
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          {review.before_after.caption}
        </p>
      </div>
    </div>
  );
}
