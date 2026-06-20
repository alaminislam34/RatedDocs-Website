// Booking Form Data Types and Services
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  country: string;
}

export interface BookingFormData {
  personalInfo: PersonalInfo;
  procedure: string;
  budget: string;
  travelFrom: string;
  travelTo: string;
  dentalHistory: {
    lastVisit: string;
    conditions: string[];
    additionalInfo: string;
  };
  photos: {
    required: File[];
    recommended: File[];
  };
  xray: File | null;
}

const DRAFT_SCHEMA_VERSION = 1;
const BOOKING_DRAFT_PREFIX = "booking_draft";
const ACTIVE_BOOKING_ID_KEY = "booking_active_id";
const SELECTED_DENTIST_KEY = "selected_dentist";
const BOOKINGS_KEY = "submitted_bookings";

const INITIAL_BOOKING_DATA: BookingFormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "",
  },
  procedure: "",
  budget: "",
  travelFrom: "",
  travelTo: "",
  dentalHistory: {
    lastVisit: "",
    conditions: [],
    additionalInfo: "",
  },
  photos: {
    required: [],
    recommended: [],
  },
  xray: null,
};

const INITIAL_SUBMITTED_BOOKINGS: SubmittedBooking[] = [];

type BookingDraftMeta = {
  schemaVersion: typeof DRAFT_SCHEMA_VERSION;
  bookingId: string;
  dentistId: string | null;
  step: number;
  createdAt: string;
  updatedAt: string;
};

type BookingDraft = BookingFormData & BookingDraftMeta;

