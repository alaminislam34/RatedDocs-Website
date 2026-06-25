type Id = string | number;

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  country: string;
}

export interface BookingDraft {
  version: 2;
  currentStep: number;
  completedSteps: number[];
  consultationId: Id | null;
  selectedDentistIds: string[];
  selectedBackendDentistIds: number[];
  scheduleSelections: Array<{
    dentistId: string;
    backendDentistId: number | null;
    date: string;
    timeSlot: string;
    timezone: string;
  }>;
  personalInfo: PersonalInfo;
  procedure: string;
  procedureIds: number[];
  budget: string;
  travelFrom: string;
  travelTo: string;
  dentalHistory: {
    lastVisit: string;
    conditions: string[];
    additionalInfo: string;
  };
  xrayNotes: string;
}

export interface BookingFormData extends BookingDraft {
  photos: {
    required: File[];
    recommended: File[];
  };
  xray: File | null;
}

export interface SubmittedBooking extends BookingFormData {
  id: string;
  dentistId: string;
  submittedAt: string;
}

const BOOKING_DRAFT_KEY = "rateddocs_booking_draft_v2";
const LEGACY_BOOKING_STORAGE_KEY = "booking_form_data";
const LEGACY_SELECTED_DENTIST_KEY = "selected_dentist";
const LEGACY_BOOKINGS_KEY = "submitted_bookings";

const INITIAL_BOOKING_DRAFT: BookingDraft = {
  version: 2,
  currentStep: 1,
  completedSteps: [],
  consultationId: null,
  selectedDentistIds: [],
  selectedBackendDentistIds: [],
  scheduleSelections: [],
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "",
  },
  procedure: "",
  procedureIds: [],
  budget: "",
  travelFrom: "",
  travelTo: "",
  dentalHistory: {
    lastVisit: "",
    conditions: [],
    additionalInfo: "",
  },
  xrayNotes: "",
};

let frontSmileFile: File | null = null;
let wideSmileFile: File | null = null;
let upperArchFile: File | null = null;
let lowerArchFile: File | null = null;
let leftSideFile: File | null = null;
let rightSideFile: File | null = null;
let xrayFile: File | null = null;

const canUseStorage = () => typeof window !== "undefined";

function stripFiles(draft: BookingDraft): BookingFormData {
  const required: File[] = [];
  if (frontSmileFile) required.push(frontSmileFile);
  if (wideSmileFile) required.push(wideSmileFile);
  if (lowerArchFile) required.push(lowerArchFile);

  const recommended: File[] = [];
  if (upperArchFile) recommended.push(upperArchFile);
  if (leftSideFile) recommended.push(leftSideFile);
  if (rightSideFile) recommended.push(rightSideFile);

  return {
    ...draft,
    photos: {
      required,
      recommended,
    },
    xray: xrayFile,
  };
}

function normalizeDraft(value: unknown): BookingDraft {
  const parsed = typeof value === "object" && value !== null ? value : {};
  const record = parsed as Partial<BookingDraft>;

  return {
    ...INITIAL_BOOKING_DRAFT,
    ...record,
    version: 2,
    completedSteps: Array.isArray(record.completedSteps)
      ? record.completedSteps.filter((step) => Number.isInteger(step))
      : [],
    selectedDentistIds: Array.isArray(record.selectedDentistIds)
      ? record.selectedDentistIds.map(String)
      : [],
    selectedBackendDentistIds: Array.isArray(record.selectedBackendDentistIds)
      ? record.selectedBackendDentistIds
          .map(Number)
          .filter((id) => Number.isFinite(id))
      : [],
    scheduleSelections: Array.isArray(record.scheduleSelections)
      ? record.scheduleSelections.map((selection) => ({
          dentistId: String(selection.dentistId ?? ""),
          backendDentistId:
            selection.backendDentistId === null ||
            selection.backendDentistId === undefined
              ? null
              : Number(selection.backendDentistId),
          date: selection.date ?? "",
          timeSlot: selection.timeSlot ?? "",
          timezone: selection.timezone ?? "",
        }))
      : [],
    personalInfo: {
      ...INITIAL_BOOKING_DRAFT.personalInfo,
      ...(record.personalInfo ?? {}),
    },
    dentalHistory: {
      ...INITIAL_BOOKING_DRAFT.dentalHistory,
      ...(record.dentalHistory ?? {}),
    },
  };
}

function readLegacyDraft(): Partial<BookingDraft> | null {
  if (!canUseStorage()) return null;

  try {
    const legacy = localStorage.getItem(LEGACY_BOOKING_STORAGE_KEY);
    if (!legacy) return null;

    const data = JSON.parse(legacy) as Partial<BookingFormData>;
    return {
      personalInfo: {
        ...INITIAL_BOOKING_DRAFT.personalInfo,
        ...(data.personalInfo ?? {}),
      },
      procedure: data.procedure ?? "",
      budget: data.budget ?? "",
      travelFrom: data.travelFrom ?? "",
      travelTo: data.travelTo ?? "",
      dentalHistory: {
        ...INITIAL_BOOKING_DRAFT.dentalHistory,
        ...(data.dentalHistory ?? {}),
      },
    };
  } catch {
    return null;
  }
}

export function getBookingDraft(): BookingDraft {
  if (!canUseStorage()) return INITIAL_BOOKING_DRAFT;

  try {
    const stored = localStorage.getItem(BOOKING_DRAFT_KEY);
    if (stored) return normalizeDraft(JSON.parse(stored));

    const legacy = readLegacyDraft();
    return normalizeDraft(legacy ?? INITIAL_BOOKING_DRAFT);
  } catch {
    return INITIAL_BOOKING_DRAFT;
  }
}

