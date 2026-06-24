import { LoginPayload, OtpPayload, RegisterPayload } from "@/hooks/authentication/auth.interface";
import { api, type ApiResponse, type PaginatedResponse } from "./client";
import { endpoints } from "./endpoints";

type Id = string | number;
export type ListParams = Record<string, string | number | boolean | undefined>;

export interface AddUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  username: string;
  password: string;
  role: "ADMIN";
}



export interface ResendOtpPayload {
  email: string;
}

export interface AuthResult {
  user?: {
    id: Id;
    user_id?: Id;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    role?: string;
    type?: string;
  };
  user_id?: Id;
  email?: string;
  role?: string;
  type?: string;
  access?: string;
  refresh?: string;
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
  token?: string;
  profile_created?: boolean;
}

export interface VerifyTokenResult {
  user_id: number;
  email: string;
  type: "ADMIN" | "DENTIST" | "DOCTOR" | "PATIENT" | string;
}

export interface ProcedureCatalogItem {
  id: Id;
  name?: string;
  title?: string;
  label?: string;
}

export interface PublicDentistCatalogItem {
  id: Id;
  user_id?: Id;
  name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  slug?: string;
}

export interface ConsultationStepOnePayload {
  first_name: string;
  last_name: string;
  country: string;
  date_of_birth: string;
}

export interface ConsultationStepTwoPayload {
  procedures: number[];
}

export interface ConsultationStepThreePayload {
  consultation_id: Id;
  approximate_budget: number;
  travel_start_date: string;
  travel_end_date: string;
}

export interface ConsultationStepFourPayload {
  consultation_id: Id;
  last_dentist_visit: string;
  conditions: string[];
  notes: string;
}

export interface ConsultationStepSevenPayload {
  consultation_id: Id;
  dentists: Array<{
    dentist: Id;
    scheduled_date: string;
    scheduled_time: string;
  }>;
}

export interface ConsultationStepResult {
  id?: Id;
  consultation_id?: Id;
  data?: {
    id?: Id;
    consultation_id?: Id;
  };
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<AuthResult>, RegisterPayload>(
      endpoints.auth.register,
      payload,
    ),
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthResult>, LoginPayload>(
      endpoints.auth.login,
      payload,
    ),
  verifyOtp: (payload: OtpPayload) =>
    api.post<ApiResponse<AuthResult>, OtpPayload>(
      endpoints.auth.verifyOtp,
      payload,
    ),
  verifyToken: (token: string) =>
    api.get<ApiResponse<VerifyTokenResult>>(
      endpoints.auth.verifyToken,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ),
  resendOtp: (payload: ResendOtpPayload) =>
    api.post<ApiResponse<unknown>, ResendOtpPayload>(
      endpoints.auth.resendOtp,
      payload,
    ),
  logout: (refresh: string) =>
    api.post<ApiResponse<unknown>, { refresh: string }>(
      endpoints.auth.logout,
      { refresh }
    ),
  me: <TUser = unknown>() => api.get<ApiResponse<TUser>>(endpoints.auth.me),
  forgotPassword: (email: string) =>
    api.post<ApiResponse<unknown>, { email: string }>(
      endpoints.auth.forgotPassword,
      {
        email,
      },
    ),
  resetPassword: (payload: { token: string; password: string }) =>
    api.post<ApiResponse<unknown>, typeof payload>(
      endpoints.auth.resetPassword,
      payload,
    ),

};

export const procedureApi = {
  list: () =>
    api.get<
      | ApiResponse<ProcedureCatalogItem[]>
      | PaginatedResponse<ProcedureCatalogItem>
      | ProcedureCatalogItem[]
    >(endpoints.procedures.root),
};

