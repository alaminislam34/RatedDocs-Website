import { dentistApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfessionalDetailsI, StepOneI, StepThreeI, StepTwoI } from "./dentist.interface";
import { objectToFormData } from "@/lib/utils/form-data";

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
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    },
  });
}

export default function useDentist() {
  const queryClient = useQueryClient();

  const invalidateVerification = () => {
    queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
  };

  const professionalDetailsMutation = useMutation({
    mutationFn: (data: ProfessionalDetailsI) => dentistApi.professionalDetails(data),
  });

  const stepOneMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepOne"],
    mutationFn: (data: StepOneI) => dentistApi.stepOne(objectToFormData(data)),
    onSuccess: invalidateVerification,
  });

  const stepTwoMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepTwo"],
    mutationFn: (data: StepTwoI) => dentistApi.stepTwo(objectToFormData(data)),
    onSuccess: invalidateVerification,
  });

  const stepThreeMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepThree"],
    mutationFn: (data: StepThreeI) => dentistApi.stepThree(objectToFormData(data)),
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

  // ==========================================
  // RETURN STATEMENTS
  // ==========================================
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

    // --- রিফ্যাক্টরড কোয়েরি ফাংশন এবং স্টেটসমূহ ---

    // ম্যানুয়াল চ্যাকিং এর জন্য Trigger ফাংশন (আগে যা mutation.mutate ছিল, এখন তা refetch)
    checkStepOne: stepOneCheckQuery.refetch,
    checkStepTwo: stepTwoCheckQuery.refetch,
    checkStepThree: stepThreeCheckQuery.refetch,

    // Check Data (API Response পেতে চাইলে)
    stepOneCheckData: stepOneCheckQuery.data,
    stepTwoCheckData: stepTwoCheckQuery.data,
    stepThreeCheckData: stepThreeCheckQuery.data,

    // Check Loading States (useQuery তে isFetching বা isLoading ব্যবহার করা হয়)
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
  };
}
