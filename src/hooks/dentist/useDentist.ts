import { dentistApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DentistProfile,
  ProfessionalDetailsI,
  StepOneI,
  StepThreeI,
  StepTwoI,
} from "./dentist.interface";

export function objectToFormData<T extends object>(obj: T): FormData {
  const formData = new FormData();

  function append(key: string, value: unknown) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        append(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value as Record<string, unknown>).forEach(
        ([subKey, subValue]) => {
          append(`${key}[${subKey}]`, subValue);
        },
      );
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
    append(key, value);
  });

  return formData;
}

export function useDentistProgress() {
  return useQuery({
    queryKey: ["dentistVerificationProgress"],
    queryFn: () => dentistApi.getVerificationProgress(),
    retry: false,
  });
}

export function useUpdateVerificationPhase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { verification_phase: string }) =>
      dentistApi.updateVerificationPhase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dentistVerificationProgress"],
      });
    },
  });
}

export default function useDentist() {
  const queryClient = useQueryClient();

  const invalidateVerification = () => {
    queryClient.invalidateQueries({
      queryKey: ["dentistVerificationProgress"],
    });
  };

  const professionalDetailsMutation = useMutation({
    mutationFn: (data: ProfessionalDetailsI) =>
      dentistApi.professionalDetails(data),
  });

  const stepOneMutation = useMutation({
    mutationFn: (data: StepOneI) => dentistApi.stepOne(objectToFormData(data)),
    onSuccess: invalidateVerification,
  });

  const stepTwoMutation = useMutation({
    mutationFn: (data: StepTwoI) => dentistApi.stepTwo(data),
    onSuccess: invalidateVerification,
  });

  const stepThreeMutation = useMutation({
    mutationFn: (data: StepThreeI) =>
      dentistApi.stepThree(objectToFormData(data)),
    onSuccess: invalidateVerification,
  });

  // ==========================================
  // QUERIES (GET APIs for Status Checking)
  // ==========================================

  // Step 1 Check
  const stepOneCheckQuery = useQuery({
    queryKey: ["stepOneCheck"],
    queryFn: () => dentistApi.stepOneCheck(),
    enabled: false,
  });

  // Step 2 Check
  const stepTwoCheckQuery = useQuery({
    queryKey: ["stepTwoCheck"],
    queryFn: () => dentistApi.stepTwoCheck(),
    enabled: false,
  });

  // Step 3 Check
  const stepThreeCheckQuery = useQuery({
    queryKey: ["stepThreeCheck"],
    queryFn: () => dentistApi.stepThreeCheck(),
    enabled: false,
  });

  // dentist profile get query
  const dentistProfileQuery = useQuery({
    queryKey: ["dentistProfile"],
    queryFn: () => dentistApi.profile<DentistProfile>(),
  });

  return {
    // Mutations
    stepOneMutation,
    stepTwoMutation,
    stepThreeMutation,
    professionalDetailsMutation,

    // Mutation Loading States
    isStepOneLoading: stepOneMutation.isPending,
    isStepTwoLoading: stepTwoMutation.isPending,
    isStepThreeLoading: stepThreeMutation.isPending,
    isProfessionalDetailsLoading: professionalDetailsMutation.isPending,

    // Mutation Error States
    isStepOneError: stepOneMutation.isError,
    isStepTwoError: stepTwoMutation.isError,
    isStepThreeError: stepThreeMutation.isError,
    isProfessionalDetailsError: professionalDetailsMutation.isError,
    stepOneError: stepOneMutation.error,
    stepTwoError: stepTwoMutation.error,
    stepThreeError: stepThreeMutation.error,
    professionalDetailsError: professionalDetailsMutation.error,
    professionalDetailsSuccess: professionalDetailsMutation.isSuccess,

    checkStepOne: stepOneCheckQuery.refetch,
    checkStepTwo: stepTwoCheckQuery.refetch,
    checkStepThree: stepThreeCheckQuery.refetch,

    stepOneCheckData: stepOneCheckQuery.data,
    stepTwoCheckData: stepTwoCheckQuery.data,
    stepThreeCheckData: stepThreeCheckQuery.data,

    isStepOneCheckLoading: stepOneCheckQuery.isFetching,
    isStepTwoCheckLoading: stepTwoCheckQuery.isFetching,
    isStepThreeCheckLoading: stepThreeCheckQuery.isFetching,

    // Check Error States
    isStepOneCheckError: stepOneCheckQuery.isError,
    isStepTwoCheckError: stepTwoCheckQuery.isError,
    isStepThreeCheckError: stepThreeCheckQuery.isError,
    stepOneCheckError: stepOneCheckQuery.error,
    stepTwoCheckError: stepTwoCheckQuery.error,
    stepThreeCheckError: stepThreeCheckQuery.error,

    // dentist profile hooks
    dentistProfileQuery,
    isDentistProfileGetLoading: dentistProfileQuery.isLoading,
    isDentistProfileError: dentistProfileQuery.isError,
    dentistProfileError: dentistProfileQuery.error,
  };
}