export const consultationBookingApi = {
  stepOne: (payload: ConsultationStepOnePayload) => {
    const formData = new FormData();
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("country", payload.country);
    formData.append("date_of_birth", payload.date_of_birth);

    return api.upload<ApiResponse<ConsultationStepResult>>(
      endpoints.bookings.stepOne,
      formData,
    );
  },
  stepTwo: (payload: ConsultationStepTwoPayload) =>
    api.post<ApiResponse<ConsultationStepResult>, ConsultationStepTwoPayload>(
      endpoints.bookings.stepTwo,
      payload,
    ),
  stepThree: (payload: ConsultationStepThreePayload) =>
    api.post<ApiResponse<ConsultationStepResult>, ConsultationStepThreePayload>(
      endpoints.bookings.stepThree,
      payload,
    ),
  stepFour: (payload: ConsultationStepFourPayload) =>
    api.post<ApiResponse<ConsultationStepResult>, ConsultationStepFourPayload>(
      endpoints.bookings.stepFour,
      payload,
    ),
  stepFive: (payload: { consultation_id: Id; front_smile: File }) => {
    const formData = new FormData();
    formData.append("consultation_id", String(payload.consultation_id));
    formData.append("front_smile", payload.front_smile);

    return api.upload<ApiResponse<ConsultationStepResult>>(
      endpoints.bookings.stepFive,
      formData,
    );
  },
  stepSix: (payload: { consultation_id: Id; file: File; notes?: string }) => {
    const formData = new FormData();
    formData.append("consultation_id", String(payload.consultation_id));
    formData.append("file", payload.file);
    if (payload.notes) formData.append("notes", payload.notes);

    return api.upload<ApiResponse<ConsultationStepResult>>(
      endpoints.bookings.stepSix,
      formData,
    );
  },
  stepSeven: (payload: ConsultationStepSevenPayload) =>
    api.post<ApiResponse<ConsultationStepResult>, ConsultationStepSevenPayload>(
      endpoints.bookings.stepSeven,
      payload,
    ),
};

export const patientApi = {
  profile: <TProfile = unknown>() =>
    api.get<ApiResponse<TProfile>>(endpoints.patient.profile),
  updateProfile: <TProfile = unknown, TPayload = unknown>(payload: TPayload) =>
    api.patch<ApiResponse<TProfile>, TPayload>(
      endpoints.patient.profile,
      payload,
    ),
};

export const dentistApi = {
  global_procedure_list: () =>
    api.get<ApiResponse<unknown>>(
      endpoints.dentist.global_procedure_list,
    ),
  profile: <TProfile = unknown>() =>
    api.get<ApiResponse<TProfile>>(endpoints.dentist.profile),
  updateProfile: <TProfile = unknown, TPayload = unknown>(payload: TPayload) =>
    api.patch<ApiResponse<TProfile>, TPayload>(
      endpoints.dentist.profile,
      payload,
    ),
  professionalDetails: <TResult = unknown, TPayload = unknown>(
    payload: TPayload,
  ) =>
    api.post<ApiResponse<TResult>, TPayload>(
      endpoints.dentist.professionalDetails,
      payload,
    ),
  updateProfessionalDetails: <TResult = unknown, TPayload = unknown>(
    payload: TPayload,
  ) =>
    api.post<ApiResponse<TResult>, TPayload>(
      endpoints.dentist.professionalDetails,
      payload,
    ),

  // step one
  stepOne: (payload: FormData) =>
    api.upload<ApiResponse<unknown>>(
      endpoints.dentist.stepOne,
      payload,
    ),
  stepOneCheck: () =>
    api.get<ApiResponse<unknown>>(
      endpoints.dentist.stepOneCheck,
    ),

  // step two
  stepTwo: (payload: FormData) =>
    api.upload<ApiResponse<unknown>>(
      endpoints.dentist.stepTwo,
      payload,
    ),
  // Send step two data as JSON (no files)
  stepTwoJson: <TPayload = unknown>(payload: TPayload) =>
    api.post<ApiResponse<unknown>, TPayload>(
      endpoints.dentist.stepTwo,
      payload,
    ),
  // Send step two as multipart with files + JSON data field
  stepTwoWithFiles: (formData: FormData) =>
    api.upload<ApiResponse<unknown>>(
      endpoints.dentist.stepTwo,
      formData,
    ),
  stepTwoCheck: () =>
    api.get<ApiResponse<unknown>>(
      endpoints.dentist.stepTwoCheck,
    ),

  // step three
  stepThree: (payload: FormData) =>
    api.upload<ApiResponse<unknown>>(
      endpoints.dentist.stepThree,
      payload,
    ),
  stepThreeCheck: () =>
    api.get<ApiResponse<unknown>>(
      endpoints.dentist.stepThreeCheck,
    ),
  getVerificationProgress: () =>
    api.get<ApiResponse<unknown>>(
      endpoints.dentist.verificationProgress,
    ),
  updateVerificationPhase: (payload: { verification_phase: string }) =>
    api.post<ApiResponse<unknown>, { verification_phase: string }>(
      endpoints.dentist.updateVerificationPhase,
      payload,
    ),
    dentistProcedureList: () =>
    api.get<ApiResponse<unknown>>(
      endpoints.dentist.dentist_procedure_list,
    ),
};

