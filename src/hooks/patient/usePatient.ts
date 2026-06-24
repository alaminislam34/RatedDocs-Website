// Reusing shared useAuth hook for patient authentication
import { patientApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const usePatientConsultations = () => {
  return useQuery({
    queryKey: ["patient-consultations"],
    queryFn: async () => {
      const response = await patientApi.consultations();
      return response.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
