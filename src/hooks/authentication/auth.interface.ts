export interface RegisterPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: string;
  referral_code?: string;
  email: string;
  password: string;
  confirm_password?: string;
  role: "PATIENT" | "DENTIST";
}


export interface LoginPayload {
  email: string;
  password: string;
  role: "PATIENT" | "DENTIST" | "ADMIN";
}

export interface OtpPayload {
  email: string;
  otp: string;
}
