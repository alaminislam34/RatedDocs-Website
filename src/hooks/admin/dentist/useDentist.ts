import { adminApi } from "@/lib/api";
import type { ListParams } from "@/lib/api/services";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface DentistAddress {
  id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  profile: number;
}

export interface DentistLicenseVerification {
  id: number;
  registration_authority_name: string;
  created_at: string;
  updated_at: string;
  professional_headshot: string;
  city: string;
  country: string;
  registration_no: string;
  doc_type: string;
  file: string;
  status: string;
  is_verified: boolean;
  verified_at: string | null;
  reviewer_notes: string;
  dentist: number;
  verification: number;
  registration_authority: number;
}

export interface ClinicOperationVerification {
  id: number;
  status: string;
  is_verified: boolean;
  verified_at: string | null;
  reviewer_notes: string;
  dentist: number;
  verification: number;
  sterilization_verification?: {
    id: number;
    has_jci_certificate: boolean;
    jci_certificate: string | null;
    walkthrough_video: string | null;
    certificate_number: string | null;
    expiry_date: string | null;
    issuing_authority: string | null;
    issue_date: string | null;
  } | null;
  no_surprise_guarantee?: {
    id: number;
    allowed_variation_percent: string;
    signer_name: string;
    typed_signature: string;
    accepted_terms: boolean;
    signed_at: string;
  } | null;
  procedures_feature?: {
    id: number;
    procedure_name: string;
    price: string;
    currency: string;
    option_notes: string;
    is_active: boolean;
    procedure: number;
  }[];
}

export interface ClinicDepthVerification {
  id: number;
  status: string;
  is_verified: boolean;
  verified_at: string | null;
  reviewer_notes: string;
  dentist: number;
  verification: number;
  clinic_address?: {
    address: string;
    lat: string;
    lng: string;
  } | string | null;
  materials?: unknown;
  procedure_material_verifications?: unknown;
}

export interface DentistVerification {
  id: number;
  dentist_license_verification: DentistLicenseVerification | null;
  operation_verification: ClinicOperationVerification | null;
  clinical_path_verification: ClinicDepthVerification | null;
  created_at: string;
  updated_at: string;
  license_verification: string;
  operations_verification: string;
  clinical_verification: string;
  face_match_score: number | null;
  dentist: number;
}

export interface AdminDentist {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_verified: boolean;
  };
  clinic: unknown | null;
  full_name: string;
  phone: string | null;
  specialty: string;
  bio: string | null;
  experience_years: number;
  rating_avg: number;
  total_reviews: number;
  rdv_score: number;
  response_time_avg: number;
  verification_phase: string;
  is_verified: boolean;
  verified_at: string | null;
  dentist_address: DentistAddress[];
  weekly_availability: unknown[];
  slot_exceptions: unknown[];
  dentist_verification: DentistVerification | null;
  created_at: string;
  updated_at: string;
}

interface UseAdminDentistsOptions {
  params?: ListParams;
  enabled?: boolean;
}

export function useAdminDentists(options: UseAdminDentistsOptions = {}) {
  const query = useQuery({
    queryKey: ["admin", "dentists", options.params],
    queryFn: () => adminApi.listDentists<AdminDentist>(options.params),
    placeholderData: keepPreviousData,
    enabled: options.enabled !== false,
    staleTime: 30_000,
  });

  return {
    ...query,
    dentists: query.data?.data || [],
    meta: query.data?.meta,
    isLoadingDentists: query.isLoading,
    isErrorDentists: query.isError,
  };
}

export interface UseAdminDentistOptions {
  enabled?: boolean;
}

export function useAdminDentist(id: string, options: UseAdminDentistOptions = {}) {
  const query = useQuery({
    queryKey: ["admin", "dentist", id],
    queryFn: () => adminApi.getDentistProfile<AdminDentist>(id),
    enabled: !!id && options.enabled !== false,
    staleTime: 30_000,
  });

  return {
    ...query,
    dentist: query.data?.data,
    isLoadingDentist: query.isLoading,
    isErrorDentist: query.isError,
  };
}


export function useDentistPhaseOneApprove(id: string, dentistId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminApi.phaseOneApprove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dentist", id] });
      if (dentistId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "dentist", dentistId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenseQueue"] });
    },
  });
}

export function useDentistPhaseOneReject(id: string, dentistId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => adminApi.phaseOneReject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dentist", id] });
      if (dentistId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "dentist", dentistId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenseQueue"] });
    },
  });
}

export function useDentistPhaseTwoApprove(id: string, dentistId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminApi.phaseTwoApprove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dentist", id] });
      if (dentistId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "dentist", dentistId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenseQueue"] });
    },
  });
}

export function useDentistPhaseTwoReject(id: string, dentistId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => adminApi.phaseTwoReject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dentist", id] });
      if (dentistId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "dentist", dentistId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenseQueue"] });
    },
  });
}

export function useDentistPhaseThreeApprove(id: string, dentistId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminApi.phaseThreeApprove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dentist", id] });
      if (dentistId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "dentist", dentistId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenseQueue"] });
    },
  });
}

export function useDentistPhaseThreeReject(id: string, dentistId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => adminApi.phaseThreeReject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dentist", id] });
      if (dentistId) {
        queryClient.invalidateQueries({ queryKey: ["admin", "dentist", dentistId] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dentists"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "licenseQueue"] });
    },
  });
}
