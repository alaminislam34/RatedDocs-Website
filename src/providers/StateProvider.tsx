"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  Suspense,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { initializeDentistData } from "@/lib/storage/dentistData";
import {
  clearBookingResumeState,
  getBookingDraftContext,
  initializeBookingData,
  setBookingDraftDentist,
} from "@/lib/storage/bookingService";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

// Re-export store hooks for direct access
export { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
export { useDataStoreForVerification } from "@/lib/hooks/verification-store-hooks";
export { useUiStoreForVerification } from "@/lib/hooks/verification-store-hooks";

export type kolSteps =
  | "Basic Info"
  | "Bio & Languages"
  | "Contact"
  | "Media & Notes";

export type dentistBookingTabs = "In Progress" | "Completed" | "Rejected";

interface StateContextType {
  verificationStatus: "idle" | "match" | "no-match";
  setVerificationStatus: (status: "idle" | "match" | "no-match") => void;
  verificationStep: number;
  setVerificationStep: (stepOrFn: number | ((prev: number) => number)) => void;
  verificationStepReady: Record<number, boolean>;
  setVerificationStepReady: (step: number, ready: boolean) => void;
  verificationCompletedStep: number | null;
  setVerificationCompletedStep: (step: number | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  showSignupModal: boolean;
  setShowSignupModal: (show: boolean) => void;
  showSigninModal: boolean;
  setShowSigninModal: (show: boolean) => void;
  showPersonalizeModal: boolean;
  setShowPersonalizeModal: (show: boolean) => void;
  showCompareModal: boolean;
  setShowCompareModal: (show: boolean) => void;
  compareModalPurpose: "compare" | "postBooking" | null;
  setCompareModalPurpose: (purpose: "compare" | "postBooking" | null) => void;
  showBookingModal: string | null;
  setShowBookingModal: (stageOrDentistId: string | null) => void;
  bookingStep: number;
  bookingDraftId: string | null;
  setBookingStep: (step: number | ((prev: number) => number)) => void;
  advanceBookingStep: () => void;
  selectedDentistId: string | null;
  setSelectedDentistId: (id: string | null) => void;
  setSchedule: (schedule: boolean) => void;
  schedule: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dentistsToCompare: Dentist[];
  setDentistsToCompare: (dentists: Dentist[] | ((prev: Dentist[]) => Dentist[])) => void;
  kolModalOpen: boolean;
  setKolModalOpen: (open: boolean) => void;
  addKolStep: kolSteps;
  setAddKolStep: (step: kolSteps) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isNewestFirst: boolean;
  setIsNewestFirst: (isNewest: boolean | ((prev: boolean) => boolean)) => void;
  openSignupFlow: (reason?: "compare" | "booking") => void;
  openSigninFlow: (reason?: "compare" | "booking") => void;
  openCompareFlow: (purpose?: "compare" | "postBooking") => void;
  openBookingFlow: (dentistId: string) => string;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined,
);

// Helper sub-component to handle URL step synchronization inside a Suspense boundary
function StepSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStep = Number(searchParams.get("step"));

  const verificationStep = useAppStore((state) => state.verificationStep);
  const setVerificationStep = useAppStore((state) => state.setVerificationStep);
  const hasInitializedStep = useRef(false);

  // Initialize the step once from the URL or persisted value.
  // can you please check it here is always show ?step=1 why ?

  useEffect(() => {
    if (hasInitializedStep.current) return;
    hasInitializedStep.current = true;

    if (urlStep >= 1 && urlStep <= 3) {
      if (urlStep !== verificationStep) {
        setVerificationStep(urlStep);
      }
    } else {
      const savedStep = typeof window !== "undefined" ? localStorage.getItem("dentist_verification_step") : null;
      if (savedStep) {
        const parsedStep = Number(savedStep);
        if (parsedStep >= 1 && parsedStep <= 3) {
          setVerificationStep(parsedStep + 1);
          router.replace(`?step=${parsedStep + 1}`);
          return;
        }
      }
      router.replace("");
    }
  }, [urlStep, verificationStep, router, setVerificationStep]);

  // After initialization, let the store drive the URL.
  useEffect(() => {
    if (!hasInitializedStep.current) return;
    if (urlStep !== verificationStep) {
      router.push(`?step=${verificationStep}`);
    }
  }, [verificationStep, urlStep, router]);

  return null;
}

function BookingDraftSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const store = useAppStore();
  const currentBookingId =
    store.flow.kind === "booking" ? store.flow.bookingId : null;
  const searchBookingId = searchParams.get("bookingId");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const activeBookingResumeId =
      typeof window !== "undefined"
        ? localStorage.getItem("booking_active_id")
        : null;

    if (
      store.flow.kind === "idle" &&
      searchBookingId &&
      searchBookingId === activeBookingResumeId
    ) {
      const draft = getBookingDraftContext(searchBookingId);
      if (draft?.dentistId) {
        store.setSelectedDentistId(draft.dentistId);
        store.resumeBooking(draft.dentistId, draft.bookingId, draft.step);
        return;
      }
    }

    if (currentBookingId) {
      if (searchBookingId !== currentBookingId) {
        params.set("bookingId", currentBookingId);
        router.replace(`${pathname}?${params.toString()}`);
      }
      return;
    }

    if (searchBookingId) {
      params.delete("bookingId");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    }
  }, [currentBookingId, pathname, router, searchBookingId, searchParams, store.flow.kind, store]);

  return null;
}

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useAppStore();

  useEffect(() => {
    initializeDentistData();
    initializeBookingData();

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const value: StateContextType = {
    verificationStatus: store.verificationStatus,
    setVerificationStatus: store.setVerificationStatus,
    verificationStep: store.verificationStep,
    setVerificationStep: store.setVerificationStep,
    verificationStepReady: store.verificationStepReady,
    setVerificationStepReady: store.setVerificationStepReady,
    verificationCompletedStep: store.verificationCompletedStep,
    setVerificationCompletedStep: store.setVerificationCompletedStep,
    nextStep: store.nextStep,
    prevStep: store.prevStep,

    // Modals mapping
    showSignupModal: store.flow.kind === "auth" && store.flow.modal === "signup",
    setShowSignupModal: (show) => {
      if (show) {
        store.openSignup("compare");
      } else if (store.flow.kind === "auth" && store.flow.modal === "signup") {
        store.resetFlow();
      }
    },
    showSigninModal: store.flow.kind === "auth" && store.flow.modal === "signin",
    setShowSigninModal: (show) => {
      if (show) {
        store.openSignin("compare");
      } else if (store.flow.kind === "auth" && store.flow.modal === "signin") {
        store.resetFlow();
      }
    },
    showPersonalizeModal: store.flow.kind === "personalize",
    setShowPersonalizeModal: (show) => {
      if (show) {
        store.openPersonalize("compare");
      } else if (store.flow.kind === "personalize") {
        store.resetFlow();
      }
    },
    showCompareModal: store.flow.kind === "compare",
    setShowCompareModal: (show) => {
      if (show) {
        store.openCompare(store.compareModalPurpose ?? "compare");
      } else if (store.flow.kind === "compare") {
        store.resetFlow();
      }
    },

    showBookingModal:
      store.flow.kind === "booking"
        ? store.flow.stage === "start"
          ? "startBooking"
          : "book"
        : null,
    bookingStep: store.flow.kind === "booking" ? store.flow.step : 1,
    bookingDraftId: store.flow.kind === "booking" ? store.flow.bookingId : null,
    setShowBookingModal: (stageOrDentistId) => {
      if (!stageOrDentistId) {
        if (store.flow.kind === "booking") {
          clearBookingResumeState();
          store.resetFlow();
        }
        return;
      }

      if (stageOrDentistId === "startBooking") {
        const dentistId = store.selectedDentistId;
        if (!dentistId) return;
        const bookingId = store.startBooking(dentistId);
        setBookingDraftDentist(bookingId, dentistId);
        return;
      }

      if (stageOrDentistId === "book") {
        store.setBookingStage("book");
      }
    },
    setBookingStep: store.setBookingStep,
    advanceBookingStep: store.advanceBookingStep,

    compareModalPurpose: store.compareModalPurpose,
    setCompareModalPurpose: store.setCompareModalPurpose,
    selectedDentistId: store.selectedDentistId,
    setSelectedDentistId: store.setSelectedDentistId,
    schedule: store.schedule,
    setSchedule: store.setSchedule,
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    dentistsToCompare: store.dentistsToCompare,
    setDentistsToCompare: store.setDentistsToCompare,
    kolModalOpen: store.kolModalOpen,
    setKolModalOpen: store.setKolModalOpen,
    addKolStep: store.addKolStep,
    setAddKolStep: store.setAddKolStep,
    searchQuery: store.searchQuery,
    setSearchQuery: store.setSearchQuery,
    isNewestFirst: store.isNewestFirst,
    setIsNewestFirst: store.setIsNewestFirst,

    openSignupFlow: store.openSignup,
    openSigninFlow: store.openSignin,
    openCompareFlow: store.openCompare,
    openBookingFlow: (dentistId: string) => {
      store.setSelectedDentistId(dentistId);
      const bookingId = store.startBooking(dentistId);
      setBookingDraftDentist(bookingId, dentistId);
      return bookingId;
    },
  };

  return (
    <StateContext.Provider value={value}>
      <Suspense fallback={null}>
        <StepSync />
        <BookingDraftSync />
      </Suspense>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
