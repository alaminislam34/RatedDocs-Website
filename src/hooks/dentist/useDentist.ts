import { dentistApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfessionalDetailsI, StepOneI, StepThreeI, StepTwoI } from "./dentist.interface";

export function objectToFormData<T extends object>(obj: T): FormData {
  const formData = new FormData();

  function parse(val: unknown, pathParts: (string | number)[]) {
    if (val instanceof File) {
      const keys = getKeys(pathParts);
      keys.forEach((k) => formData.append(k, val));
    } else if (val instanceof Date) {
      const keys = getKeys(pathParts);
      keys.forEach((k) => formData.append(k, val.toISOString()));
    } else if (Array.isArray(val)) {
      val.forEach((item, index) => {
        parse(item, [...pathParts, index]);
      });
    } else if (typeof val === "object" && val !== null) {
      Object.entries(val as Record<string, unknown>).forEach(([subKey, subValue]) => {
        parse(subValue, [...pathParts, subKey]);
      });
    } else if (val !== undefined && val !== null) {
      const keys = getKeys(pathParts);
      keys.forEach((k) => formData.append(k, String(val)));
    }
  }

  function getKeys(parts: (string | number)[]): string[] {
    if (parts.length === 0) return [];

    let mixed = String(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (typeof part === "number") {
        mixed += `[${part}]`;
      } else {
        mixed += `.${part}`;
      }
    }

    return [mixed];
  }

  Object.entries(obj).forEach(([key, value]) => {
    parse(value, [key]);
  });

  return formData;
}

function buildStepTwoFormData(data: StepTwoI): FormData {
  const formData = new FormData();

  if (data.jci_certificate) {
    formData.append("jci_certificate", data.jci_certificate);
  }

  if (data.walkthrough_video) {
    formData.append("walkthrough_video", data.walkthrough_video);
  }

  formData.append("procedures", JSON.stringify(data.procedures));
  formData.append("guarantee", JSON.stringify(data.guarantee));

  return formData;
}

function buildStepThreeFormData(data: StepThreeI): FormData {
  const formData = new FormData();

  if (data.clinic_address) {
    formData.append("clinic_address", JSON.stringify(data.clinic_address));
  }
  data.materials.forEach((m, index) => {
    formData.append(`materials[${index}].own_procedure`, String(m.own_procedure));

    if (m.ce_certificate) {
      formData.append(`materials[${index}].ce_certificate`, m.ce_certificate);
    }
    if (m.material_brands) {
      formData.append(`materials[${index}].material_brands`, m.material_brands);
    }
    if (m.invoice) {
      formData.append(`materials[${index}].invoice`, m.invoice);
    }
    if (m.protocol_pdf) {
      formData.append(`materials[${index}].protocol_pdf`, m.protocol_pdf);
    }
  });

  console.log("=== Phase 3 FormData Payload ===");
  formData.forEach((value, key) => {
    if (value instanceof File) {
      console.log(`${key}: File [name: ${value.name}, size: ${value.size} bytes]`);
    } else {
      console.log(`${key}:`, value);
    }
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
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] }),
        queryClient.invalidateQueries({ queryKey: ["licenseVerifyProgress"] }),
        queryClient.invalidateQueries({ queryKey: ["photoVerifyProgress"] }),
        queryClient.invalidateQueries({ queryKey: ["idVerifyProgress"] }),
      ]);
    },
  });
}

export default function useDentist() {
  const queryClient = useQueryClient();

  const invalidateVerification = () => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] }),
      queryClient.invalidateQueries({ queryKey: ["licenseVerifyProgress"] }),
      queryClient.invalidateQueries({ queryKey: ["photoVerifyProgress"] }),
      queryClient.invalidateQueries({ queryKey: ["idVerifyProgress"] }),
    ]);
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
    mutationFn: (data: StepTwoI) =>
      dentistApi.stepTwoWithFiles(buildStepTwoFormData(data)),
    onSuccess: invalidateVerification,
  });

  const stepThreeMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepThree"],
    mutationFn: (data: StepThreeI) => dentistApi.stepThree(buildStepThreeFormData(data)),
    onSuccess: invalidateVerification,
  });

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

  const globalProcedureListQuery = useQuery({
    queryKey: ["global_procedure_list"],
    queryFn: () => dentistApi.global_procedure_list(),
    enabled: true,
  });

  const stepThreeCheckQuery = useQuery({
    queryKey: ["stepThreeCheck"],
    queryFn: () => dentistApi.stepThreeCheck(),
    enabled: false,
  });

  const dentistProcedureList = useQuery({
    queryKey: ["dentist_procedures"],
    queryFn: () => dentistApi.dentistProcedureList(),
    enabled: true,
  })

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

    // global procedure list 
    globalProcedureListQuery,
    checkGlobalProcedureList: globalProcedureListQuery.refetch,
    isGlobalProcedureListLoading: globalProcedureListQuery.isFetching,
    isGlobalProcedureListError: globalProcedureListQuery.isError,
    globalProcedureListError: globalProcedureListQuery.error,
    globalProcedureListData: globalProcedureListQuery.data,

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

    dentistProcedureList,
    dentistProcedureListData: dentistProcedureList.data,
    dentistProcedureListLoading: dentistProcedureList.isFetching,
    dentistProcedureListError: dentistProcedureList.error,
    dentistProcedureListRefetch: dentistProcedureList.refetch,
  };
}
