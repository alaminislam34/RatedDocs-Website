"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  Suspense,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { initializeDentistData } from "@/lib/storage/dentistData";
import { initializeBookingData } from "@/lib/storage/bookingService";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";
import type { AppModalType } from "@/store/slices/uiSlice";

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
  showPersonalizeModal: boolean;
  setShowPersonalizeModal: (show: boolean) => void;
  showCompareModal: boolean;
  setShowCompareModal: (show: boolean) => void;
  compareModalPurpose: "compare" | "postBooking" | null;
  setCompareModalPurpose: (purpose: "compare" | "postBooking" | null) => void;
  showBookingModal: string | null;
  setShowBookingModal: (dentistId: string | null) => void;
  selectedDentistId: string | null;
  setSelectedDentistId: (id: string | null) => void;
  setSchedule: (schedule: boolean) => void;
  schedule: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dentistsToCompare: Dentist[];
  setDentistsToCompare: (
    dentists: Dentist[] | ((prev: Dentist[]) => Dentist[]),
  ) => void;
  kolModalOpen: boolean;
  setKolModalOpen: (open: boolean) => void;
  addKolStep: kolSteps;
  setAddKolStep: (step: kolSteps) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isNewestFirst: boolean;
  setIsNewestFirst: (isNewest: boolean | ((prev: boolean) => boolean)) => void;
  showSigninModal: boolean;
  setShowSigninModal: (show: boolean) => void;
  isCompareMode: boolean;
  setIsCompareMode: (isCompareMode: boolean) => void;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined,
);

const MODAL_QUERY_KEY = "modal";

const MODAL_TO_QUERY: Record<Exclude<AppModalType, null>, string> = {
  signin: "signin",
  signup: "signup",
  personalize: "personalize",
  compare: "compare",
  startBooking: "start-booking",
  booking: "booking",
  kol: "kol",
};

const QUERY_TO_MODAL = Object.fromEntries(
  Object.entries(MODAL_TO_QUERY).map(([modal, query]) => [query, modal]),
) as Record<string, Exclude<AppModalType, null>>;

function getModalFromQuery(searchParams: URLSearchParams): AppModalType {
  return QUERY_TO_MODAL[searchParams.get(MODAL_QUERY_KEY) ?? ""] ?? null;
}

function getUrlWithModal(
  pathname: string,
  searchParams: URLSearchParams,
  modal: AppModalType,
) {
  const nextParams = new URLSearchParams(searchParams.toString());

  if (modal) {
    nextParams.set(MODAL_QUERY_KEY, MODAL_TO_QUERY[modal]);
  } else {
    nextParams.delete(MODAL_QUERY_KEY);
  }

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function StepSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVerificationRoute = pathname === "/dentist/verification";

  useEffect(() => {
    if (isVerificationRoute) return;

    if (!searchParams.has("step") && !searchParams.has("phase")) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("step");
    nextParams.delete("phase");
    const query = nextParams.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [isVerificationRoute, pathname, router, searchParams]);

  return null;
}

function ModalSync({
  pendingModalRef,
}: {
  pendingModalRef: React.MutableRefObject<AppModalType | undefined>;
}) {
  const store = useAppStore();
  const searchParams = useSearchParams();
  const urlModal = getModalFromQuery(searchParams);

  useEffect(() => {
    if (pendingModalRef.current !== undefined) {
      if (pendingModalRef.current === urlModal) {
        pendingModalRef.current = undefined;
      } else {
        return;
      }
    }

    if (urlModal === store.activeModal) return;

    const timeoutId = window.setTimeout(() => {
      store.openModal(urlModal);
      store.setKolModalOpen(urlModal === "kol");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [store, urlModal, pendingModalRef]);

  return null;
}

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  const pendingModalRef = useRef<AppModalType | undefined>(undefined);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const setUrlModal = (modal: AppModalType) => {
    const currentSearchParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    const href = getUrlWithModal(pathname, currentSearchParams, modal);
    const hasModalInUrl = currentSearchParams.has(MODAL_QUERY_KEY);
    pendingModalRef.current = modal;

    if (modal) {
      if (hasModalInUrl) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    } else {
      router.replace(href, { scroll: false });
    }

    store.openModal(modal);
    store.setKolModalOpen(modal === "kol");
  };

  useEffect(() => {
    initializeDentistData();
    initializeBookingData();

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
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
      } else {
        // In development, unregister any active service workers to prevent stale cached chunks
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log(
                  "[Dev] Unregistered service worker:",
                  registration.scope,
                );
                // Clear all caches to ensure fresh assets are fetched
                caches.keys().then((keys) => {
                  Promise.all(keys.map((key) => caches.delete(key))).then(
                    () => {
                      console.log(
                        "[Dev] Cleared service worker caches. Reloading...",
                      );
                      window.location.reload();
                    },
                  );
                });
              }
            });
          }
        });
      }
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
    showSignupModal: store.activeModal === "signup",
    setShowSignupModal: (show) => setUrlModal(show ? "signup" : null),
    showSigninModal: store.activeModal === "signin",
    setShowSigninModal: (show) => setUrlModal(show ? "signin" : null),
    showPersonalizeModal: store.activeModal === "personalize",
    setShowPersonalizeModal: (show) => setUrlModal(show ? "personalize" : null),
    showCompareModal: store.activeModal === "compare",
    setShowCompareModal: (show) => setUrlModal(show ? "compare" : null),

    showBookingModal:
      store.activeModal === "startBooking"
        ? "startBooking"
        : store.activeModal === "booking"
          ? "book"
          : null,
    setShowBookingModal: (modal) => {
      if (modal === "startBooking") {
        setUrlModal("startBooking");
      } else if (modal === "book") {
        setUrlModal("booking");
      } else {
        setUrlModal(null);
      }
    },

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
    setKolModalOpen: (open) => setUrlModal(open ? "kol" : null),
    addKolStep: store.addKolStep,
    setAddKolStep: store.setAddKolStep,
    searchQuery: store.searchQuery,
    setSearchQuery: store.setSearchQuery,
    isNewestFirst: store.isNewestFirst,
    setIsNewestFirst: store.setIsNewestFirst,
    isCompareMode,
    setIsCompareMode,
  };

  return (
    <StateContext.Provider value={value}>
      <Suspense fallback={null}>
        <StepSync />
        <ModalSync pendingModalRef={pendingModalRef} />
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
