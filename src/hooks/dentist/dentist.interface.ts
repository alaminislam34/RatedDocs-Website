export interface StepOneI {
  professional_headshot: File;
  city: string;
  country: string;
  registration_authority: number;
  registration_no: string;
  file: File;
}

export interface StepTwoI {
  jci_certificate?: File | null;
  walkthrough_video?: File | null;
  procedures: {
    procedure_id?: number;
    procedure_name?: string;
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
