import PatientDetailPage from "@/app/(admin dashboard)/modules/patients/components/patient-details-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailRoute({ params }: Props) {
  const { id } = await params;
  return <PatientDetailPage patientId={id} />;
}
