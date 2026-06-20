import { StateCreator } from "zustand";

export type FlowReason = "compare" | "booking";
export type CompareModalPurpose = "compare" | "postBooking";
export type BookingStage = "start" | "book";

export type FlowState =
  | { kind: "idle" }
  | { kind: "auth"; modal: "signup" | "signin"; reason: FlowReason }
  | { kind: "personalize"; purpose: CompareModalPurpose }
  | { kind: "compare"; purpose: CompareModalPurpose }
  | {
      kind: "booking";
      stage: BookingStage;
      dentistId: string;
      bookingId: string;
      step: number;
    };

export interface FlowSlice {
  flow: FlowState;
  compareModalPurpose: CompareModalPurpose | null;

  openSignup: (reason?: FlowReason) => void;
  openSignin: (reason?: FlowReason) => void;
  openPersonalize: (purpose?: CompareModalPurpose) => void;
  openCompare: (purpose?: CompareModalPurpose) => void;
  startBooking: (dentistId: string) => string;
  resumeBooking: (dentistId: string, bookingId: string, step: number) => void;
  setBookingStage: (stage: BookingStage) => void;
  setBookingStep: (step: number | ((prev: number) => number)) => void;
  advanceBookingStep: () => void;
  resetFlow: () => void;
  setCompareModalPurpose: (purpose: CompareModalPurpose | null) => void;
}

function createBookingId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `booking_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const createFlowSlice: StateCreator<FlowSlice> = (set, get) => ({
  flow: { kind: "idle" },
  compareModalPurpose: "compare",

  openSignup: (reason = "compare") =>
    set({
      flow: { kind: "auth", modal: "signup", reason },
      compareModalPurpose: "compare",
    }),

  openSignin: (reason = "compare") =>
    set({
      flow: { kind: "auth", modal: "signin", reason },
      compareModalPurpose: "compare",
    }),

  openPersonalize: (purpose = "compare") =>
    set({
      flow: { kind: "personalize", purpose },
      compareModalPurpose: purpose,
    }),

  openCompare: (purpose = "compare") =>
    set({
      flow: { kind: "compare", purpose },
      compareModalPurpose: purpose,
    }),

  startBooking: (dentistId) => {
    const bookingId = createBookingId();
    set({
      flow: {
        kind: "booking",
        stage: "start",
        dentistId,
        bookingId,
        step: 1,
      },
    });
    return bookingId;
  },

  resumeBooking: (dentistId, bookingId, step) =>
    set({
      flow: {
        kind: "booking",
        stage: "book",
        dentistId,
        bookingId,
        step: Math.max(1, step),
      },
    }),

  setBookingStage: (stage) =>
    set((state) => {
      if (state.flow.kind !== "booking") return {};
      return {
        flow: {
          ...state.flow,
          stage,
        },
      };
    }),

  setBookingStep: (stepOrFn) =>
    set((state) => {
      if (state.flow.kind !== "booking") return {};
      const nextStep =
        typeof stepOrFn === "function" ? stepOrFn(state.flow.step) : stepOrFn;
      if (nextStep < 1) return {};
      return {
        flow: {
          ...state.flow,
          step: nextStep,
        },
      };
    }),

  advanceBookingStep: () =>
    set((state) => {
      if (state.flow.kind !== "booking") return {};
      return {
        flow: {
          ...state.flow,
          step: state.flow.step + 1,
        },
      };
    }),

  resetFlow: () => set({ flow: { kind: "idle" } }),

  setCompareModalPurpose: (purpose) =>
    set((state) => {
      if (purpose === null) {
        return { compareModalPurpose: null };
      }

      if (state.flow.kind === "compare") {
        return {
          compareModalPurpose: purpose,
          flow: { kind: "compare", purpose },
        };
      }

      if (state.flow.kind === "personalize") {
        return {
          compareModalPurpose: purpose,
          flow: { kind: "personalize", purpose },
        };
      }

      return { compareModalPurpose: purpose };
    }),
});
