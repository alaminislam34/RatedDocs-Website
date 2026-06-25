import { ConsultationStatus } from "@/types/patient_portal.interface";

export interface TreatmentPlan {
  id: string;
  slug: string;
  estimate_status: "pending" | "accepted" | "rejected";
  payment_status: "pending" | "paid" | "refunded";
  doctor: {
    name: string;
    specialty: string;
    image: string;
    rating: number;
    reviewCount: number;
  };
  procedure: {
    name: string;
    breakdown: Array<{ label: string; price: number | string }>;
    totalEstimate: number;
    maxLeeway: number;
  };
  timeline: {
    days: string;
    dates: string;
    remainingTime: string;
  };
}

export const treatmentPlansData: TreatmentPlan[] = [
  {
    id: "TP-001",
    slug: "all-on-4-full-arch",

    estimate_status: "pending",
    payment_status: "pending",
    doctor: {
      name: "Dr. Alex Hemsworth",
      specialty: "Orthodontist",
      image: "/doctors/alex.png",
      rating: 5,
      reviewCount: 8,
    },
    procedure: {
      name: "All-on-4 Full Arch",
      breakdown: [
        { label: "Initial examination", price: "Included" },
        { label: "CBCT scan (if needed)", price: 693 },
        { label: "Temporary prosthesis", price: 1039 },
        { label: "Final fitting & adjustments", price: 346 },
      ],
      totalEstimate: 1075,
      maxLeeway: 1236,
    },
    timeline: {
      days: "4-5 days",
      dates: "June 15-20 2026",
      remainingTime: "12:59:20",
    },
  },
  {
    id: "TP-002",

    slug: "invisalign-full-course",

    estimate_status: "accepted",
    payment_status: "paid",
    doctor: {
      name: "Dr. Eliza Mick",
      specialty: "Orthodontist",
      image: "/doctors/eliza.png",
      rating: 5,
      reviewCount: 12,
    },
    procedure: {
      name: "Invisalign Full Course",
      breakdown: [
        { label: "Consultation", price: "Included" },
        { label: "3D Digital Scan", price: 450 },
        { label: "Aligner Set (Upper/Lower)", price: 3200 },
      ],
      totalEstimate: 3650,
      maxLeeway: 4197,
    },
    timeline: {
      days: "12-18 months",
      dates: "July 01 2026 - Jan 2028",
      remainingTime: "00:00:00",
    },
  },
  {
    id: "TP-003",

    slug: "gum-grafting-procedure",
    estimate_status: "pending",
    payment_status: "pending",
    doctor: {
      name: "Dr. Sarah Jenkins",
      specialty: "Periodontist",
      image: "/doctors/sarah.png",
      rating: 4.8,
      reviewCount: 24,
    },
    procedure: {
      name: "Gum Grafting",
      breakdown: [
        { label: "Deep Cleaning", price: 200 },
        { label: "Tissue Graft Surgery", price: 1500 },
        { label: "Post-op Follow-up", price: "Included" },
      ],
      totalEstimate: 1700,
      maxLeeway: 1955,
    },
    timeline: {
      days: "1-2 days",
      dates: "August 10-12 2026",
      remainingTime: "23:15:05",
    },
  },
  {
    id: "TP-004",

    slug: "single-tooth-implant",
    estimate_status: "accepted",
    payment_status: "paid",
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Implantologist",
      image: "/doctors/michael.png",
      rating: 4.9,
      reviewCount: 45,
    },
    procedure: {
      name: "Single Tooth Implant",
      breakdown: [
        { label: "Titanium Post", price: 1200 },
        { label: "Abutment", price: 400 },
        { label: "Porcelain Crown", price: 900 },
      ],
      totalEstimate: 2500,
      maxLeeway: 2875,
    },
    timeline: {
      days: "3-6 months",
      dates: "Sept 15 2026 - March 2027",
      remainingTime: "00:00:00",
    },
  },
  {
    id: "TP-005",
    slug: "porcelain-veneers-6-teeth",
    estimate_status: "accepted",
    payment_status: "pending",
    doctor: {
      name: "Dr. Julianna Rossi",
      specialty: "Cosmetic Dentist",
      image: "/doctors/julianna.png",
      rating: 5,
      reviewCount: 19,
    },
    procedure: {
      name: "Porcelain Veneers (6 teeth)",
      breakdown: [
        { label: "Prep & Shaping", price: 600 },
        { label: "Custom Veneers", price: 5400 },
        { label: "Bonding Session", price: 800 },
      ],
      totalEstimate: 6800,
      maxLeeway: 7820,
    },
    timeline: {
      days: "7-10 days",
      dates: "Oct 05-15 2026",
      remainingTime: "47:59:59",
    },
  },
];