export function saveBookingDraft(updates: Partial<BookingDraft>): BookingDraft {
  const current = getBookingDraft();
  const updated = normalizeDraft({
    ...current,
    ...updates,
    personalInfo: {
      ...current.personalInfo,
      ...(updates.personalInfo ?? {}),
    },
    dentalHistory: {
      ...current.dentalHistory,
      ...(updates.dentalHistory ?? {}),
    },
  });

  if (canUseStorage()) {
    localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(updated));
  }

  return updated;
}

export function initializeBookingData() {
  if (!canUseStorage()) return;

  const existing = localStorage.getItem(BOOKING_DRAFT_KEY);
  if (!existing) {
    const legacy = readLegacyDraft();
    saveBookingDraft(legacy ?? INITIAL_BOOKING_DRAFT);
  }
}

export function getBookingData(): BookingFormData {
  return stripFiles(getBookingDraft());
}

export function updateBookingData(updates: Partial<BookingDraft>): BookingFormData {
  return stripFiles(saveBookingDraft(updates));
}

export function updatePersonalInfo(info: Partial<PersonalInfo>) {
  const current = getBookingDraft();
  return stripFiles(
    saveBookingDraft({
      personalInfo: { ...current.personalInfo, ...info },
    }),
  );
}

export function updateDentalHistory(
  history: Partial<BookingDraft["dentalHistory"]>,
) {
  const current = getBookingDraft();
  return stripFiles(
    saveBookingDraft({
      dentalHistory: { ...current.dentalHistory, ...history },
    }),
  );
}

export function updateTreatmentDetails(
  details: Partial<
    Pick<
      BookingDraft,
      "procedure" | "procedureIds" | "budget" | "travelFrom" | "travelTo"
    >
  >,
) {
  return stripFiles(saveBookingDraft(details));
}

export function setBookingCurrentStep(step: number) {
  return saveBookingDraft({ currentStep: Math.min(Math.max(step, 1), 6) });
}

export function markBookingStepComplete(step: number) {
  const draft = getBookingDraft();
  return saveBookingDraft({
    completedSteps: Array.from(new Set([...draft.completedSteps, step])).sort(
      (a, b) => a - b,
    ),
    currentStep: Math.min(step + 1, 6),
  });
}

export function setConsultationId(consultationId: Id | null) {
  return saveBookingDraft({ consultationId });
}

export function setSelectedDentistsForBooking(
  dentistIds: string[],
  backendDentistIds: number[] = [],
) {
  return saveBookingDraft({
    selectedDentistIds: dentistIds,
    selectedBackendDentistIds: backendDentistIds,
  });
}

export function setFrontSmileFile(file: File | null) {
  frontSmileFile = file;
}

export function getFrontSmileFile() {
  return frontSmileFile;
}

export function setWideSmileFile(file: File | null) {
  wideSmileFile = file;
}

export function getWideSmileFile() {
  return wideSmileFile;
}

export function setUpperArchFile(file: File | null) {
  upperArchFile = file;
}

export function getUpperArchFile() {
  return upperArchFile;
}

export function setLowerArchFile(file: File | null) {
  lowerArchFile = file;
}

export function getLowerArchFile() {
  return lowerArchFile;
}

export function setLeftSideFile(file: File | null) {
  leftSideFile = file;
}

export function getLeftSideFile() {
  return leftSideFile;
}

export function setRightSideFile(file: File | null) {
  rightSideFile = file;
}

export function getRightSideFile() {
  return rightSideFile;
}

export function setXrayFile(file: File | null) {
  xrayFile = file;
}

export function getXrayFile() {
  return xrayFile;
}

export function updateXrayNotes(notes: string) {
  return saveBookingDraft({ xrayNotes: notes });
}

export function clearBookingData() {
  frontSmileFile = null;
  wideSmileFile = null;
  upperArchFile = null;
  lowerArchFile = null;
  leftSideFile = null;
  rightSideFile = null;
  xrayFile = null;

  if (canUseStorage()) {
    localStorage.removeItem(BOOKING_DRAFT_KEY);
    localStorage.removeItem(LEGACY_BOOKING_STORAGE_KEY);
    localStorage.removeItem(LEGACY_SELECTED_DENTIST_KEY);
  }
}

export function setSelectedDentist(dentistId: string) {
  setSelectedDentistsForBooking([dentistId]);
}

export function getSelectedDentist(): string | null {
  return getBookingDraft().selectedDentistIds[0] ?? null;
}

export function clearSelectedDentist() {
  saveBookingDraft({
    selectedDentistIds: [],
    selectedBackendDentistIds: [],
  });
}

export function submitBooking(dentistId: string): SubmittedBooking {
  const bookingData = getBookingData();
  const booking: SubmittedBooking = {
    ...bookingData,
    id: `booking_${Date.now()}`,
    dentistId,
    submittedAt: new Date().toISOString(),
  };

  if (canUseStorage()) {
    const existing = localStorage.getItem(LEGACY_BOOKINGS_KEY);
    const bookings: SubmittedBooking[] = existing ? JSON.parse(existing) : [];
    bookings.push(booking);
    localStorage.setItem(LEGACY_BOOKINGS_KEY, JSON.stringify(bookings));
  }

  clearBookingData();
  return booking;
}

export function getSubmittedBookings(): SubmittedBooking[] {
  if (!canUseStorage()) return [];

  try {
    const data = localStorage.getItem(LEGACY_BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
