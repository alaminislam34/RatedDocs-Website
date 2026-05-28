import BookingDetailPage from "@/app/(admin dashboard)/modules/bookings/components/booking-details-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailRoute({ params }: Props) {
  const { id } = await params;
  return <BookingDetailPage bookingId={id} />;
}
