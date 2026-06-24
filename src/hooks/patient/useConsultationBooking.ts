"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { consultationBookingApi, type ConsultationStepOnePayload, type ConsultationStepTwoPayload, type ApiResponse, type ConsultationStepResult } from "@/lib/api";
import { setConsultationId } from "@/lib/storage/bookingService";

export const consultationKeys = {
  all: ["consultations"] as const,
  detail: (id: string | number) => [...consultationKeys.all, id] as const,
};

export function useConsultationStepOne() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ConsultationStepResult>, Error, ConsultationStepOnePayload>({
    mutationFn: async (payload: ConsultationStepOnePayload) => {
      console.log("[DEBUG] Starting Step 1 Consultation Mutation with payload:", payload);
      const response = await consultationBookingApi.stepOne(payload);
      console.log("[DEBUG] Step 1 API response received:", response);
      return response;
    },
    onSuccess: (response) => {
      const payload = response as any;
      const consultationId =
        payload.consultation?.id ??
        payload.data?.consultation?.id ??
        payload.data?.consultation_id ??
        payload.data?.id ??
        payload.data?.data?.consultation_id ??
        payload.data?.data?.id ??
        payload.consultation_id ??
        payload.id ??
        null;

      console.log("[DEBUG] Step 1 Success. Extracted Consultation ID:", consultationId);
      if (consultationId) {
        setConsultationId(consultationId);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
    },
    onError: (error) => {
      console.error("[DEBUG] Step 1 Error:", error);
    },
  });
}

export function useConsultationStepTwo() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ConsultationStepResult>, Error, ConsultationStepTwoPayload>({
    mutationFn: async (payload: ConsultationStepTwoPayload) => {
      console.log("[DEBUG] Starting Step 2 Consultation Mutation with payload:", payload);
      const response = await consultationBookingApi.stepTwo(payload);
      console.log("[DEBUG] Step 2 API response received:", response);
      return response;
    },
    onSuccess: (response) => {
      console.log("[DEBUG] Step 2 Success. Response data:", response);
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
    },
    onError: (error) => {
      console.error("[DEBUG] Step 2 Error:", error);
    },
  });
}


// consultaion id get hook create
// response
// {
//     "success": true,
//     "consultation": {
//         "id": 4
//     }
// } 
export function useGetConsultationId() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ConsultationStepResult>, Error, void>({
    mutationFn: async () => {
      console.log("[DEBUG] Starting Consultation ID GET Mutation with payload:");
      const response = await consultationBookingApi.getConsultation_id();
      console.log("[DEBUG] Consultation ID GET API response received:", response);
      return response;
    },
    onSuccess: (response) => {
      const payload = response as any;
      const consultationId =
        payload.consultation?.id ??
        payload.data?.consultation?.id ??
        payload.data?.consultation_id ??
        payload.data?.id ??
        payload.data?.data?.consultation_id ??
        payload.data?.data?.id ??
        payload.consultation_id ??
        payload.id ??
        null;

      console.log("[DEBUG] Consultation ID GET Success. Extracted Consultation ID:", consultationId);
      if (consultationId) {
        setConsultationId(consultationId);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: consultationKeys.all });
    },
    onError: (error) => {
      console.error("[DEBUG] Consultation ID GET Error:", error);
    },
  });
}