export interface ConsultationFlowItem {
  id: string;
  slug: string;
  status: ConsultationStatus;
  doctor: {
    name: string;
    specialty: string;
    image: string;
    rating: number;
    reviewCount: number;
  };
  procedure: string;
  estimateBudget: string;
  accuracy: string;
  rdvScore: number;
  date: string;
  time: string;
  timezone: string;
  duration: string;
  isoDate: string;
  alertMessage?: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
}

export const consultationFlowData: ConsultationFlowItem[] = [
  //ConsultationStatus.SCHEDULED─────────────────────────────────────────────────────────────────
  {
    id: "consultation-004",
    slug: "dr-alex-hemsworth",
    status: ConsultationStatus.SCHEDULED,
    doctor: {
      name: "Dr. Alex Hemsworth",
      specialty: "Implantologist",
      image: "/images/dentist.png",
      rating: 4.9,
      reviewCount: 34,
    },
    procedure: "Single Tooth Implant",
    estimateBudget: "$2,200 - $2,600",
    accuracy: "94% Accuracy",
    rdvScore: 97,
    date: "Monday, 02 June 2026",
    isoDate: "2026-06-02",
    time: "11:00 AM EST",
    timezone: "EST",
    duration: "15-minute video call",
    primaryActionLabel: "Join Consultation",
    secondaryActionLabel: "Add to calendar",
  },
  {
    id: "consultation-005",
    slug: "dr-sarah-jenkins",
    status: ConsultationStatus.SCHEDULED,
    doctor: {
      name: "Dr. Sarah Jenkins",
      specialty: "Periodontist",
      image: "/images/dentist.png",
      rating: 4.8,
      reviewCount: 21,
    },
    procedure: "Gum Grafting",
    estimateBudget: "$1,800 - $2,100",
    accuracy: "93% Accuracy",
    rdvScore: 95,
    date: "Wednesday, 04 June 2026",
    isoDate: "2026-06-04",
    time: "2:30 PM GMT",
    timezone: "GMT",
    duration: "15-minute video call",
    primaryActionLabel: "Join Consultation",
    secondaryActionLabel: "Add to calendar",
  },
  // ── Active / Missed ───────────────────────────────────────────────────────────
  {
    id: "consultation-001",
    slug: "dr-eliza-mick",
    status: ConsultationStatus.DRAFT,
    doctor: {
      name: "Dr. Eliza Mick",
      specialty: "Orthodontist",
      image: "/images/dentist.png",
      rating: 5,
      reviewCount: 8,
    },
    procedure: "All-on-4 Full Arch",
    estimateBudget: "$3,760 - $4,300",
    accuracy: "96% Accuracy",
    rdvScore: 100,
    date: "Tuesday, 29 April 2025",
    isoDate: "2025-04-29",
    time: "10:30 AM EST",
    timezone: "EST",
    duration: "15-minute video call",
    primaryActionLabel: "Join Consultation",
    secondaryActionLabel: "Add to calendar",
  },
  {
    id: "consultation-002",
    slug: "dr-eliza-mick-reschedule",
    status: ConsultationStatus.CANCELLED,
    doctor: {
      name: "Dr. Eliza Mick",
      specialty: "Orthodontist",
      image: "/images/dentist.png",
      rating: 5,
      reviewCount: 8,
    },
    procedure: "All-on-4 Full Arch",
    estimateBudget: "$3,760 - $4,300",
    accuracy: "96% Accuracy",
    rdvScore: 100,
    date: "Tuesday, 29 April 2025",
    isoDate: "2025-04-29",
    time: "10:30 AM EST",
    timezone: "EST",
    duration: "15-minute video call",
    alertMessage:
      "You missed your consultation. You can book any available slot in the next 24 hours. After that, this option will expire.",
    primaryActionLabel: "Reschedule",
    secondaryActionLabel: "Add to calendar",
  },
  // ── Completed (Estimate Updates tab) ─────────────────────────────────────────
  {
    id: "consultation-003",
    slug: "dr-eliza-will",
    status: ConsultationStatus.COMPLETED,
    doctor: {
      name: "Dr. Eliza Will",
      specialty: "Consultant Dentist",
      image: "/images/dentist.png",
      rating: 5,
      reviewCount: 12,
    },
    procedure: "Smile Analysis",
    estimateBudget: "$1,700",
    accuracy: "95% Accuracy",
    rdvScore: 100,
    date: "Thursday, 16 April 2026",
    isoDate: "2026-04-16",
    time: "5:00 PM GMT",
    timezone: "GMT",
    duration: "15-minute video call",
    primaryActionLabel: "View Summary",
  },
];

