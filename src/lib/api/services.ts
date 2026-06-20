import { LoginPayload, OtpPayload, RegisterPayload } from "@/hooks/authentication/auth.interface";
import type { StepTwoI } from "@/hooks/dentist/dentist.interface";
import { api, type ApiResponse, type PaginatedResponse } from "./client";
import { endpoints } from "./endpoints";

type Id = string | number;
type ListParams = Record<string, string | number | boolean | undefined>;

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
  user: {
    id: Id;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    role: string;
  };
  role: string;
  access?: string;
  refresh?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  profile_created?: boolean;
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
  stepTwo: (payload: StepTwoI) =>
    api.post<ApiResponse<unknown>, StepTwoI>(
      endpoints.dentist.stepTwo,
      payload,
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
