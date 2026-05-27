"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./header";
import TabBarAndSearch from "./tab-bar-and-search";
import BookingCard from "./booking-card";
import { getSubmittedBookings, SubmittedBooking } from "@/lib/storage/bookingService";

export default function BookingManage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<SubmittedBooking[]>([]);

  useEffect(() => {
    const submitted = getSubmittedBookings();
    setBookings(submitted || []);
  }, []);

  return (
    <div className="space-y-6">
      <Header />
      <TabBarAndSearch />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length === 0
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mt-6">
                <BookingCard
                  name={`Jacob Smith ${index + 1}`}
                  email={`Jacob.smith${index + 1}@sample.com`}
                  initials={`JS${index + 1}`}
                  procedure="Dental Implants"
                  budget="$1254"
                  status={index % 2 === 0 ? "In Escrow" : "Completed"}
                  dates="12–24 Jan, 2024"
                  timelineStatus="Patient in Travel"
                  onViewDetail={() => router.push("/dentist/bookings")}
                />
              </div>
            ))
          : bookings.map((b) => (
              <div key={b.id} className="mt-6">
                <BookingCard
                  name={`${b.personalInfo.firstName} ${b.personalInfo.lastName}`}
                  email={b.personalInfo.email}
                  initials={`${b.personalInfo.firstName[0] || ""}${b.personalInfo.lastName[0] || ""}`}
                  procedure={b.procedure}
                  budget={b.budget}
                  status={"In Escrow"}
                  dates={`${b.travelFrom || ""}`}
                  timelineStatus={"Patient in Travel"}
                  onViewDetail={() => router.push(`/dentist/bookings/${b.id}`)}
                />
              </div>
            ))}
      </div>
    </div>
  );
}
