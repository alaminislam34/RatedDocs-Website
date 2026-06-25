// --- Sub-Interfaces ---

export interface Patient {
    id: number;
    full_name: string;
    date_of_birth: string; // Format: YYYY-MM-DD
    country: string;
    medical_notes: string;
}

export interface Dentist {
    id: number;
    full_name: string;
    specialty: string; // e.g., "DENTIST"
    experience_years: number;
    rating_avg: number;
    total_reviews: number;
    is_verified: boolean;
}

export interface TreatmentInterest {
    id: number;
    name: string;
}

export interface Schedule {
    id: number;
    created_at: string;
    updated_at: string;
    scheduled_at: string;
    re_scheduled_at: string | null;
    re_scheduled_confirm: string | boolean | null;
    timezone: string;
    duration_minutes: number;
    status: string;
    consultation: number;
    dentist: number;
}

export interface DentalPhoto {
    id: number;
    uploaded_photo_count: number;
    created_at: string;
    updated_at: string;
    front_smile: string | null;
    wide_smile: string | null;
    lower_arch: string | null;
    upper_arch: string | null;
    left_side: string | null;
    right_side: string | null;
    notes: string;
    consultation: number;
}

export interface XRays {
    id: number;
    created_at: string;
    updated_at: string;
    file: string | null;
    notes: string;
    consultation: number;
}

export interface DentalHistory {
    id: number;
    last_dentist_visit_display: string;
    created_at: string;
    updated_at: string;
    last_dentist_visit: string;
    conditions: string[];
    notes: string;
    consultation: number;
}

export interface VideoSession {
    id: number;
    created_at: string;
    updated_at: string;
    meeting_url: string;
    room_id: string;
    started_at: string;
    ended_at: string | null;
    status: string;
    consultation: number;
}

export enum ConsultationStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DRAFT = "draft",
    ESTIMATE_PENDING = "estimate_pending",
    ESTIMATE_RECEIVED = "estimate_received",
    ESTIMATE_ACCEPT = "estimate_accept",
}

export interface Consultation {
    id: number;
    patient: Patient;
    dentist: Dentist;
    status: ConsultationStatus;
    treatment_interest: TreatmentInterest[];
    approximate_budget: string;
    travel_start_date: string;
    travel_end_date: string;
    schedule: Schedule;
    dental_photo: DentalPhoto;
    xrays: XRays;
    dental_history: DentalHistory;
    video_session: VideoSession;
    created_at: string;
    updated_at: string;
}


export interface DentistList {
    id: number;
    name: string;
    image_url: string | null;
    rating_avg: string | null;
    total_reviews: string | null;
    location: string | null;
    specialty: string;
    total_consultations_completed: number;
    services: {
        name: string;
        description: string;
        price: string;
    }[];
}