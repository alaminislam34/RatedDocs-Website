"use client";

import { useState } from "react";
import ToggleButton from "@/app/(dashboard)/patient/_components/Module/MyBooking/ToggleButton/ToggleButton";
import { inProgressBookingsData, type InProgressBooking } from "./data";
import InProgressBookingCard from "./InProgressBookingCard";
import InProgressBookingCardSkeleton from "./InProgressBookingCardSkeleton";
import { CalendarOff } from "lucide-react";

const TABS = [
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

export default function MyBooking() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const [isLoading] = useState(false);

  const byStatus = (status: InProgressBooking["bookingStatus"]) =>
    inProgressBookingsData.filter((b) => b.bookingStatus === status);

  const inProgress = byStatus("in_progress");
  const completed = byStatus("completed");
  const rejected = byStatus("rejected");

  const currentList =
    activeTab === "in-progress"
      ? inProgress
      : activeTab === "completed"
        ? completed
        : rejected;

  const emptyMessages: Record<string, { title: string; description: string }> =
    {
      "in-progress": {
        title: "No Treatment Bookings Yet",
        description:
          "You haven't booked any treatments yet. Once you schedule a consultation, your treatment details will appear here.",
      },
      completed: {
        title: "No Completed Bookings",
        description:
          "Your completed treatment bookings will appear here once a treatment has been finished.",
      },
      rejected: {
        title: "No Rejected Bookings",
        description:
          "Any treatment bookings that were rejected or cancelled will appear here.",
      },
    };

  return (
    <div>
      <p className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold">
        My Bookings
      </p>

      <div className="mt-4">
        <ToggleButton value={activeTab} onChange={setActiveTab} tabs={TABS} />
      </div>

      <div className="py-5 space-y-4">
        {isLoading ? (
          <InProgressBookingCardSkeleton />
        ) : currentList.length === 0 ? (
          <EmptyState {...emptyMessages[activeTab]} />
        ) : (
          currentList.map((booking) => (
            <InProgressBookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <CalendarOff className="size-12 text-[#0F3659] opacity-60" />
      <h3 className="text-lg font-bold text-[#1A1A2E]">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}
