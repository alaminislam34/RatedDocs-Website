export const API_BASE_URL =  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://52.60.153.12:8004/api/v1";
"http://10.10.20.11:8004/api/v1";
  
export const endpoints = {
  auth: {
    register: "/auth/signup/",
    login: "/auth/login/",
    logout: "/auth/logout/",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password/",
    resetPassword: "/auth/reset-password/",
    refreshToken: "/auth/token/refresh/",
    verifyToken: "/auth/token/verify/",
    verifyOtp: "/auth/verify-otp/",
    resendOtp: "/auth/resend-otp/",
  },
  patient: {
    register: "/auth/signup/",
    login: "/auth/signin/",
    profile: "/auth/profile",
    consultations: "/patient/consultations/",
  },

  // todo
  dentist: {
    profile: "/auth/profile",
    professionalDetails: "/dentist/enter-professional-details/",
    verificationProgress: "/dentist/verification-progress/",
    updateVerificationPhase: "/dentist/update-verification-phase/", // body: { "verification_phase": "COMPLETE"}
    // verification step
    stepOne: "/dentist/verification-step/license/",
    stepOneCheck: "/dentist/verification-step/license/",
    stepTwo: "/dentist/verification-step/operations/",
    stepTwoCheck: "/dentist/verification-step/operations/",
    global_procedure_list: "/procedure/procedures/",
    dentist_procedure_list: "/dentist/verification-step/dentist-procedure-list/",
    stepThree: "/dentist/verification-step/clinical-depth/",
    stepThreeCheck: "/dentist/verification-step/clinical-depth/",
  },

  // todo
  admin: {
    addUser: "/auth/add-user/",
    login: "/admin/login",
    profile: "/admin/profile",
    dentists: "/admin/dentists/",
    get_dentist_profile: (id: string) => `/admin/dentists/${id}/`,
    phase_one_approve: (id: string) => `/admin/dentist-verification/${id}/approve-license/`,
    phase_one_reject: (id: string) => `/admin/dentist-verification/${id}/reject-license/`,
    phase_two_approve: (id: string) => `/admin/dentist-verification/${id}/approve-operation/`,
    phase_two_reject: (id: string) => `/admin/dentist-verification/${id}/reject-operation/`,
    phase_three_approve: (id: string) => `/admin/dentist-verification/${id}/approve-clinical/`,
    phase_three_reject: (id: string) => `/admin/dentist-verification/${id}/reject-clinical/`,
    patients: "/admin/patients",
    bookings: "/admin/bookings",
    reviews: "/admin/reviews",
    payments: "/admin/payments",
    reports: "/admin/reports",
    notifications: "/admin/notifications",
    verificationQueue: "/admin/dentist-verification/",
  },

  // todo
  bookings: {
    stepOne: "/consultations/step-1/",
    getStepOne: "/consultations/step-1/",
    stepTwo: "/consultations/step-2/",
    getStepTwo: "/consultations/step-2/", //!! not available yet
    stepThree: "/consultations/step-3/",
    getStepThree: "/consultations/step-3/",  //!! not available yet
    stepFour: "/consultations/step-4/",
    getStepFour: "/consultations/step-4/", //!! not available yet
    stepFive: "/consultations/step-5/",
    getStepFive: "/consultations/step-5/", //!! not available yet
    stepSix: "/consultations/step-6/",
    getStepSix: "/consultations/step-6/", //!! not available yet
    stepSeven: "/consultations/step-7/",
    getStepSeven: "/consultations/step-7/", //!! not available yet
    root: "/bookings",
    byId: (id: string | number) => `/bookings/${id}`,
    get_current_consultation_id: "/consultations/get-id/",

  },
  procedures: {
    root: "/procedure/procedures/",
    byId: (id: string | number) => `/procedures/${id}`,
  },
  consultations: {
    root: "/patient/consultations/",
    byId: (id: string | number) => `/consultations/${id}`,
  },
  dentists: {
    root: "/patient/dentists/",
    byId: (id: string | number) => `/patient/dentists/${id}/`,
  },
  patients: {
    root: "/patients",
    byId: (id: string | number) => `/patients/${id}`,
  },
  reviews: {
    root: "/reviews",
    byId: (id: string | number) => `/reviews/${id}`,
  },
  uploads: {
    root: "/uploads",
  },
} as const;
