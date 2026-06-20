import { StateCreator } from "zustand";

export type AppModalType = "signin" | "signup" | "personalize" | "compare" | "booking" | null;
export type kolSteps = "Basic Info" | "Bio & Languages" | "Contact" | "Media & Notes";

export interface UISlice {
    activeModal: AppModalType;
    compareModalPurpose: "compare" | "postBooking" | null;
    kolModalOpen: boolean;
    addKolStep: kolSteps;

    openModal: (modalType: AppModalType) => void;
    closeModal: () => void;
    setCompareModalPurpose: (purpose: "compare" | "postBooking" | null) => void;
    setKolModalOpen: (open: boolean) => void;
    setAddKolStep: (step: kolSteps) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
    activeModal: null,
    compareModalPurpose: "compare",
    kolModalOpen: false,
    addKolStep: "Basic Info",

    openModal: (modalType) => set({ activeModal: modalType }),
    closeModal: () => set({ activeModal: null }),
    setCompareModalPurpose: (purpose) => set({ compareModalPurpose: purpose }),
    setKolModalOpen: (open) => set({ kolModalOpen: open }),
    setAddKolStep: (step) => set({ addKolStep: step }),
});