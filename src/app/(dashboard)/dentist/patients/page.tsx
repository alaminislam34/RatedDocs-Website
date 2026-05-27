import PatientManage from "@/app/modules/dentist/patients-manage/patient-manage";
import { loadPatientRecords } from "@/app/modules/dentist/patients-manage/patients-data.server";

export default async function PatientsManagePage() {
  const patients = await loadPatientRecords();

  return (
    <div>
      <PatientManage patients={patients} />
    </div>
  );
}