export const adminApi = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthResult>, LoginPayload>(
      endpoints.admin.login,
      payload,
    ),
  addUser: (payload: AddUserPayload) =>
    api.post<ApiResponse<unknown>, AddUserPayload>(
      endpoints.admin.addUser,
      payload,
    ),
  profile: <TProfile = unknown>() =>
    api.get<ApiResponse<TProfile>>(endpoints.admin.profile),
  listDentists: <TDentist = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TDentist>>(endpoints.admin.dentists, { params }),
  getDentistProfile: <TDentist = unknown>(id: string) =>
    api.get<ApiResponse<TDentist>>(endpoints.admin.get_dentist_profile(id)),
  phaseOneApprove: (id: string) =>
    api.post<ApiResponse<unknown>, void>(endpoints.admin.phase_one_approve(id)),
  phaseOneReject: (id: string) =>
    api.post<ApiResponse<unknown>, void>(endpoints.admin.phase_one_reject(id),),
  phaseTwoApprove: (id: string) =>
    api.post<ApiResponse<unknown>, void>(endpoints.admin.phase_two_approve(id),),
  phaseTwoReject: (id: string) =>
    api.post<ApiResponse<unknown>, void>(endpoints.admin.phase_two_reject(id),),
  phaseThreeApprove: (id: string) =>
    api.post<ApiResponse<unknown>, void>(endpoints.admin.phase_three_approve(id),
    ),
  
  phaseThreeReject: (id: string) =>
    api.post<ApiResponse<unknown>, void>(endpoints.admin.phase_three_reject(id),),
  listPatients: <TPatient = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TPatient>>(endpoints.admin.patients, { params }),
  listBookings: <TBooking = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TBooking>>(endpoints.admin.bookings, { params }),
  listReviews: <TReview = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TReview>>(endpoints.admin.reviews, { params }),
  listPayments: <TPayment = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TPayment>>(endpoints.admin.payments, { params }),
  listReports: <TReport = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TReport>>(endpoints.admin.reports, { params }),
  listLicenseQueue: <TQueue = unknown>(params?: ListParams) =>
    api.get<PaginatedResponse<TQueue>>(endpoints.admin.verificationQueue, { params }),
};

export function createResourceApi<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
>(root: string, byId: (id: Id) => string) {
  return {
    list: (params?: ListParams) =>
      api.get<PaginatedResponse<TEntity>>(root, { params }),
    getById: (id: Id) => api.get<ApiResponse<TEntity>>(byId(id)),
    create: (payload: TCreate) =>
      api.post<ApiResponse<TEntity>, TCreate>(root, payload),
    update: (id: Id, payload: TUpdate) =>
      api.patch<ApiResponse<TEntity>, TUpdate>(byId(id), payload),
    replace: (id: Id, payload: TCreate) =>
      api.put<ApiResponse<TEntity>, TCreate>(byId(id), payload),
    remove: (id: Id) => api.delete<ApiResponse<unknown>>(byId(id)),
  };
}

export const bookingApi = createResourceApi(
  endpoints.bookings.root,
  endpoints.bookings.byId,
);

export const consultationApi = createResourceApi(
  endpoints.consultations.root,
  endpoints.consultations.byId,
);

export const publicDentistApi = createResourceApi(
  endpoints.dentists.root,
  endpoints.dentists.byId,
);

export const reviewApi = createResourceApi(
  endpoints.reviews.root,
  endpoints.reviews.byId,
);
