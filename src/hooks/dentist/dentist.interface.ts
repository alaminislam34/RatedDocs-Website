export interface StepOneI {
  professional_headshot: File;
  city: string;
  country: string;
  registration_authority: number;
  registration_no: string;
  file: File;
}

export interface StepTwoI {
  sterilization: {
    has_jci_certificate: boolean;
    jci_certificate?: File | null;
    certificate_number: string;
    expiry_date: string;
    issuing_authority: string;
    issue_date: string;
    walkthrough_video?: File | null;
    autoclave_brand: boolean;
    sealed_pouch_visible: boolean;
    ultrasonic_cleaner_available: boolean;
  };
  procedures: {
    procedure: number;
    price: number;
    currency: string;
    option_notes: string;
  }[];
  guarantee: {
    signer_name: string;
    typed_signature: string;
    accepted_terms: boolean;
  };
}

export interface StepThreeI {
  materials: {
    own_procedure: number;
    brand_name: string;
    ce_certificate: File;
    material_brands: File;
    invoice: File;
    protocol_pdf: File;
    notes: string;
  }[];
}

export interface ProfessionalDetailsI {
  full_name: string;
  specialty: string;
  experience_years: number;
  city: string;
  country: string;
}

export interface LicenseStepData {
  id: number;
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
  verified_at: string;
  reviewer_notes: string;
  dentist: number;
  verification: number;
  registration_authority: number;
}

export interface LicenseVerifyProgressResponse {
  success: boolean;
  message: string;
  data: {
    submitted: boolean;
    status: string | null;
    data?: LicenseStepData;
  };
}
// types/dentist.ts
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_verified: boolean;
}

export interface DentistAddress {
  id: number;
  city: string;
  country: string;
  // Add other fields if needed
}

export interface DentistProfile {
  id: number;
  user: User;
  full_name: string;
  phone: string | null;
  specialty: string;
  bio: string | null;
  experience_years: number;
  rating_avg: number;
  total_reviews: number;
  rdv_score: number;
  response_time_avg: number;
  verification_phase: string; // e.g., "LICENSE", "OPERATIONS", "CLINICAL"
  is_verified: boolean;
  dentist_address: DentistAddress[];
}
