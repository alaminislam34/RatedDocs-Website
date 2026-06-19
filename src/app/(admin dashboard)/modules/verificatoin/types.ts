"use client";

import type { License } from "@/types/license";

export type QueueStatus = "pending" | "approved" | "rejected";
export type PhaseStatus = "approved" | "pending" | "rejected" | "locked";
export type PhaseKey = "ph1" | "ph2" | "ph3";

export interface PhaseMeta {
  status: PhaseStatus;
}

export interface VerificationDentist extends License {
  queue_status: QueueStatus;
  dentist_name?: string;
  specialty?: string;
  avatar_color?: string;
  location?: string;
  submitted_ago?: string;
  rdv_score?: number;
  phases?: Record<PhaseKey, PhaseMeta>;
  ph1_data?: {
    auto_approved?: boolean;
    auto_approved_message?: string;
    license?: { number?: string; issuing_state?: string };
    government_id?: {
      file_name: string;
      file_size: string;
      verified_note: string;
    };
    selfie?: { file_name: string; ai_match_score: number; confidence: string };
  };
  ph2_data?: {
    rejection_reason?: string;
    sterilization_evidence?: {
      video_walkthrough?: { file_name: string; file_size: string };
      jci_certificate?: { file_name: string; file_size: string };
    };
    procedure_pricing?: { procedure: string; price: number; notes: string }[];
    no_surprise_guarantee?: {
      description: string;
      signer_name: string;
      typed_signature: string;
      agreed_at: string;
    };
  };
  ph3_data?: {
    rejection_reason?: string;
    clinic_location: string;
    specialties?: {
      name: string;
      doc_count: number;
      status: "complete" | "missing";
      missing_count?: number;
      documents: {
        label: string;
        file_name?: string;
        file_size?: string;
        missing: boolean;
        missing_label?: string;
        missing_note?: string;
      }[];
    }[];
  };
}

export interface VerificationStats {
  total_dentists: number;
  pending_review: number;
  fully_approved: number;
  rejected: number;
}