const createBookingId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `booking_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const cloneInitialData = (): BookingFormData => ({
  personalInfo: { ...INITIAL_BOOKING_DATA.personalInfo },
  procedure: INITIAL_BOOKING_DATA.procedure,
  budget: INITIAL_BOOKING_DATA.budget,
  travelFrom: INITIAL_BOOKING_DATA.travelFrom,
  travelTo: INITIAL_BOOKING_DATA.travelTo,
  dentalHistory: {
    ...INITIAL_BOOKING_DATA.dentalHistory,
    conditions: [...INITIAL_BOOKING_DATA.dentalHistory.conditions],
  },
  photos: {
    required: [...INITIAL_BOOKING_DATA.photos.required],
    recommended: [...INITIAL_BOOKING_DATA.photos.recommended],
  },
  xray: INITIAL_BOOKING_DATA.xray,
});

const getBookingDraftKey = (bookingId: string) => `${BOOKING_DRAFT_PREFIX}:${bookingId}`;

const safeParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const isDraftPayload = (value: unknown): value is BookingDraft => {
  if (!value || typeof value !== "object") return false;

  const draft = value as Record<string, unknown>;
  return (
    draft.schemaVersion === DRAFT_SCHEMA_VERSION &&
    typeof draft.bookingId === "string" &&
    typeof draft.createdAt === "string" &&
    typeof draft.updatedAt === "string" &&
    ("dentistId" in draft ? typeof draft.dentistId === "string" || draft.dentistId === null : true)
  );
};

const getCurrentBookingId = () => {
  if (typeof window === "undefined") return null;

  const urlBookingId = new URLSearchParams(window.location.search).get("bookingId");
  if (urlBookingId) return urlBookingId;

  return localStorage.getItem(ACTIVE_BOOKING_ID_KEY);
};

const persistDraft = (draft: BookingDraft) => {
  if (typeof window === "undefined") return draft;

  localStorage.setItem(getBookingDraftKey(draft.bookingId), JSON.stringify(draft));
  localStorage.setItem(ACTIVE_BOOKING_ID_KEY, draft.bookingId);
  if (draft.dentistId) {
    localStorage.setItem(SELECTED_DENTIST_KEY, draft.dentistId);
  }

  return draft;
};

const createDraft = (bookingId?: string): BookingDraft => {
  const resolvedBookingId = bookingId ?? getCurrentBookingId() ?? createBookingId();
  const now = new Date().toISOString();

  return {
    ...cloneInitialData(),
    schemaVersion: DRAFT_SCHEMA_VERSION,
    bookingId: resolvedBookingId,
    dentistId: null,
    step: 1,
    createdAt: now,
    updatedAt: now,
  };
};

const loadDraft = (bookingId?: string): BookingDraft | null => {
  if (typeof window === "undefined") return null;

  const resolvedBookingId = bookingId ?? getCurrentBookingId();
  if (!resolvedBookingId) return null;

  const raw = localStorage.getItem(getBookingDraftKey(resolvedBookingId));
  const parsed = safeParse<unknown>(raw);
  if (!isDraftPayload(parsed)) return null;

  return parsed;
};

const getOrCreateDraft = (bookingId?: string) => {
  const existing = loadDraft(bookingId);
  return existing ?? persistDraft(createDraft(bookingId));
};

const extractBookingData = (draft: BookingDraft): BookingFormData => ({
  personalInfo: { ...draft.personalInfo },
  procedure: draft.procedure,
  budget: draft.budget,
  travelFrom: draft.travelFrom,
  travelTo: draft.travelTo,
  dentalHistory: {
    ...draft.dentalHistory,
    conditions: [...draft.dentalHistory.conditions],
  },
  photos: {
    required: [...draft.photos.required],
    recommended: [...draft.photos.recommended],
  },
  xray: draft.xray,
});

export function getBookingDraftContext(bookingId?: string) {
  const draft = loadDraft(bookingId);
  if (!draft) return null;

  return {
    bookingId: draft.bookingId,
    dentistId: draft.dentistId,
    step: draft.step,
  };
}

export function setBookingDraftDentist(bookingId: string, dentistId: string) {
  if (typeof window === "undefined") return;

  const draft = getOrCreateDraft(bookingId);
  persistDraft({
    ...draft,
    dentistId,
    updatedAt: new Date().toISOString(),
  });
}

export function initializeBookingData() {
  if (typeof window !== "undefined") {
    const submittedBookings = localStorage.getItem(BOOKINGS_KEY);
    if (!submittedBookings) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_SUBMITTED_BOOKINGS));
    }
  }
}

export function getBookingData(): BookingFormData {
  if (typeof window === "undefined") return cloneInitialData();

  const draft = loadDraft();
  if (draft) return extractBookingData(draft);

  const legacy = safeParse<BookingFormData>(localStorage.getItem("booking_form_data"));
  if (legacy) {
    return {
      ...cloneInitialData(),
      ...legacy,
      personalInfo: { ...cloneInitialData().personalInfo, ...legacy.personalInfo },
      dentalHistory: {
        ...cloneInitialData().dentalHistory,
        ...legacy.dentalHistory,
        conditions: legacy.dentalHistory?.conditions ?? [],
      },
      photos: {
        ...cloneInitialData().photos,
        ...legacy.photos,
      },
    };
  }

  return cloneInitialData();
}

export function updateBookingData(updates: Partial<BookingFormData>): BookingFormData {
  if (typeof window === "undefined") return cloneInitialData();

  const draft = getOrCreateDraft();
  const updated: BookingDraft = persistDraft({
    ...draft,
    ...updates,
    personalInfo: {
      ...draft.personalInfo,
      ...updates.personalInfo,
    },
    dentalHistory: {
      ...draft.dentalHistory,
      ...updates.dentalHistory,
      conditions: updates.dentalHistory?.conditions ?? draft.dentalHistory.conditions,
    },
    photos: {
      ...draft.photos,
      ...updates.photos,
    },
    step: draft.step,
    updatedAt: new Date().toISOString(),
  });

  return extractBookingData(updated);
}

export function updatePersonalInfo(info: Partial<PersonalInfo>) {
  const current = getOrCreateDraft();
  const updated = persistDraft({
    ...current,
    personalInfo: { ...current.personalInfo, ...info },
    step: current.step,
    updatedAt: new Date().toISOString(),
  });
  return extractBookingData(updated);
}

export function updateDentalHistory(history: Partial<BookingFormData["dentalHistory"]>) {
  const current = getOrCreateDraft();
  const updated = persistDraft({
    ...current,
    dentalHistory: {
      ...current.dentalHistory,
      ...history,
      conditions: history.conditions ?? current.dentalHistory.conditions,
    },
    step: current.step,
    updatedAt: new Date().toISOString(),
  });
  return extractBookingData(updated);
}

export function updateTreatmentDetails(
  details: Partial<Pick<BookingFormData, "procedure" | "budget" | "travelFrom" | "travelTo">>,
) {
  const current = getOrCreateDraft();
  const updated = persistDraft({
    ...current,
    ...details,
    step: current.step,
    updatedAt: new Date().toISOString(),
  });
  return extractBookingData(updated);
}

export function clearBookingData(bookingId?: string) {
  if (typeof window === "undefined") return;

  const resolvedBookingId = bookingId ?? getCurrentBookingId();
  if (resolvedBookingId) {
    localStorage.removeItem(getBookingDraftKey(resolvedBookingId));
  }
  localStorage.removeItem(ACTIVE_BOOKING_ID_KEY);
  localStorage.removeItem("booking_form_data");
}

export function clearBookingResumeState() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACTIVE_BOOKING_ID_KEY);
}

export function updateBookingStep(bookingId: string | undefined, step: number) {
  if (typeof window === "undefined") return;

  const draft = getOrCreateDraft(bookingId);
  persistDraft({
    ...draft,
    step: Math.max(1, step),
    updatedAt: new Date().toISOString(),
  });
}

// Selected Dentist Management
export function setSelectedDentist(dentistId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SELECTED_DENTIST_KEY, dentistId);
  }
}

export function getSelectedDentist(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SELECTED_DENTIST_KEY);
  } catch {
    return null;
  }
}

export function clearSelectedDentist() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SELECTED_DENTIST_KEY);
  }
}

// Booking Submissions

export interface SubmittedBooking extends BookingFormData {
  id: string;
  dentistId: string;
  submittedAt: string;
}

export function submitBooking(dentistId: string, bookingId?: string): SubmittedBooking {
  if (typeof window === "undefined") {
    throw new Error("Cannot submit booking outside of browser");
  }

  const draft = getOrCreateDraft(bookingId);
  const booking: SubmittedBooking = {
    ...extractBookingData(draft),
    id: `booking_${Date.now()}`,
    dentistId,
    submittedAt: new Date().toISOString(),
  };

  try {
    const existing = localStorage.getItem(BOOKINGS_KEY);
    const bookings: SubmittedBooking[] = existing ? JSON.parse(existing) : [];
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    clearBookingData(draft.bookingId);
    clearSelectedDentist();
    return booking;
  } catch {
    throw new Error("Failed to submit booking");
  }
}

export function getSubmittedBookings(): SubmittedBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
