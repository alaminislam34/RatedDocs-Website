"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import TabBarAndSearch from "./tab-bar-and-search";
import BookingCard from "./booking-card";
import { getSubmittedBookings, SubmittedBooking } from "@/lib/storage/bookingService";

const DEMO_CARDS = [
  {
    id: "booking_demo_1",
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "JS",
    procedure: "Dental Implants",
    budget: "$1,254",
    status: "In Escrow",
    dates: "12–24 Jan, 2024",
    timelineLabel: "Patient timeline",
    timelineStatus: "Day 1 arrival",
  },
  {
    id: "booking_demo_2",
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "JS",
    procedure: "Dental Implants",
    budget: "$1,254",
    status: "In Escrow",
    dates: "12–24 Jan, 2024",
    timelineLabel: "Timeline",
    timelineStatus: "Patient in Travel",
  },
  {
    id: "booking_demo_3",
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "JS",
    procedure: "Dental Implants",
    budget: "$1,254",
    status: "In Escrow",
    dates: "12–24 Jan, 2024",
    timelineLabel: "Timeline",
    timelineStatus: "Patient in Travel",
  },
];

export default function BookingManage() {
  const [bookings, setBookings] = useState<SubmittedBooking[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const submitted = getSubmittedBookings();
    setBookings(submitted || []);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="h-12 w-full bg-slate-100 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const cards =
    bookings.length > 0
      ? bookings.map((b) => ({
          id: b.id,
          name: `${b.personalInfo.firstName} ${b.personalInfo.lastName}`,
          email: b.personalInfo.email,
          initials: `${b.personalInfo.firstName[0] || ""}${b.personalInfo.lastName[0] || ""}`,
          procedure: b.procedure,
          budget: b.budget || "$1,254",
          status: "In Escrow",
          dates: b.travelFrom || "12–24 Jan, 2024",
          timelineLabel: "Timeline",
          timelineStatus: "Patient in Travel",
        }))
      : DEMO_CARDS;

  return (
    <div className="space-y-6">
      <Header />
      <TabBarAndSearch />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id}>
            <BookingCard
              id={card.id}
              name={card.name}
              email={card.email}
              initials={card.initials}
              procedure={card.procedure}
              budget={card.budget}
              status={card.status}
              dates={card.dates}
              timelineLabel={card.timelineLabel}
              timelineStatus={card.timelineStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