export function getConsultationFlowItemBySlug(slug: string) {
  return consultationFlowData.find((item) => item.slug === slug) ?? consultationFlowData[0];
}

export interface ProgressStep {
  label: string;
  completed: boolean;
}

export interface TimelineStep {
  title: string;
  description: string;
  completed: boolean;
  link?: { label: string };
}

export interface InProgressBooking {
  id: string;
  slug: string;
  bookingStatus: "in_progress" | "completed" | "rejected";
  doctor: {
    name: string;
    specialty: string;
    image: string;
    rating: number;
    reviewCount: number;
    rdvScore: number;
    isVerified: boolean;
  };
  procedure: string;
  appointmentDate: string;
  estimateBudget: number;
  paymentStatus: "in_escrow" | "paid" | "pending" | "refunded";
  progressSteps: ProgressStep[];
  infoMessage: string;
  treatmentPlan: {
    breakdown: Array<{ label: string; price: number | string }>;
    totalEstimate: number;
    leewayPercent: number;
  };
  timeline: TimelineStep[];
  clinicLocation: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  arrivalCode: string;
  paymentCode: string;
  finalPlan?: {
    breakdown: Array<{ label: string; price: number | string }>;
    finalTotal: number;
    isWithinLeeway: boolean;
  };
  journeyCompleted?: {
    finalAmount: number;
    treatmentDuration: string;
    location: string;
  };
}

export const inProgressBookingsData: InProgressBooking[] = [
  {
    id: "IB-001",
    slug: "all-on-4-full-arch",
    bookingStatus: "in_progress",
    doctor: {
      name: "Dr. Eliza Mick",
      specialty: "Orthodontist",
      image: "/images/dentist.png",
      rating: 5,
      reviewCount: 8,
      rdvScore: 100,
      isVerified: true,
    },
    procedure: "All-on-4 Full Arch",
    appointmentDate: "June 15, 2026 · 9:00 AM",
    estimateBudget: 1200,
    paymentStatus: "in_escrow",
    progressSteps: [
      { label: "Payment Confirmed", completed: true },
      { label: "Travel destination", completed: true },
      { label: "Day 1 arrival, CBCT examination", completed: true },
      { label: "Final Treatment Plan Confirm", completed: false },
      { label: "Treatment Done", completed: false },
    ],
    infoMessage:
      "Review your treatment details, including arrival date and any updates, to confirm next steps.",
    treatmentPlan: {
      breakdown: [
        { label: "Initial examination", price: "Included" },
        { label: "CBCT scan (if needed)", price: 693 },
        { label: "Temporary prosthesis", price: 1039 },
        { label: "Temporary prosthesis", price: 1200 },
        { label: "Final fitting & adjustments", price: 346 },
      ],
      totalEstimate: 1075,
      leewayPercent: 15,
    },
    timeline: [
      {
        title: "Payment Confirmed",
        description: "$1075 held in escrow • April 30, 2026",
        completed: true,
      },
      {
        title: "Travel destination",
        description: "Cancun, Mexico • May 02, 2026",
        completed: true,
        link: { label: "View map location" },
      },
      {
        title: "Day 1 arrival, CBCT examination",
        description: "Show arrival code at clinic • May 03, 2026",
        completed: true,
      },
      {
        title: "Final Treatment Plan Confirm",
        description: "Dr Alex submit final price you confirm via sms • May 02, 2026",
        completed: true,
      },
      {
        title: "Treatment Done",
        description: "Review to the doctor",
        completed: true,
      },
    ],
    clinicLocation: {
      address: "123 Smile Avenue, Suite 202, Mexico City, Mexico 01010",
      city: "Mexico City",
      country: "Mexico",
      lat: 19.4326,
      lng: -99.1332,
    },
    arrivalCode: "7623",
    paymentCode: "5263",
    finalPlan: {
      breakdown: [
        { label: "Initial examination", price: "Included" },
        { label: "CBCT scan (if needed)", price: 693 },
        { label: "Temporary prosthesis", price: 1039 },
        { label: "Temporary prosthesis", price: 1200 },
        { label: "Final fitting & adjustments", price: 346 },
      ],
      finalTotal: 1150,
      isWithinLeeway: true,
    },
    journeyCompleted: {
      finalAmount: 1150,
      treatmentDuration: "April 30 – May 5, 2026",
      location: "Cancun, Mexico",
    },
  },
];

export function getInProgressBookingBySlug(slug: string): InProgressBooking | undefined {
  return inProgressBookingsData.find((b) => b.slug === slug);
}
